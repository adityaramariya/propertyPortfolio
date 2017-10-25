import React from 'react';
import { Button,Modal, ModalHeader, ModalBody, ModalFooter,TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import Select from 'react-select';
import FileInput from 'react-file-input';
import axios from 'axios';
import DateField from "react-bootstrap-datetimepicker";
import { toastr } from 'react-redux-toastr'
import { FormWithConstraints, FieldFeedbacks, FieldFeedback , Bootstrap4} from 'react-form-with-constraints';
const { FormGroup, FormControlInput } = Bootstrap4;
var companyData = new FormData();
var userData = new FormData();
const apiBaseUrl = "http://localhost:8793/api/v1/user/";
const config = {
           headers: { 
           "Content-Type": "application/json"
           //"AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };
const image1='';
var image2='';
const image3='';

class Register extends FormWithConstraints {



	
	componentWillMount() {
		this.state = {
		   //	modal: false,
		   //	large: false,
		   activeTab: '1',
		   mak : '',
		   isAdmin: false,
		   TermsAndCondition: false,
		   country: [{
		      cid: 1,
		      label: 'Turkey'
		   }, {
		      cid: 2,
		      label: 'Japan'
		   }, {
		      cid: 3,
		      label: 'India'
		   }],
		   state: [{
		         sid: 1,
		         cid: 1,
		         label: 'Turkey1'
		      }, {
		         sid: 2,
		         cid: 1,
		         label: 'Turkey2'
		      },
		      {
		         sid: 3,
		         cid: 2,
		         label: 'Turkey1'
		      }, {
		         sid: 4,
		         cid: 2,
		         label: 'Turkey2'
		      }
		   ],
		   city: [{
		         ctId: 1,
		         sid: 1,
		         cid: 1,
		         label: 'Indore'
		      }, {
		         ctId: 2,
		         sid: 2,
		         cid: 1,
		         label: 'Dewas'
		      },
		      {
		         ctId: 3,
		         sid: 3,
		         cid: 2,
		         label: 'Dhar'
		      }, {
		         ctId: 4,
		         sid: 4,
		         cid: 2,
		         label: 'Rajgarh'
		      }
		   ],
		   arr: [{
		      companyId: 1,
		      jobVal: 'ucode1'
		   }, {
		      companyId: 2,
		      jobVal: 'ucode2'
		   }],
		   TraderBrokerBox: true,
		   regAsCompDet: [{
		         label: 'Trader Company',
		         name: 'Trader Company'
		      },
		      {
		         label: 'Broker Company',
		         name: 'Broker Company'
		      }
		   ],
		   regAsComp: '',
		   companies: [{
		         label: 'Trader Company',
		         name: 'Trader Company',
		         jobs: []
		      },
		      {
		         label: 'Broker Company',
		         name: 'Broker Company',
		         jobs: []
		      },
		      {
		         label: 'Individual',
		         name: 'Individual',
		         jobs: []
		      }
		   ],
		   selectedCompany: 'Trader Company',
		   userJson: {},
		   companyJson: {},
		};
		this.getCountryList();
	}

	uploadFile(keyName, stateName,fileRequest,event) {
		if (stateName === 'companyData'){
     console.log('service man');
		   companyData.append(''+fileRequest+'.'+keyName+'', event.target.files[0]);}
		else{
	               console.log('inside');
      	   userData.append(''+fileRequest+'.'+keyName+'', event.target.files[0]);
	}}



	linkValue(keyName, stateName, e) {
		super.handleChange(e);
		var newState = this.state[stateName]
		newState[keyName] = e.target.value;
		this.setState({
		   [stateName]: newState
		})
	};


	
	// accept and terms condition  
	toggleLarge = () => {
		this.setState({
		   large: !this.state.large,
		});
	}

	// country list in company module 
	getCountryList() {
		this.setState({
		   country: this.state.country
		});
	}

	// save country  in company module 
	saveAsCountry(countryValue) {
		if (countryValue === null) {
		   this.setState({
		      stateValue: '',
		      cityValue: ''
		   });
		   companyData.append("country", null);
		   companyData.append("state", null);
		   companyData.append("city", null);
		} else {
		   this.setState({
		      countryValue
		   });
		   companyData.append("country", countryValue.cid);
		   this.setState({
		      state: this.state.state
		   });
		}
	}

	// save state  in company module 
	saveAsState(stateValue) {
		if (stateValue === null) {
		   this.setState({
		      cityValue: ''
		   });
		   companyData.append("state", null);
		   companyData.append("city", null);
		} else {
		   this.setState({
		      stateValue
		   });
		   companyData.append("state", stateValue.sid);
		   this.setState({
		      state: this.state.city
		   });
		}
	}
	// save city  in company module 
	saveAsCity(cityValue) {
		if (cityValue === null) {
		   companyData.append("city", cityValue);
		} else {
		   companyData.append("city", cityValue.ctId);
		   this.setState({
		      cityValue
		   });
		}
	}


	// save  company  in company module 	
	saveRegAsComp(regAsComp) {
		console.log(regAsComp);
		this.setState({
		   regAsComp
		});
	}


	// company form submission 
	onSubmitOfCompanyForm(e) {
		if (!this.state.regAsComp.name) {
		   toastr.error('Error', 'Please Select Company ');
		   return false;
   	 }else if (!this.state.companyJson["address1"]) {
      	toastr.error('Error', 'Please Enter Address');
     		return false;
		 }else if (this.state.companyJson["phone1"] ==		(null && undefined)) {
		   toastr.error('Error', 'Please Enter Phone no.');
		   return false;
		 }
			else if (this.state.companyJson["taxNo"] ==		(null && undefined)) {
		   toastr.error('Error', 'Please Enter Tax No.');
		   return false;
		 }else if (this.state.companyJson["email"] ==		(null && undefined)) {
		   toastr.error('Error', 'Please Enter Email');
		   return false;
		 }		
		 else{
		      this.checkUniqueTaxNo(this.state.companyJson["taxNo"]);
		 }
  	}
	

	
	// check unique in submit company	
	checkUniqueTaxNo(taxNo) {
		var self = this;
		var data1 = new FormData();
		data1.append("taxNo", taxNo);
		axios.post(apiBaseUrl + 'isTaxNumberExist/', data1, config)
		   .then(function(response) {
			     if (response.data === false){
				     self.checkEmailForCompany(self.state.companyJson["email"],'company');
				  }
		      else {
		         toastr.error('Error', 'Tax no. already Exist');
		      }
		   })
	}

// check email in submit company	and user
	checkEmailForCompany(email,mode) {
		var self = this; 
		axios.put(apiBaseUrl + 'isCompanyEmailExist/',email 
		      , config)
		   .then(function(response) {
		      console.log(response.data)
		      if (response.data === false){
				  if(mode === 'company')  
			       self.submitCompany();
                }
		      else {
		         toastr.error('Error', 'Email Id already Exist');
		      }
		   });
	}
	
	checkEmailForUser(email,mode) {
		
		var self = this;
		
		axios.post(apiBaseUrl + 'isUserEmailExist/', 
		    email
		   , config)
		   .then(function(response) {
		      console.log(response.data)
		      if (response.data === false){
				  
				  if(mode === 'user')  
			       self.submitUser();
               }
		      else {
		         toastr.error('Error', 'Email Id already Exist');
		      }
		   });
	}

	clearCompanyFormData(){
     
		document.getElementById("taxCertificate").children[0].children[1].value = "";
		document.getElementById("licenceOfAuthComp").children[0].children[1].value = "";
		document.getElementById("signatureCircleComp").children[0].children[1].value = "";
 		companyData =  new FormData();
    }

	// Company Module		
	submitCompany() {
		var compData = companyData;
      this.clearCompanyFormData()
		var self = this;
				for (var key in this.state.companyJson) {
		   compData.append(key, this.state.companyJson[key])
		}

  		compData.append("companyType", this.state.regAsComp.name);
		compData.append("termsAndCondition", this.state.TermsAndCondition);
	
		if(this.state.TermsAndCondition==true){
			
		axios.post(apiBaseUrl + 'createCompany/', compData, config)
		   .then(function(response) {
			
		      if (response.status === 200) {
		         console.log("createCompany successfull");
		         toastr.success('Success', 'Company created successfully , Please check your mail');
				 self.context.router.push('/');	
		         event.preventDefault();
		      } else if (response.status === 204) {
		         console.log("Company is not registered");
		        toastr.error('Error', 'Company is not registered 123');
		      } else {
		         console.log("Company is not registered");
		         toastr.error('Error', 'Company is not registered 456');
		      }
		   })
		   .catch(function(error) {
		      console.log(error);
			   toastr.error('Error', 'Company is not registered 5555'+error);
		   });
		}
		else{
			toastr.error('Error', 'Please Accept Terms and condition');
		}
		
	}


	// are you a admin check in user module
	toggleCheckboxChange(stateName, e) {
			if (stateName === 'isAdmin') {
		   this.setState({
		      isAdmin: e.target.checked
		   });
		   if (!this.state.shouldHide) {
		      this.setState({
		         shouldHide: true
		      })
		   } else {
		      this.setState({
		         shouldHide: false
		      })
		   }
		} else
		   this.setState({
		      [stateName]: e.target.checked
		   });
	}
	

	// birth date select in user module  
	handleChange = (newDate) => {
			console.log("newDate", newDate);
			return userData.append("dateOfBirth", newDate);
			//   return this.setState({
			// 	date: newDate
			// });
		}


	// company change in user module
	handleChangeCompany(selectedCompany) {
		this.setState({
		   selectedCompany,
		   compId: null
		});
		if (selectedCompany.name !== 'Individual') {
		   var self = this;
		   var index = self.state.companies.map(function(d) {
		      return d['name'];
		   }).indexOf(selectedCompany.name);
		   var data1 = new FormData();
		   data1.append("companyTypeId", selectedCompany.name);
		   axios.post(apiBaseUrl + 'getCompanyListByCompanyType/', data1, config)
		      .then(function(response) {
		         self.state.companies[index].jobs = response.data;
		         self.setState({
		            companies: self.state.companies
		         });
		      })
		      .catch(function(error) {
		         console.log(error);
		      });
		}
		if (selectedCompany.name === "Trader Company" || selectedCompany.name === "Broker Company") {
		   this.setState({
		      TraderBrokerBox: true
		   });
		} else
		   this.setState({
		      TraderBrokerBox: false
		   });
	}

	// save sub company  in user module 
	saveSubComp(compId) {
		console.log(compId);
		this.setState({
		   compId
		});
	}
	


	//Submission of User Form	
	onSubmitOfUserForm(e) {
		if(this.state.selectedCompany.name!='Individual'){
			
		if (!this.state.selectedCompany) {
			toastr.error('Error', 'Please Select Company Type');
			return false;
		 }
		  if (!this.state.compId) {
			toastr.error('Error', 'Please Select Company');
			return false;
		 }
			 }
			
  		 if (!this.state.userJson["firstName"]) {
		   toastr.error('Error', 'Please Enter FirstName');
		   return false;
   		 }else if (!this.state.userJson["email"]) {
      	toastr.error('Error', 'Please Enter Email');
     		return false;
		 }
		 else if (!this.state.userJson["identityNo"]) {
			toastr.error('Error', 'Please Enter Identity No');
			   return false;
		   }
		 else if (!this.state.userJson["phone"]) {
		   toastr.error('Error', 'Please Enter Phone no.');
		   return false;
		 } else if (!this.state.userJson["mobile"]) {
			toastr.error('Error', 'Please Enter Mobile No.');
			return false;
		  } 
		  if(this.state.selectedCompany.name!='Individual'){
		   if (!this.getCheckCompanyCode()){
		   toastr.error('Error', 'Company Code and User Code is different');
		   return false;
		 } 
		}
		      this.checkEmailForUser(this.state.userJson["email"],'user');
		 
	}


	// check company code in user module	     
	getCheckCompanyCode() {
		
		var flag = true;
		console.log("comp");
		console.log(this.state.compId);
		if (this.state.selectedCompany.name === "Trader Company" || this.state.selectedCompany.name === "Broker Company") {
			
		if (this.state.compId.compCode =this.state.userJson["companyCode"]){
			flag = true;
			
		}
		   else flag = false;
		}
		return flag;
	}

   clearUserFormData(){
      document.getElementById("signatureCircleUser").children[0].children[1].value = "";
		document.getElementById("identityDocument").children[0].children[1].value = "";
		if(document.getElementById("licOfAuth")!==null)
		document.getElementById("licOfAuth").children[0].children[1].value = "";
		userData =  new FormData();
    }

	submitUser() {
		var self=this;
		var usersData = userData ;
		this.clearUserFormData();
		
 
		for(var key in this.state.userJson) {
					usersData.append(key, this.state.userJson[key]);
				  	}
				usersData.append("companyType",this.state.selectedCompany.name);	
				usersData.append("isAdmin", this.state.isAdmin);
				usersData.append("termsAndCondition", this.state.TermsAndCondition);
				
				if (this.state.compId!== null && this.state.compId!== undefined )
					usersData.append("companyId", this.state.compId.companyId);
				else{
					usersData.append("companyId", "");
					}
				if(this.state.TermsAndCondition==true){
               axios.post(apiBaseUrl + 'createUser/', usersData, config)
						.then(function(response) {
								toastr.success('Success', 'User Registered successfully, Please check your mail');	
						if (response.status === 200) {
						   
					//	   self.context.router.push('/');
						   
						} 
					})
					.catch(function(error) {
						
						console.log("catch error in below line");
						console.log(error);
						
					});
				}
				else{
					toastr.error('Error', 'Please Accept Terms and condition');
				}
		  }







	toggle(tab) {
		if (this.state.activeTab !== tab) {
		   this.setState({
		      activeTab: tab
		   });
	 }	}

	// Ucode in user module
	getUcode() {
	    return <div className="input-group mb-1 col-md-6" >
		<span className="input-group-addon" > < i className="glyphicons glyphicons-user"> </i></span >
		<input type="text"  className="form-control" placeholder="Code" name="uCode" value={this.state.uCode} id="uName"
	    onChange={this.linkValue.bind(this,'companyCode','userJson')}
	    /> <
	    /div>
	}

	// getCompanyList in user module
	getCompanyList() {
	    let company= this.state.companies.filter(company => {
		return company.name === this.state.selectedCompany.name;
	    });
	    var jobs = [];
	    if (company !== undefined && company.length !== 0)
		jobs = company[0].jobs.map(function(data) {
			 console.log(data);
		    data.label = data.name;
		    return data;
		});

		console.log(jobs);
	    return this.state.TraderBrokerBox ? < div className="mb-1 col-sm-6" >
		<Select name="subComp"   value={this.state.compId} 
	    options={jobs}
	    onChange={this.saveSubComp.bind(this)}
	    id="subComp" /></div>: null;
	}

	// showing licOfAuthFile in user module
	getlicOfAuthFile() {
	    return <div className="mb-1 col-md-6" id="licOfAuth"><
		FileInput name="licOfAuth"
	    accept=".jpg,.png,.pdf"
	    placeholder="License of Authorization"
	    className="form-control uploadBtn"
	    onChange={
		this.uploadFile.bind(this, 'letterOfAuth','userData','fileRequest')}
	    />
	     < /div>
	}

	// adminCheck in user module
	getAdminCheck() {
	    return <div className="col-sm-12"><div className="checkbox"><label><
		 input type="checkbox"
	    id="isAdmin"
	    name="isAdmin"
	    value="{this.state.isAdmin}"
	    onChange={this.toggleCheckboxChange.bind(this,'isAdmin')}
	    /> <span className="check" > < /span>
	    Are you an Admin
		</label> </div> </div>
	}

 render() {
	var content; var showLicOfAuth;  var showAdmin;    
   if(this.state.selectedCompany.name==="Trader Company" || this.state.selectedCompany.name==="Broker Company"){
      content=this.getUcode();  showAdmin = this.getAdminCheck();  }              
    else
    content=null;
   
  const TraderBrokerContent = this.getCompanyList();

  if(this.state.shouldHide === true)
 		 showLicOfAuth = this.getlicOfAuthFile(); 
  
  return (
          <div className="container">
            <div className="animated fadeIn">
              <div className="row justify-content-center">
                <div className="col-md-7  mb-1">
                <div className="card">
                    <div className="centeredLogo card-header"><img src="img/logo.png" alt=""/></div>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1') }}
                            >
                                Register As Company
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2') }}
                            >
                                Register As User
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <form action="">
                                <div className="justify-content-center">
                                   
                                    <div className="flex row">
                                        <div className="mb-1 col-sm-6">
										<Select className="" name="subComp"
		                                    value={this.state.regAsComp}
		                                    options={this.state.regAsCompDet}
		                                    onChange={ this.saveRegAsComp.bind(this)}
		                                    id="subComp"
                                     		    />					
                                          </div>
                                        <div className="col-sm-6">
                                            <FormGroup for="cName">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                   <i className="glyphicons glyphicons-equalizer"></i>
                                                </span>
                                                <FormControlInput
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Company Name"
                                                    name="cName"
                                                    onChange={this.linkValue.bind(this, 'name','companyJson')}
                                                    required
                                                />
                                                </div>
                                                <FieldFeedbacks for="cName">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup for="cAddressOne">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                   <i className="glyphicons glyphicons-credit-card"></i>
                                                </span>
                                                    <FormControlInput
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Company Address 1"
                                                        name="cAddressOne"
                                                        onChange={this.linkValue.bind(this, 'address1','companyJson')}
                                                        required
                                                    />
                                                </div>
                                                <FieldFeedbacks for="cAddressOne">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>
                                        <div className="input-group mb-1 col-sm-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-credit-card"></i></span>
                                            <input type="text" className="form-control" placeholder="Company Address 2" onChange={this.linkValue.bind(this, 'address2','companyJson')} />
                                        </div>
                                        <div className="input-group mb-1 col-sm-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-list-alt"></i></span>
                                            <input type="text" className="form-control" placeholder="Company Tax Number" name="cTaxNumber" value={this.state.cTaxNumber} onChange={this.linkValue.bind(this, 'taxNo','companyJson')}/>
                                        </div>
                                        <div className="input-group mb-1 col-sm-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-lock"></i></span>
                                            <input type="text" className="form-control" placeholder="Company Tax Administrative" name="cTaxAdmin" value={this.state.cTaxAdmin} id="cTaxAdmin" onChange={this.linkValue.bind(this, 'taxAdministrative','companyJson')}/>
                                        </div>
                                        <div className="input-group mb-1 col-sm-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-fax"></i></span>
                                            <input type="text" className="form-control" placeholder="Company Fax Number" name="cFax" value={this.state.cFax} id="cFax" 							onChange={this.linkValue.bind(this, 'fax','companyJson')}/>
                                        </div>

                                        <div className="col-sm-6">
                                            <FormGroup for="cCountry">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                  <i className="glyphicons glyphicons-map-marker"></i>
                                                </span>
                                                    <Select className="form-control" name="subComp"
		                                    value={this.state.countryValue}
		                                    options={this.state.country}
		                                    onChange={ this.saveAsCountry.bind(this)}
		                                    id="subComp"
                                     		    />
                                                </div>
                                                <FieldFeedbacks for="cCountry">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>

                                        <div className="col-sm-6">
                                            <FormGroup for="cState">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="glyphicons glyphicons-map-marker"></i>
                                                    </span>
                                                   <Select className="form-control" name="subComp"
		                                    value={this.state.stateValue}
		                                    options={this.state.state}
		                                    onChange={ this.saveAsState.bind(this)}
		                                    id="subComp"
                                     		    />
                                                </div>
                                                <FieldFeedbacks for="cState">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>

                                         <div className="col-sm-6">
                                            <FormGroup for="cCity">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="glyphicons glyphicons-map-marker"></i>
                                                    </span>
                                               	<Select className="form-control" name="subComp"
		                                    value={this.state.cityValue}
		                                    options={this.state.city}
		                                    onChange={ this.saveAsCity.bind(this)}
		                                    id="subComp"
                                     		    />
                                                </div>
                                                <FieldFeedbacks for="cCity">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>



                                        <div className="col-sm-6">
                                            <FormGroup for="cZip">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                   <i className="glyphicons glyphicons-list-alt"></i>
                                                </span>
                                                    <FormControlInput
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Zip Code"
                                                        name="cZip"
                                                        onChange={this.linkValue.bind(this, 'zipCode','companyJson')}
                                                        required
                                                    />
                                                </div>
                                                <FieldFeedbacks for="cZip">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>

                                        <div className="col-sm-6">
                                            <FormGroup for="cPhoneOne">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                   <i className="glyphicons glyphicons-list-alt"></i>
                                                </span>
                                                    <FormControlInput
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Phone Number 1"
                                                        name="cPhoneOne"
                                                        onChange={this.linkValue.bind(this, 'phone1','companyJson')}
                                                        required
                                                    />
                                                </div>
                                                <FieldFeedbacks for="cPhoneOne">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>


                                        <div className="input-group mb-1 col-sm-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-earphone"></i></span>
                                            <input type="text" className="form-control" placeholder="Phone Number 2" name="cPhoneTwo" value={this.state.cPhoneTwo} 	onChange={this.linkValue.bind(this, 'phone2','companyJson')}/>
                                        </div>

                                        <div className="col-sm-6">
                                            <FormGroup for="cEmail">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="glyphicons glyphicons-envelope"></i>
                                                </span>
                                                    <FormControlInput
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Company Email"
                                                        name="cEmail"
                                                         onChange={this.linkValue.bind(this, 'email','companyJson')}
                                                        required
                                                    />
                                                </div>
                                                <FieldFeedbacks for="cEmail">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>

                                        <div className="mb-1 col-md-6" id="signatureCircleComp">
                                            {/*<input type="file" id="signatureCircle" name="signatureCircle"/>*/}
                                            <FileInput name="signatureCircleComp"
                                                       accept=".jpg,.png"
                                                       placeholder="Signature Circle"
                                                       className="form-control uploadBtn"
                                                       onChange={this.uploadFile.bind(this,'signCircleComp','companyData','fileRequest')} />
                                        </div>
                                        <div className="mb-1 col-md-6" id="licenceOfAuthComp">
                                            {/*<input type="file" id="licenceOfAuth" name="licenceOfAuth"/>*/}
                                            <FileInput name="licenceOfAuthComp"
                                                       accept=".jpg,.png"
                                                       placeholder="Licence Of Authorization"
                                                       className="form-control uploadBtn"
                                                       onChange={this.uploadFile.bind(this, 'license','companyData','fileRequest')} />
                                        </div>
                                        <div className="mb-1 col-md-6" id="taxCertificate">
                                            {/*<input type="file" id="taxCertificate" name="taxCertificate"/>*/}
                                            <FileInput name="taxCertificate"
                                                       accept=".jpg,.png"
                                                       placeholder="Tax Certificate"
                                                       className="form-control uploadBtn"
                                                       onChange={this.uploadFile.bind(this, 'tax','companyData','fileRequest')} />
									               </div>
                                    <div className="col-sm-12">
                                           <div className="row">
                                               <div className="col-sm-6">
                                                   <div className="checkbox"><label>
                                                    <input
                                                    type="checkbox"
                                                    id="TermsAndCondition"
                                                    name="TermsAndCondition"
                                                    value="TermsAndCondition" onClick={this.toggleCheckboxChange.bind(this,'TermsAndCondition')}/> <span 																		className="check"></span>
                                                       Accept terms and conditions
                                                   </label>
                                                   </div>
                                               </div>
                                               <div className="col-sm-6 text-right">
                                                   <a onClick={this.toggleLarge.bind(this)} className="btn-link">Terms and Condition</a>
                                               </div>
                                           </div>
                                        </div>                                        
                                    </div>
                                    <div className="text-center">
                                        <button type="button" className="btn btn-primary" onClick={this.onSubmitOfCompanyForm.bind(this)}>Create Company Account</button>
                                    </div>
                                </div>
                            </form>
                        </TabPane>
						
						
						{/*================================= User from started from here=================================================*/}
                        <TabPane tabId="2">
                            <form action="" id="uform">
                                <div className="justify-content-center">
                                 
                                    <div className="flex row">
                                      
                           <div className="mb-1 col-sm-6"> 
	                    		<Select className="" name="comp"
		                                    value={this.state.selectedCompany}
		                                    options={this.state.companies}
						                onChange={this.handleChangeCompany.bind(this)}
		                                    id="omp"
                                     		    />

					</div>
                         						   {TraderBrokerContent}
									{content}
				         <div className="col-sm-6">
                                            <FormGroup for="firstName">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="glyphicons glyphicons-user"></i>
                                                </span>
                                                    <FormControlInput
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="First Name"
                                                        name="firstName"
                                                        onChange={this.linkValue.bind(this, 'firstName','userJson')}
                                                        required
                                                    />
                                                </div>
                                                <FieldFeedbacks for="firstName">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>
                                        <div className="input-group mb-1 col-md-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                                            <input type="text" className="form-control" placeholder="Middle Name" name="uMiddleName" value={this.state.uMiddleName}
                                        id="uMiddleName" onChange={this.linkValue.bind(this, 'middleName','userJson')}/>
					</div>
                                        <div className="input-group mb-1 col-md-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-user"></i></span>
                                            <input type="text" className="form-control" placeholder="Last Name" name="uLastName" value={this.state.uLastName}
						id="uLastName" onChange={this.linkValue.bind(this, 'lastName','userJson')}/>
                                        </div>

                                        <div className="col-sm-6">
                                            <FormGroup for="uEmail">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="glyphicons glyphicons-envelope"></i>
                                                </span>
                                                    <FormControlInput
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Email Address"
                                                        name="uEmail"
                                                        onChange={this.linkValue.bind(this, 'email','userJson')}
                                                        required
                                                    />
                                                </div>
                                                <FieldFeedbacks for="uEmail">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>
                                        <div className="input-group mb-1 col-md-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-lock"></i></span>
                                            <input type="text" className="form-control" placeholder="Identity Number" name="uIdentityNumber" 						value={this.state.uIdentityNumber} id="uIdentityNumber" onChange={this.linkValue.bind(this, 'identityNo','userJson')}/>
                                        </div>
                                        <div className="col-sm-6">
                                            <FormGroup for="uPhoneOne">
                                                <div className="input-group">
                                                <span className="input-group-addon">
                                                   <i className="glyphicons glyphicons-list-alt"></i>
                                                </span>
                                                    <FormControlInput
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Phone Number"
                                                        name="uPhoneOne"
                                                        onChange={this.linkValue.bind(this, 'phone','userJson')}
                                                        required
                                                    />
                                                </div>
                                                <FieldFeedbacks for="uPhoneOne">
                                                    <FieldFeedback when="*" />
                                                </FieldFeedbacks>
                                            </FormGroup>
                                        </div>
										 <div className="input-group mb-1 col-md-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-iphone"></i></span>
                                            <input type="text" className="form-control" placeholder="Extension" id="uExtension" name="uExtension" 					value={this.state.uExtension} onChange={this.linkValue.bind(this, 'extension','userJson')}/>
                                        </div>
										
                                        <div className="input-group mb-1 col-md-6">
                                            <span className="input-group-addon"><i className="glyphicons glyphicons-iphone"></i></span>
                                            <input type="text" className="form-control" placeholder="Mobile Number" id="uMobile"                             							name="uMobile"	value={this.state.uPhone} onChange={this.linkValue.bind(this, 'mobile','userJson')}/>
                			</div>
                                       
                                        {/*<div className="input-group mb-1 col-md-6">
                                         <span className="input-group-addon"><i className="fa fa-fax"></i></span>
                                         <input type="text" className="form-control" placeholder="Fax Number" name="uFax"/>
                                         </div>*/}
                                       
				<div className="input-group mb-1 col-md-6">
                                   <DateField  mode="date" defaultText="Please select a birth date"  name="uBirth"/>
                                  </div>
                                        <div className="mb-1 col-md-6" id="identityDocument">
                                            <FileInput 
																name="identityDocument"
																accept=".jpg,.png"
																placeholder="Identity Document"
																className="form-control uploadBtn"
																onChange={this.uploadFile.bind(this, 'idDoc','userData','fileRequest')} />
                                        </div>
 														
														<div className="mb-1 col-md-6" id="signatureCircleUser">
                                            <FileInput name="signatureCircleUser"
															 accept=".jpg,.png"
                                              placeholder="Signature Circle"
															 className="form-control uploadBtn"
                                              onChange={this.uploadFile.bind(this, 'signCircleUser','userData','fileRequest')} 
															/>
                                       </div>
						

                                         	{showLicOfAuth}
					 									{showAdmin}
                         
                             <div className="col-sm-12">
                                           <div className="row">
                                               <div className="col-sm-6">
                                                   <div className="checkbox"><label>
                                                    <input
                                                    type="checkbox"
                                                    value="TermsAndCondition" onClick={this.toggleCheckboxChange.bind(this,'TermsAndCondition')}/> <span className="check"></span>
                                                       Accept terms and conditions
                                                   </label>
                                                   </div>
                                               </div>
                                               <div className="col-sm-6 text-right">
                                                   <a onClick={this.toggleLarge.bind(this)} className="btn-link">Terms and Condition</a>
                                               </div>
                                           </div>
                                        </div>


                                 	</div>
                                    <div className="text-center">
                                        <button type="button" className="btn btn-primary" onClick={this.onSubmitOfUserForm.bind(this)}>Create User Account</button>
                                    </div>


                                </div>
                            </form>
                        </TabPane>
                    </TabContent>
                </div>

                </div>
              </div>
            </div>
	 
 		 <Modal isOpen={this.state.large} toggle={this.toggleLarge} className={'modal-lg ' + this.props.className}>
                         <ModalHeader toggle={this.toggleLarge.bind(this)}>Terms and Condition</ModalHeader>
                         <ModalBody>
                         <form action="" id="uform">
                        
                         <p className="text-muted" >Create your account</p>
                  	
                         </form>
                         </ModalBody>
                         <ModalFooter>
                         <Button className={ 'btn-sm' } color="primary" onClick={this.toggleLarge.bind(this)}>Accept</Button>{' '}
                         <Button className={ 'btn-sm' }  color="secondary" onClick={this.toggleLarge.bind(this)}>Reject</Button>
                         </ModalFooter>
                         </Modal>

          </div>
        );
    }
}
Register.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Register;
