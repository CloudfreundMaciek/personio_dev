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
        title: this.properties.quickViewButton,
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
      primaryText: this.state.error ? this.state.error : (this.state.quickViewStage ? this.properties.cardViewContent : strings.CardViewLoading),
      imageUrl: `${this.context.pageContext.site.absoluteUrl}/SiteAssets/personio_image.png`,
      imageAltText: "personio_logo"
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

  private getSVGimg() { //xmlns="http://www.w3.org/2000/svg"
    return svgToTinyDataUri(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="110" viewBox="-100, -50, 300, 220">
    <line x1="30" y1="5" x2="10" y2="100" stroke-width="5" stroke="#000"/>
    <ellipse cx="30" cy="40" rx="50" ry="25" fill="#FFF" stroke="#000" stroke-width="4"/>
    <ellipse cx="25" cy=" 98" rx="4" ry="4"/>
    <line x1="5" y1="105" x2="35" y2="105" stroke="#000" stroke-width="4" />
  </svg>
  `);
  }
}
