import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'HolidaysFormAdaptiveCardExtensionStrings';
import { IHolidaysFormAdaptiveCardExtensionProps, IHolidaysFormAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../HolidaysFormAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IHolidaysFormAdaptiveCardExtensionProps, IHolidaysFormAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return this.state.loading ? 
      undefined
      :
      [
        {
          title: strings.RegisterButton,
          action: {
            type: 'QuickView',
            parameters: {
              view: QUICK_VIEW_REGISTRY_ID
            }
          }
        }
      ];
  }

  public get data(): IBasicCardParameters {
    return {
      primaryText: this.state.loading ? 'Loading...' : strings.PrimaryText,
      title: this.properties.title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
