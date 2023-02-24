import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { AadHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';
//import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IAbsence, IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, IProject, ITimeOffType, IWorkRegister } from '../PersonioAttendanceFormAdaptiveCardExtension';

export interface IQuickViewAttendanceData {
  today: string;
  projects: Array<IProject>;
  message: string;
  timeOffTypes: Array<ITimeOffType>;
  absences: Array<IAbsence>;

}

export class QuickViewPersonio extends BaseAdaptiveCardView<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState,
  IQuickViewAttendanceData
> {
  public get data(): IQuickViewAttendanceData {
    const nowDate = new Date();
    
    const year = nowDate.getFullYear();
    let month: number | string = nowDate.getMonth()+1;
    if (month < 10) {
      month = '0'+month;
    }
    let day: number | string = nowDate.getDate();
    if (day < 10) {
      day = '0'+day;
    }
    const date = year+'-'+month+'-'+day;

    const absences = this.state.absences;
    for (const absence of absences) {
      absence.start_date = absence.start_date.slice(0, 10);
      absence.end_date = absence.end_date.slice(0, 10);
      absence.id = absence.id.toString();
    }

    return {
      today: date,
      projects: this.state.projects,
      message: this.state.message,
      absences: absences,
      timeOffTypes: this.state.timeOffTypes
    };
  }

  private takeTimeOff(data: IAbsence): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'takeTimeOff',
        data,
        email: this.context.pageContext.user.email
      })
    };
    this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(response => response.json())
    .then(response => {
      if (response.success === true) {
        const absences = this.state.absences;
        data.id = response.data.attributes.id;
        data.status = response.data.attributes.status
        for (const type of this.state.timeOffTypes) {
          if (+type.id === data.time_off_type_id) data.time_off_type_name = type.name;
        }
        absences.push(data);
        this.setState({absences: absences, message: "Your request has been successfuly delivered.", quickViewStage: 'response'});
      } 
      else {
        this.setState({message: response.error.message, quickViewStage: response});
      }
    });
  }

  public registerWork (data: IWorkRegister): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'registerAttendance', 
        data, 
        email: this.context.pageContext.user.email
      })
    };
    this.state.azureClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', AadHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
      if (res.success === true) {
        this.setState({message: res.data.message, quickViewStage: 'response'})
      } else {
        this.setState({message: res.error.message, quickViewStage: 'response'})
      }
    });
  }

  public deleteTimeOff(data: any): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'deleteTimeOff',
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

  public get template(): ISPFxAdaptiveCard {
    switch (this.state.quickViewStage) {
      case 'attendanceForm':
        return require('./template/attendance_form.json');
      
      case 'absenceForm':
        return require('./template/absence_form.json');
        
        case 'absenceOverview':
          if (this.state.absences.length !== 0) return require('./template/absence_overview.json');
          else return require('./template/absence_empty.json');
          
        case 'projectForm':
            return require('./template/project_form.json');
          
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
          const requestData: IWorkRegister = {
            date: action.data.day,
            start_time: action.data.start,
            end_time: action.data.end,
            break: +action.data.break,
            comment: action.data.comment,
            project_id: +action.data.project
          }
          this.setState({quickViewStage: 'loading'});
          this.registerWork(requestData);
        }
        else {
          this.setState({
            message: 'The end time has to take place after the start time. Please try again :)',
            attendanceStage: 'response'
          })
        }
      }
      else if (action.id === 'back') {
        this.setState({quickViewStage: 'menu'});
      }
      else if (action.id === 'close') {
        this.setState({quickViewStage: 'menu', message: null});
      }
      else if (action.id === 'attendanceFormMenuButton') {
        this.setState({quickViewStage: 'attendanceForm'});
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
      else if (action.id === "takeTimeOffButton") {
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
                
        if (startTime < endTime) {
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
          this.takeTimeOff(requestData);
        }
        else {
          this.setState({
            message: 'The end time has to take place after the start time. Please try again :)',
            quickViewStage: 'response'
          })
        }
      }
      else if (action.id === 'close') {
        this.setState({
          quickViewStage: 'overview',
          message: null
        })
      }
      else if (action.id === 'callOff') {
        this.setState({quickViewStage: 'loading'});
        this.deleteTimeOff(action.data);
      }

    }
  }
}