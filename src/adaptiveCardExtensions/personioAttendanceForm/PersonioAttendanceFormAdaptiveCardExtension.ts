import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { PersonioAttendanceFormPropertyPane } from './PersonioAttendanceFormPropertyPane';
import { ISPHttpClientOptions, AadHttpClient } from '@microsoft/sp-http';
import { QuickViewPersonio } from './quickView/QuickViewAttendance';

export interface IPersonioAttendanceFormAdaptiveCardExtensionProps {
  title: string;
  projects: Array<IProject>;
  timeOffTypes: Array<ITimeOffType>;
  absences: Array<IAbsence>;
}

export interface IPersonioAttendanceFormAdaptiveCardExtensionState {
  projects: Array<IProject>;
  timeOffTypes: Array<ITimeOffType>;
  absences: Array<IAbsence>;
  attendanceStage: string;
  holidaysStage: string;
  quickViewStage: string;
  message: string;
  cardViewContent: string;
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

export interface IWorkRegister {
  date: string;
  start_time: string;
  end_time: string;
  break: number;
  comment: string;
  project_id: number;
}

export interface IProject {
  id: string;
  name: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'PersonioAttendanceForm_CARD_VIEW';
export const QUICK_VIEW_ID: string = 'Personio_QUICK_VIEW';

export default class PersonioAttendanceFormAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PersonioAttendanceFormPropertyPane | undefined;

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
        this.setState({cardViewContent: res.error.message});
        return null;
      }
    });
  }

  public async getTimeOffTypes(): Promise<Array<ITimeOffType>|null> {
    const types = new Array<ITimeOffType>();
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'getTimeOffTypes'
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
        this.setState({cardViewContent: res.error.message});
        return null;
      }
      
    });
  }

  public async getProjects(): Promise<Array<IProject>|null> {
    const projects = new Array<IProject>();
    projects.push({name: '---', id: null});
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
              id: project.id.toString()
            });
          }
          return projects;
        } else {
          this.setState({cardViewContent: res.error.message});
          return null;
        }
      });
  }

  public async onInit(): Promise<void> {
    this.state = { 
      timeOffTypes: this.properties.timeOffTypes, 
      absences: this.properties.absences, 
      projects: this.properties.projects, 
      attendanceStage: 'form', 
      holidaysStage: 'overview',
      quickViewStage: 'menu',
      cardViewContent: 'Loading...',
      message: null, 
      azureClient: await this.context.aadHttpClientFactory.getClient('4ad53561-c347-45d2-b544-f5d6baee39b7') 
    };

    const typesPromise = this.getTimeOffTypes();
    const absencesPromise = this.getAbsences();
    const projectsPromise = this.getProjects();

    Promise.all([typesPromise, absencesPromise, projectsPromise])
    .then(res => {
      this.setState({
        timeOffTypes: res[0],
        absences: res[1],
        projects: res[2]
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
