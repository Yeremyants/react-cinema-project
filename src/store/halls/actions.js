import { browserHistory } from 'react-router';
import api from '../../services/api';
import language from '../../services/language';
import _ from 'lodash';

import * as hallsSelectors from './selectors';
import * as exceptionsActions from '../exceptions/actions';

export const types = {
	FETCH_ALL_ITEMS_DONE: 'halls.FETCH_ALL_ITEMS_DONE',
	FETCH_ITEMS_DONE: 'halls.FETCH_ITEMS_DONE',
	FETCH_ITEM_DONE: 'halls.FETCH_ITEM_DONE',
	VALIDATE_ITEM_DONE: 'halls.VALIDATE_ITEM_DONE',
	SET_SORTER: 'halls.SET_SORTER',
	SET_SEARCH_TERM: 'halls.SET_SEARCH_TERM',
	SET_CATEGORY_ID: 'halls.SET_CATEGORY_ID',
	SET_CURRENT_PAGE: 'halls.SET_CURRENT_PAGE',
	SET_CURRENT_ITEM_ID: 'halls.SET_CURRENT_ITEM_ID',
	TOGGLE_SORTER: 'halls.TOGGLE_SORTER',
	CLEAR_CACHE: 'halls.CLEAR_CACHE',
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

			let items = await api.get('/halls', params);
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
			let filters = hallsSelectors.getFilters(state);
			let sorter = hallsSelectors.getSorter(state);
			let pagination = hallsSelectors.getPagination(state);
			// params.set('expand', 'downloads');
			params.set('page_size', pagination.pageSize);
			params.set('page_number', deleteCache ? 1 : pagination.currentPage);
			params.set('sort_by', sorter.column);
			params.set('sort_desc', sorter.descending);

			// GET request from API
			let [response, items] = await api.get('/halls', params, true);

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
			let item = await api.get(`/halls/${id}`, params);
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
			await api.post('/halls', params);
			browserHistory.push(`/halls`);

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
			await api.put(`/halls/${id}`, params);
			browserHistory.push(`/halls`);
			
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
			await api.put(`/halls/${id}/order`, params);
			// browserHistory.push(`/halls/${id}`);

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
			await api.postFiles(`/halls/${id}/image`, params);

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
			let item = await api.post('/halls', params);
			browserHistory.push(`/halls`);

			params = new Map();
			params.set('file', file);
			// POST request to API for Upload
			await api.postFiles(`/halls/${item.id}/image`, params);

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
			await api.delete('/halls/' + id);
			dispatch(fetchItems());
		} catch (e) {
			dispatch(exceptionsActions.process(e));
		}
	}
}