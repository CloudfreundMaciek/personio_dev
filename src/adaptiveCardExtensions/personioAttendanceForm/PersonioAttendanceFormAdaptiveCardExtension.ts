import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { PersonioAttendanceFormPropertyPane } from './PersonioAttendanceFormPropertyPane';
import { ISPHttpClientOptions, SPHttpClient } from '@microsoft/sp-http';

export interface IPersonioAttendanceFormAdaptiveCardExtensionProps {
  title: string;
}

export interface IPersonioAttendanceFormAdaptiveCardExtensionState {
  projects: Array<IProject>;
  stage: string;
  message: string;
}

export interface IWorkRegister {
  day: string;
  start: string;
  end: string;
  break: string;
  comment: string;
  project: string;
}

export interface IProject {
  id: string;
  name: string;
}

const CARD_VIEW_REGISTRY_ID: string = 'PersonioAttendanceForm_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PersonioAttendanceForm_QUICK_VIEW';

export default class PersonioAttendanceFormAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPersonioAttendanceFormAdaptiveCardExtensionProps,
  IPersonioAttendanceFormAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PersonioAttendanceFormPropertyPane | undefined;

  public registerWork (date: IWorkRegister): void {
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'attendance', 
        date, 
        email: this.context.pageContext.user.email
      })
    };
    this.context.httpClient.fetch('https://personiodev.azurewebsites.net/api/HttpTrigger1?code=ugK5t1l5opFERGswXgN4lfQHp8kTJ1V0tLc9j9KujMxBAzFuCEdDaQ==', SPHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => this.setState({message: res.message, stage: 'response'}));
  }

  // add error handling
  public async getProjects(): Promise<Array<IProject>> {
    const projects = new Array<IProject>();
    projects.push({name: '---', id: null});
    const options: ISPHttpClientOptions = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        target: 'projects',
        email: this.context.pageContext.user.email
      })
    };
    return this.context.httpClient.fetch('https://personiodev.azurewebsites.net/api/HttpTrigger1?code=ugK5t1l5opFERGswXgN4lfQHp8kTJ1V0tLc9j9KujMxBAzFuCEdDaQ==', SPHttpClient.configurations.v1, options)
    .then(res => res.json())
    .then(res => {
      for (const project of res) {
        projects.push({
          name: project.attributes.name,
          id: project.id.toString()
        });
      }
      return projects;
    });
    //.catch(err => err);
  }

  public onInit(): Promise<void> {
    this.state = {projects: null, stage: 'form', message: null};
    this.getProjects().then(projects => this.setState({
      projects: projects
    }));
    this.registerWork = this.registerWork.bind(this);

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView(this.registerWork));

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PersonioAttendanceForm-property-pane'*/
      './PersonioAttendanceFormPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PersonioAttendanceFormPropertyPane();
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
