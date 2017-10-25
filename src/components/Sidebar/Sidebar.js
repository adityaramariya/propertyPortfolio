import React, { Component } from 'react';
 import { Link } from 'react-router'
class Sidebar extends Component {
  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }
  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }
  render() {
    var headerData = JSON.parse(localStorage.getItem('HEADER_DATA'));
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          {/*static list in sidebar*/}
         <ul className="nav">
            <li className={this.activeRoute("/forms")}>
              <Link to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-note"></i> Dashboard</Link>
            </li>
            <li className={this.activeRoute("/icons")}>
              <Link to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Properties</Link>
            </li>
          </ul>
          {/*<ul className="nav navbar-nav hidden-md-down">
            {headerData && headerData.map(function (headerNavLink) {
                var imgPath = "img/icons/"+headerNavLink.linkName+".svg"
              return (
                  <li className="nav-item" key={headerNavLink.linkName}>
                    <a className="nav-link" href={headerNavLink.linkTo}><img width={40 + 'px'} height={40 + 'px'} src={imgPath} />  {headerNavLink.linkName}</a>
                  </li>
              )
            })}
          </ul>*/}
        </nav>
      </div>
    )
  }
}
export default Sidebar;