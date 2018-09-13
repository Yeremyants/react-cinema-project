import _ from 'lodash';

export function getItems(state) {
    return state.movies.itemsById;
}

export function getItemsByPage(state, page) {
    if (!state.movies.idsByPage['_' + page]) {
        page = (getPagination(state)).previousPage;
    }
    return _.map(state.movies.idsByPage['_' + page], (itemId) => {
        return state.movies.itemsById['_' + itemId]
    })
}

export function getItemById(state, id) {
    return state.movies.itemsById['_' + id];
}

export function getCurrentItem(state) {
    return state.movies.currentItemId ? getItemById(state, state.movies.currentItemId) : null;
}

export function getFilters(state) {
    return state.movies.filters;
}

export function getPagination(state) {
    return state.movies.pagination;
}

export function getSorter(state) {
    return state.movies.sorter;
}

export function getFields(state){
    return state.movies.fields;
}