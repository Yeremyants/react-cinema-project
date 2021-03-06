import React, { Component } from 'react';
import autoBind from 'react-autobind';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './MovieList.scss';

import Modal from 'boron/DropModal';

class MoviesList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }
    getHall(id){
        if (this.props.halls && typeof this.props.halls !== "undefined"){
            for (let i = 0 ; i < this.props.halls.length ; i ++){
                if (this.props.halls[i].id === id){
                    return this.props.halls[i].color;
                }
            }
        }
        return null;

    }

    getDocuments() {
        if (this.props.items) {
            return _.map(this.props.items, (item) => {
                return (
                    <tr key={ item.id }>
                        <td>
                            <div className="details">
                                <div className="name">
                                    { item.name }
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="details">
                                <div className="name">
                                    { item.start_time }
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="details">
                                <div className="name">
                                    { item.date }
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="details">
                                <div className="name">
                                    { item.duration } hours
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="details">
                                <div className="name">
                                    $ { item.price }
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="details">
                                <div className="name">
                                    {this.getHall(item.hall_id)}
                                </div>
                            </div>
                        </td>
                        <td>
                            <i onClick={() => this.handleEditClick(item.id)} className="btn btn-default edit-btn ion-edit"></i>
                            <i onClick={() => this.handleDeleteClick(item.id)} className="btn btn-default delete-btn ion-trash-b"></i>
                        </td>
                    </tr>
                );
            });
        }
    }

    showDeleteModal() {
        this.refs.deleteModal.show();
    }

    hideDeleteModal() {
        this.refs.deleteModal.hide();
    }

    handleDeleteClick(id) {
        this.props.setCurrentItemId(id);
        this.showDeleteModal();
    }

    handleConfirmDeleteClick() {
        this.props.deleteItem(this.props.currentItem.id);
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideDeleteModal();
    }

    handleCancelDeleteClick() {
        _.delay(() => this.props.unsetCurrentItemId(), 250);
        this.hideDeleteModal();
    }

    handleEditClick(id) {
        browserHistory.push(`/movies/${id}`);
    }

    render() {
        let deleteModalContent = this.props.currentItem ? (
            <span>
                <h2>Are you Sure that you want to delete {this.props.currentItem.name} Movie ?</h2>
                <div className="form-actions">
                    <button className="btn btn-lg btn-danger" onClick={ this.handleConfirmDeleteClick }>Delete</button>
                    <button className="btn btn-lg btn-default" onClick={ this.handleCancelDeleteClick }>Cancel</button>
                </div>
            </span>
        ) : null;

        return (
            <span className="DocumentList">
                <Modal className="boron-modal" ref="deleteModal">
                    { deleteModalContent }
                </Modal>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Movie Name</th>
                            <th>Start Time</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th>Hall</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.getDocuments() }
                    </tbody>
                </table>
            </span>
        );
    }
}

MoviesList.propTypes = {
    items: React.PropTypes.array.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    currentItem: React.PropTypes.object,
};

export default MoviesList;