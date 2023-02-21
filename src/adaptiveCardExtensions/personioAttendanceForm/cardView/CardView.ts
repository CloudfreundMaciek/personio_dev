import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, QUICK_VIEW_ATTENDANCE_ID, QUICK_VIEW_HOLIDAYS_ID } from '../PersonioAttendanceFormAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    const quickViewButton: [ICardButton, ICardButton] | undefined = this.state.projects ? [
      {
        title: strings.QuickViewAttendanceButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_ATTENDANCE_ID
          }
        }
      },
      {
        title: strings.QuickViewHolidaysButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_HOLIDAYS_ID
          }
        }
      }
    ]
    :
    undefined;
    return quickViewButton;
  }

  public get data(): IBasicCardParameters {
    return {
      primaryText: this.state.projects ? strings.PrimaryText : 'Loading projects...',
      title: this.properties.title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_ATTENDANCE_ID
      }
    };
  }
}
