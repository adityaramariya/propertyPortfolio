import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
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

const PENDING_USER_STATUS = 1;
const USER_REJECT_STATUS = 6;
class User extends React.Component {

    componentWillMount() {
        this.state = {          
            compDetail: {},
            activeTab: '1'
        };
        this.getUserApprovalRequestList(PENDING_USER_STATUS);  
    }

    getUserApprovalRequestList(param){
        var self = this;
        Request.post(apiBaseUrl + 'getUserApprovalRequestList/', {
            status: param
            }, config)
            .then(function (response) {
                console.log(response.data.userList);
                if (response.data.userList !== undefined){
                    self.setState({
                        userList: response.data.userList
                    });
                } else
                    self.setState({
                        userList: []
                    });
            })
            .catch(function(error){
                console.log("UserData --> getUserApprovalRequestList"+error);
            });  
    }

    tabToggle(tab) {
        this.getUserApprovalRequestList(tab);
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
  

    toggleLarge = (item) => {
        this.setState({
            large: !this.state.large,
            compDetail: item,
            modal: !this.state.modal
        });
    }
  
    approveUserApprovalRequest(item,action){
        var status = action==="approved" ? (item.status + 4) : USER_REJECT_STATUS; 
        var self = this;
        Request.post(apiBaseUrl + 'approveUserApprovalRequest/', {
            userId: item.userId,
            status: status
             }, config)
            .then(function (response) {
                if(response.data.statusCode === 200){
                    toastr.success('SUCCESS', item.name+' is '+action);
                    var array = self.state.userList;
                    var index = array.indexOf(item)
                    array.splice(index, 1);
                    self.setState({
                        userList: array
                    });
                }else{
                    toastr.error('Error', item.name+' is not'+action); 
                }
            })
            .catch(function(error){
                console.log("UserData -->"+action+""+error);                         
            });
    }

    updateSearch(e) {
        this.setState({
            [e.target.name]: e.target.value.substr(0, 5)
        });
    }
    
    renderUserList(){
        var self = this;       
            return(
                <table className="table table-bordered table-striped table-condensed">
						<thead>
                            <tr>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Company Name</th>
                                <th>Role</th>
                                <th>Identity No</th>
                                {(self.state.activeTab !== '5' && self.state.activeTab !== '0' ?
                                <th>Approval</th>:null)}
                            </tr>
                        </thead>                          
						<tbody>
                            {this.state.userList && this.state.userList.map(function (item,i) { return(
                            <tr>
                                <td><a onClick={() => self.toggleLarge(item)}>{item["firstName"]}</a> </td>              
                                <td>{item["email"]}</td>
                                <td>{item["company"]["name"]}</td>
                                <td>{item["mRoles"]["description"]}</td>
                                <td>{item["identityNo"]}</td>
                                {(self.state.activeTab !== '5' && self.state.activeTab !== '0' ?
                                <td><button className="btn btn-sm btn-primary" 
                                onClick={() => self.approveUserApprovalRequest(item,"approved")}>
                                    Accept
                                </button>&nbsp;
                                <button className="btn btn-sm btn-danger" 
                                onClick={() => self.approveUserApprovalRequest(item,"rejected")}>
                                    Reject
                                </button></td> : null)}
                            </tr> 
                            )})} 
                        </tbody>
					</table> 
            )
     }
    render() {
        return (
            
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.tabToggle('1'); }}>
                            New
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '5' })}
                            onClick={() => { this.tabToggle('5'); }}>
                            Active
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '0' })}
                            onClick={() => { this.tabToggle('0'); }}>
                            InActive
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='1' >
                        <div className="mb-1 clearfix">
                            <div className="pull-right">
                                <input type="search" className="form-control" placeholder="Search"
                                       name="search" value={this.state.search}
                                       onChange={this.updateSearch.bind(this)} />
                            </div>
                        </div>
                        <div className="scrollableContent">
                            {this.renderUserList()}
                        </div>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='5' >
                        <div className="mb-1 clearfix">
                            <div className="pull-right">
                                <input type="search" className="form-control" placeholder="Search"
                                       name="search" value={this.state.search}
                                       onChange={this.updateSearch.bind(this)} />                                            </div>
                        </div>
                        <div className="scrollableContent">
                            {this.renderUserList()}
                        </div>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='0' >
                        <div className="mb-1 clearfix">
                            <div className="pull-right">
                                <input type="search" className="form-control" placeholder="Search"
                                       name="search" value={this.state.search}
                                       onChange={this.updateSearch.bind(this)} />
                            </div>
                        </div>
                        <div className="scrollableContent">
                            {this.renderUserList()}
                        </div>
                    </TabPane>
                </TabContent>
                <Modal isOpen={this.state.large} toggle={this.toggleLarge.bind(this)} className={'modal-lg ' + this.props.className}>
                    <ModalHeader toggle={this.toggleLarge.bind(this)}>User Details</ModalHeader>
                    <ModalBody>
                        <form action="" id="uform">
                            <div className="justify-content-center">
                                <p className="text-muted" >Create your account</p>
                                <div className="flex row">
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                                        <input type="text" value={this.state.compDetail.firstName} className="form-control" placeholder="First Name" name="cName" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                                        <input type="text" className="form-control" value={this.state.compDetail.middleName} placeholder="Middle Name" name="cTax" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                                        <input type="text" className="form-control" value={this.state.compDetail.lastName} placeholder="Last Name" name="cTaxAdministrative" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-envelope"></i></span>
                                        <input type="email" className="form-control" value={this.state.compDetail.email} placeholder="Email" name="cAddressOne" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-lock"></i></span>
                                        <input type="text" className="form-control" value={this.state.compDetail.phone} placeholder="Phone Number" name="cAddressTwo" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-earphone"></i></span>
                                        <input type="text" className="form-control" value={this.state.compDetail.extension} placeholder="Extension" name="cCountry" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-iphone"></i></span>
                                        <input type="text" className="form-control" placeholder="Mobile" value={this.state.compDetail.mobile} name="cState" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-iphone"></i></span>
                                        <input type="text" className="form-control" placeholder="Identity Number" value={this.state.compDetail.identityNo} name="cCity" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                                        <input type="text" className="form-control" placeholder="Company Phone 1" value={this.state.compDetail.phone1} name="cPhoneOne" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                                        <input type="text" className="form-control" placeholder="Company Phone 2" value={this.state.compDetail.phone2} name="cPhoneTwo" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                                        <input type="text" className="form-control" placeholder="Company Fax" value={this.state.compDetail.fax} name="cFax" />
                                    </div>
                                    <div className="input-group mb-1 col-md-6">
                                        <a href="#" className="thumbnail" target="_blank">
                            
                                        </a>&nbsp;
                                        <a href="{this.state.compDetail.identityDocumentForResponse}" className="thumbnail" target="_blank">
                                            <img className="thumbnailImg" src={this.state.compDetail.identityDocumentForResponse} alt="" />
                                        </a>&nbsp;
                                        <a href="#" className="thumbnail" target="_blank">
                                            <img className="thumbnailImg" src={this.state.compDetail.signatureCircleForResponse} alt="" />
                                        </a>&nbsp;
                                        <a href="#" className="thumbnail" target="_blank">
                                            <img className="thumbnailImg" src={this.state.compDetail.signatureCircleForResponse} alt="" />
                                        </a>&nbsp;
                                    </div>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button className={'btn-sm'} color="primary" onClick={this.toggleLarge.bind(this)}>Accept</Button>{' '}
                        <Button className={'btn-sm'} color="secondary" onClick={this.toggleLarge.bind(this)}>Reject</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default User;
