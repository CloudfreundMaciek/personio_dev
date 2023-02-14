import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
//import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, IWorkRegister } from '../PersonioAttendanceFormAdaptiveCardExtension';

export interface IQuickViewData {
}

export class QuickView2 extends BaseAdaptiveCardView<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState,
  IQuickViewData
> {
  fun: (date: IWorkRegister)=>void;

  public get data(): IQuickViewData {
    return {
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/response.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.type == 'Submit') {
      console.log('swd');
      this.setState({stage: 'loading'});
      const start: string = action.data.start;
      const end: string = action.data.end;
      
      const startTime = start.split(':');
      const endTime = end.split(':');

      console.log(endTime);
      console.log(startTime);

      if(endTime[0]>startTime[0] || (endTime[0]==startTime[0] && endTime[1]>startTime[1])) {
        //this.fun(action.data);
      }
      else {
        this.setState({
          message: 'The end time has to take place after the start time. Please try again :)',
          stage: 'response'
        })
      }
      //The error has to be shown somehow.
    }
  }
}