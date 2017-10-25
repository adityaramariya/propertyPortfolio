import React, { Component } from 'react';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
class ForgotPassword extends Component {
	
	componentWillMount() {
		this.state = {
		   //	modal: false,
		   //	large: false,
		   username: ''
		}
	}
		   
	  onChange(e) {
		this.setState({
		   [e.target.name]: e.target.value
		});
	}
	onSubmit(event) {
		var apiBaseUrl = "http://localhost:8793/api/v1/user/forgotPassMail/";
		var self = this;
		var config = {
		   headers: {
		      "Content-Type": "application/json",
		      "AUTHORIZATION": localStorage.getItem('AUTHORIZATION')
		   }
		};

		axios.post(apiBaseUrl, {
		      hello: this.state.username
		   }, config)
		   .then(function(response) {
		      console.log(response);
		      if (response.status === 200) {
		         console.log("Login successfull");
		        // self.context.router.push('/pages/login');
				toastr.success('Success', 'Your password is sent on your mail.');
				self.setState({
				   username: ''
				})
		        
		      } else if (response.status === 204) {
		         console.log("Username password do not match");
		         toastr.error('Error', 'Error');
		      } else {
		         console.log("Username does not exists");
		         toastr.error('Error', 'Error');
		      }
		   })
		   .catch(function(error) {
		      console.log(error);
			  toastr.error('Error', 'Error');
		   });

	}
	redirectToRegisterPage(event) {
		this.context.router.push('/pages/login');
		event.preventDefault();
	}
  render() {
    return (
    <form className="container" >
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card-group mb-0">
                    <div className="card p-2">
                        <div className="card-block">
                            <h2>Forgot Password</h2>
                            <p className="text-muted">Enter your registered Email</p>
                            <div className="input-group mb-1">
                                <span className="input-group-addon"><i className="icon-user"></i></span>
                      <input type="text" className="form-control" placeholder="Username" name="username" value={this.state.username} onChange={this.onChange.bind(this)}/>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button type="button" onClick={this.onSubmit.bind(this)} className="btn btn-primary px-2" >Submit</button>
                                </div>
                                <div className="col-6 text-right">
                                    {/*<button onClick={this.redirectToRegisterPage} type="button" className="btn btn-link px-0">Back to Login</button>*/}
                                    <a href="#/pages/login">Back to Login</a>
                                </div>
                            </div>
                        </div>
                    </div>
                   {/* <div className="card card-inverse card-primary py-3 hidden-md-down" style={{ width: 44 + '%' }}>
                        <div className="card-block text-center">
                            <div>
                                <h2>Sign up here</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <button type="button" className="btn btn-primary active mt-1" onClick={this.redirectToRegisterPage}>Register Now!</button>
                            </div>
                        </div>
                    </div>*/}
                </div>
            </div>
        </div>

    </form>
    );
  }
}

ForgotPassword.contextTypes = {
    router: React.PropTypes.object.isRequired
};


export default ForgotPassword;
