import React, {Component}   from 'react';
import {Button} from 'reactstrap';
import Request from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import {toastr} from 'react-redux-toastr'
const apiBaseUrl = 'api/v1/public/registration/';
const config = {
    headers: {
        "Content-Type": "application/json",
        "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
    }
};

class Licence extends Component {
    
    componentWillMount() {
        this.state = {
            PlanRequest: {},
            planRequestList: [],
            plans: {},
            companyTypeList: [{
                compTypeId: 1,
                label: 'Trader'
            }, {
                compTypeId: 2,
                label: 'Broker'
            }, {
                compTypeId: 3,
                label: 'Individual'
            }],
            totalFee: 0
        }
    }
    onToken = (token) => {
        Request.post('/save-stripe-token', token, config)
            .then(function (response) {
                console.log("we r in bus" + response.data.email);
            });
        // fetch('/save-stripe-token', {
        //      method: 'POST',
        //      body: JSON.stringify(token),
        //    }).then(response => {
        //      response.json().then(data => {
        //        alert(`We are in business, ${data.email}`);
        //      });
        //   });
    }
    clearPlansForUser() {
        for (var key in this.state.plans) {
            this.setState({plans: {[key]: ''}});
        }
    }
    saveCompanyType(companyType) {
        this.setState({companyId: "", userId: ""});
        var self = this;
        Request.post(apiBaseUrl + 'getAllActiveCompanyListByCompanyType/', {
            companyType: companyType.target.value
        }, config)
            .then(function (response) {
                if (typeof response.data.companyList !== undefined) {
                    self.clearPlansForUser();
                    self.setState({
                        companyList: response.data.companyList
                    });
                } else {
                    self.setState({
                        companyList: [], userList: []
                    });
                    toastr.error('Error', 'CompanyList is Empty');
                }
            })
            .catch(function (error) {
                console.log("License -- > saveCompanyType" + error);
            });
    }
    //company select
    saveCompanyName(keyName, e) {
        this.setState({[keyName]: e.target.value, userId: ""});
        var self = this;
        Request.post(apiBaseUrl + 'getAllActiveUsersByCompany/', {
            companyId: e.target.value
        }, config)
            .then(function (response) {
                self.clearPlansForUser();
                if (response.data.userList !== undefined) {
                    console.log('checked');
                    self.setState({
                        userList: response.data.userList
                    });
                } else {
                    self.setState({
                        userList: []
                    });
                    toastr.error('Error', 'UserList is Empty');
                }
            }).catch(function (error) {
            console.log("License --> saveCompanyName" + error);
        });
    }
    //user select
    saveUserName(keyName, e) {
        this.clearPlansForUser();
        this.setState({[keyName]: e.target.value});
        var self = this;
        if (e.target.value !== null) {
            Request.post(apiBaseUrl + 'getSubscriptionPageInfoByUser/', {
                userId: e.target.value
            }, config)
                .then(function (response) {
                    if (response.data) {
                        self.setState({
                            plans: response.data
                        });
                    }
                })
                .catch(function (error) {
                    console.log("saveUserName" + error);
                });
        }
    }
    
    savePlans(keyName, stateName, e) {
        if (keyName === "year") {
            this.saveYearList(e.target.value);
        } else if (keyName === "licenseType") {
            this.setPrice(this.state.PlanRequest["productCategory"], e.target.value, this.state.PlanRequest["validityPlan"]);
        } else if (keyName === "productCategory") {
            this.setPrice(e.target.value, this.state.PlanRequest["licenseType"], this.state.PlanRequest["validityPlan"]);
        } else if (keyName === "validityPlan") {
            this.setPrice(this.state.PlanRequest["productCategory"], this.state.PlanRequest["licenseType"], e.target.value);
            this.setPlanDate(this.state.PlanRequest["year"], this.state.PlanRequest["month"], e.target.value);
        } else if (keyName === "month") {
            console.log('validi' + this.state.PlanRequest["validityPlan"]);
            this.setPlanDate(this.state.PlanRequest["year"], e.target.value, this.state.PlanRequest["validityPlan"]);
        }
        var newState = this.state[stateName];
        newState[keyName] = e.target.value;
        this.setState({
            [stateName]: newState
        })
    }
    
