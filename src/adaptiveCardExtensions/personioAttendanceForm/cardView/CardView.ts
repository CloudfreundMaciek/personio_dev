import {
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  BaseImageCardView,
  IImageCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, QUICK_VIEW_ID } from '../PersonioAttendanceFormAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    const cardButton: [ICardButton] | undefined = (this.state.quickViewStage && !this.state.error) ? [
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
    return cardButton;
  }

  public get data(): IImageCardParameters {
    return {
      primaryText: this.state.error ? this.state.error : (this.state.quickViewStage ? strings.PrimaryText : "Loading..."),
      imageUrl: `${this.context.pageContext.site.absoluteUrl}/SiteAssets/personio_image.png`
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    const onCardAction: IQuickViewCardAction | undefined = (this.state.quickViewStage && !this.state.error) ? {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_ID
      }
    }
    :
    undefined;
    return onCardAction;
  }
}
