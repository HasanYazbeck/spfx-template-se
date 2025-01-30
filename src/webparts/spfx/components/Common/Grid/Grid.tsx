import * as React from 'react';
import { IGridProps ,IGridState } from './IGrid';
import { Severity } from '../../Problems/IProblems';

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
                <div className="card mb-3">
                <div className="card-header" style={{backgroundColor: '#4d784e'}}>
                    {/* <label className="text-white">Reported Problems</label> */}
                </div>
                <div className="card-body">
                    {/* Add Problem Button */}
                    <button className="btn btn-primary mb-2" style={{backgroundColor: 'rgb(103, 86, 69)'}}
                        //onClick={this.props.OnAddProblemClick}
                        >Add Problem</button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Site Name</th>
                            <th>Issue Title</th>
                            <th>Severity</th>
                            <th>Reported By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.list.map(item => (
                            <tr key={item.Id}>
                                <td>{item.SiteName}</td>
                                <td>{item.IssueTitle}</td>
                                <td>
                                    <span className={`badge bg-${this.getSeverityColor(item.Severity)}`}>
                                        {item.Severity}
                                    </span>
                                </td>
                                <td>{item.ReportedBy}</td>
                                <td>
                                    <button 
                                        className="btn btn-link btn-sm"
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