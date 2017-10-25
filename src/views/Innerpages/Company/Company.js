import React   from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import Request from 'axios';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr'

const apiBaseUrl = 'api/v1/public/registration/';
const config = {
           headers: { 
           "Content-Type": "application/json",
           "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };

const PENDING_COMPANY_STATUS = 1;
const COMPANY_REJECT_STATUS = 4;
class Company extends React.Component { 

    componentWillMount() {
        this.state = {           
            compDetail : {},
            activeTab: '1'
            };
        this.getCompanyApprovalRequestList(PENDING_COMPANY_STATUS);    
    }

    getCompanyApprovalRequestList(param){
        var self = this;
        Request.post(apiBaseUrl+'getCompanyApprovalRequestList/',{status:param},config)
            .then(function (response) {
                if(response.data.companyList !== undefined){
                self.setState({companyList:response.data.companyList}); 
                }else
                self.setState({companyList:[]});
            })
            .catch(function(error){
                console.log("companyData --> getCompanyApprovalRequestList"+error);               
            });
    }

    tabToggle(tab) {
        this.getCompanyApprovalRequestList(tab);  
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    toggleLarge =(item) => {
        this.setState({
        large: !this.state.large,
        compDetail : item,
        modal: !this.state.modal
        });
        console.log(item);
    }

    approveCompanyApprovalRequest(item,action){
        var status = action==="approved" ? (item.status+1) : COMPANY_REJECT_STATUS;             
        var self = this;
        Request.post(apiBaseUrl+'approveCompanyApprovalRequest/',{companyId:item.companyId,status:status},config)
            .then(function (response) {
                console.log(response.data.statusCode=== 200);
                if(response.data.statusCode === 200){
                    toastr.success('SUCCESS', item.name+' is '+action);
                    var array = self.state.companyList;
                    var index = array.indexOf(item)
                    array.splice(index, 1);
                    self.setState({companyList:array});
                }else{
                    toastr.error('Error', item.name+' is not'+action);
                }
            }).catch(function(error){
                console.log("companyData --> "+action+""+error);               
            });  
    }


    updateSearch(e){
        console.log(e.target.value);
        this.setState({[e.target.name] : e.target.value.substr(0,5)});
    }

    renderCompanyList(){
        var self = this;       
            return(
                <table className="table table-bordered table-striped table-condensed">
						<thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Company Type</th>
                                <th>Company Tax No.</th>
                                <th>Country</th>
                                <th>Contact</th>
                                {(self.state.activeTab !== '3' && self.state.activeTab !== '0' ?
                                <th className="mdTD">Approval</th>:null)}
                            </tr>
                        </thead>                          
						<tbody>
                            {this.state.companyList && this.state.companyList.map(function (item,i) { return(
                            <tr>
                                <td><a onClick={()=>self.toggleLarge(item)}>{item["name"]}</a></td>              
                                <td>{item['companyType']['code']}</td>
                                <td>{item["taxNo"]}</td>
                                <td>{item["country"]}</td>
                                <td>{item["phone1"]}</td>
                                {(self.state.activeTab !== '3' && self.state.activeTab !== '0' ?
                                <td><button className="btn btn-sm btn-primary" onClick={()=>self.approveCompanyApprovalRequest(item,"approved")}>
                                        Accept
                                    </button>&nbsp;
                                    <button className="btn btn-sm btn-danger" onClick={()=>self.approveCompanyApprovalRequest(item,"rejected")}>
                                        Reject
                                    </button></td> : null)}
                            </tr> 
                            )})} 
                        </tbody>
					</table>
            )
     }
    
    render(){       
        return(
            <div className="card">
                {/*<div className="card-header">*/}
                {/*Company List*/}
                {/*</div>*/}
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.tabToggle('1'); }}
                        >
                            New
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.tabToggle('2'); }}
                        >
                            Contract Pending
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.tabToggle('3'); }}
                        >
                            Active
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '0' })}
                            onClick={() => { this.tabToggle('0'); }}
                        >
                            InActive
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='1' >
                        { <div className="pull-right">
                            <input type="search" className="form-control" placeholder="Search" name="search"
                                   value={this.state.search}
                                   onChange={this.updateSearch.bind(this)} />
                        </div> }
                        <div className="scrollableContent">
                            {this.renderCompanyList()}
                        </div>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='2' >
                        {/* <div className="pull-right">
                         <input type="search" className="form-control" placeholder="Search" name="search"
                         value={this.state.search} onChange={this.updateSearch.bind(this)} />
                         </div> */}
                        <div className="scrollableContent">
                            {this.renderCompanyList()}
                        </div>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='3' >
                        {/* <div className="pull-right">
                         <input type="search" className="form-control" placeholder="Search" name="search"
                         value={this.state.search} onChange={this.updateSearch.bind(this)} />
                         </div> */}
                        <div className="scrollableContent">
                            {this.renderCompanyList()}
                        </div>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='0' >
                        {/* <div className="pull-right">
                         <input type="search" className="form-control" placeholder="Search" name="search" value={this.state.search} onChange=   					{this.updateSearch.bind(this)} />
                         </div> */}
                        <div className="scrollableContent">
                            {this.renderCompanyList()}
                        </div>
                    </TabPane>
                </TabContent>
                <Modal isOpen={this.state.large} toggle={this.toggleLarge.bind(this)} className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge.bind(this)}>Company Detail</ModalHeader>
                    <ModalBody>
                        <form action="" id="uform">
                            <div className="justify-content-center">
                                <div className="flex row">
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                                        <input type="text" value={this.state.compDetail.name} className="form-control" placeholder="Company Name" name="cName"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                                        <input type="text" className="form-control" value={this.state.compDetail.taxNo} placeholder="Company Tax Number" name="cTax"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                                        <input type="text" className="form-control" value={this.state.compDetail.taxAdministrative} placeholder="Company Tax Administrative" 					name="cTaxAdministrative"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-envelope"></i></span>
                                        <input type="email" className="form-control" value={this.state.compDetail.address1} placeholder="Company Address Line 1" name="cAddressOne"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-lock"></i></span>
                                        <input type="text" className="form-control" value={this.state.compDetail.address2} placeholder="Company Address Line 2" name="cAddressTwo"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-earphone"></i></span>
                                        <input type="text" className="form-control" value={this.state.compDetail.country} placeholder="Country" name="cCountry"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-iphone"></i></span>
                                        <input type="text" className="form-control" placeholder="State" value={this.state.compDetail.state} name="cState"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-iphone"></i></span>
                                        <input type="text" className="form-control" placeholder="City" value={this.state.compDetail.city} name="cCity"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                                        <input type="text" className="form-control" placeholder="Company Phone 1" value={this.state.compDetail.phone1} name="cPhoneOne"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                                        <input type="text" className="form-control" placeholder="Company Phone 2" value={this.state.compDetail.phone2} name="cPhoneTwo"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                                        <input type="text" className="form-control" placeholder="Company Fax" value={this.state.compDetail.fax} name="cFax"/>
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <a href="#" className="thumbnail" target="_blank">
                                            <img src={this.state.compDetail.signatureCircleForResponse} alt=""/>
                                        </a>&nbsp;
                                        <a href="#" className="thumbnail" target="_blank">
                                            <img src={this.state.compDetail.licenseOfAuthorizationForResponse} alt=""/>
                                        </a>&nbsp;
                                        <a href="#" className="thumbnail" target="_blank">
                                            <img src={this.state.compDetail.taxCertificateForResponse} alt=""/>
                                        </a>&nbsp;
                                    </div>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button className={ 'btn-sm' } color="primary" onClick={this.toggleLarge.bind(this)}>Accept</Button>{' '}
                        <Button className={ 'btn-sm' }  color="secondary" onClick={this.toggleLarge.bind(this)}>Reject</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default Company;

