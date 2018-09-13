import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import strings from '../../services/strings';
import language from '../../services/language';
import { browserHistory } from 'react-router';
import _ from 'lodash';

class HallForm extends Component {

    state = {
        currentItemLoaded: false,
        form: {
            color: '',
            size: '',
        },
        currentRule: {},
    };
    componentDidMount() {
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
    render() {
        let nameLabel = this.hasError('color') ? `Color ${this.getErrorMessage('color')}` : 'Color';
        let sizeLabel = this.hasError('size') ? `Size ${this.getErrorMessage('size')}` : 'Size';
        return (
            <div className="DocumentForm row">
                <form>
                    <div className={ this.getErrorClass('color', 'form-group col-sm-12 col-md-10 col-lg-8') }>
                        <label className="control-label">{ nameLabel }</label>
                        <input className="form-control" type="text" name="color" value={ this.state.form.color } onChange={ this.handleInputChange } />
                    </div>
                    <div className={ this.getErrorClass('size', 'form-group col-sm-12 col-md-10 col-lg-8') }>
                        <label className="control-label">{ sizeLabel }</label>
                        <input className="form-control" type="number" name="size" value={ this.state.form.size } onChange={ this.handleInputChange } />
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

HallForm.propTypes = {
    exceptions: React.PropTypes.object.isRequired,
    saveItem: React.PropTypes.func.isRequired,
};

export default HallForm;