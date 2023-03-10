import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
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
                PropertyPaneTextField('cardViewContent', {
                  label: strings.PropertyPane.Content
                }),
                PropertyPaneTextField('quickViewButton', {
                  label: strings.PropertyPane.ButtonLabel
                }),
                PropertyPaneToggle('attendance', {
                  label: strings.PropertyPane.Fields.Attendance
                }),
                PropertyPaneToggle('absence', {
                  label: strings.PropertyPane.Fields.Absence
                }),
                PropertyPaneToggle('projects', {
                  label: strings.PropertyPane.Fields.Projects
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
