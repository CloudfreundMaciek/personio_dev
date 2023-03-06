import {
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  BaseImageCardView,
  IImageCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';
import { IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState, QUICK_VIEW_ID } from '../PersonioAttendanceFormAdaptiveCardExtension';
import svgToTinyDataUri from "mini-svg-data-uri";

export class CardView extends BaseImageCardView<IPersonioAttendanceFormAdaptiveCardExtensionProps, IPersonioAttendanceFormAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    this.getSVGimg();
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

  private getSVGimg() {
    return svgToTinyDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="60" height="80" rx="10" ry="10" fill="none" stroke="black" stroke-width="5"/>
    <path d="M 70 50 C 70 70, 55 85, 35 85" stroke="black" stroke-width="5" fill="none"/> </svg>
  `);
  }
}
