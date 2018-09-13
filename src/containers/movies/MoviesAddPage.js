import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as hallsActions from '../../store/halls/actions';
import * as hallsSelectors from '../../store/halls/selectors';
import * as moviesSelectors from '../../store/movies/actions';
import * as moviesActions from '../../store/movies/selectors';

import Topbar from '../../components/Topbar';
import MovieForm from '../../components/movies/MovieForm';
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
        this.props.fetchHalls();
    }
    componentWillUnmount() {
        this.props.clearExceptions();
    }

    saveMovie(data) {
        if (data.file) {
            this.props.createMovieWithLogo(data.form, data.file);
        } else {
            this.props.createMovie(data.form);
        }
    }

    render() {
        return (
            <div className="DocumentAddPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/movies">Movies</Link>
                        <span className="hidden-xs">
                            <span className="divider">/</span>
                            <Link to="/movies/add">Add</Link>
                        </span>
                    </div>
                </Topbar>

                <div className="content">
                    <MovieForm
                        exceptions={ this.props.exceptions }
                        saveItem={ this.saveMovie }
                        halls={ this.props.halls }
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
        fetchHalls: (data) => {
            dispatch(hallsActions.fetchItems(data))
        },
        createMovie: (data) => {
            dispatch(moviesSelectors.createItem(data))
        },
        createMovieWithLogo: (data, file) => {
            dispatch(moviesSelectors.createItemWithLogo(data, file))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HallAddPage);