import React, { Component } from 'react';
import Request from 'axios';
import { toastr } from 'react-redux-toastr';
const apiBaseUrl = 'api/v1/public/registration/';
const config = {
           headers: { 
           "Content-Type": "application/json",
           "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };
const NO_LIMIT_VALUE_CHECK = -1;
const NO_LIMIT_VALUE_UNCHECK = 0;
class TradingLimit extends Component {
    constructor(props){
        super(props);
        this.state = {
            value: 'LMS',
            tradingLimit:{},
            periodArray : [
            {id:'',periodId:1,periodName : 'JAN',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:2,periodName : 'FEB',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:3,periodName : 'MAR',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:4,periodName : 'APR',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:5,periodName : 'MAY',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:6,periodName : 'JUN',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:7,periodName : 'JUL',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:8,periodName : 'AUG',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:9,periodName : 'SEP',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:10,periodName : 'OCT',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:11,periodName : 'NAV',quantity:'',amount:'',noLimit:0},
            {id:'',periodId:12,periodName : 'DEC',quantity:'',amount:'',noLimit:0}
            ]
        }
        this.getCompanyName();
        this.getProductList();        
    }
	getCompanyName(companyType) {
        var self = this;
        Request.get(apiBaseUrl + 'getAllActiveCompanyList/')
            .then(function(response) {
                console.log(response.data);
                if (response.data !== undefined) {
                    self.setState({
                    companyList: response.data
                    });
                } else
                    self.setState({
                    companyList: []
                    });
            });
    }
    getProductList() {
        var self = this;
        Request.get(apiBaseUrl + 'getProductCategoryList/')
            .then(function(response) {
                console.log(response.data);
                console.log(response.data.mProductCategoryList);
                if (response.data !== undefined) {
                    self.setState({
                    productList: response.data.mProductCategoryList
                    });
                } else
                    self.setState({
                    productList: []
                    });
            });
    }
    onCompanySelect(keyName,stateName,e){    
        var newState = this.state[stateName];
        newState[keyName] = e.target.value;
        this.setState({
        [stateName]: newState
        })
        if(keyName==="primaryCompanyId"){
            this.setState({partnerComp : 
                this.state.companyList.filter(company => company.companyId !== parseInt(e.target.value,10))});
            }     
    }
    onProductSelect(keyName,stateName,e){             
        var self=this;
        // alert("ca="+this.state.tradingLimit.primaryCompanyId+"="+this.state.tradingLimit.partnerCompanyId+"="+e.target.value);
        if(this.state.tradingLimit.primaryCompanyId && this.state.tradingLimit.partnerCompanyId && e.target.value){
            var newState = this.state[stateName];
            newState[keyName] = e.target.value;
            this.setState({
            [stateName]: newState
            })            
            console.log(this.state.tradingLimit);
            Request.post('getSavedDataBasedOnIds/', 
            this.state.tradingLimit
                    , config)
                    .then(function(response) {
                        console.log(response.data);                        
                        if(response.data.limitDetailResponse.length>0){
                          self.setState({periodArray: response.data.limitDetailResponse});
                        }                      
                    });
        }else{
            alert("fail");
        }
    }
   changeQuantity(rowNum,e){
        var periodArray = this.state.periodArray;
        periodArray[rowNum].quantity = e.target.value;
        this.setState({periodArray  : periodArray });
    }
    changeAmount(rowNum,e){
        var periodArray = this.state.periodArray;
        periodArray[rowNum].amount = e.target.value;
        this.setState({periodArray  :this.state.periodArray });
    }
    toggleCheckboxChange(rowNum,e){
        console.log(e.target.checked);
        console.log(rowNum);
        if(e.target.checked){
            var periodArray = this.state.periodArray;
            periodArray[rowNum].amount = '';
            periodArray[rowNum].quantity = '';
            periodArray[rowNum].noLimit = NO_LIMIT_VALUE_CHECK;
            this.setState({periodArray  : periodArray });
        }else{
            var periodArraynoLimit = this.state.periodArray;
            periodArraynoLimit[rowNum].noLimit = NO_LIMIT_VALUE_UNCHECK;
            this.setState({periodArray  : periodArraynoLimit });
        }
    }
    saveTradingLimit(){      
        if(!this.state.tradingLimit["primaryCompanyId"]){    
            toastr.error('Error', 'Kindly select primaryCompany');
        }else if(!this.state.tradingLimit["partnerCompanyId"]){    
            toastr.error('Error', 'Kindly select partnerCompany');
        }else if(!this.state.tradingLimit["productCategoryId"]){    
            toastr.error('Error', 'Kindly select productCategory');
        }else {    
            var self=this;
            console.log(this.state.periodArray);
            var tradingLimit =  this.state.tradingLimit;
            tradingLimit["limitDetailRequest"] = this.state.periodArray;
            this.setState({tradingLimit : tradingLimit});
            console.log(this.state.tradingLimit);
            Request.post(apiBaseUrl + 'saveTraderLimitForCompany/', 
                this.state.tradingLimit
                , config)
                .then(function(response){                
                    console.log(response.data);                
                    if(response.data !== undefined) {
                        toastr.success('SUCCESS', 'Trading added');
                        for(var key in self.state.tradingLimit){
                                self.setState({tradingLimit:{[key] : ''}})                                            
                                self.state.periodArray.forEach((val,index)=>{                        
                                    self.state.periodArray[index]["quantity"]=""; 
                                    self.state.periodArray[index]["amount"]=""; 
                                    self.state.periodArray[index]["noLimit"]=0;  
                                    self.setState({periodArray:self.state.periodArray});
                                })             
                        }
                        self.getCompanyName();
                        //  self.setState({
                        //     companyList: this.state.companyList
                        //  });
                    }else{
                        self.getCompanyName();                
                        //  self.setState({companyList: this.state.companyList});
                    }
                });
            }
    }
    saveChanges(value) {
        this.setState({ value });
    }
    render(){
        return(
            <div className="card nomargin">
                {/*<div className="card-header">*/}
                    {/*Trading Limit*/}
                {/*</div>*/}
                <div className="card-block">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Company Name</label>
                                <select className="form-control"
                                        value={this.state.tradingLimit.primaryCompanyId}
                                        onChange={this.onCompanySelect.bind(this,"primaryCompanyId","tradingLimit")}
                                        defaultValue={this.state.tradingLimit.primaryCompanyId ? this.state.tradingLimit.primaryCompanyId : ''}>
                                    <option value="" disabled className="hide">Select Primary Company</option>
                                    {  this.state.companyList &&
                                    this.state.companyList.map(function(options, responseIndex) {
                                        return <option key={options.companyId} value={options.companyId} className="selection-style">{options.name}
                                        </option>
                                    })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Partner Company</label>
                                <select className="form-control"
                                        value={this.state.tradingLimit.partnerCompanyId}
                                        onChange={this.onCompanySelect.bind(this,"partnerCompanyId","tradingLimit")}
                                        disabled={this.state.tradingLimit.primaryCompanyId ? false : true}
                                        defaultValue={this.state.tradingLimit.partnerCompanyId ? this.state.tradingLimit.partnerCompanyId : ''}>
                                    <option value="" disabled className="hide">Select Partner Company</option>
                                    {  this.state.partnerComp &&
                                    this.state.partnerComp.map(function(options, responseIndex) {
                                        return <option key={options.companyId} value={options.companyId} className="selection-style">{options.name}
                                        </option>
                                    })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Product Category</label>
                                <select className="form-control"
                                        value={this.state.tradingLimit.productCategoryId}
                                        disabled={this.state.tradingLimit.partnerCompanyId ? false : true}
                                        onChange={this.onProductSelect.bind(this,"productCategoryId","tradingLimit")}
                                        defaultValue={this.state.tradingLimit.productCategoryId ? this.state.tradingLimit.productCategoryId : ''}>
                                    <option value="" disabled className="hide">Select Product Category</option>
                                    { this.state.productList &&
                                    this.state.productList.map(function(options, responseIndex) {
                                        return <option key={options.id} value={options.id} className="selection-style">{options.description}
                                        </option>
                                    })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            {/* this class should be added to below div, if you need a scrollbar in table
                             scrollableContent */}
                            <div className="scrollableContent">
                                <table className="table table-condensed table-bordered editableTable">
                                    <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                        <th>No Limit</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.periodArray.map( (row,i) => (
                                        <tr>
                                            <td>{row.periodName}</td>
                                            <td>
                                                <input type="number" className="form-control"
                                                       placeholder="quantity" name="quantity"
                                                       value={row.quantity} id="quantity"
                                                       disabled={row.noLimit!==-1 ?false :true}
                                                       onChange={this.changeQuantity.bind(this,i)}/>
                                            </td>
                                            <td>
                                                <input type="number" className="form-control"
                                                       placeholder="amount" name="amount"
                                                       value={row.amount}
                                                       disabled={row.noLimit!==-1 ?false :true} id="amount"
                                                       onChange={this.changeAmount.bind(this,i)}/>
                                            </td>
                                            <td>
                                                <div className="checkbox hvc">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="noLimit"
                                                            value="noLimit"
                                                            checked={row.amount===-1 ?true :false}
                                                            onClick={this.toggleCheckboxChange.bind(this,i)}
                                                        />
                                                        <span className="check"></span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button type="submit" className="btn btn-primary"
                                    onClick={this.saveTradingLimit.bind(this)}>Save</button>{' '}
                        </div>
                    </div>
                </div>
            </div>
      )
    }
}
export default TradingLimit;