    setPrice(catId, licensePlan, validity) {
        var PlanRequest = this.state.PlanRequest;
        PlanRequest["fee"] = '';
        PlanRequest["totalAmountPlan"] = '';
        var self = this;
        if (catId && licensePlan && validity) {
            self.state.plans.planList.forEach(function (item) {
                if (parseInt(catId, 10) === item.mProductCategory.id && parseInt(validity, 10) === item.validity && licensePlan === item.licenseType) {
                    PlanRequest["fee"] = item.fee;
                    PlanRequest["planId"] = item.id;
                    PlanRequest["totalAmountPlan"] = item.fee + self.state.plans.taxRate;
                    self.setState({
                        PlanRequest: PlanRequest
                    });
                }
            });
        }
    }
    
    saveYearList(yearId) {
        var d = new Date(), monthList = [];
        if (parseInt(yearId, 10) === d.getFullYear()) {
            for (var i = d.getMonth() + 1; i < 12; i++) {
                console.log(i);
                monthList.push({
                    label: i + 1
                });
            }
        } else {
            for (var j = 1; j <= 12; j++) {
                monthList.push({
                    label: j
                });
            }
        }
        this.setState({
            monthList: monthList
        });
    }
    
    setPlanDate(yearId, month, valId) {
        if (valId !== null && month !== null && yearId !== null) {
            if (valId !== undefined && month !== undefined && yearId !== undefined) {
                var d = new Date(yearId, month, 1);
                var PlanRequest = this.state.PlanRequest;
                PlanRequest["startDate"] = d.getDate() + '/' + month + '/' + d.getFullYear();
                d.setMonth(d.getMonth() + parseInt(valId, 10));
                d.setDate(d.getDate() - 1);
                PlanRequest["endDate"] = d.getDate() + '/' + (d.getMonth()) + '/' + d.getFullYear();
                this.setState({
                    PlanRequest: PlanRequest
                });
            }
        }
    }
    
