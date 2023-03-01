import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { PersonioAttendanceFormPropertyPane } from './PersonioAttendanceFormPropertyPane';
import { ISPHttpClientOptions, AadHttpClient } from '@microsoft/sp-http';
import { QuickViewPersonio } from './quickView/QuickViewAttendance';

export interface IPersonioAttendanceFormAdaptiveCardExtensionProps {
  title: string;
}

export interface IPersonioAttendanceFormAdaptiveCardExtensionState {
  projects: Array<IProject>;
  timeOffTypes: Array<ITimeOffType>;
  attendances: Array<IAttendance>;
  absences: Array<IAbsence>;
  absenceCount: number;
  absenceLimit: number;
  quickViewStage: string;
  message: string;
  error: string;
  dates: IDatesPack;
  azureClient: AadHttpClient;
}

export interface IAbsence {
  id: string;
  time_off_type_id: number;
  time_off_type_name: string;
  start_date: string;
  end_date: string;
  half_day_start: boolean;
  half_day_end: boolean;
  comment: string;
  status: string;
}

export interface ITimeOffType {
  id: string;
  name: string;
  canHalfDay: boolean;
}

export interface IAttendance {
  date: string;
  start_time: string;
  end_time: string;
  break: number;
  comment: string;
  project_id: number;
  project_name: string;
  id: string;
}

export interface IProject {
  id: string;
  name: string;
  active: boolean;
}

export interface IDatesPack {
  today_date: string; 
  week_ago_date: string;
}

export function sortAttendances (attendances: Array<IAttendance>): Array<IAttendance> {
  attendances.sort((a: IAttendance, b: IAttendance): number => {
    const aYear = +a.date.slice(0,4);
    const bYear = +b.date.slice(0,4);
    
    return aYear-bYear;
  });
  attendances.sort((a: IAttendance, b:IAttendance): number => {
    const aYear = +a.date.slice(0,4);
    const bYear = +b.date.slice(0,4);

    if (aYear === bYear) {
      const aMonth = +a.date.slice(5, 7);
      const bMonth = +b.date.slice(5, 7);
      return aMonth - bMonth;
    } else return 1;
  });
  attendances.sort((a: IAttendance, b:IAttendance): number => {
    const aYear = +a.date.slice(0,4);
    const bYear = +b.date.slice(0,4);

    if (aYear === bYear) {
      const aMonth = +a.date.slice(5, 7);
      const bMonth = +b.date.slice(5, 7);
      if (aMonth === bMonth) {
        const aDay = +a.date.slice(8);
        const bDay = +b.date.slice(8);
        return (aDay-bDay);
      } else return 1;
    } else return 1;
  });

  return attendances;
}

const CARD_VIEW_REGISTRY_ID: string = 'PersonioAttendanceForm_CARD_VIEW';
export const QUICK_VIEW_ID: string = 'Personio_QUICK_VIEW';

