import React from 'react';
import axios  from 'axios';
import querystring from 'querystring';
import cookie from 'react-cookies';
import {FormWithConstraints, FieldFeedbacks, FieldFeedback, Bootstrap4} from 'react-form-with-constraints';
const {FormGroup, FormControlInput} = Bootstrap4;
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import {setHeaderLinkData} from '../../../actions';
const mapStateToProps = function (state) {
    return {
        getHeaderLinkData: state.HeaderLinkData
    }
}
const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        dispatchHeaderLinkData: setHeaderLinkData,
    }, dispatch)
}
var apiBaseUrl = "http://103.76.253.131:8791/userauth/oauth/token";;
var config = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
};

class Login extends FormWithConstraints {
    constructor(props) {
        super(props);
        this.state = {
            submitButtonDisabled: false,
            headerNav: [{
                linkName: 'Dashboard',
                linkTo: '#/Innerpages/Dashboard'
            },
                {
                    linkName: 'Properties',
                    linkTo: '#/Innerpages/trade'
                }
            ]
        };
    }
    onChange(e) {
        const target = e.currentTarget;
        this.setState({
            [target.name]: target.value
        });
        
        super.handleChange(e);
        this.setState({
            submitButtonDisabled: !this.isValid()
        });
    }
    //Login Submission
    onSubmit(event) {
        if (!this.state.username) {
            toastr.error('Error', 'Please Enter UserName');
            return false;
        } else if (!this.state.password) {
            toastr.error('Error', 'Please enter Password');
            return false;
        } else {
            var self = this;
            var comment = querystring.stringify({
                grant_type: "password",
                username: this.state.username,
                password: this.state.password
            });
            //post to sever
            axios.post(apiBaseUrl, comment, config)
                .then(function (response) {
                    console.log(response.data);
                    //	$http.defaults.headers.common['Authorization'] = 'Bearer ' + res.token;
                    localStorage.setItem('AUTHORIZATION', 'Basic ' + response.data.access_token);
                    self.props.dispatchHeaderLinkData(self.state.headerNav)
                    localStorage.setItem('HEADER_DATA', JSON.stringify(self.state.headerNav));
                    console.log(response);
                    if (response.status === 200) {
                        console.log("Login successfull" + response.data.access_token);
                        cookie.save('AUTHORIZATION', response.data.access_token, {
                            path: '/'
                        });
                        self.context.router.push('/innerPages/dashboard');
                        event.preventDefault();
                    } else if (response.status === 204) {
                        console.log("Username password do not match");
                        toastr.error('Error', 'Username password do not match');
                    } else {
                        console.log("Username does not exists");
                        toastr.error('Error', 'Username does not exists');
                    }
                })
                .catch(function (error) {
                    self.setState({
                        username: '',
                        password: '',
                    });
                    console.log(error);
                });
        }
    }
    render() {
        return (
            <form className="container">
                <div className="row justify-content-center">
                    <div className="card-group mb-0 loginBox">
                        <a href="#" className="logo">
                            <img src="img/logo.png" alt=""/>
                        </a>
                        <div className="card p-2">
                            <img src="" alt=""/>
                            <div className="userIcon"></div>
                            <div className="loginInputContainer">
                                <FormGroup for="username">
                                    <FormControlInput
                                        type="text"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChange.bind(this)}
                                        placeholder="Username"
                                        required/>
                                    <FieldFeedbacks for="username">
                                        <FieldFeedback when="*"/>
                                    </FieldFeedbacks>
                                </FormGroup>
                                <FormGroup for="password"   className = "noBorder">
                                    <FormControlInput
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChange.bind(this)}
                                        pattern=".{5,}"
                                        placeholder="Password"
                                        required/>
                                    <FieldFeedbacks for="password" show="all">
                                        <FieldFeedback when="valueMissing"/>
                                        <FieldFeedback when="patternMismatch">Should be at least 5 characters
                                            long</FieldFeedback>
                                        <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain
                                            numbers</FieldFeedback>
                                        <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain
                                            small letters</FieldFeedback>
                                        <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain
                                            capital letters</FieldFeedback>
                                    </FieldFeedbacks>
                                </FormGroup>
                            </div>
                            <button
                                type="button" onClick={this.onSubmit.bind(this)}
                                className="btn btn-primary  btn-block">Sign In
                            </button>
                            <div className="di justify-content-between">
                                <a href="#/pages/ForgotPassword">Forgot
                                    password?</a>
                                <a href="#/pages/register">Sign Up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);