    // Save Plan in new row
    addPlan(e) {
        var copy = Object.assign({}, this.state.PlanRequest);
        this.setState({PlanRequest: {userId: this.state.userId}});
        if (!this.state.userId) {
            toastr.error('Error', 'Please Select UserId');
            return false;
        } else if (!this.state.PlanRequest["licenseType"]) {
            toastr.error('Error', 'Please Select License Type');
            return false;
        } else if (!this.state.PlanRequest["productCategory"]) {
            toastr.error('Error', 'Please Select Product Category Type');
            return false;
        } else if (!this.state.PlanRequest["validityPlan"]) {
            toastr.error('Error', 'Please Select Validity ');
            return false;
        } else if (!this.state.PlanRequest["year"]) {
            toastr.error('Error', 'Please Select Year ');
            return false;
        } else if (!this.state.PlanRequest["month"]) {
            toastr.error('Error', 'Please Select Month ');
            return false;
        } else if (!this.state.PlanRequest["fee"]) {
            toastr.error('Error', 'Fee is not appeared, kindly select the matched fields');
            return false;
        } else {
            console.log('agle ko');
            var self = this;
            Request.post(apiBaseUrl + 'validateIfSubscribedPlanIsValid/', this.state.PlanRequest, config)
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        for (var key in copy) {
                            self.setState({PlanRequest: {[key]: ''}});
                        }
                        self.setState({
                            planRequestList: self.state.planRequestList.concat(copy),
                            monthList: []
                        })
                    } else {
                        toastr.error('Error', 'Validation is not successful');
                    }
                })
                .catch(function (error) {
                    console.log("License -->addPlan " + error);
                });
        }
    }
    
    //stripe test
    handleFormSubmit(e) {
        Request.post(apiBaseUrl + 'createSubscriptionPlanForUser/', {
            planRequests: this.state.planRequestList
        }, config)
            .then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
            console.log("License -->handleFormSubmit " + error);
        });
    }
    
    removePlan(planSelected) {
        //   this.state.planRequestList.splice(this.state.planRequestList.indexOf(planSelected), 1);
        this.setState({
            planRequestList: this.state.planRequestList.filter(function (planSelect) {
                return planSelect !== planSelected
            })
        });
    }
    
    cash() {
        console.log('you clicked on cash payment');
    }
    
    renderBuyNewPlan() {
        return (
            <table className="table table-bordered editableTable">
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Licence Type</th>
                    <th>Validity</th>
                    <th>Year</th>
                    <th>month</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Amount</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <select className="form-control"
                                value={this.state.PlanRequest.productCategory}
                                onChange={this.savePlans.bind(this, "productCategory", "PlanRequest")}
                                defaultValue={this.state.PlanRequest.productCategory ? this.state.PlanRequest.productCategory : ''}>
                            <option value="" disabled className="hide"></option>
                            { this.state.plans.productCategories ?
                                this.state.plans.productCategories.map(function (options, responseIndex) {
                                    return <option key={responseIndex} value={options.id}
                                                   className="selection-style">{options.code}
                                    </option>
                                }) : ''
                            }
                        </select>
                    </td>
                    <td>
                        <select className="form-control"
                                value={this.state.PlanRequest.licenseType}
                                onChange={this.savePlans.bind(this, "licenseType", "PlanRequest")}
                                defaultValue={this.state.PlanRequest.licenseType ? this.state.PlanRequest.licenseType : ''}>
                            <option value="" disabled className="hide"></option>
                            { this.state.plans.liceneTypeList &&
                            this.state.plans.liceneTypeList.map(function (options, responseIndex) {
                                return <option key={responseIndex} value={options} className="selection-style">{options}
                                </option>
                            })
                            }
                        </select>
                    </td>
                    <td>
                        <select className="form-control"
                                value={this.state.PlanRequest.validityPlan}
                                onChange={this.savePlans.bind(this, "validityPlan", "PlanRequest")}
                                defaultValue={this.state.PlanRequest.validityPlan ? this.state.PlanRequest.validityPlan : ''}>
                            <option value="" disabled className="hide"></option>
                            {this.state.plans.validity &&
                            Object.keys(this.state.plans.validity).map((options, i) => {
                                return <option key={i} value={options} className="selection-style">{options}
                                </option>
                            })
                            }
                        </select>
                    </td>
                    <td>
                        <select className="form-control"
                                value={this.state.PlanRequest.year}
                                onChange={this.savePlans.bind(this, "year", "PlanRequest")}
                                defaultValue={this.state.PlanRequest.year ? this.state.PlanRequest.year : ''}>
                            <option value="" disabled className="hide"></option>
                            {this.state.plans.years &&
                            this.state.plans.years.map(function (options, responseIndex) {
                                return <option key={responseIndex} value={options} className="selection-style">{options}
                                </option>
                            })
                            }
                        </select>
                    </td>
                    <td>
                        <select className="form-control"
                                value={this.state.PlanRequest.month}
                                onChange={this.savePlans.bind(this, "month", "PlanRequest")}
                                defaultValue={this.state.PlanRequest.month ? this.state.PlanRequest.month : ''}>
                            <option value="" disabled className="hide"></option>
                            {this.state.monthList &&
                            this.state.monthList.map(function (options, responseIndex) {
                                return <option key={responseIndex} value={options.label}
                                               className="selection-style">{options.label}
                                </option>
                            })
                            }
                        </select>
                    </td>
                    <td>
                        {this.state.PlanRequest.startDate}
                    </td>
                    <td>
                        {this.state.PlanRequest.endDate}</td>
                    <td>
                        <input type="text" className="form-control" placeholder="Fee" name="fee"
                               value={this.state.PlanRequest.fee} id="fee"/>
                    </td>
                    <td>
                        <input type="text" className="form-control" placeholder="Tax" name="tax"
                               value={this.state.plans.taxRate} id="tax"/>
                    </td>
                    <td>
                        <input type="text" className="form-control" placeholder="Total" name="totalAmount"
                               value={this.state.PlanRequest.totalAmountPlan} id="totalAmount"/>
                    </td>
                    <td className="smallTD">
                        <a onClick={this.addPlan.bind(this)} className="btn btn-primary btn-block p-0">
                            <i className="glyphicons glyphicons-plus"></i></a>
                    </td>
                </tr>
                {this.state.planRequestList && this.state.planRequestList.map((row, i) => (
                    <tr key={i}>
                        <td>{this.state.plans.productCategories ? this.state.plans.productCategories[this.state.plans.productCategories.map(
                            function (d) {
                                return d['id'];
                            }).indexOf(parseInt(row.productCategory, 10))].code : ''}</td>
                        <td>{row.licenseType}</td>
                        <td>{row.validityPlan}</td>
                        <td>{row.month}</td>
                        <td>{row.startDate}</td>
                        <td>{row.endDate}</td>
                        <td>{row.totalAmountPlan}</td>
                        <td>
                            <a onClick={this.removePlan.bind(this, row)} key={row}
                               className="btn btn-danger">
                                <i className="glyphicons glyphicons-remove"></    i></a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
    render() {
        return (
            <div className="card">
                {/*<div className="card-header">*/}
                {/*Licence*/}
                {/*</div>*/}
                <div className="card-block">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Company Type</label>
                                <select className="form-control"
                                        value={this.state.companyIdType}
                                        onChange={this.saveCompanyType.bind(this)}
                                        defaultValue={this.state.companyIdType ? this.state.companyIdType : ""}>
                                    <option value="" disabled className="hide">Select Company Type</option>
                                    {this.state.companyTypeList &&
                                    this.state.companyTypeList.map(function (options, responseIndex) {
                                        return <option key={options.compTypeId} value={options.compTypeId}
                                                       className="selection-style">{options.label}
                                        </option>
                                    })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Company Names</label>
                                <select className="form-control"
                                        value={this.state.companyId}
                                        onChange={this.saveCompanyName.bind(this, "companyId")}
                                        defaultValue={this.state.companyId ? this.state.companyId : ""}>
                                    <option value="" disabled className="hide">Select Company Name</option>
                                    { this.state.companyList &&
                                    this.state.companyList.map(function (options, responseIndex) {
                                        return <option key={options.companyId} value={options.companyId}
                                                       className="selection-style">{options.name}
                                        </option>
                                    })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label>Users Names</label>
                                <select className="form-control"
                                        value={this.state.userId}
                                        onChange={this.saveUserName.bind(this, "userId")}
                                        defaultValue={this.state.userId ? this.state.userId : ""}>
                                    <option value="" disabled className="hide">Select User Name</option>
                                    {this.state.userList &&
                                    this.state.userList.map(function (options, responseIndex) {
                                        return <option key={responseIndex} value={options.userId}
                                                       className="selection-style">{options.email}
                                        </option>
                                    })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="card card-outline-secondary">
                        <div className="card-header">
                            Purchased Plan
                        </div>
                        <div className="card-block">
                            <div className="scrollableContent">
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Plan Name</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>{this.state.plans.subscriptionList && this.state.plans.subscriptionList.map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.plan.mProductCategory.code}
                                                _ {row.plan.licenseType}_ {row.plan.validity}</td>
                                            <td>{row.start}</td>
                                            <td>{row.end}</td>
                                            <td>{row.fee}</td>
                                        </tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card card-outline-secondary ">
                        <div className="card-header">
                            Buy New Plan
                        </div>
                        <div className="card-block">
                            {this.renderBuyNewPlan()}
                            <div className="totalBox pull-right">
                                <span>Total payble amount is    </span>
                                <span><strong>{this.state.totalFee}</strong></span>
                            </div>
                            <br/><br/>
                         <div className="flex justify-content-center">
                             <StripeCheckout
                                 name="Balkaner Energy Trading" // the pop-in header title
                                 description="Trading" // the pop-in header subtitle
                                 ComponentClass="div"
                                 panelLabel="Pay" // prepended to the amount in the bottom pay button
                                 amount={this.state.totalFee} // cents
                                 currency="USD"
                                 stripeKey="pk_test_phTezyRZ7QBy2WTHnOW8JGps"
                                 locale="auto"
                                 email="kerem@balkaner.com"
                                 // Note: Enabling either address option will give the user the ability to
                                 // fill out both. Addresses are sent as a second parameter in the token callback.
                                 //shippingAddress
                                 //billingAddress={false}
                                 // Note: enabling both zipCode checks and billing or shipping address will
                                 // cause zipCheck to be pulled from billing address (set to shipping if none provided).
                                 //zipCode={false}
                                 //alipay // accept Alipay (default false)
                                 bitcoin="true" // accept Bitcoins (default false)
                                 //allowRememberMe // "Remember Me" option (default true)
                                 token={this.onToken} // submit callback
                                 // opened={this.onOpened} // called when the checkout popin is opened (no IE6/7)
                                 // closed={this.onClosed} // called when the checkout popin is closed (no IE6/7)
                                 // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
                                 // you are using multiple stripe keys
                                 reconfigureOnUpdate={false}
                                 // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`
                                 // useful if you're using React-Tap-Event-Plugin
                                 // triggerEvent="onTouchTap"
                             >
                                 <Button color="primary"
                                         onClick={this.handleFormSubmit.bind(this)}>Request</Button>
                             </StripeCheckout>
                             <Button color="secondary"
                                     onClick={this.cash.bind(this)}>Cash</Button>
                         </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Licence;


