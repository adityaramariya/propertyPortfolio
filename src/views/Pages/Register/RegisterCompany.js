import React from 'react';
import Select from 'react-select';
import FileInput from 'react-file-input';
import Request from 'axios';
import { toastr } from 'react-redux-toastr'
import { FormWithConstraints, FieldFeedbacks, FieldFeedback , Bootstrap4} from 'react-form-with-constraints';
const { FormGroup, FormControlInput } = Bootstrap4;
var companyData = new FormData();
const apiBaseUrl = "api/v1/public/registration/";
const config = {
           headers: { 
           "Content-Type": "application/json"
           //"AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
                    }
            };
class RegisterCompany extends FormWithConstraints {	
	componentWillMount() {
		this.state = {
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
		   selectedCompany: 'Trader Company',
		   companyJson: {},
		};
		this.getCountryList();
	}

	uploadFile(keyName, stateName,fileRequest,event) {	
		   companyData.append(''+fileRequest+'.'+keyName+'', event.target.files[0]);
		// else{
	    //            console.log('inside');
      	//    userData.append(''+fileRequest+'.'+keyName+'', event.target.files[0]);
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

	// country list in company module 
	getCountryList() {
		this.setState({
		   country: this.state.country
		});
	}

	// save country  in company module 
	saveAsCountry(countryValue) {
		if (countryValue === null){
		   this.setState({
		      stateValue: '',
		      cityValue: ''
		   });
		   companyData.append("country", null);
		   companyData.append("state", null);
		   companyData.append("city", null);
		}else{
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
	saveRegAsComp(e) {
		console.log(e);
		this.setState({
		   regAsComp : e.target.value
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
		}else if (!this.state.companyJson["phone1"]) {
			toastr.error('Error', 'Please Enter Phone no.');
			return false;
		}
		else if (!this.state.companyJson["taxNo"]) {
			toastr.error('Error', 'Please Enter Tax No.');
			return false;
		}else if (!this.state.companyJson["email"]) {
			toastr.error('Error', 'Please Enter Email');
			return false;
		}else{
			this.checkUniqueTaxNo(this.state.companyJson["taxNo"]);
		}
  	}
	
	// check unique in submit company	
	checkUniqueTaxNo(taxNo) {		
		var self = this;
		var data1 = new FormData();
		data1.append("taxNo", taxNo);
		Request.post(apiBaseUrl + 'isTaxNumberExist/', data1, config)
		.then(function(response) {
			if (response.data === false){
				self.checkEmailForCompany(self.state.companyJson["email"],'company');
			}else {
				toastr.error('Error', 'Tax no. already Exist');
			}
		})
		.catch(function(error) {
			console.log("RegisterCompany --> checkUniqueTaxNo"+error);				
		});
	}

// check email in submit company	and user
	checkEmailForCompany(email,mode) {
		var self = this; 
		var data1 = new FormData();
		data1.append("email", email);
		Request.post(apiBaseUrl + 'isCompanyEmailExist/',data1 
		      , config)
		   .then(function(response) {
		      console.log(response.data)
				if (response.data === false){
					if(mode === 'company')  
						self.submitCompany();
				}else{
					toastr.error('Error', 'Email Id already Exist');
				}
		   	})
		   	.catch(function(error) {
			console.log("RegisterCompany --> checkUniqueTaxNo"+error);				
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
      	this.clearCompanyFormData();		
		for (var key in this.state.companyJson) {
		   	compData.append(key, this.state.companyJson[key])
		}
  		compData.append("companyType", this.state.regAsComp.name);
		compData.append("termsAndCondition", this.state.TermsAndCondition);	
		if(this.state.TermsAndCondition===true){			
			Request.post(apiBaseUrl + 'createCompany/', compData, config)
			.then(function(response) {				
				if (response.status === 200) {
					console.log("createCompany successfull");
					toastr.success('Success', 'Company created successfully , Please check your mail');
					setTimeout(function(){						
					}, 5000);
					window.location.reload();
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
		}else{
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
			}else {
					this.setState({
						shouldHide: false
					})
			}
		}else
			this.setState({
				[stateName]: e.target.checked
		});
	}
		

 	render() {	 
  		return (       
			<form action="">
				<div className="justify-content-center">											
					<div className="flex row">
						<div className="mb-1 col-sm-6">						
							<select className="form-control" 
								value={this.state.regAsComp} 
								onChange={this.saveRegAsComp.bind(this)} 	 	  											       
								defaultValue={this.state.regAsComp ? this.state.regAsComp : ''}>
								<option value="" disabled className="hide">select Type</option>
								{ this.state.regAsCompDet.map(function(options, responseIndex) {
										return <option key={responseIndex} value={options.name} className="selection-style">{options.name}
														</option>                                                          
									})
								}
							</select>					
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
									<div className="checkbox">
										<label>
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
        );
    }
}
RegisterCompany.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default RegisterCompany;
