import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import * as strings from 'PersonioAttendanceFormAdaptiveCardExtensionStrings';

export class PersonioAttendanceFormPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                
              ]
            }
          ]
        }
      ]
    };
  }
}
