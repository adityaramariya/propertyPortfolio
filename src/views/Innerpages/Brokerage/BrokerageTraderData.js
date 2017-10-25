import React from 'react';
import Request from 'axios';
import { toastr } from 'react-redux-toastr'

const apiBaseUrl = 'api/v1/public/registration/';
const config = {
           headers: { 
           "Content-Type": "application/json",
           "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };

const TRADER_COMP_ID =3;
const CHECKED_STATUS = 3;
const UNCHECKED_STATUS = 3;
class BrokerageTraderData extends React.Component {

	constructor(props) {
    super(props);
 	this.state = {
      companyTraderId: ""
    	}
	  }
	

	componentWillMount() {
		this.state = {
			activeTab: '1',
			defaultBrokerages: [],
			brokerTraderResponse: []
		};
		  	this.getTraderList(TRADER_COMP_ID);
	}


	getTraderList(companyType) {
		var self = this;
		Request.post(apiBaseUrl + 'getAllActiveCompanyListByCompanyType/',{
			companyType: companyType
			},config)
			.then(function(response) {
			if(response.data.companyList !== undefined) {
				self.setState({
				traderList: response.data.companyList
				});
			}else
				self.setState({
				traderList: []
				});
			})
			.catch(function(error) {
				console.log("getTraderList"+error);
				toastr.error('Error', 'Unable to get TraderList');
			});
	}



	getBrokerTraderList(e) {
		var self = this;
		this.setState({
		   compTradeId: e.target.value,
		   brokerTraderLists: [],
		   productCategory: []
		});

		Request.post(apiBaseUrl + 'getBrokeragePlansForTraderCompany/', {
		    trader: e.target.value
		   	}, config)
			.then(function(response) {
				console.log(response.data);
				if(response.data.brokeragePlansByBrokerList !== undefined) {
					self.state.brokerTraderLists = response.data.brokeragePlansByBrokerList.map(function(item) {
					item.forEach(function(col) {
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
				}else{
					toastr.error('Error', 'No Plan is available for the selected Trader');
				}
				})
			.catch(function(error){
				console.log("getBrokerTraderList"+error);
				toastr.error('Error', 'Unable to get list of selected Company, Server Error');
			});
	}




	toggleCheckboxChange(rowNum, e) {
		this.setState({
		   isChecked: e.target.checked
		});
		if (e.target.checked) {
		var brokerTraderListsCheck = this.state.brokerTraderLists;
		brokerTraderListsCheck[rowNum].isChecked = true;
		brokerTraderListsCheck[rowNum].map(function(column, i) {
			if (column.brokerage != null) {
				column.status = CHECKED_STATUS;
			}
			return column;
		})
		this.setState({brokerTraderLists : brokerTraderListsCheck});
		} else {
		var brokerTraderListsUncheck = this.state.brokerTraderLists;
		brokerTraderListsUncheck[rowNum].isChecked = false;
		brokerTraderListsUncheck[rowNum].map(function(column, i) {
			if (column.brokerage != null) {
				column.status = UNCHECKED_STATUS;
			}
			return column
		});
		this.setState({brokerTraderLists : brokerTraderListsUncheck}); 
		}
	}



	changeBrokerageTraderData(rowNum, colNum, col1, e) {
		if (this.state.brokerTraderLists[rowNum].isChecked) {
			console.log(this.state.brokerTraderLists[rowNum][colNum].brokerage);
			var brokerTraderLists = this.state.brokerTraderLists;
			brokerTraderLists[rowNum][colNum].brokerage = e.target.value;
			this.setState({brokerTraderLists:brokerTraderLists});
		}
	}




	saveBrokerageTraderData() {
		var self = this;
		this.state.brokerTraderLists.forEach(function(row, i) {
			if (row.isChecked) {
				row.forEach(function(col, j) {
					if (col.status === CHECKED_STATUS) {
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
		if (!this.state.compTradeId) {
			toastr.error('Error', 'Please Select Company');
		}else if (!this.state.defaultBrokerages) {
		toastr.error('Error', 'Please Check Company');
		}else if (this.state.defaultBrokerages.length === 0) {
		toastr.error('Error', 'Please Check Company');
		}else {
		console.log(this.state.defaultBrokerages);
		Request.post(apiBaseUrl + 'requestBrokerageContractsForTrader/', {
			defaultBrokerages: this.state.defaultBrokerages,
			trader: parseInt(this.state.compTradeId,10),
			status: CHECKED_STATUS
			}, config)
			.then(function(response) {
				self.clear();
				toastr.success('Success', 'Brokerage Added');
				console.log(response.data);
			}).catch(function(error) {
				console.log("saveBrokerageTraderData"+error);
				toastr.error('Error', 'Unable to Save Data for the selected Company, Server Error');
            });
		}
	}

	clear(){
		this.setState({defaultBrokerages: [],brokerTraderLists:[],productCategory:[],companyTraderId:""});
		this.getTraderList(TRADER_COMP_ID);
	}

    render(){
        return(
            <form action="">
                <div className="flex row">
                    <div className="form-group col-sm-4">
                      	<label>Select Trader Name</label>
							<select className="form-control"  
								value={this.state.companyTraderId} 
								onChange={this.getBrokerTraderList.bind(this)} 
								defaultValue={this.state.companyTraderId ? this.state.companyTraderId : ''}>
								<option value="" disabled className="hide">Select Trader Name</option>
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
										))}
									</tr>
                              	</thead>
                              	<tbody>
									{this.state.brokerTraderLists && this.state.brokerTraderLists.map( (row,i) => (
									<tr>
										<td>
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
											disabled={col1.brokerage!==null ? (row.isChecked===false?true:false) :true} 
											defaultValue={col1.brokerage!==null ? col1.brokerage:" "} 
											onChange={this.changeBrokerageTraderData.bind(this,i,j,col1)}   
											/></div>
										</td>))}.
									</tr>))}
              				  	</tbody>
                          	</table>
                     	</div>
                        <br/><br/>
                      	<div className="text-center">
              				<button type="button" className="btn btn-primary" 
									onClick={this.saveBrokerageTraderData.bind(this)}>Save
							</button>
                      	</div>
					</div>
                </div>
            </form>
        )
    }
}
export default BrokerageTraderData;
