import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Progress } from 'reactstrap';
class Aside extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
    var headerData = JSON.parse(localStorage.getItem('HEADER_DATA'));
    return (
      <aside className="aside-menu">
        <nav className="sidebar-nav">
          <ul className="nav navbar-nav hidden-md-down">
            {headerData && headerData.map(function (headerNavLink) {
              return (
                  <li className="nav-item" key={headerNavLink.linkName}>
                    <a className="nav-link" href={headerNavLink.linkTo}><i className="icon-speedometer"></i>  {headerNavLink.linkName}</a>
                  </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    )
  }
}
export default Aside;
