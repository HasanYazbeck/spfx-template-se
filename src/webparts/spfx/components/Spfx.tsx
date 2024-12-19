import * as React from 'react';
import styles from './Spfx.module.scss';
import { ISpfxProps } from './ISpfxProps';

export interface ISpfxState {
  newItemTitle: string; // State to store the value of the new item input field
  personId: number;
}

export default class Spfx extends React.Component < ISpfxProps, ISpfxState > {
  constructor(props: ISpfxProps) {
    super(props);
    this.state = {
      newItemTitle: '', // Initialize the state for the new item title
      personId: 0
    };
  }
   // Handle input change to store new item title in the state
   private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ newItemTitle: event.target.value});
  }

    // Call the parent addItem function with the new item
    private handleAddItem = (): void => {
      if (!this.state.newItemTitle.trim()) {
        alert('Please enter a valid title for the item.');
        return;
      }
  
      const newItem = {
        Title: this.state.newItemTitle // Assuming 'Title' is the name of the column in SharePoint
      };
  
      // Call the parent method to add the item
      this.props.onAddItem(newItem);
  
      // Clear the input field after submission
      this.setState({ newItemTitle: '' });
    }


  public render(): React.ReactElement<ISpfxProps> {
    const { items } = this.props;
    return (
      <div className={styles.spfx}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <h2>SharePoint List CRUD</h2>

              {/* Form to add new item */}
              <input 
                type="text" 
                value={this.state.newItemTitle} 
                onChange={this.handleInputChange} 
                placeholder="Enter new item title" 
                className={styles.inputField} 
              />

          


              <button onClick={this.handleAddItem} className={styles.addButton}>
                Add Item
              </button>

              {/* Button to refresh the list */}
              <button onClick={this.props.onClick} className={styles.refreshButton}>
                Refresh List
              </button>
            </div>

            <div className={styles.column}>
              {/* Display list of items */}
              {items && items.length > 0 && (
                <ul className={styles.itemList}>
                  {items.map((item, index) => (
                   <li key={index}>{item.Title}</li> // Display the Title of the list item
                ))}
              </ul>
            )}
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}
