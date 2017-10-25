import React from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import BrokerageBrokerData from "./BrokerageBrokerData"
import BrokerageTraderData from "./BrokerageTraderData"

class Brokerage extends React.Component {	
	componentWillMount() {
		this.state = {	
		   activeTab: '1'	
		}
	}
	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});   
		}
		if(tab===2 || tab === "2"){
			this.refs.traderChild.clear();
		}else{
			this.refs.brokerChild.clear();
		}	 
	}	

 render() {
  	return (
		<div className="card">
			{/*<div className="card-header">*/}
			{/*Brokerage*/}
			{/*</div>*/}
			<Nav tabs>
				<NavItem>
					<NavLink
						className={classnames({ active: this.state.activeTab === '1' })}
						onClick={() => { this.toggle('1'); }}
					>
						Brokers
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: this.state.activeTab === '2' })}
						onClick={() => { this.toggle('2'); }}
					>
						Traders
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={this.state.activeTab}>
				<TabPane tabId="1">
					<BrokerageBrokerData ref="brokerChild"/>
				</TabPane>
			</TabContent>
			<TabContent activeTab={this.state.activeTab}>
				<TabPane tabId="2">
					<BrokerageTraderData ref="traderChild"/>
				</TabPane>
			</TabContent>
		</div>
        );
    }
}

export default Brokerage;
