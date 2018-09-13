import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as hallsActions from '../../store/halls/actions';
import * as hallsSelectors from '../../store/halls/selectors';
import * as moviesActions from '../../store/movies/actions';
import * as moviesSelectors from '../../store/movies/selectors';

import Topbar from '../../components/Topbar';
import MoviesForm from '../../components/movies/MovieForm';
import _ from 'lodash';

class MoviesEditPage extends Component {

    state = {
        fieldsLoaded : false,
    };

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchHalls();
        this.props.fetchMovie(this.props.params.id);
        this.props.setCurrentMovieId(this.props.params.id);
    }

    componentWillUnmount() {
        this.props.unsetCurrentMovieId();
        this.props.clearExceptions();
    }

    saveMovie(data) {
        this.props.updateMovie(this.props.params.id, data.form);
    }

    updateItemOrder(data){
        this.props.updateDocumentOrder(this.props.params.id, data);
    }

    render() {
        return (
            <div className="DocumentEditPage">
                <div className="title">
                    <Link to="/movies">Movies</Link>
                    <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/movies/add">Add</Link>
                        </span>
                </div>

                <div className="content">
                    <MoviesForm
                        exceptions={ this.props.exceptions }
                        currentItem={ this.props.currentMovie }
                        saveItem={ this.saveMovie }
                        halls={ this.props.halls }
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
        currentMovie: moviesSelectors.getCurrentItem(state),
        halls: hallsSelectors.getItems(state),
        fieldsOrder: hallsSelectors.getFieldsOrder(state),
        selectors: hallsSelectors.getSelectors(state),
        clauses: hallsSelectors.getClauses(state),
        stepsFromValidation: hallsSelectors.getSteps(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMovie: (id) => {
            dispatch(moviesActions.fetchItem(id))
        },
        fetchHalls: (data) => {
            dispatch(hallsActions.fetchItems(data))
        },
        setCurrentMovieId: (id) => {
            dispatch(moviesActions.setCurrentItemId(id))
        },
        unsetCurrentMovieId: () => {
            dispatch(moviesActions.unsetCurrentItemId())
        },
        updateMovie: (id, data) => {
            dispatch(moviesActions.updateItem(id, data))
        },
        createMovie: (data) => {
            dispatch(moviesActions.createItem(data))
        },
        updateHallOrder: (id, data) => {
            dispatch(moviesActions.updateItemOrder(id, data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesEditPage);