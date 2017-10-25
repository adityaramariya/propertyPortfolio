import React   from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import axios from 'axios';
import classnames from 'classnames';


const apiBaseUrl = 'http://localhost:8793/api/v1/user/';
const config = {
           headers: { 
           "Content-Type": "application/json",
           "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };


class AdminData extends React.Component {
  
componentWillMount() {
  this.state = {
            search: '',
            modal: false,
            large: false,
            small: false,
            primary: false,
            success: false,
            warning: false,
            danger: false,
            info: false,
	    companyList : [],
	    compDetail : {},
            activeTab: '1'
                    };
		this.toggle = this.toggle.bind(this);
		this.tabToggle = this.tabToggle.bind(this);
		this.toggleLarge= this.toggleLarge.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
        	this.getCompanyApprovalRequestList();
		}



getCompanyApprovalRequestList()
{
var self = this;
    axios.post(apiBaseUrl+'getCompanyApprovalRequestList/',{status:1},config)
        .then(function (response) {
console.log(response.data.companyList);
if(response.data.companyList != undefined)
        self.setState({companyList:response.data.companyList}); 
  });
}

handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }

tabToggle(tab) {
 	var self = this;
        console.log('apibaseurl');
        axios.post(apiBaseUrl+'getCompanyApprovalRequestList/',{status:tab},config)
        .then(function (response) {
	if(response.data.companyList != undefined)
        self.setState({companyList:response.data.companyList}); 
	else
	self.setState({companyList:[]});
});


  if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }


    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
 


toggleLarge =(item) => {
this.setState({
large: !this.state.large,
compDetail : item
        
});
console.log(item);
}






acceptApproval =(item) => {
console.log(item);
 var self = this;
axios.post(apiBaseUrl+'approveCompanyApprovalRequest/',{companyId:item.companyId,status:(item.status+1)},config)
        .then(function (response) {
  var array = self.state.companyList;
  var index = array.indexOf(item)
  array.splice(index, 1);
 self.setState({companyList:array});
        
   });
}


rejectApproval =(item) => {
 var self = this;
console.log('reject -- '+item.companyId);
   axios.post(apiBaseUrl+'approveCompanyApprovalRequest/',{companyId:item.companyId,status:4},config)
        .then(function (response) {
console.log(response);
        var array = self.state.companyList;
  var index = array.indexOf(item)
  array.splice(index, 1);
 self.setState({companyList:array});
   });      
 }


updateSearch(e){
        this.setState({[e.target.name] : e.target.value.substr(0,5)});
    }

render(){
var self = this;    

var rows;
var headerComponents;
if(this.state.companyList.length != 0 )
{ 
 headerComponents = this.generateHeaders(); 
 rows = this.state.companyList.map(function(item) {
            var cells = self.props.cols.map(function(colData, index) {
                if(index == 0){

                    return <td><a onClick={()=>self.toggleLarge(item)}>{item[colData.key]}</a> </td>
                } else if(self.props.cols.length -1 == index){
                    return <td>
                        <button className="btn btn-sm btn-primary"  href="" onClick={()=>self.acceptApproval(item)}>
                            Accept
                        </button>&nbsp;
                        <button className="btn btn-sm btn-danger" href="" onClick={()=>self.rejectApproval(item)}>
                            Reject
                        </button>
                    </td>

                }
                return <td> {item[colData.key]} </td>;
            });
            return <tr key={item.id}> {cells} </tr>;
        })
}
else
{
  rows = <div>Data not available</div> ;
  headerComponents =<div></div>;
}

   
        return(
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header">
                        Contract Pending
                    </div>
                    <div className="card-block">
                        <div className="mb-1">
                            <div className="pull-left">
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
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.tabToggle('0'); }}
                >
                  InActive
                </NavLink>
              </NavItem>
            </Nav>        
 </div>
                          
 <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='1' >
  <div className="pull-right">
                                <input type="search" className="form-control" placeholder="Search" name="search" value={this.state.search} onChange=   					{this.updateSearch.bind(this)} />
  </div>
                  <table className="table table-bordered table-striped table-condensed">
                  <thead>{headerComponents}</thead>                          
	<tbody>
 			 {rows}

	</tbody>
       </table>
</TabPane>
</TabContent>
<TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='2' >
  <div className="pull-right">
                                <input type="search" className="form-control" placeholder="Search" name="search" value={this.state.search} onChange=   					{this.updateSearch.bind(this)} />
  </div>
                  <table className="table table-bordered table-striped table-condensed">
                  <thead>{headerComponents}</thead>                          
	<tbody>
 			 {rows}
	</tbody>
       </table>

</TabPane>
</TabContent>
<TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='3' >
  <div className="pull-right">
                                <input type="search" className="form-control" placeholder="Search" name="search" value={this.state.search} onChange=   					{this.updateSearch.bind(this)} />
  </div>
                  <table className="table table-bordered table-striped table-condensed">
                  <thead>{headerComponents}</thead>                          
	<tbody>
 			 {rows}
	</tbody>
       </table>

</TabPane>
</TabContent>
<TabContent activeTab={this.state.activeTab}>
              <TabPane tabId='4' >
  <div className="pull-right">
                                <input type="search" className="form-control" placeholder="Search" name="search" value={this.state.search} onChange=   					{this.updateSearch.bind(this)} />
  </div>
                  <table className="table table-bordered table-striped table-condensed">
                  <thead>{headerComponents}</thead>                          
	<tbody>
 			 {rows}
	</tbody>
       </table>

</TabPane>
</TabContent>
</div>  
                        
                        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className={'modal-lg ' + this.props.className}>
                         <ModalHeader toggle={this.toggleLarge}>Contract Pending</ModalHeader>
                         <ModalBody>
                         <form action="" id="uform">
                         <div className="justify-content-center">
                         <p className="text-muted" >Create your account</p>
                         <div className="flex row">
                         <div className="input-group mb-1 col-md-6">
			 <label>Company Name</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                         <input type="text" value ={this.state.compDetail.name} className="form-control" placeholder="Company Name" name="cName"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>Tax Number</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                         <input type="text" className="form-control" value ={this.state.compDetail.taxNo} placeholder="Company Tax Number" name="cTax"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>Tax Administrative</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                         <input type="text" className="form-control" value ={this.state.compDetail.taxAdministrative} placeholder="Company Tax Administrative" 				 name="cTaxAdministrative"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>Address Line 1</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-envelope"></i></span>
                         <input type="email" className="form-control" value ={this.state.compDetail.address1} placeholder="Company Address Line 1" name="cAddressOne"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>Address Line 2</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-lock"></i></span>
                         <input type="text" className="form-control" value ={this.state.compDetail.address2} placeholder="Company Address Line 2" name="cAddressTwo"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>Country</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-earphone"></i></span>
                         <input type="text" className="form-control" value ={this.state.compDetail.country} placeholder="Country" name="cCountry"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>State</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-iphone"></i></span>
                         <input type="text" className="form-control" placeholder="State" value ={this.state.compDetail.state} name="cState"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>City</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-iphone"></i></span>
                         <input type="text" className="form-control" placeholder="City" value ={this.state.compDetail.city} name="cCity"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>Phone 1</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                         <input type="text" className="form-control" placeholder="Company Phone 1" value ={this.state.compDetail.phone1} name="cPhoneOne"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>Phone 2</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                         <input type="text" className="form-control" placeholder="Company Phone 2" value ={this.state.compDetail.phone2} name="cPhoneTwo"/>
                         </div>
                         <div className="input-group mb-1 col-md-6"><label>Company Fax</label>
                         <span className="input-group-addon"><i className="glyphicons glyphicons-calendar"></i></span>
                         <input type="text" className="form-control" placeholder="Company Fax" value ={this.state.compDetail.fax} name="cFax"/>
                         </div>
                         <div className="input-group mb-1 col-md-6">
                         <a href="#" className="thumbnail" target="_blank">
                         <img src="https://dummyimage.com/40x40/000/fff" alt=""/>
                         </a>&nbsp;
                         <a href="#" className="thumbnail" target="_blank">
                         <img src="https://dummyimage.com/40x40/000/fff" alt=""/>
                         </a>&nbsp;
                         <a href="#" className="thumbnail" target="_blank">
                         <img src="https://dummyimage.com/40x40/000/fff" alt=""/>
                         </a>&nbsp;
                         </div>
                         </div>
                         </div>
                         </form>
                         </ModalBody>
                         <ModalFooter>
                         <Button className={ 'btn-sm' } color="primary" onClick={this.toggleLarge}>Accept</Button>{' '}
                         <Button className={ 'btn-sm' }  color="secondary" onClick={this.toggleLarge}>Reject</Button>
                         </ModalFooter>
                         </Modal>
                        <div className="pull-right">
                            <nav>
                                <ul className="pagination">
                                    <li className="page-item"><a className="page-link" href="#">Prev</a></li>
                                    <li className="page-item active">
                                        <a className="page-link" href="#">1</a>
                                    </li>
                                    <li className="page-item"><a className="page-link" href="#page-1">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" href="#">4</a></li>
                                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
    generateHeaders() {
        var cols = this.props.cols;
        return cols.map(function(colData) {
            return <th key={colData.key}> {colData.label} </th>;
        });
    }
  


}
export default AdminData;
