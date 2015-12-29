var Select = require('react-select');
var ReactBootstrap = require("react-bootstrap"), Modal = ReactBootstrap.Modal, Input = ReactBootstrap.Input, Alert = ReactBootstrap.Alert, Button = ReactBootstrap.Button;
var ItemTable = require('./ItemTable')
var _ = require('underscore');
var mapPickupObjsByPrimeLineNo = require('./dataHandler');
var sunmitPayload = require('./submitPayload');
var securityStore = require('../../../stores/securityStore');
var SuperModal = require('../../return/superModal.jsx');
var Spinner = require('../../../components/spinner');

var AdjustmentModalContainer = React.createClass({
    getInitialState: function () {
        return { itemHashmap:{}, 
                 loading: false,
                 isModalOpen: false,
                 rechargeData: []
                }
    },    
    componentWillMount: function(){
        var manualPickupEligibleItems = _.clone(this.props.manualPickupEligibleItems);
        var selectedData = _.clone(this.props.selectedData);
        var mapedPikupItem = mapPickupObjsByPrimeLineNo(manualPickupEligibleItems, selectedData);
        this.setState({itemHashmap: mapedPikupItem});
    },
    closeDialog: function (data) {
        this.props.onClose(data);
    },
    toggleIsLoad: function(){
        this.setState({loading: !this.state.loading});
    },
    _handleToggle: function () {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    },
    renderSuperModal: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }
        return (
            <SuperModal handleToggle={this._handleToggle} doSubmit={this._submit} items={this.state.rechargeData.length}
                warningMsg={'Please review all items before selecting "Approve". No further changes will be possible after you login and approve.'}/>
        );
    },
    _submit: function(supervisorId) {
        this.props.submitPayload(this.state.rechargeData, this.closeDialog, this.props.orderNo, this.toggleIsLoad, this.props.orderSource, supervisorId);
    },
    changeHandler: function(arg) {
        var that = this;
        var actions = {
            checkBox: function(item){
                item.toggleSelection();
                this.setState({itemHashmap: this.state.itemHashmap});
            },
            unselectItemBtn: function(item){
                item.toggleSelection();
                this.setState({itemHashmap: this.state.itemHashmap});
            },
            qtyDropDown: function(item, newQty){
                item.updateSelectedQty(newQty);
                this.setState({itemHashmap: this.state.itemHashmap});
            },
            confirmSubmit: function(data){
                this.state.rechargeData = data;
                this.setState({rechargeData: this.state.rechargeData});
                if (this.props.accessControl && !securityStore.isAdmin()) {
                    this._handleToggle();
                } else
                    this._submit();
            },
            cancelModal: function(data){
                this.closeDialog(data);
            }
        }
        return actions[arg].bind(this);
    },
    render:function(){
        var selectedItemWarning = "Do you want to update the status of the following to picked up? Once completed it cannot be undone.";
        var submitSpinner = this.state.loading ? <Spinner/> : <span></span>;
        return(
            <Modal title = {this.props.title} animation={false} onRequestHide={this.closeDialog}>
                { this.state.loading ? <Spinner/> : ( <div className='modal-body'>
                    <ItemTable type = 'SelectedItem' items = {this.state.itemHashmap} changeHandler={this.changeHandler} warningMsg={selectedItemWarning}/>
                    <ItemTable type = 'NonEligible' items = {this.state.itemHashmap} changeHandler={this.changeHandler}/>
                    <ItemTable type = 'UnSelected' items = {this.state.itemHashmap} changeHandler={this.changeHandler}/>
                </div> ) }
            </Modal>
        );
    }
});

module.exports = AdjustmentModalContainer;

