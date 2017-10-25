import React from 'react';
import FileInput from 'react-file-input';
import Request from 'axios';
import DateField from "react-bootstrap-datetimepicker";
import { toastr } from 'react-redux-toastr'
import { FormWithConstraints, FieldFeedbacks, FieldFeedback , Bootstrap4} from 'react-form-with-constraints';
const { FormGroup, FormControlInput } = Bootstrap4;
var userData = new FormData();
const apiBaseUrl = "api/v1/public/registration/";
const config = {
           headers: { 
           "Content-Type": "application/json"
           //"AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };
class RegisterUser extends FormWithConstraints {
	componentWillMount() {
		this.state = {		  
		   isAdmin: false,
		   TermsAndCondition: false,		  
		   arr: [{
		      companyId: 1,
		      jobVal: 'ucode1'
		   }, {
		      companyId: 2,
		      jobVal: 'ucode2'
		   }],
		   TraderBrokerBox: true,		   
		   regAsComp: '',
		   companyType: [{
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
		   userJson: {}		   
		};
	}

	uploadFile(keyName, stateName,fileRequest,event) {
		userData.append(''+fileRequest+'.'+keyName+'', event.target.files[0]);
	}

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
	
	checkEmailForUser(email,mode){		
		var self = this;
		var data1 = new FormData();
		data1.append("email", email);
		Request.post(apiBaseUrl + 'isUserEmailExist/',data1, config)
			.then(function(response) {				
				if (response.data === false){					
					if(mode === 'user')  
					self.submitUser();
				}
				else {
					toastr.error('Error', 'Email Id already Exist');
				}
			})
			.catch(function(error) {
				console.log("registerUser -->checkEmailForUser "+error);
			});
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
	}

	// company change in user module
	handleChangeCompany(e) {
		console.log(e.target.value);
		this.setState({	
		   compType : e.target.value,		
		   compId: null
		});
		if (e.target.value !== 'Individual') {
			var self = this;	
			var data1 = new FormData();
			data1.append("companyTypeId", e.target.value);
			Request.post(apiBaseUrl + 'getCompanyListByCompanyType/', data1, config)
				.then(function(response) {			
					console.log(response.data);		
					self.setState({
						companies: response.data
					});
				})
				.catch(function(error) {
					console.log("registerUser -->handleChangeCompany "+error);
				});
		}
		if (e.target.value === "Trader Company" || e.target.value === "Broker Company") {
			this.setState({
				TraderBrokerBox: true
			});
		} else
		   this.setState({
		      TraderBrokerBox: false
		   });
	}

	// save sub company  in user module 
	saveSubComp(e) {
		console.log(e.target.value);
		var hello = e.target.value;
		console.log(hello);
		this.setState({
		   compId  : e.target.value
		});
	}

		// check company code in user module	     
	getCheckCompanyCode() {		
		var flag = true;var self = this;		
		console.log(this.state.compId);
		if (this.state.compType === "Trader Company" || this.state.compType === "Broker Company"){			
			var company =	self.state.companies.filter(function(d){
						return d.companyId === parseInt(self.state.compId,10);
									})
									console.log(company);
									console.log(company[0].companyCode);
			if (company[0].companyCode === this.state.userJson["companyCode"]){
				flag = true;	
			}else flag = false;
			}
		return flag;
	}

	//Submission of User Form	
	onSubmitOfUserForm(e) {
		if(this.state.compType!=='Individual'){			
			if (!this.state.compType) {
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
		}else if (!this.state.userJson["identityNo"]) {
			toastr.error('Error', 'Please Enter Identity No');
			return false;
		}else if (!this.state.userJson["phone"]) {
			toastr.error('Error', 'Please Enter Phone no.');
			return false;
		}else if (!this.state.userJson["mobile"]) {
			toastr.error('Error', 'Please Enter Mobile No.');
			return false;
		} 
		if(this.state.selectedCompany.name!=='Individual'){
			if (!this.getCheckCompanyCode()){
				toastr.error('Error', 'Company Code and User Code is different');
				return false;
			} 
		}
		this.checkEmailForUser(this.state.userJson["email"],'user');		 
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
		usersData.append("companyType",this.state.compType);	
		usersData.append("isAdmin", this.state.isAdmin);
		usersData.append("termsAndCondition", this.state.TermsAndCondition);				
		if (this.state.compId)
			usersData.append("companyId", this.state.compId);
		else{
			usersData.append("companyId", "");		
		}
		if(this.state.TermsAndCondition===true){
			Request.post(apiBaseUrl + 'createUser/', usersData, config)
				.then(function(response) {					
					toastr.success('Success', 'User Registered successfully, Please check your mail');	
					if (response.status === 200) {	
						self.context.router.push('/');					
					} 
				})
				.catch(function(error) {					
					console.log("catch error in below line");
					console.log("RegisterUser -- > submitUser"+error);					
				});
		}else{
			toastr.error('Error', 'Please Accept Terms and condition');
		}
	}	
			
	render() {			
  		return (
			<form action="" id="uform">
				<div className="justify-content-center">                                 
					<div className="flex row">                                      
						<div className="mb-1 col-sm-6"> 						
							<select className="form-control" 
								value={this.state.compType} 
								onChange={this.handleChangeCompany.bind(this)} 	 	  											       
								defaultValue={this.state.compType ? this.state.compType : ''}>
								<option value="" disabled className="hide">select Type</option>
								{ this.state.companyType.map(function(options, responseIndex) {
										return <option key={responseIndex} value={options.name} className="selection-style">{options.name}
														</option>                                                          
									})
								}
							</select>
							</div>
							{this.state.TraderBrokerBox ?< div className="mb-1 col-sm-6" >
							<select className="form-control" 
								value={this.state.compName} 
								onChange={this.saveSubComp.bind(this)}							 	  											       
								defaultValue={this.state.compName ? this.state.compName : ''}>
								<option value="" disabled className="hide">select Company</option>
								{ this.state.companies && this.state.companies.map(function(options, responseIndex) {
										return <option key={responseIndex} value={options.companyId} className="selection-style">{options.name}
														</option>                                                          
									})
								}
								</select></div> : ''}
											{this.state.compType==="Trader Company" || 
											this.state.compType==="Broker Company" ?
											<div className="input-group mb-1 col-md-6" >
												<span className="input-group-addon" > < i className="glyphicons glyphicons-user"> </i></span >
												<input type="text"  className="form-control" placeholder="Code" name="uCode" value={this.state.uCode} id="uName"
												onChange={this.linkValue.bind(this,'companyCode','userJson')}
												/> 
											</div> : ''
											}
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
                                            <input type="text" className="form-control" 
												placeholder="Last Name" name="uLastName" 
												value={this.state.uLastName}
												id="uLastName" 
												onChange={this.linkValue.bind(this, 'lastName','userJson')}/>
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
										{this.state.shouldHide === true ?
											<div className="mb-1 col-md-6" id="licOfAuth"><
											FileInput name="licOfAuth"
											accept=".jpg,.png,.pdf"
											placeholder="License of Authorization"
											className="form-control uploadBtn"
											onChange={
											this.uploadFile.bind(this, 'letterOfAuth','userData','fileRequest')}
											/>
											</div> : ''
										}                        
										{this.state.compType==="Trader Company" || this.state.compType==="Broker Company"
										?<div className="col-sm-12"><div className="checkbox"><label><
												input type="checkbox"
												id="isAdmin"
												name="isAdmin"
												value="{this.state.isAdmin}"
												onChange={this.toggleCheckboxChange.bind(this,'isAdmin')}
												/> <span className="check" > </span>
												Are you an Admin
												</label> </div> </div>:''
										}						    
                            			<div className="col-sm-12">
                                           <div className="row">
                                               <div className="col-sm-6">
                                                   <div className="checkbox"><label>
                                                    <input
                                                    type="checkbox"
                                                    value="TermsAndCondition" checked onClick={this.toggleCheckboxChange.bind(this,'TermsAndCondition')}/> <span className="check"></span>
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
                        
             
        );
    }
}
RegisterUser.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default RegisterUser;
