import React, { Component } from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap'
import classnames from 'classnames';
import { Button } from 'reactstrap';
import axios from 'axios';
import { toastr } from 'react-redux-toastr'

const apiBaseUrl = 'http://localhost:8793/api/v1/user/';
const config = {
           headers: { 
           "Content-Type": "application/json",
           "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };
const BROKER_COMP_ID = 2;
const TRADER_COMP_ID =3;
const CHECKED_STATUS = 3;
const UNCHECKED_STATUS = 3;

class Brokerage extends Component {
		 constructor(props) {
		 super(props);
		 this.state = {
		    activeTab: '1',
           defaultBrokerages : [],
		     brokerLists: [],
			  brokerageRequestList:{},
		     brokerTraderResponse: []
		     };
		 this.getBrokerCompany(BROKER_COMP_ID);
	 };


	 getBrokerCompany(companyType) {
		 var self = this;
		 axios.post(apiBaseUrl + 'getAllActiveCompanyListByCompanyType/', {
		       companyType: companyType
		    }, config)
		    .then(function(response) {
		       console.log(response.data);
		       if (response.data.companyList !== undefined) {
		          self.setState({
		             brokerCompanyList: response.data.companyList
		          });
		       } else
		          self.setState({
		             brokerCompanyList: []
		          });
		    });
	 }


	 toggle(tab) {
		 console.log(tab);
		 if (this.state.activeTab !== tab) {
		    this.setState({
		       activeTab: tab
		    });
		 }
		 if (parseInt(tab,10) === 2) {
		    this.getTraderList(TRADER_COMP_ID);
		 }
	 }

	 getTraderList(companyType) {
		 var self = this;
	    axios.post(apiBaseUrl + 'getAllActiveCompanyListByCompanyType/', {
		       companyType: companyType
		    }, config)
		    .then(function(response) {
		         if (response.data.companyList !== undefined) {
		          self.setState({
		             traderList: response.data.companyList
		          });
		       } else
		          self.setState({
		             traderList: []
		          });
		    });
	 }


	 changeBrokerageData(row, e) {
		 this.state.brokerLists[this.state.brokerLists.indexOf(row)].brokerage = e.target.value;
		 this.setState({
		    brokerLists: this.state.brokerLists
		 });
	 }


	 saveBrokerageData() {
		 if(!this.state.compId){
       toastr.error('Error', 'Please Select Company');
       }else{
     	 axios.post(apiBaseUrl + 'setDefaultBrokerageRates/', {
		       defaultBrokerages: this.state.brokerLists,
		       broker: this.state.compId
		    }, config)
		    .then(function(response) {
				if(response.data.statusCode === 200)
				toastr.success('Success', 'Brokerage Added');
           });
	    }}




	 getBrokerList(e) {
	   var self = this;
		 this.setState({
		      compId: e.target.value,
			   brokerageRequests : [],
				brokerLists : [],
		 });
		 this.state.compName = self.state.brokerCompanyList[self.state.brokerCompanyList.map(function(d) {
		    return d['companyId'];
		 }).indexOf(parseInt(e.target.value))].name;
		 axios.post(apiBaseUrl + 'getBrokeragePageForBrokerCompany/', {
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
		       } else{
 						toastr.error('Error', 'No Brokerage Plan is available for this broker');
		        	   self.setState({
		             brokerLists: [],brokerageRequests:[],compName:''
		          });}
		    });
	   }


	 getBrokerTraderList(e) {
		 var self = this;
		 this.setState({
		      compTradeId: e.target.value,
				brokerTraderLists : [],
				productCategory : []
		 });

		 axios.post(apiBaseUrl + 'getBrokeragePlansForTraderCompany/', {
		       trader: e.target.value
		    }, config)
		    .then(function(response) {
		       console.log(response.data);
		       if (response.data.brokeragePlansByBrokerList !== undefined) {
                  self.state.brokerTraderLists = response.data.brokeragePlansByBrokerList.map(function(item) {
		             item.map(function(col) {
		                if (col.company !== null) {
		                   item.companyName = col.company.name;
		                   item.companyId = col.company.companyId;
		                   return col;
		                }
		             })
		             item.isChecked = false;
		             return item;
		          });
		         self.setState({
		             brokerTraderLists: response.data.brokeragePlansByBrokerList,
		             productCategory: response.data.mProductCategories
		          });
		       } else { toastr.error('Error', 'No Plan is available for the selected Trader');
		          }
		    });
	 }

	 toggleCheckboxChange(rowNum, e) {
		 this.setState({
		    isChecked: e.target.checked
		 });
		 if (e.target.checked) {
		    this.state.brokerTraderLists[rowNum].isChecked = true;
		    this.state.brokerTraderLists[rowNum].map(function(column, i) {
		       if (column.brokerage != null) {
		          column.status = CHECKED_STATUS;
		       }
		       return column;
		    })
		 } else {
		    this.state.brokerTraderLists[rowNum].isChecked = false;
		    this.state.brokerTraderLists[rowNum].map(function(column, i) {
		       if (column.brokerage != null) {
		          column.status = UNCHECKED_STATUS;
		       }
		       return column
		    });
		 }
	 }


	 changeBrokerageTraderData(rowNum, colNum, col1, e) {
		 if (this.state.brokerTraderLists[rowNum].isChecked) {
		    console.log(this.state.brokerTraderLists[rowNum][colNum].brokerage);
		    this.state.brokerTraderLists[rowNum][colNum].brokerage = e.target.value;
		 }
	 }

	 saveBrokerageTraderData() {
		 var self = this;
		 this.state.brokerTraderLists.map(function(row, i) {
		    if (row.isChecked) {
   	       row.map(function(col, j) {
		          if (col.status == CHECKED_STATUS) {
                      self.state.defaultBrokerages.push({
		                brokerage: col.brokerage,
		                status: col.status,
		                company: {
		                   companyId: row.companyId
		                },
		                mProductCategory: {
		                   id: col.mProductCategory.id
		                }
		             });
		          }
		       })
		    }
		 })
		 if(!this.state.compTradeId){
       toastr.error('Error', 'Please Select Company');
       }else if(!this.state.defaultBrokerages){
		 toastr.error('Error', 'Please Check Company');
       }else if(this.state.defaultBrokerages.length===0){
		 toastr.error('Error', 'Please Check Company');
       }else{
       console.log(this.state.defaultBrokerages);
   	 axios.post(apiBaseUrl + 'requestBrokerageContractsForTrader/', {
		       defaultBrokerages: this.state.defaultBrokerages,
		       trader: parseInt(this.state.compTradeId),
		       status: CHECKED_STATUS
		    }, config)
		    .then(function(response) {
				toastr.success('Success', 'Brokerage Added');
		       console.log(response.data);
    	    });}
	   }

 	generateHeaders() {
		     return this.state.brokerLists.map(function(colData,index) {
	         return <th key={index}> {colData.mProductCategory.code} </th>;
		     });
		 }


	generateRows(){var self = this;    
		  	   return this.state.brokerageRequestList && Object.keys(this.state.brokerageRequestList).map(function(item,i) {
		           var cells = self.state.brokerLists.map(function(colData, index){
                    var check = false;
                     var check =  self.state.brokerageRequestList[item].map(function(itemList,listIndex) {
							if(colData.mProductCategory.code === itemList.mProductCategory.code){
							   check = true;
                        return <td key={i}>{itemList.brokerage}</td> 
                     }else if(self.state.brokerageRequestList[item].length -1 === listIndex && check !== true){
						      return <td></td>    
							 }}); 
                    return check;
                }); return <tr key={i}><td>{item}</td>{cells}</tr>
             })
		}



   render(){
	var brData;
	if(this.state.brokerageRequestList){ 
											 brData =   <table className="table table-bordered">
										             	 <thead><tr><th>Trader Type</th>{this.generateHeaders()}</tr></thead>                          
															 <tbody>{this.generateRows()}</tbody>
							 							   </table> 
 	}
	else
	 brData = <div>Data Not Found</div> ;
        


    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header">
                        Brokerage
                    </div>
                    <div className="card-block">
                        <div className="row">
                            <div className="col-md-12">
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => { this.toggle('1'); }}
                                        >
                                            Brokers
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}
                                        >
                                            Traders
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
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
																					<th>Company Name</th>                              
																					{this.state.brokerLists.map( (header,i) => (
																					<th>{header.mProductCategory.code}</th>
														  						 ))}</tr>
                                                            </thead>
                                                            <tbody>
 																				<tr>
          																	  <td>{this.state.compName}</td>                              
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
																		<div className="scrollableContent">
																								  		 {brData}</div>
																	   </div>
                                            </div>
                                        </form>
                                    </TabPane></TabContent>
                                    <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="2">
                                        <form action="">
                                            <div className="flex row">
                                                <div className="form-group col-sm-4">
                                                    <label>Select Broker Name</label>
								                             <select className="form-control"  
																		value={this.state.companyTraderId} 
																		onChange={this.getBrokerTraderList.bind(this)} 
																		defaultValue={this.state.companyTraderId ? this.state.companyTraderId : ''}>
																		<option value="" disabled className="hide">Select Broker Name</option>
																		 {  this.state.traderList && 
																			 this.state.traderList.map(function(options, responseIndex) {
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
																					<th>Company Name</th>                              
																					{this.state.productCategory && this.state.productCategory.map( (header,i) => (
																					<th>{header.code}</th>
													  						 ))}</tr>
                                                            </thead>
                                                            <tbody>
 																					{this.state.brokerTraderLists && this.state.brokerTraderLists.map( (row,i) => (
																					<tr><td>
																						<div className="checkbox hvc">
																						 <label>
																						  <input type="checkbox" value="isChecked" 
																							onClick={this.toggleCheckboxChange.bind(this,i)}/>
																							<span className="check"></span>
                                                         		    </label>
                                                       			   </div>
																			{row.companyName}
																			</td>
																			{row.map( (col1,j)  => (
																			<td>
																			<div className="input-group mb-1 col-md-6">
																		     <input type="text" className="form-control" 
																				placeholder="brokerage" name="brokerage" 
																				value={this.state.brokerage} id="brokerage"   
																				disabled={col1.brokerage!==null ? (row.isChecked==false?true:false) :true} 
																				defaultValue={col1.brokerage!==null ? col1.brokerage:" "} 
																				onChange={this.changeBrokerageTraderData.bind(this,i,j,col1)}   
																				/></div></td>))}</tr>))}
                                            				  </tbody>
                                                        </table>
                                                    </div>
                                                    <br/><br/>
                                                    <div className="text-center">
                                            				<button type="submit" className="btn btn-primary" 
																			onClick={this.saveBrokerageTraderData.bind(this)}>Save
																		</button>
                                                    </div>
																	 <div className="scrollableContent">
                                                      
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        )
    }
}
export default Brokerage;
