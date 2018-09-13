import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as moviesSelectors from './selectors';
import * as exceptionsActions from '../exceptions/actions';

export const types = {
    FETCH_ALL_ITEMS_DONE: 'movies.FETCH_ALL_ITEMS_DONE',
    FETCH_ITEMS_DONE: 'movies.FETCH_ITEMS_DONE',
    FETCH_ITEM_DONE: 'movies.FETCH_ITEM_DONE',
    VALIDATE_ITEM_DONE: 'movies.VALIDATE_ITEM_DONE',
    SET_SORTER: 'movies.SET_SORTER',
    SET_SEARCH_TERM: 'movies.SET_SEARCH_TERM',
    SET_CATEGORY_ID: 'movies.SET_CATEGORY_ID',
    SET_CURRENT_PAGE: 'movies.SET_CURRENT_PAGE',
    SET_CURRENT_ITEM_ID: 'movies.SET_CURRENT_ITEM_ID',
    TOGGLE_SORTER: 'movies.TOGGLE_SORTER',
    CLEAR_CACHE: 'movies.CLEAR_CACHE',
};

export function setCurrentPage(page) {
    return {
        type: types.SET_CURRENT_PAGE,
        payload: {
            page
        }
    }
}

export function setCurrentItemId(id) {
    return {
        type: types.SET_CURRENT_ITEM_ID,
        payload: {
            id
        }
    }
}

export function unsetCurrentItemId() {
    return {
        type: types.SET_CURRENT_ITEM_ID,
        payload: {
            id: null,
        }
    }
}

export function toggleSorter(column) {
    return {
        type: types.TOGGLE_SORTER,
        payload: {
            column
        }
    }
}

export function setSearchTerm(searchTerm) {
    return {
        type: types.SET_SEARCH_TERM,
        payload: {
            searchTerm
        }
    }
}

export function clearCache() {
    return {
        type: types.CLEAR_CACHE
    }
}

export function fetchAllItems() {
    return async (dispatch, getState) => {
        try {
            let params = new Map();
            params.set('language_id', language.get());
            // params.set('expand', 'downloads');

            let items = await api.get('/movies', params);
            dispatch(clearCache());
            dispatch({
                type: types.FETCH_ALL_ITEMS_DONE,
                payload: {
                    items
                }
            });
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function fetchItems(deleteCache = false) {
    return async (dispatch, getState) => {
        let state = getState();
        try {
            // Set additional params
            let params = new Map();
            let filters = moviesSelectors.getFilters(state);
            let sorter = moviesSelectors.getSorter(state);
            let pagination = moviesSelectors.getPagination(state);
            // params.set('expand', 'downloads');
            params.set('page_size', pagination.pageSize);
            params.set('page_number', deleteCache ? 1 : pagination.currentPage);
            params.set('sort_by', sorter.column);
            params.set('sort_desc', sorter.descending);

            // GET request from API
            let [response, items] = await api.get('/movies', params, true);

            // Clear cache if deleteCache is enabled

            if (deleteCache) {
                dispatch(clearCache());
            }

            dispatch({
                type: types.FETCH_ITEMS_DONE,
                payload: {
                    totalPages: parseInt(response.headers.get('X-Total-Pages')),
                    items
                }
            });
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function fetchItem(id) {
    return async (dispatch) => {
        try {
            let params = new Map();
            // params.set('expand', 'downloads');

            // GET request from API
            let item = await api.get(`/movies/${id}`, params);
            dispatch({
                type: types.FETCH_ITEM_DONE,
                payload: {
                    item
                }
            })
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function createItem(data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            })
            // POST request to API
            await api.post('/movies', params);
            browserHistory.push(`/movies`);

            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function updateItem(id, data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            });
            // PUT request to API
            await api.put(`/movies/${id}`, params);
            browserHistory.push(`/movies`);

            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function updateItemOrder(id, data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            params.set("fields_order",JSON.stringify(data));
            // PUT request to API
            await api.put(`/movies/${id}/order`, params);
            // browserHistory.push(`/movies/${id}`);

            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function validateItem(id, data) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            });
            // GET request to API
            let {fields, fieldsOrder, selectors, clauses, steps} = await api.post(`/halls/${id}/validate`, params);

            dispatch(clearCache());

            dispatch({
                type: types.VALIDATE_ITEM_DONE,
                payload: {
                    fields,
                    fieldsOrder,
                    selectors,
                    clauses,
                    steps,
                }
            });
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function uploadItemLogo(id, file) {
    return async (dispatch) => {
        try {
            let params = new Map();
            params.set('file', file);
            // POST request to API
            await api.postFiles(`/movies/${id}/image`, params);

            dispatch(fetchItem(id));
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function createItemWithLogo(data, file) {
    return async (dispatch) => {
        try {
            let params = new Map();
            _.map(data, (value, key) => {
                params.set(key, value);
            })
            // POST request to API
            let item = await api.post('/movies', params);
            browserHistory.push(`/movies`);

            params = new Map();
            params.set('file', file);
            // POST request to API for Upload
            await api.postFiles(`/movies/${item.id}/image`, params);

            dispatch(fetchItem(item.id));
            dispatch(exceptionsActions.clear());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}

export function deleteItem(id) {
    return async (dispatch) => {
        try {
            // DELETE request to API
            await api.delete('/movies/' + id);
            dispatch(fetchItems());
        } catch (e) {
            dispatch(exceptionsActions.process(e));
        }
    }
}