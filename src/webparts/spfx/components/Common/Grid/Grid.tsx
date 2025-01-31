import * as React from 'react';
import { IGridProps ,IGridState } from './IGrid';
import { Severity } from '../../Problems/IProblems';
import styles from './Grid.module.scss';

export class Grid extends React.Component<IGridProps<any>, IGridState<any>> {

    state: IGridState<any> = {
    };
    constructor(props: IGridProps<any>) {
        super(props);
    }

    public render(): React.ReactElement<{}> {
        return (
            <div>   
                {/* Problems Grid */}
                <div className='card mb-3'>
                <div className='card-header' style={{backgroundColor: '#4d784e'}}>
                    {/* <label className='text-white'>Reported Problems</label> */}
                </div>
                {/* <div className='card-body'>
                <button className='btn btn-primary btn-sm' style={{backgroundColor: 'rgb(103, 86, 69)'}}
                        //onClick={this.props.OnAddProblemClick}
                        >Add Problem</button>
                    <div className={`${styles.responsiveGrid}`}>
                        {this.props.list.map(item => (
                            <div key={item.Id} className={`${styles.gridItem}`}>
                                <div className={`${styles.gridRow}`}>
                                    <strong>Site Name:</strong> {item.Site.Title}
                                </div>
                                <div className={`${styles.gridRow}`}>
                                    <strong>Issue Title:</strong> {item.IssueTitle}
                                </div>
                                <div className={`${styles.gridRow}`}>
                                    <strong>Severity:</strong> 
                                    <span className={`badge bg-${this.getSeverityColor(item.Severity)}`}>
                                        {item.Severity}
                                    </span>
                                </div>
                                <div className={`${styles.gridRow}`}>
                                    <strong>Reported By:</strong> {item.Author.Title}
                                </div>
                                <div className={`${styles.gridRow}`}>
                                    <strong>Date:</strong> {item.Created !== undefined ? item.Created.toLocaleDateString() : ''}
                                </div>
                                <div className={`${styles.gridRow}`}>
                                    <button 
                                        id={item.Id}
                                        key={item.Id}
                                        className='btn btn-link btn-sm'
                                        onClick={(item) => this.props.OnViewDetailsClick(item)}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Add Problem Button */}
                <div className='card-body'>
                    <button className='btn btn-primary btn-sm' style={{backgroundColor: 'rgb(103, 86, 69)'}}
                        >Add Problem</button>
                        <div className={'table-responsive'}>
                        <table className='table table-striped'>
                            <thead>
                                <tr className={`text-center text-uppercase`}>
                                    <th>Site Name</th>
                                    <th>Issue Title</th>
                                    <th>Severity</th>
                                    <th>Reported By</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.list.map(item => (
                                    <tr key={item.Id} className={`${styles.gridItem}`}>
                                        <td>{item.Site.Title}</td>
                                        <td>{item.IssueTitle}</td>
                                        <td>
                                            <span className={`badge bg-${this.getSeverityColor(item.Severity)}`}>
                                                {item.Severity}
                                            </span>
                                        </td>
                                        <td hidden>{item.Author.Id}</td>
                                        <td>{item.Author.Title}</td>
                                        <td>{item.Created !== undefined ? item.Created.toLocaleDateString() : ''}</td>
                                        <td>
                                            <button 
                                                id={item.Id}
                                                key={item.Id}
                                                className='btn btn-link btn-sm'
                                                onClick={(item) => this.props.OnViewDetailsClick(item)}>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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