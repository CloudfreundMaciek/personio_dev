import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
//import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, IProject, IWorkRegister } from '../PersonioAttendanceFormAdaptiveCardExtension';

export interface IQuickViewData {
  today: string;
  projects: Array<IProject>;
  message: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState,
  IQuickViewData
> {
  fun: (date: IWorkRegister)=>void;

  constructor(fun: (date: IWorkRegister)=>void) {
    super();
    this.fun = fun;
  }

  public get data(): IQuickViewData {
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
    switch (this.state.stage) {
      case 'form':
        return require('./template/form.json');

      case 'loading':
        return require('./template/loading_screen.json');

      case 'response':
        return require('./template/response.json');
    
      default:
        return require('./template/form.json');
    }
  }

  public onAction(action: IActionArguments): void {
    if (action.type == 'Submit') {
      if (action.id == 'submit') {
        if (!action.data.start || !action.data.end) {
          this.setState({
            stage: 'response',
            message: 'Both start and end time have to be given. Please try again :)'
          });
          return;
        }
        const start: string = action.data.start;
        const end: string = action.data.end;
        
        const startTime = start.split(':');
        const endTime = end.split(':');
                
        if(endTime[0]>startTime[0] || (endTime[0]==startTime[0] && endTime[1]>startTime[1])) {
          this.setState({stage: 'loading'});
          this.fun(action.data);
        }
        else {
          this.setState({
            message: 'The end time has to take place after the start time. Please try again :)',
            stage: 'response'
          })
        }
      }
      else if (action.id == 'close') {
        this.setState({stage: 'form', message: null});
      }
    }
  }
}