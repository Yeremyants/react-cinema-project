import _ from 'lodash';

export function getItems(state) {
	return state.halls.itemsById;
}

export function getItemsByPage(state, page) {
	if (!state.halls.idsByPage['_' + page]) {
		page = (getPagination(state)).previousPage;
	}
	return _.map(state.halls.idsByPage['_' + page], (itemId) => {
		return state.halls.itemsById['_' + itemId]
	})
}

export function getItemById(state, id) {
	return state.halls.itemsById['_' + id];
}

export function getCurrentItem(state) {
	return state.halls.currentItemId ? getItemById(state, state.halls.currentItemId) : null;
}

export function getFilters(state) {
	return state.halls.filters;
}

export function getPagination(state) {
	return state.halls.pagination;
}

export function getSorter(state) {
	return state.halls.sorter;
}

export function getFields(state){
    return state.halls.fields;
}

export function getFieldsOrder(state){
    return state.halls.fieldsOrder;
}

export function getSelectors(state){
    return state.halls.selectors;
}

export function getClauses(state){
    return state.halls.clauses;
}

export function getSteps(state){
    return state.halls.steps;
}