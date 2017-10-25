import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Request from 'axios';
import { toastr } from 'react-redux-toastr'


const apiBaseUrl = 'api/v1/public/registration/';
const config = {
           headers: { 
           "Content-Type": "application/json",
           "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };
const BROKER_COMP_ID = 2;
class BrokerageBrokerData extends Component {
	constructor(props){
		super(props);
		this.state = {		
		brokerLists: [],
		brokerageRequestList: {}
		};
		this.getBrokerCompany(BROKER_COMP_ID);
	};


	getBrokerCompany(companyType) {
		var self = this;
		Request.post(apiBaseUrl + 'getAllActiveCompanyListByCompanyType/', {
				companyType: companyType
			}, config)
			.then(function(response) {
				console.log(response.data);
				if (response.data.companyList !== undefined) {
					self.setState({
						brokerCompanyList: response.data.companyList
					});
				}else
					self.setState({
						brokerCompanyList: []
					});
			})
			.catch(function(error) {
				console.log("BrokerageBrokerData --> getBrokerCompany"+error);				
			});
	}	


	changeBrokerageData(row, e) {
		var brokerLists =this.state.brokerLists;
		brokerLists[this.state.brokerLists.indexOf(row)].brokerage = e.target.value;
		this.setState({
		brokerLists: brokerLists
		});
	}


	saveBrokerageData() {
		var self = this;
		if(!this.state.compId){
		toastr.error('Error', 'Please Select Company');
		}else{
			Request.post(apiBaseUrl + 'setDefaultBrokerageRates/', {
				defaultBrokerages: this.state.brokerLists,
				broker: this.state.compId
				}, config)
				.then(function(response) {
					if(response.data.statusCode === 200)
					self.clear();
					toastr.success('Success', 'Brokerage Added');
				})
				.catch(function(error) {
					console.log("BrokerageBrokerData --> saveBrokerageData"+error);					
				});
	}}
    
  	clear(){
		this.setState({brokerLists: [],brokerageRequestList:{},companyId:""});
		this.getBrokerCompany(BROKER_COMP_ID);
  	}


	getBrokerList(e) {
	    var self = this;
		var compName = this.state.brokerCompanyList[this.state.brokerCompanyList.map(function(d){
		    return d['companyId'];
		 	}).indexOf(parseInt(e.target.value,10))].name;
		this.setState({
			compId: e.target.value,
			brokerageRequests : [],
			brokerLists : [],
			compName :compName
		});
		Request.post(apiBaseUrl + 'getBrokeragePageForBrokerCompany/', {
			broker: e.target.value
			}, config)
			.then(function(response) {
				console.log(response.data);
				if (response.data.brokeragePlans !== undefined) {
					self.setState({
					brokerLists: response.data.brokeragePlans,
					brokerageRequests :response.data.brokerageRequests,
					brokerageRequestList : response.data.brokerageRequestList,
					compName: self.state.compName
					});
				}else{					
					self.setState({
					brokerLists: [],brokerageRequests:[],compName:''
					});
					toastr.error('Error', 'No Brokerage Plan is available for this broker');
				}
			})
			.catch(function(error) {
				console.log("BrokerageBrokerData --> getBrokerList"+error);
			});
	}

	renderBrData(){
		var self = this;
		return (
			<table className="table table-bordered editableTable">
				<thead>
					<tr>
						<th>Trader Type</th>
						{this.state.brokerLists.map(function(colData,index) {
							return <th key={index}>{colData.mProductCategory.code}</th>;
						})}
					</tr>
				</thead> 
			<tbody>   
				{ this.state.brokerageRequestList && 
					Object.keys(this.state.brokerageRequestList).map(function(item,i) {
						var cells = self.state.brokerLists.map(function(colData, index){
							var check = false;
							var rowData =  self.state.brokerageRequestList[item].map(function(itemList,listIndex) {
							var row;
								if(colData.mProductCategory.code === itemList.mProductCategory.code){
									check = true;
									row = <td key={index}>{itemList.brokerage}</td> 
								}else if(self.state.brokerageRequestList[item].length -1 === listIndex && check !== true){
										row = <td key={index}></td>    
										}
								return row; 
							}); 
							return rowData;
						}); 
					return <tr key={i}><td>{item}</td>{cells}</tr>
				})
				}
			</tbody>
			</table>
			)
	}

    render(){	
		return (
	
			<form action="">
				<div className="flex row">
					<div className="form-group col-sm-4">
						<label>Select Broker Name</label>
								<select className="form-control"  
										value={this.state.companyId} 
										onChange={this.getBrokerList.bind(this)} 
										defaultValue={this.state.companyId ? this.state.companyId : ''}>
										<option value="" disabled className="hide">Select Broker Name</option>
											{this.state.brokerCompanyList &&
												this.state.brokerCompanyList.map(function(options, responseIndex) {
												return <option key={options.companyId} value={options.companyId} className="selection-style">{options.name}
													</option>                                                          
											})
										}
								</select>
					</div>
					<div className="col-sm-12">
						<div className="scrollableContent">
							<table className="table table-bordered">
								<thead>
										<tr>      
											<th>Company Name
											</th>                              
											{this.state.brokerLists.map( (header,i) => (
											<th>{header.mProductCategory.code}
											</th>
											))}
										</tr>
								</thead>
								<tbody>
										<tr>
											<td>{this.state.compName}
											</td>                              
											{this.state.brokerLists.map( (row,i) => (
											<td>
												<div className="input-group mb-1 col-md-6">
												<input type="text" className="form-control" placeholder="brokerage" name="brokerage" 																				     value={this.state.brokerage} id="brokerage" 							      									  																			           defaultValue={row.brokerage!==null ? row.brokerage:0} 
												onChange={this.changeBrokerageData.bind(this,row)} 
												key={row} 
												/>
											</div>
											</td>
											))}
										</tr>
								</tbody>
							</table>
						</div>
						<br/><br/>
						<div className="text-center">
							<Button color="primary" onClick={this.saveBrokerageData.bind(this)}>Save</Button>{' '}
						</div>
						<br/>
						<div className="scrollableContent">
							{this.renderBrData()}
						</div>
					</div>
				</div>
			</form>
										
		)
    }
}
export default BrokerageBrokerData;
