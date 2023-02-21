import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { AadHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';
//import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, IProject, IWorkRegister } from '../PersonioAttendanceFormAdaptiveCardExtension';

export interface IQuickViewAttendanceData {
  today: string;
  projects: Array<IProject>;
  message: string;
}

export class QuickViewAttendance extends BaseAdaptiveCardView<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState,
  IQuickViewAttendanceData
> {

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
    .then(res => this.setState({message: res.message, attendanceStage: 'response'}));
  }

  public get data(): IQuickViewAttendanceData {
    const nowDate = new Date();
    
    const year = nowDate.getFullYear();
    let month: any = nowDate.getMonth()+1;
    if (month < 10) {
      month = '0'+month;
    }
    let day: any = nowDate.getDate();
    if (day < 10) {
      day = '0'+day;
    }
    const date = year+'-'+month+'-'+day;


    return {
      today: date,
      projects: this.state.projects,
      message: this.state.message
    };
  }

  public get template(): ISPFxAdaptiveCard {
    switch (this.state.attendanceStage) {
      case 'form':
        return require('./template/attendance.json');

      case 'loading':
        return require('./template/loading_screen.json');

      case 'response':
        return require('./template/response.json');
    
      default:
        return require('./template/attendance.json');
    }
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      if (action.id === 'submit') {
        if (!action.data.start || !action.data.end) {
          this.setState({
            attendanceStage: 'response',
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
          this.setState({attendanceStage: 'loading'});
          this.registerWork(requestData);
        }
        else {
          this.setState({
            message: 'The end time has to take place after the start time. Please try again :)',
            attendanceStage: 'response'
          })
        }
      }
      else if (action.id === 'close') {
        this.setState({attendanceStage: 'form', message: null});
      }
    }
  }
}