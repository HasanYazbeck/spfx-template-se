import * as React from 'react';
import {ISearchBarProps , ISearchBarState } from './ISearchBar';

export class SearchBar extends React.Component<ISearchBarProps<any>, ISearchBarState<any>> {
    state: ISearchBarState<any> = {
        searchResults: [],
        selectedItem: undefined
    };

    constructor(props: ISearchBarProps<any>) {
        super(props);
    }

    private selectItem = (item: any) => {
      this.setState({selectedItem: item});
      this.props.onSelectItem(item);
    }

    public render(): React.ReactElement<{}> {
        return (
        <div>
            <div className={`input-group input-group-text`}>
                <span className='input-group-text' id='inputGroup-sizing-sm'>Search</span>
                <input id= {this.props.keyId} onChange={this.props.OnChange}
                  type='text'
                  className='form-control'
                  aria-label='Sizing example input'
                  aria-describedby='inputGroup-sizing-sm'
                  />
                </div>
                {this.props.searchResults.length > 0 && (
                    <ul className='list-group position-absolute w-100'
                    style={{
                      zIndex: 1000,
                      backgroundColor: 'white',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      borderRadius: '0.25rem',
                    }}>
                    {this.props.searchResults.map((obj) => (
                        <li key={obj.Title}
                          className='list-group-item list-group-item-action'
                          onClick={() => this.selectItem(obj)}
                          style={{ cursor: 'pointer' }}
                        >{obj.Title}</li>
                      ))}
                    </ul>
                  )}
            </div>
        );
    }
}