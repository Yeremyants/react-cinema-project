import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import { browserHistory } from 'react-router';
import _ from 'lodash';

let modal,templateData;

class MovieForm extends Component {

    state = {
        currentItemLoaded: false,
        form: {
            start_time: '',
            duration: '',
            date: '',
            name: '',
            price: '',
            hall_id : ''
        },
        currentRule: {},
    };
    componentDidMount() {
        modal = this.refs.orderFieldsModal;
        this.tryLoadCurrentItem();
    }

    componentDidUpdate() {
        this.tryLoadCurrentItem();
    }

    constructor(props) {
        super(props);
        autoBind(this);
    }

    tryLoadCurrentItem() {
        if (this.props.currentItem && !this.state.currentItemLoaded) {
            let form = _.extend({}, this.state.form);
            let payed;
            _.map(this.state.form, (value, key) => {
                form[key] = (this.props.currentItem[key]) ? this.props.currentItem[key] : this.state.form[key];
                if (key === 'payed') payed = !!form[key];
            });

            this.setState({
                currentItemLoaded: true,
                form
            });
        }
    }

    hasError(inputName) {
        return (inputName === 'image') ? this.state.fileRejected : !!this.props.exceptions[inputName];
    }

    getErrorClass(inputName, defaultClasses = '') {
        return this.hasError(inputName) ? defaultClasses + ' has-error' : defaultClasses;
    }

    getErrorMessage(inputName) {
        if (inputName === 'template' && _.isObject(this.props.exceptions[inputName])) {
            return strings.get('Exceptions.notAddedRules');
        } else {
            return this.props.exceptions[inputName];
        }
    }
    handleInputChange(e) {
        let form = {};

        form[e.target.name] = e.target.value;
        this.setState({
            form: _.extend(this.state.form, form)
        });
    }

    handleSaveClick(e) {
        e.preventDefault();
        this.props.saveItem(this.state);
    }

    handleCancelClick(e) {
        e.preventDefault();
        browserHistory.push('/halls');
    }

    handleChange() {
        if (!this.state.form.read_more_link) {
            this.setState({
                checkedReadMore: !this.state.checkedReadMore
            })
        }
    }

    render() {
        let halls = _.map(this.props.halls,function (item) {
            return (
                <option value={item.id} key={item.id}>{item.color}</option>
            );
        });

        let nameLabel = this.hasError('name') ? `Name ${this.getErrorMessage('color')}` : 'Name';
        let startTimeLabel = this.hasError('start_time') ? `Color ${this.getErrorMessage('start_time')}` : 'Start Time';
        let durationLabel = this.hasError('duration') ? `duration ${this.getErrorMessage('duration')}` : 'duration';
        let dateLabel = this.hasError('date') ? `date ${this.getErrorMessage('date')}` : 'date';
        let priceLabel = this.hasError('price') ? `price ${this.getErrorMessage('price')}` : 'price';
        let hallLable = this.hasError('Hall') ? `Hall ${this.getErrorMessage('price')}` : 'Hall';
        return (
            <div className="DocumentForm row">
                <form>
                    <div className={ this.getErrorClass('name', 'form-group col-sm-12 col-md-10 col-lg-8') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="name" value={ this.state.form.name } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('start_time', 'form-group col-sm-12 col-md-10 col-lg-8') }>
                        <label className="control-label">{ startTimeLabel }</label>
                        <input className="form-control" type="time" name="start_time" value={ this.state.form.start_time } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('duration', 'form-group col-sm-12 col-md-10 col-lg-8') }>
                        <label className="control-label">{ durationLabel }</label>
                        <input className="form-control" type="text" name="duration" value={ this.state.form.duration } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('price', 'form-group col-sm-12 col-md-10 col-lg-8') }>
                        <label className="control-label">{ priceLabel}</label>
                        <input className="form-control" type="number" name="price" value={ this.state.form.price } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('price', 'form-group col-sm-12 col-md-10 col-lg-8') }>
                        <label className="control-label">{ dateLabel }</label>
                        <input className="form-control" type="date" name="date" value={ this.state.form.date } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('hall', 'form-group col-sm-12 col-md-10 col-lg-8') }>
                        <label className="control-label">{ hallLable }</label>
                        <select
                            className="form-control"
                            name="hall_id"
                            onChange={ this.handleInputChange }
                            value={this.state.currentItemLoaded ? this.state.form.hall_id : 0}
                        >
                            <option value="0"></option>
                            {halls}
                        </select>
                    </div>
                    <div className="form-actions col-sm-12">
                        <button className="btn btn-primary" onClick={ this.handleSaveClick }>Save</button>
                        <button className="btn btn-default" onClick={ this.handleCancelClick }>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

}

MovieForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
};

export default MovieForm;