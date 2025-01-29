import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart
} from '@microsoft/sp-webpart-base';
import { ICalenderEventsSeProps, IEvent} from './components/ICalenderEventsSeProps';
import {CalenderEventsSe} from './components/CalenderEventsSe';
import { SPCrudOperations } from '../../Classes/SPCrudOperations';
import { SPHelpers } from '../../Classes/SPHelpers';

export default class CalenderEventsSeWebPart extends BaseClientSideWebPart<ICalenderEventsSeProps> {
  private spCrudOperation: SPCrudOperations;
  private spHelpers: SPHelpers = new SPHelpers();
  state = {
    showAdvancedSettings: true,
    newEvent: {Title:'', Location:'', Description:'' , fRecurrence: false, IsCompleted: false}
  }
  public async render(): Promise<void> {
    const element: React.ReactElement<ICalenderEventsSeProps> = React.createElement(
      CalenderEventsSe,
      {
        description: this.properties.description,
        context: this.context,
        categories: [
          { Id:'Meeting' , Title: 'Meeting'},
          { Id:'Work hours' , Title: 'Work hours'},
          { Id:'Business' , Title: 'Business'},
          { Id:'Holiday' , Title: 'Holiday'},
          { Id:'Get-together' , Title: 'Get-together'},
          { Id:'Gifts' , Title: 'Gifts'},
          { Id:'Anniversary' , Title: 'Anniversary'},
        ]
      }
    );

    ReactDom.render(element, this.domElement);
  }
  
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  //   return {
  //     pages: [
  //       {
  //         header: {
  //           description: strings.PropertyPaneDescription
  //         },
  //         groups: [
  //           {
  //             groupName: strings.BasicGroupName,
  //             groupFields: [
  //               PropertyPaneTextField('description', {
  //                 label: strings.DescriptionFieldLabel
  //               })
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   };
  // }

  // protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  //   const { showAdvancedSettings } = this.state;
  
  //   return {
  //     pages: [
  //       {
  //         header: {
  //           description: showAdvancedSettings ? "Advanced Event Settings" : "Basic Event Settings"
  //         },
  //         groups: [
  //           {
  //             groupName: showAdvancedSettings ? "Advanced Event Details" : "Basic Event Details",
  //             groupFields: [
  //               PropertyPaneTextField('newEventTitle', {
  //                 label: "Event Title",
  //                 value: this.state.newEvent.Title
  //               }),
  //               PropertyPaneTextField('newEventLocation', {
  //                 label: "Event Location",
  //                 value: this.state.newEvent.Location
  //               }),

  //               PropertyPaneTextField('newEventDescription', {
  //                 label: "Event Description",
  //                 value: this.state.newEvent.Description
  //               }),

  //               PropertyPaneCheckbox('newEventRecurrence', {
  //                 text: "Recurrence",
  //                 checked: this.state.newEvent.fRecurrence
  //               }),

  //                // If showAdvancedSettings is true, show these extra fields
  //                ...(showAdvancedSettings ? [

  //                ] : []),

  //               PropertyPaneCheckbox('newEventCompleted', {
  //                 text: "Completed",
  //                 checked: this.state.newEvent.IsCompleted
  //               }),
  
  //               PropertyPaneButton('saveEvent', {
  //                 text: "Save",
  //                 onClick: function (value: any) {
  //                   throw new Error('Function not implemented.');
  //                 }
  //               }),

  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   };
  // }

  // private async GetEvents(): Promise<IEvent []> {
    
  //   try {
  //     const query: string ='';
  //     let result: IEvent [] = [];
  //     this.spCrudOperation = new SPCrudOperations(this.context.spHttpClient, this.context.pageContext.web.absoluteUrl,'Events',query);
  //     const reponse =  await this.spCrudOperation._getItems();
    
  //     if(reponse !== undefined && reponse.length > 0){
  //      reponse.map(item => {
  //         let temp: IEvent = {Id:0, Title:''};
  //         temp.GUID = item['GUID'] !== undefined ? item['GUID']: undefined;
  //         temp.Id = item['Id'] !== undefined ? item['Id'] : 0;
  //         temp.Title = item['Title'] !== undefined ? item['Title'] : '';
  //         temp.IsCompleted = item['IsCompleted'] !== undefined ? item['IsCompleted'] : undefined;
  //         temp.Category =item['Category'] !== undefined ? item['Category'] : '';
  //         temp.Location = item['Location'] !== undefined ? item['Location'] : '';
  //         temp.Description = item['Description'] !== undefined ? item['Description'] : '';
  //         temp.fAllDayEvent = item['fAllDayEvent'] !== undefined ? item['fAllDayEvent'] : undefined;
  //         temp.fRecurrence = item['fRecurrence'] !== undefined ? item['fRecurrence'] : undefined;
  //         if (item['EventDate'] !== undefined) {
  //           temp.StartTime = this.spHelpers.convertGMTToLocalTime12Hour(item['EventDate']);
  //           temp.startDate = new Date(item['EventDate']);
  //         } else {
  //           temp.StartTime = '';
  //           temp.startDate = new Date(2024, 10, 29); // Default fallback date
  //         }

  //         if(item['EndDate'] !== undefined) {
  //           temp.EndTime = this.spHelpers.convertGMTToLocalTime12Hour(item['EndDate']);
  //           temp.endDate = new Date(item['EndDate']);
  //         } else {
  //           temp.EndTime = '';
  //           temp.endDate = new Date(2024, 10, 29); // Default fallback date
  //         }

  //         result.push(temp);
  //       });
  //       };
  //    return result;
  //   }
  //   catch (err) {
  //     console.log(err);
  //   } 
  // }
}
