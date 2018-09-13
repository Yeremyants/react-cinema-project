import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { Link } from 'react-router';
import '../Page.scss';

import * as hallsActions from '../../store/halls/actions';
import * as hallsSelectors from '../../store/halls/selectors';

import Topbar from '../../components/Topbar';
import HallList from '../../components/hall/HallList';
import Pagination from '../../components/Pagination';

class HallsListPage extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentWillMount() {
        this.props.fetchHalls();

    }

    render() {
        return (
            <div className="DocumentListPage">
                <Topbar currentLanguage={this.props.currentLanguage} handleLangChange={this.props.handleLangChange}>
                    <div className="title">
                        <Link to="/halls">Halls</Link>
                    </div>
                    <div className="main-btns">
                        <Link to="/halls/add" className="btn btn-primary">Add Hall</Link>
                    </div>
                </Topbar>

                <div className="content">
                    <HallList
                        items={this.props.halls}
                        setCurrentItemId={this.props.setCurrentHallId}
                        unsetCurrentItemId={this.props.unsetCurrentHallId}
                        deleteItem={this.props.deleteHall}
                        currentItem={this.props.currentHall}
                    />

                    <Pagination
                        pagination={ this.props.pagination }
                        setCurrentPage={ this.props.setCurrentPage }
                        fetchItems={ this.props.fetchHalls }
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        halls: hallsSelectors.getItemsByPage(state, (hallsSelectors.getPagination(state)).currentPage),
        sorter: hallsSelectors.getSorter(state),
        filters: hallsSelectors.getFilters(state),
        pagination: hallsSelectors.getPagination(state),
        currentHall: hallsSelectors.getCurrentItem(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchHalls: (deleteCache) => {
            dispatch(hallsActions.fetchItems(deleteCache))
        },
        toggleSorter: (searchTerm) => {
            dispatch(hallsActions.toggleSorter(searchTerm))
        },
        setCurrentPage: (page) => {
            dispatch(hallsActions.setCurrentPage(page))
        },
        setCurrentHallId: (id) => {
            dispatch(hallsActions.setCurrentItemId(id))
        },
        unsetCurrentHallId: () => {
            dispatch(hallsActions.unsetCurrentItemId())
        },
        deleteHall: (id) => {
            dispatch(hallsActions.deleteItem(id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HallsListPage);