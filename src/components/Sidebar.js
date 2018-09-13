import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../services/strings';
import { Link } from 'react-router';

import './Sidebar.scss';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    getLinkClassName(linkName) {
        let path = location.pathname.split('/');
        return (path[1] == linkName) ? 'active' : '';
    }

    handleLogoutClick() {
        this.props.logout();
    }

    render() {
        return (
            <span>
                <div className="title">
                    <h1>Cinema</h1>
                </div>
                <ul className="nav nav-sidebar">
                    <li className={ this.getLinkClassName('halls') }>
                        <Link to="/halls" href="#">Halls</Link>
                    </li>
                    <li className={ this.getLinkClassName('movies') }>
                        <Link to="/movies" href="#">Movies</Link>
                    </li>
                     <li className="logout" >
                        <a href="#" onClick={ this.handleLogoutClick }>Log Out</a>
                    </li>
                </ul>
            </span>
        );
    }

}

Sidebar.propTypes = {
    toggleSidebar: React.PropTypes.func,
};

export default Sidebar;