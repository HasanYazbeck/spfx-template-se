import * as React from 'react';

// Interfaces
import { IGridProps , IGridState } from './IGrid';
import { Severity } from '../../Problems/IProblems';

// Styles
import styles from './Grid.module.scss';
import commonStyles from './../../../../common.module.scss';
import { Paginator } from '../Paginator/Paginator';

export class Grid extends React.Component<IGridProps<any>, IGridState<{}>> {
    public state: IGridState<{}> = {
    };
    constructor(props: IGridProps<any>) {
        super(props);
    }

    public render(): React.ReactElement<{}> {
        return (
           <div className='card'>
                    {/* Problems Grid */}
                {/* <div className='card-header' style={{backgroundColor: '#6E8E59'}}>
                    <label className='text-white'>Reported Problems</label>
                </div> */}
                {/* Add Problem Button */}
                <div className='card-body'>
                    <button className={`btn btn-primary btn-sm ${commonStyles.militaryBrownBackground}`}
                        onClick={this.props.OnClick}>Add</button>
                        <div className={'table-responsive'}>
                        <table className='table table-striped table-sm'>
                            <thead>
                                <tr className={`text-center text-capitalize`}>
                                    <th className='w-25'>Site</th>
                                    <th className='w-25'>Issue</th>
                                    <th>Severity</th>
                                    <th>Reported By</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.list.map(item => (
                                    <tr key={item.Id} className={`${styles.gridItem} text-capitalize`}>
                                        <td>{item.Site.Title}</td>
                                        <td>{item.IssueTitle}</td>
                                        <td className='text-center'>
                                            <span className={`badge bg-${this.getSeverityColor(item.Severity)} w-100 text-dark`}>
                                                {item.Severity}
                                            </span>
                                        </td>
                                        <td hidden>{item.Author.Id}</td>
                                        <td className='text-center'>{item.Author.Title}</td>
                                        <td className='text-center'>{item.Created !== undefined ? item.Created.toLocaleDateString('en-US') : ''}</td>
                                        <td className='text-center'>
                                            <button id={item.Id} key={item.Id} className='btn btn-link btn-sm'
                                            onClick={(item) => this.props.OnViewDetailsClick(item)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Paginator items={this.props.list} currentPage={1} itemPerPage={2}/>
                        {/* <Pagination currentPage={0} totalPages={0} onChange={function (page: number): void {
                            throw new Error('Function not implemented.');
                        } }/> */}
                    </div>
                </div>
           </div>
        );
    }

    private getSeverityColor = (severity: Severity): string => {
        switch (severity) {
            case 'critical': return 'danger';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'success';
            default: return 'secondary';
        }
    }
}