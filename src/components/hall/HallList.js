import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './HallList.scss';

import Modal from 'boron/DropModal';

class HallList extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }
    getDocuments() {
        if (this.props.items) {
            return _.map(this.props.items, (item) => {
                return (
                    <tr key={ item.id }>
                        <td>
                            <div className="details">
                                <div className="name">
                                    { item.color }
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="details">
                                <div className="name">
                                    { item.size }
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
        browserHistory.push(`/halls/${id}`);
    }

    render() {
        let deleteModalContent = this.props.currentItem ? (
            <span>
                <h2>Are you Sure that you want to delete {this.props.currentItem.color} hall ?</h2>
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
                            <th>Color</th>
                            <th>Hall size</th>
                            <th></th>
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

HallList.propTypes = {
    items: React.PropTypes.array.isRequired,
    setCurrentItemId: React.PropTypes.func.isRequired,
    unsetCurrentItemId: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    currentItem: React.PropTypes.object,
};

export default HallList;