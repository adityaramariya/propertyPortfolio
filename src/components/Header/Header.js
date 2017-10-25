import React, {Component} from 'react';
import {Dropdown, DropdownMenu, DropdownItem} from 'reactstrap';
class Header extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }
    toggle(e) {
        e.preventDefault();
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');
    }
    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }
    asideToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('aside-menu-hidden');
    }
    render() {
        return (
            <header className="app-header navbar navbar-inverse">
                <button className="navbar-toggler mobile-sidebar-toggler hidden-lg-up"
                        onClick={this.mobileSidebarToggle} type="button">&#9776;</button>
                <a className="navbar-brand" href="#"></a>
                <ul className="nav navbar-nav">
                    <li>
                        <a className="navbar-toggler sidebar-toggler navicon-button x" classID="navIcon"
                           onClick={this.sidebarToggle} href="#">
                            <div className="navicon"></div>
                        </a>
                    </li>
                </ul>
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item ">
                        <a className="nav-link" href="#">
                            <i className="glyphicons glyphicons-pending-notifications"></i>
                        </a>
                    </li>
                    <li className="nav-item adminHeaderlink">
                        <a onClick={this.toggle} className="nav-link" href="#" role="button">
                            <span className="hidden-md-down">admin</span>
                            <img src={'img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                        </a>
                    </li>
                </ul>
            </header>
        )
    }
}
export default Header;
