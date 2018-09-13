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

class HallEditPage extends Component {

    state = {
        fieldsLoaded : false,
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchHall(this.props.params.id);
        this.props.setCurrentHallId(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.unsetCurrentHallId();
        this.props.clearExceptions();
    }

    saveHall(data) {
        this.props.updateHall(this.props.params.id, data.form);
    }

    render() {
        return (
            <div className="DocumentEditPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/halls">Halls</Link>
                        <span className="hidden-xs">

                            <span className="divider">/</span>
                            <Link to={`/halls/${this.props.params.id}`}>Edit</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <HallForm
                        exceptions={ this.props.exceptions }
                        currentItem={ this.props.currentHall }
                        saveItem={ this.saveHall }
                        fieldsOrder={ this.props.fieldsOrder }
                        updateItemOrder={ this.updateItemOrder }
                    />
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        currentHall: hallsSelectors.getCurrentItem(state),
        fields: hallsSelectors.getFields(state),
        fieldsOrder: hallsSelectors.getFieldsOrder(state),
        selectors: hallsSelectors.getSelectors(state),
        clauses: hallsSelectors.getClauses(state),
        stepsFromValidation: hallsSelectors.getSteps(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchHall: (id) => {
            dispatch(hallsActions.fetchItem(id))
        },
        setCurrentHallId: (id) => {
            dispatch(hallsActions.setCurrentItemId(id))
        },
        unsetCurrentHallId: () => {
            dispatch(hallsActions.unsetCurrentItemId())
        },
        updateHall: (id, data) => {
            dispatch(hallsActions.updateItem(id, data))
        },
        createHall: (data) => {
            dispatch(hallsActions.createItem(data))
        },
        updateHallOrder: (id, data) => {
            dispatch(hallsActions.updateItemOrder(id, data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HallEditPage);