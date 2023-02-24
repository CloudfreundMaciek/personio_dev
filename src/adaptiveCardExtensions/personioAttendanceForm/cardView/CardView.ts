import {
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  BaseBasicCardView,
  IBasicCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, QUICK_VIEW_ID } from '../PersonioAttendanceFormAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    const quickViewButton: [ICardButton] | undefined = this.state.timeOffTypes ? [
      {
        title: strings.QuickViewAttendanceButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_ID
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
      primaryText: this.state.projects ? strings.PrimaryText : this.state.cardViewContent
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_ID
      }
    };
  }
}
