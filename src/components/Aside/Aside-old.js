import React, { Component } from 'react';
import { Link } from 'react-router';
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
  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }
  componentWillMount() {
    this.setState({
      items: [
        { name: 'withhold all orders', link: '#' },
        { name: 'delete all orders', link: '#' },
        { name: 'elc', link: '#' },
        { name: 'steel', link: '#' },
        { name: 'coal', link: '#' },
        { name: 'nags', link: '#' },
        { name: 'carbon', link: '#' },
        { name: 'all', link: '#' },
        { name: 'options', link: '#' },
        { name: 'trade value', link: '#' },
        { name: 'watchlist', link: '#' },
        { name: 'analysis', link: '#' },
        { name: 'news', link: '#' },
        { name: 'my account activities', link: '#' },
        { name: 'add transactions', link: '#' },
        { name: 'create new sheet', link: '#' },
        { name: 'quick screens', link: '#' },
        { name: 'save screen', link: '#' },
        { name: 'print screen', link: '#' }
      ]
    })
  }

  render() {
    return (
      <aside className="aside-menu">
          {/*<ul className="aside-links">
            {this.state.items.map(function(item) {
              return (
                  <li key={item.name}>
                    <a className='button' href={item.link}>{item.name}</a>
                  </li>
              );
            })}
          </ul>*/}
          <nav className="sidebar-nav">
            <ul className="nav">
              <li className="nav-item">
                <Link to={'/dashboard'} className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Dashboard <span className="badge badge-info">NEW</span></Link>
              </li>
              <li className="nav-title">
                UI Elements
              </li>
              <li className={this.activeRoute("/components")}>
                <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Components</a>
                <ul className="nav-dropdown-items">
                  <li className="nav-item">
                    <Link to={'/components/buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Buttons</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/components/social-buttons'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Social Buttons</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/components/cards'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Cards</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/components/modals'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modals</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/components/switches'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Switches</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/components/tables'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tables</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/components/tabs'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Tabs</Link>
                  </li>
                </ul>
              </li>
              <li className={this.activeRoute("/forms")}>
                <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-note"></i> Forms</a>
                <ul className="nav-dropdown-items">
                  <li className="nav-item">
                    <Link to={'/forms/basic-forms'} className="nav-link" activeClassName="active"><i className="icon-note"></i> Basic Forms</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/forms/advanced-forms'} className="nav-link" activeClassName="active"><i className="icon-note"></i> Advanced Forms</Link>
                  </li>
                </ul>
              </li>
              <li className={this.activeRoute("/icons")}>
                <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Icons</a>
                <ul className="nav-dropdown-items">
                  <li className="nav-item">
                    <Link to={'/icons/font-awesome'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Font Awesome</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/icons/glyphicons'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Glyphicons</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/icons/glyphicons-filetypes'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Glyphicons Filetypes</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/icons/glyphicons-social'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Glyphicons Social</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/icons/simple-line-icons'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Simple Line Icons</Link>
                  </li>
                </ul>
              </li>
              <li className={this.activeRoute("/plugins")}>
                <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-energy"></i> Plugins</a>
                <ul className="nav-dropdown-items">
                  <li className="nav-item">
                    <Link to={'/plugins/loading-buttons'} className="nav-link" activeClassName="active"><i className="icon-cursor"></i> Loading Buttons</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/plugins/spinners'} className="nav-link" activeClassName="active"><i className="fa fa-spinner"></i> Spinners</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link to={'/widgets'} className="nav-link" activeClassName="active"><i className="icon-calculator"></i> Widgets <span className="badge badge-info">NEW</span></Link>
              </li>
              <li className="nav-item">
                <Link to={'/charts'} className="nav-link" activeClassName="active"><i className="icon-pie-chart"></i> Charts</Link>
              </li>
              <li className="divider"></li>
              <li className="nav-title">
                Extras
              </li>
              <li className="nav-item nav-dropdown">
                <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-star"></i> Pages</a>
                <ul className="nav-dropdown-items">
                  <li className="nav-item">
                    <Link to={'/pages/login'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/pages/register'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/pages/404'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 404</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/pages/500'} className="nav-link" activeClassName="active"><i className="icon-star"></i> Error 500</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
      </aside>
    )
  }
}
export default Aside;
