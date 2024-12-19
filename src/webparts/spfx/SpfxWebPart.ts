import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpfxWebPartStrings';
import Spfx from './components/Spfx';
import { ISpfxProps } from './components/ISpfxProps';
import { SPCrudOperations } from "../Classes/SPCrudOperations";
import { ISPItem } from '../Interfaces/ISPItem';

export interface ISpfxWebPartProps {
  description: string;
}
export interface ISpfxWebPartState {
  items: any[]; // Update the type based on your list data structure
}
export default class SpfxWebPart extends BaseClientSideWebPart<ISpfxWebPartProps> {
  private spCrudOperations : SPCrudOperations;
  
  private state: ISpfxWebPartState = {
    items: [] // Initial state for items
  };

  private getList = (): void => {
    try {
      debugger;
      this.spCrudOperations = new SPCrudOperations(
        this.context.spHttpClient,
        this.context.pageContext.web.absoluteUrl,
        "Test"
      );
  
      this.spCrudOperations._getItems()
        .then(results => {
          console.log('Results:', results);
          this.setState({ items: results });
          this.state.items = results; // Update state with results
          this.render(); 
        })
        .catch(error => {
          console.error('An Error has Occurred!', error);
        });
    } catch (error) {
      console.error('An Error has Occurred!', error);
    }
  }

  private addItem = (newItem: ISPItem): void => {
    try {
      this.spCrudOperations = new SPCrudOperations(
        this.context.spHttpClient,
        this.context.pageContext.web.absoluteUrl,
        "Test" // Name of the SharePoint list
      );

      this.spCrudOperations._insertItem(newItem)
        .then(() => {
          console.log('Item added successfully!');
          this.getList(); // Refresh the list after adding an item
        })
        .catch(error => {
          console.error('An error has occurred while adding an item!', error);
        });
    } catch (error) {
      console.error('An error has occurred!', error);
    }
  }
  
  public render(): void {
    const element: React.ReactElement<ISpfxProps > = React.createElement(
      Spfx,
      {
        description: this.properties.description,
        onClick: this.getList,
        items:this.state.items,
        onAddItem: this.addItem,
      }
    );

    ReactDom.render(element, this.domElement);
  }

 // Custom setState method to update the component's state
  private setState(newState: Partial<ISpfxWebPartState>): void {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