export default class PersonioAttendanceFormAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PersonioAttendanceFormPropertyPane | undefined;

  public define_dates(): IDatesPack {
    const nowDate = new Date();
    
    let year = nowDate.getFullYear();
    let month: number | string = nowDate.getMonth()+1;
    if (month < 10) {
      month = '0'+month;
    }
    let day: number | string = nowDate.getDate();
    if (day < 10) {
      day = '0'+day;
    }
    const today_date = year+'-'+month+'-'+day;
    
    month = +month;
    day = +day;

    if ((day - 7) <= 0) {
      day = 30 - (7-day);
      month--;
      if (month === 0) {
        month = 12;
        year--;
      }
    } else day -= 7;

    if (day < 10) {
      day = '0'+day;
    }
    if (month < 10) {
      month = '0'+month;
    }
    const week_ago_date = year+'-'+month+'-'+day;

    return {today_date: today_date, week_ago_date: week_ago_date};
  }

  public async getAbsences(): Promise<Array<IAbsence>|null> {
    const absences = new Array<IAbsence>();
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'getAbsences',
        email: this.context.pageContext.user.email
      })
    };
    return this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        for (const absence of res.data) {
          const attributes = absence.attributes;
          absences.push({
            id: String(attributes.id),
            time_off_type_id: attributes.time_off_type.attributes.id,
            time_off_type_name: attributes.time_off_type.attributes.name,
            start_date: attributes.start_date,
            end_date: attributes.end_date,
            half_day_start: attributes.half_day_start,
            half_day_end: attributes.half_day_end,
            comment: attributes.comment,
            status: attributes.status
          });
        }
        return absences;
      } else {
        this.setState({error: res.error.message});
        return null;
      }
    });
  }

  public async getAttendances(): Promise<Array<IAttendance>|null> {

    const attendances = new Array<IAttendance>();
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'getAttendances',
        email: this.context.pageContext.user.email,
        data: {
          start_date: this.state.dates.week_ago_date,
          end_date: this.state.dates.today_date
        }
      })
    };
    return this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        for (const attendance of res.data) {
          const attributes = attendance.attributes;
          attendances.push({
            date: attributes.date,
            start_time: attributes.start_time,
            end_time: attributes.end_time,
            break: attributes.break,
            comment: attributes.comment,
            project_id: attributes.project ? attributes.project.id : '',
            project_name: attributes.project ? attributes.project.attributes.name : '',
            id: attendance.id.toString()
          });
        }

        return sortAttendances(attendances);
      } else {
        this.setState({error: res.error.message});
        return null;
      }
    });
  }

  public async getAbsenceTypes(): Promise<Array<ITimeOffType>|null> {
    const types = new Array<ITimeOffType>();
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'getAbsenceTypes'
      })
    };
    return this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        for (const type of res.data) {
        types.push({
          name: type.attributes.name,
          id: type.attributes.id.toString(),
          canHalfDay: type.attributes.half_day_requests_enabled
        });
      }
      return types;
      } else {
        this.setState({error: res.error.message});
        return null;
      }
      
    });
  }

  public async getAbsenceCount(): Promise<{current: number; limit: number;}|null> {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'getAbsenceCount',
        email: this.context.pageContext.user.email
      })
    };
    return this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        return {
          current: res.data.attributes.vacation_day_balance.value,
          limit: res.data.attributes.absence_entitlement.value[0].attributes.entitlement
        };
      } else {
        this.setState({error: res.error.message});
        return null;
      }
    });
  }

  public async getProjects(): Promise<Array<IProject>|null> {
    const projects = new Array<IProject>();
    projects.push({name: '---', id: null, active: false});
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'getProjects',
        email: this.context.pageContext.user.email
      })
    };
    return this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
      .then(res => res.json())
      .then(res => {
        if (res.success === true) {
          for (const project of res.data) {
            projects.push({
              name: project.attributes.name,
              id: project.id.toString(),
              active: project.attributes.active
            });
          }
          return projects;
        } else {
          this.setState({error: res.error.message});
          return null;
        }
      });
  }

  public async onInit(): Promise<void> {
    this.state = {
      timeOffTypes: null, 
      projects: null,
      attendances: null,
      absences: null, 
      absenceCount: null,
      absenceLimit: null,
      quickViewStage: null,
      error: null,
      message: null, 
      dates: this.define_dates(), 
      azureClient: await this.context.aadHttpClientFactory.getClient('4ad53561-c347-45d2-b544-f5d6baee39b7') 
    };

    const typesPromise = this.getAbsenceTypes();
    const attendancesPromise = this.getAttendances();
    const absencesPromise = this.getAbsences();
    const absenceCount = this.getAbsenceCount();
    const projectsPromise = this.getProjects();

    Promise.all([typesPromise, absencesPromise, projectsPromise, absenceCount, attendancesPromise])
    .then(res => {
      this.setState({
        timeOffTypes: res[0],
        absences: res[1],
        projects: res[2],
        absenceCount: res[3].current,
        absenceLimit: res[3].limit,
        attendances: res[4],
        quickViewStage: 'menu'
      });
    });

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_ID, () => new QuickViewPersonio());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PersonioAttendanceForm-property-pane'*/
      './PersonioAttendanceFormPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PersonioAttendanceFormPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}