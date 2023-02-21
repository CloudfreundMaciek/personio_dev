import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { AadHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';
import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IAbsence, IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, ITimeOffType } from '../PersonioAttendanceFormAdaptiveCardExtension';

export interface IQuickViewHolidaysData {
  subTitle: string;
  title: string;
  absences: Array<IAbsence>;
  timeOffTypes: Array<ITimeOffType>;
  message: string;
}

export class QuickViewHolidays extends BaseAdaptiveCardView<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState,
  IQuickViewHolidaysData
> {
  public get data(): IQuickViewHolidaysData {
    const absences = this.state.absences;
    for (const absence of absences) {
      absence.start_date = absence.start_date.slice(0, 10);
      absence.end_date = absence.end_date.slice(0, 10);
      absence.id = absence.id.toString();
    }
    
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      absences: absences,
      timeOffTypes: this.state.timeOffTypes,
      message: this.state.message
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
      const absences = this.state.absences;
      data.id = response.attributes.id;
      absences.push(data);
      this.setState({absences: absences, message: response.attributes.status, holidaysStage: 'response'});
    });
  }

  public get template(): ISPFxAdaptiveCard {
    switch (this.state.holidaysStage) {    
      case 'overview':
        if (this.state.absences.length) return require('./template/holidays.json');
        else return require('./template/holidays_empty.json');

      case 'loading':
        return require('./template/loading_screen.json');

      case 'response':
        return require('./template/response.json');
  
      default:
        return require('./template/holidays.json');
    }
  }

  public onAction(action: IActionArguments): void {
    if (action.type === "Submit") {
      if (action.id === "takeTimeOffButton") {
        if (!action.data.start_date || !action.data.end_date || !action.data.time_off_type_id) {
          this.setState({
            holidaysStage: 'response',
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
            comment: action.data.comment,
            status: ''
          }
          this.setState({holidaysStage: 'loading'});
          this.takeTimeOff(requestData);
        }
        else {
          this.setState({
            message: 'The end time has to take place after the start time. Please try again :)',
            holidaysStage: 'response'
          })
        }
      }
      else if (action.id === 'close') {
        this.setState({
          holidaysStage: 'overview',
          message: null
        })
      }
      else if (action.id === 'delete') {
        this.setState({holidaysStage: 'loading'});
        this.deleteTimeOff(action.data);
      }
    }
  }
  deleteTimeOff(data: any): void {
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
      const absences = new Array<IAbsence>();
      for (const absence of this.state.absences) {
        if (absence.id != data.id) absences.push(absence);
      }
      this.setState({absences: absences, message: response.message, holidaysStage: 'response'});
    });
  }
}