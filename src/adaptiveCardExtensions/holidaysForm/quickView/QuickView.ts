import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'HolidaysFormAdaptiveCardExtensionStrings';
import { IAbsence, IHolidaysFormAdaptiveCardExtensionProps, IHolidaysFormAdaptiveCardExtensionState } from '../HolidaysFormAdaptiveCardExtension';

export interface IQuickViewData {
  subTitle: string;
  title: string;
  absences: Array<IAbsence>;
}

export class QuickView extends BaseAdaptiveCardView<
  IHolidaysFormAdaptiveCardExtensionProps,
  IHolidaysFormAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      absences: this.state.absences
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/Register.json');
  }
}