import * as React from 'react';
import {ISearchBarProps , ISearchBarState } from './ISearchBar';

export class SearchBar extends React.Component<ISearchBarProps<any>, ISearchBarState<any>> {
    state: ISearchBarState<any> = {
        searchResults: [],
        selectedItem: undefined,
    };

    constructor(props: ISearchBarProps<any>) {
        super(props);
    }

    private selectItem = (item: any) => {
      if(item !== undefined){
        this.setState({selectedItem: item});
        this.props.onSelectItem(item);
      } else {
        this.setState({selectedItem: undefined});
      }
    }

    public render(): React.ReactElement<{}> {
      // const selectedItemTitle = this.state.selectedItem? this.state.selectedItem.Title || 
      //                                                    this.state.selectedItem.FullName || '' : '';
        return (
        <div>
          {/* input-group-text */}
            <div className={this.props.className === undefined ?  `input-group` : `${this.props.className}` }>
                <span className='input-group-text' id='inputGroup-sizing-sm'>Search</span>
                <input id= {this.props.keyId} onChange={this.props.OnChange} type='text'
                  className='form-control' aria-label='Sizing example input'
                  aria-describedby='inputGroup-sizing-sm' placeholder={this.props.placeholder}
                  // value= {this.props.value}
                  />
                </div>
                {this.props.searchResults.length > 0 && (
                    <ul className='list-group position-absolute'
                    style={{
                      zIndex: 1000,
                      backgroundColor: 'white',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      borderRadius: '0.25rem',
                      width: '-webkit-fill-available'
                    }}>
                    {this.props.searchResults.map((obj,index) => (
                        <li key={index}
                          className='list-group-item list-group-item-action'
                          onClick={() => this.selectItem(obj)}
                          style={{ cursor: 'pointer' }}>{obj.Title!= undefined? obj.Title : obj.FullName}</li>
                      ))}
                    </ul>
                  )}
            </div>
        );
    }
}