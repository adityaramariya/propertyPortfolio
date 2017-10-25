import React,{ Component }  from 'react';
import { Button} from 'reactstrap';
import DateTimeField from "react-bootstrap-datetimepicker";
class Reports extends Component {
 
  handleChange = (newDate) => {
    console.log("newDate", newDate);
    return this.setState({date: newDate});
  }
    
render(){
        return(
            <div className="mainInnerWrapper">
                <div className="card">
                    <div className="card-header">
                        Reports
                    </div>
                    <div className="card-block">
                        <div className="row">
                            <div className="col-sm-6 ">
                                <div className="form-group">
                                    <label>Report Type</label>
                                    <select name="rType" id="rType" className="form-control">
                                        <option value="Transaction Details Report">Transaction Details Report</option>
                                        <option value="Transaction Details Report">Transaction Details Report</option>
                                        <option value="Transaction Details Report">Transaction Details Report</option>
                                        <option value="Transaction Details Report">Transaction Details Report</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Trader Company</label>
                                    <select name="rCompany" id="rCompany" className="form-control">
                                        <option value="Transaction Details Report">Select Trader Company</option>
                                        <option value="Transaction Details Report">Select Trader Company</option>
                                        <option value="Transaction Details Report">Select Trader Company</option>
                                        <option value="Transaction Details Report">Select Trader Company</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Trader Company</label>
                                    <select name="rbCompany" id="rbCompany" className="form-control">
                                        <option value="Transaction Details Report">Select Broker Company</option>
                                        <option value="Transaction Details Report">Select Broker Company</option>
                                        <option value="Transaction Details Report">Select Broker Company</option>
                                        <option value="Transaction Details Report">Select Broker Company</option>
                                        <option value="Transaction Details Report">Select Broker Company</option>
                                        <option value="Transaction Details Report">Select Broker Company</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Transaction Date Begins</label>
                                    <DateTimeField />
                                </div>
                            </div>
                
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Transaction Date Ends</label>
                                    <input type="text" className="form-control" placeholder="Select End Date" id="rEndDate"/>
                                </div>
                            </div>
                        </div>
                       <div className="flex justify-content-end button-group">
                           <Button color="primary" onClick={this.toggle}>Download</Button>{' '}
                           <Button color="secondary" onClick={this.toggle}>Reset</Button>
                       </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Reports;

