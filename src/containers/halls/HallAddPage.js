import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as hallsActions from '../../store/halls/actions';
import * as hallsSelectors from '../../store/halls/selectors';

import Topbar from '../../components/Topbar';
import HallForm from '../../components/hall/HallForm';
import _ from 'lodash';

class HallAddPage extends Component {

    state = {
        fieldsLoaded : false,
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }
    componentWillMount(){
        // this.props.fetchHalls();
    }
    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveHall(data) {
        if (data.file) {
            this.props.createHallWithLogo(data.form, data.file);
        } else {
            this.props.createHall(data.form);
        }
    }

    render() {
        return (
            <div className="DocumentAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/halls">Halls</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/halls/add">Add</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <HallForm
                        exceptions={ this.props.exceptions }
                        saveItem={ this.saveHall }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        halls: hallsSelectors.getItems(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createHall: (data) => {
            dispatch(hallsActions.createItem(data))
        },
        createHallWithLogo: (data, file) => {
            dispatch(hallsActions.createItemWithLogo(data, file))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HallAddPage);