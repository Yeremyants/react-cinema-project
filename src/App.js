import classNames from 'classnames';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import auth from './services/auth';
import './App.scss';

import * as authActions from './store/auth/actions';
import * as exceptionsSelectors from './store/exceptions/selectors';
import * as exceptionsActions from './store/exceptions/actions';

import Sidebar from './components/Sidebar';

class App extends Component {

    state = {};

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        if (!auth.isAuthenticated()) {
            browserHistory.push('/login');
        }
    }

    getClassName() {
        if (this.props.sidebarOpened) {
            return 'App sidebar-opened';
        }

        return 'App';
    }
    render() {
        let children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
                exceptions: this.props.exceptions,
                clearExceptions: this.props.clearExceptions,
                handleLangChange: this.handleLangChange,
            })
        });

        return (
            <div className={ this.getClassName() }>
                <div className="sidebar transation-2s-in-out">
                    <Sidebar
                        toggleSidebar={ this.props.toggleSidebar }
                        logout={ this.props.logout }
                        lang={this.state.lang}
                    />
                </div>
                <div className="container transation-2s-in-out">
                    { children }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

        exceptions: exceptionsSelectors.getItems(state),

    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => {
            dispatch(authActions.logout())
        },
        clearExceptions: () => {
            dispatch(exceptionsActions.clear())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);