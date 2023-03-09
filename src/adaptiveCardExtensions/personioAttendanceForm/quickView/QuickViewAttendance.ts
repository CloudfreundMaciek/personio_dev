import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { AadHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';
import strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IAbsence, IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, IProject, ITimeOffType, IAttendance, IDatesPack, sortAttendances } from '../PersonioAttendanceFormAdaptiveCardExtension';

export interface IQuickViewAttendanceData {
  projects: Array<IProject>;
  message: string;
  timeOffTypes: Array<ITimeOffType>;
  absences: Array<IAbsence>;
  absenceCount: string;
  absenceLimit: string;
  attendances: Array<IAttendance>;
  dates: IDatesPack;
  stage: string;
  icons: any;
  strings: any;
}

export class QuickViewPersonio extends BaseAdaptiveCardView<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState,
  IQuickViewAttendanceData
> {
  public get data(): IQuickViewAttendanceData {

    const absences = this.state.absences;
    for (const absence of absences) {
      absence.start_date = absence.start_date.slice(0, 10);
      absence.end_date = absence.end_date.slice(0, 10);
      absence.id = absence.id.toString();
    }
    const sortedAbsences = new Array<IAbsence>();
    for (const absence of absences) {
      if (absence.status === 'requested') sortedAbsences.push(absence);
      else continue;
    }
    for (const absence of absences) {
      if (absence.status === 'approved') sortedAbsences.push(absence);
      else continue;
    }
    
    let projects = new Array<IProject>();
    if (this.state.quickViewStage === 'projectsOverview') {
      for (const project of this.state.projects) {
        if (project.name === '---') continue;
        else projects.push(project);
      }
    } else projects = this.state.projects;

    const icons = {
      attendance: `${this.context.pageContext.site.absoluteUrl}/SiteAssets/suitcase.png`,
      absence: `${this.context.pageContext.site.absoluteUrl}/SiteAssets/luggage.png`,
      project: `${this.context.pageContext.site.absoluteUrl}/SiteAssets/files.png`
    };

    return {
      projects: projects,
      message: this.state.message,
      absences: absences,
      absenceCount: this.state.absenceCount.toString(),
      absenceLimit: this.state.absenceLimit.toString(),
      timeOffTypes: this.state.timeOffTypes,
      attendances: this.state.attendances,
      dates: this.state.dates,
      stage: this.state.quickViewStage,
      icons: icons,
      strings: strings.QuickView
    };
  }
  
  private createProject(data: IProject): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'createProject',
        data,
        email: this.context.pageContext.user.email
      })
    };
    this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(response => response.json())
    .then(response => {
      if (response.success === true) {
        const projects = this.state.projects;
        data.id = response.data.id.toString();
        projects.push(data);

        this.setState({message: strings.QuickView.Response.Successful.ProjectCreated, quickViewStage: 'response', projects: projects});
      } 
      else {
        this.setState({message: response.error.message, quickViewStage: 'response'});
      }
    });
  }

  private finishProject(data: any): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'finishProject',
        data,
        email: this.context.pageContext.user.email
      })
    };
    this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(response => response.json())
    .then(response => {
      if (response?.success === false) {
        this.setState({message: response.error.message, quickViewStage: 'response'});
      } else {
        const projects = new Array<IProject>();
        for (const project of this.state.projects) {
          if (project.id !== data.id) {
            projects.push(project);
          }
        }
        this.setState({message: strings.QuickView.Response.Successful.ProjectFinished, quickViewStage: 'response', projects: projects});
      }
    });
  }

  public createAttendance (data: IAttendance): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'createAttendance', 
        data, 
        email: this.context.pageContext.user.email
      })
    };
    this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        if (data.comment == undefined) data.comment = '';
        data.id = res.data.id[0].toString();
        
        if (data.project_id) {
          for (const project of this.state.projects) {
            if (+project.id === data.project_id) data.project_name = project.name
          }
        }

        const attendances = this.state.attendances;
        attendances.push(data);
        this.setState({message: strings.QuickView.Response.Successful.AttendanceSaved, quickViewStage: 'response', attendances: sortAttendances(attendances)});
      } else {
        this.setState({message: res.error.message, quickViewStage: 'response'});
      }
    });
  }

  private deleteAttendance(data: {id: string}): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'deleteAttendance',
        data: {
          id: +data.id
        },
        email: this.context.pageContext.user.email
      })
    };
    this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(response => response.json())
    .then(response => {
      if (response.success === true) {
        const attendances = new Array<IAttendance>();
        for (const attendance of this.state.attendances) {
          if (attendance.id != data.id) attendances.push(attendance);
        }
        this.setState({attendances: attendances, message: response.data.message, quickViewStage: 'response'});
      } else {
        this.setState({message: response.error.message, quickViewStage: 'response'});
      }
    });
  }

  private createAbsence(data: IAbsence): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'createAbsence',
        data,
        email: this.context.pageContext.user.email
      })
    };
    this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(response => response.json())
    .then(async response => {
      if (response.success === true) {
        data.id = response.data.attributes.id;
        data.status = response.data.attributes.status
        for (const type of this.state.timeOffTypes) {
          if (+type.id === data.time_off_type_id) data.time_off_type_name = type.name;
        }

        const absences = Array<IAbsence>().concat(data, this.state.absences);
        const absenceCount = await this.getAbsenceCount();
        const status = (response.data.attributes.status === 'requested') ? strings.QuickView.Response.Successful.AbsenceRequested : strings.QuickView.Response.Successful.AbsenceApproved;
        this.setState({absences: absences, message: status, quickViewStage: 'response', absenceCount: absenceCount.current});
      } else {
        this.setState({message: response.error.message, quickViewStage: 'response'});
      }
    });
  }

  public deleteAbsence(data: any): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'deleteAbsence',
        data,
        email: this.context.pageContext.user.email
      })
    };
    this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(response => response.json())
    .then(response => {
      if (response.success === true) {
        const absences = new Array<IAbsence>();
      for (const absence of this.state.absences) {
        if (absence.id !== data.id) absences.push(absence);
      }
      this.setState({absences: absences, message: response.data.message, quickViewStage: 'response'});
      } else {
      this.setState({message: response.error.message, quickViewStage: 'response'});
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


  public get template(): ISPFxAdaptiveCard {
    switch (this.state.quickViewStage) {
      case 'attendanceMenu':
        return require('./template/attendance_menu.json');

      case 'absenceMenu':
        return require('./template/absence_menu.json');

      case 'projectsMenu':
        return require('./template/projects_menu.json');
    
      case 'attendanceForm':
        return require('./template/attendance_form.json');
      
      case 'attendanceOverview':
        if (this.state.attendances.length !== 0) return require('./template/attendance_overview.json');
        else return require('./template/attendance_empty.json');

      case 'absenceForm':
        return require('./template/absence_form.json');
        
      case 'absenceOverview':
        if (this.state.absences.length !== 0) return require('./template/absence_overview.json');
        else return require('./template/absence_empty.json');
          
      case 'projectForm':
        return require('./template/project_form.json');
          
      case 'projectsOverview':
        if (this.state.projects.length !== 1) return require('./template/projects_overview.json');
        else return require('./template/projects_empty.json');
  
      case 'menu':
        return require('./template/menu.json');

      case 'loading':
        return require('./template/loading_screen.json');

      case 'response':
        return require('./template/response.json');
    
      default:
        this.setState({message: 'An error has ocurred...'});
        return require('./template/response.json');
    }
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      if (action.id === 'submit') {
        if (!action.data.start || !action.data.end) {
          this.setState({
            quickViewStage: 'response',
            message: 'Both start and end time have to be given. Please try again :)'
          });
          return;
        }
        const start: string = action.data.start;
        const end: string = action.data.end;
        
        const startTime = start.split(':');
        const endTime = end.split(':');
                
        if(endTime[0]>startTime[0] || (endTime[0]===startTime[0] && endTime[1]>startTime[1])) {
          const requestData: IAttendance = {
            date: action.data.day,
            start_time: action.data.start,
            end_time: action.data.end,
            break: +action.data.break,
            comment: action.data.comment,
            project_id: (action.data.project == undefined) ? null : +action.data.project,
            project_name: '',
            id: null
          }
          this.setState({quickViewStage: 'loading'});
          this.createAttendance(requestData);
        }
        else {
          this.setState({
            message: 'The end time has to take place after the start time. Please try again :)',
            quickViewStage: 'response'
          })
        }
      }
      else if (action.id === 'attendanceMenuButton') {
        this.setState({quickViewStage: 'attendanceMenu'});
      }
      else if (action.id === 'absenceMenuButton') {
        this.setState({quickViewStage: 'absenceMenu'});
      }
      else if (action.id === 'projectsMenuButton') {
        this.setState({quickViewStage: 'projectsMenu'});
      }
      else if (action.id === 'attendanceFormMenuButton') {
        this.setState({quickViewStage: 'attendanceForm'});
      }
      else if (action.id === 'attendanceOverviewMenuButton') {
        this.setState({quickViewStage: 'attendanceOverview'});
      }
      else if (action.id === 'absenceFormMenuButton') {
        this.setState({quickViewStage: 'absenceForm'});
      }
      else if (action.id === 'absenceOverviewMenuButton') {
        this.setState({quickViewStage: 'absenceOverview'});
      }
      else if (action.id === 'projectFormMenuButton') {
        this.setState({quickViewStage: 'projectForm'});
      }
      else if (action.id === 'projectsOverviewMenuButton') {
        this.setState({quickViewStage: 'projectsOverview'});
      }
      else if (action.id === 'takeTimeOffButton') {
        if (!action.data.start_date || !action.data.end_date || !action.data.time_off_type_id) {
          this.setState({
            quickViewStage: 'response',
            message: 'Some fields requires to be filled. Please try again :)'
          });
          return;
        }
        const start: string = action.data.start_date;
        const end: string = action.data.end_date;
        
        const startTime = start.replace('-', '').replace('-', '');
        const endTime = end.replace('-', '').replace('-', '');
                
        if (startTime <= endTime) {
          const requestData: IAbsence = {
            id: null,
            time_off_type_id: +action.data.time_off_type_id,
            time_off_type_name: '',
            start_date: action.data.start_date,
            end_date: action.data.end_date,
            half_day_start: action.data.half_day_start ? true : false,
            half_day_end: action.data.half_day_end ? true : false,
            comment: action.data.comment ? action.data.comment : '',
            status: ''
          }
          this.setState({quickViewStage: 'loading'});
          this.createAbsence(requestData);
        }
        else {
          this.setState({
            message: 'The end time has to take place after the start time. Please try again :)',
            quickViewStage: 'response'
          })
        }
      }
      else if (action.id === 'createProjectButton') {
        if (!action.data.name) {
          this.setState({message: "You have to name your project.", quickViewStage: 'response'});
        } else {
          this.setState({quickViewStage: 'loading'});
          this.createProject(action.data);
        }
      }
      else if (action.id === 'metaProjectButton') {
        if (action.data?.id != undefined) {
          this.setState({quickViewStage: 'loading'});
          this.finishProject(action.data);
        }
      }
      else if (action.id === 'close' || action.id === 'back') {
        this.setState({
          quickViewStage: 'menu',
          message: null
        });
      }
      else if (action.id === 'callOffAbsenceButton') {
        if (action.data?.id != undefined) {
          this.setState({quickViewStage: 'loading'});
          this.deleteAbsence(action.data);
        }
      }
      else if (action.id === 'deleteAttendanceButton') {
        if (action.data?.id != undefined) {
          this.setState({quickViewStage: 'loading'});
          this.deleteAttendance(action.data);
        }
      }
    }
  }
}