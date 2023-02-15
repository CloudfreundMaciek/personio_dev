import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { HolidaysFormPropertyPane } from './HolidaysFormPropertyPane';
import { ISPHttpClientOptions, SPHttpClient } from '@microsoft/sp-http';

export interface IHolidaysFormAdaptiveCardExtensionProps {
  title: string;
}

export interface IHolidaysFormAdaptiveCardExtensionState {
  timeOffTypes: Array<ITimeOffType>;
  absences: Array<IAbsence>;
  loading: boolean;
}

export interface IAbsence {
  time_off_type_id: string;
  start_date: string;
  end_date: string;
  half_day_start: string;
  half_day_end: string;
  comment: string;
}

export interface ITimeOffType {
  id: string;
  name: string;
  canHalfDay: boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'HolidaysForm_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'HolidaysForm_QUICK_VIEW';

export default class HolidaysFormAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IHolidaysFormAdaptiveCardExtensionProps,
  IHolidaysFormAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: HolidaysFormPropertyPane | undefined;

  public async getAbsences(): Promise<Array<IAbsence>> {
    const absences = new Array<IAbsence>();
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'getAbsences',
        email: this.context.pageContext.user.email
      })
    };
    return this.context.httpClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', SPHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        return absences;
      }
    );
    //.catch(err => err);
  }

  public async getTimeOffTypes(): Promise<Array<ITimeOffType>> {
    const types = new Array<ITimeOffType>();
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'getTimeOffTypes'
      })
    };
    return this.context.spHttpClient.fetch('https://personioapi.azurewebsites.net/api/HttpTrigger1?code=HuQIZ0XP8otMJznzgy-edcdT-7vOMXv1E8h0N9dQzWFRAzFuqtu1wg==', SPHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
      for (const type of res) {
        types.push({
          name: type.attributes.name,
          id: type.id.toString(),
          canHalfDay: type.attributes.half_day_requests_enabled
        });
      }
      return types;
    });
    //.catch(err => err);
  }

  public onInit(): Promise<void> {
    this.state = { timeOffTypes: null, absences: null, loading: true };

    const typesPromise = this.getTimeOffTypes();
    const absencesPromise = this.getAbsences();

    Promise.all([typesPromise, absencesPromise]).then(res => {
      this.setState({
        timeOffTypes: res[0],
        absences: res[1],
        loading: false
      })
    }),

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'HolidaysForm-property-pane'*/
      './HolidaysFormPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.HolidaysFormPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
