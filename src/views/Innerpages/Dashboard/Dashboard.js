import React, { Component } from 'react';
import { Progress } from 'reactstrap';
class Dashboard extends Component {
    // <div className="di justify-space-between">
    // </div>
    render() {
        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-block">                                
                                <h5>Heading</h5>
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.                            
                                <ul className="progressFlex">
                                  <li>
                                    <strong>Land</strong>
                                    <div className="text-muted">40%</div>                
                                    <Progress className="progress-md mt-h" color="success" value="40" />
                                  </li>
                                  <li className="hidden-sm-down">
                                    <strong>Hotel</strong>
                                    <div className="text-muted">20%</div>        
                                    <Progress className="progress-md mt-h" color="info" value="20" />
                                  </li>
                                  <li>
                                    <strong>Apartment</strong>
                                    <div className="text-muted">60%</div>                
                                    <Progress className="progress-md mt-h" color="warning" value="60" />
                                  </li>            
                                </ul>
                            </div>                        
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-block">
                                <h5>Heading</h5>
                                <table className="table mt-1 calculationTable">
                                    <thead>
                                    <tr>
                                        <th>Types</th>
                                        <th>Count</th>
                                        <th>Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Land</td>
                                        <td>5</td>
                                        <td>$10,000</td>
                                    </tr>
                                    <tr>
                                        <td>Hotel</td>
                                        <td>5</td>
                                        <td>$10,000</td>
                                    </tr>
                                    <tr>
                                        <td>Apartment</td>
                                        <td>5</td>
                                        <td>$10,000</td>
                                    </tr>  
                                    <tr>
                                        <td>Total</td>
                                        <td>5</td>
                                        <td>$10,000</td>
                                    </tr>
                                    
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Dashboard;
