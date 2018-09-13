import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as moviesActions from '../../store/movies/actions';
import * as moviesSelectors from '../../store/movies/selectors';
import * as hallsActions from '../../store/halls/actions';
import * as hallsSelectors from '../../store/halls/selectors';

import Topbar from '../../components/Topbar';
import MoviesList from '../../components/movies/MoviesList';
import Pagination from '../../components/Pagination';

class MoviesListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchMovies();
        this.props.fetchHalls();
    }

    render() {
        return (
            <div className="DocumentListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/movies">Movies</Link>
                    </div>
                    <div className="main-btns">
                        <Link to="/movies/add" className="btn btn-primary">Add Movie</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <MoviesList
                        items={this.props.movies}
                        setCurrentItemId={this.props.setCurrentHallId}
                        unsetCurrentItemId={this.props.unsetCurrentHallId}
                        deleteItem={this.props.deleteHall}
                        currentItem={this.props.currentHall}
                        halls={this.props.halls}
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchMovies }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        movies: moviesSelectors.getItemsByPage(state, (moviesSelectors.getPagination(state)).currentPage),
        halls: hallsSelectors.getItemsByPage(state, (hallsSelectors.getPagination(state)).currentPage),
        sorter: moviesSelectors.getSorter(state),
        filters: moviesSelectors.getFilters(state),
        pagination: moviesSelectors.getPagination(state),
        currentHall: moviesSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMovies: (deleteCache) => {
            dispatch(moviesActions.fetchItems(deleteCache))
        },
        fetchHalls: (deleteCache) => {
            dispatch(hallsActions.fetchItems(deleteCache))
        },
        toggleSorter: (searchTerm) => {
            dispatch(moviesActions.toggleSorter(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(moviesActions.setCurrentPage(page))
        },
        setCurrentHallId: (id) => {
            dispatch(moviesActions.setCurrentItemId(id))
        },
        unsetCurrentHallId: () => {
            dispatch(moviesActions.unsetCurrentItemId())
        },
        deleteHall: (id) => {
            dispatch(moviesActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesListPage);