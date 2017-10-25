import React from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import RegisterUser from "./RegisterUser"
import RegisterCompany from "./RegisterCompany"

class Register extends React.Component {	
	componentWillMount() {
		this.state = {	
		   activeTab: '1'	
	}}	

	toggle(tab) {
		if (this.state.activeTab !== tab) {
		this.setState({
			activeTab: tab
		});
		}	
	}		

 render() {
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
										<RegisterCompany/>
									</TabPane>					
									{/*================================= User from started from here=================================================*/}
									<TabPane tabId="2">
										<RegisterUser/>
									</TabPane>
								</TabContent>
							</div>
						</div>
					</div>
				</div> 				
          	</div>
        );
    }
}
Register.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Register;
