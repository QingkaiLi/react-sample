var Select = require('react-select');
var ReactBootstrap = require("react-bootstrap"), Modal = ReactBootstrap.Modal, Input = ReactBootstrap.Input, Alert = ReactBootstrap.Alert, Button = ReactBootstrap.Button;
var ItemTableRow = require('./ItemTableRow');
var QtyAdjustmentComponent = require('./QtyAdjustmentComponent');

var ItemTable = React.createClass({
    getInitialState: function () {
        return {hasError: false}
    },
    constructContent: function(){
        var tableHeaderCheckBox = this.props.type === 'UnSelected' ? <th className="line_cb"></th> : ''; 
        var tableHeaderQty = this.props.type === 'NonEligible' ?  '' : <th className="line_qty"> Qty</th>;
        var type = this.props.type;
        var tableData = this.props.items.filter(function(item){
            return item[type] === true 
        });

        var tableRows = tableData.map(function(row){
            return <ItemTableRow type = {type} item = {row} changeHandler={this.props.changeHandler} />
        }.bind(this));

        return {
                tableData: tableData,
                tableRows: tableRows,
                tableHeaderCheckBox: tableHeaderCheckBox,
                tableHeaderQty: tableHeaderQty,
                type: type
                };
    },
    submit: function(tableContent){
        var dt = tableContent.tableData;
        var flag = true;
        var that = this;

        if (this.props.richProps) {
            for (var i in dt) {
                var line = dt[i];
                if (line.selectedQty < 1 || (that.props.richProps.notesAllow && line.noteText == '')) {
                    flag = false;
                    break;
                }
            }
        }

        if (flag) this.props.changeHandler('confirmSubmit')(dt)
        else {
            this.setState({hasError: true});
        }
    },

    render:function(){
        var tableContent = this.constructContent();
        var renderedContent = null;
        //console.dir(tableContent.tableRows);
        if (tableContent.tableRows.length > 0){
            renderedContent =   <div>
                                    {this.props.type === 'SelectedItem' && this.props.warningMsg ? <Alert bsStyle='warning'>{this.props.warningMsg}</Alert> : null }
                                    {this.props.type === 'SelectedItem' && this.state.hasError ? <Alert bsStyle='danger'>Please select quantity and enter notes</Alert> : null }
                                    {this.props.type === 'NonEligible' ? <p>You selected the following item(s) which are not eligible so have 
                                    been removed</p> : null }       
                                    {this.props.type === 'UnSelected' ? <p bsStyle='warning'>
                                        {this.props.warningMsg || 'The following items are eligible to be manually updated to "Picked Up".'} Add
                                    to the above list if you need to update the status on one or more of them</p> : null }
                                    
                                    <table className="table dataTable" id="datatable" aria-describedby="datatable_info">
                                        <thead>
                                        <tr role="row">
                                            {tableContent.tableHeaderCheckBox}
                                            <th className="line_id">Item ID</th>
                                            <th className="line_name">Item Name</th>
                                            {tableContent.tableHeaderQty}
                                        </tr>
                                        </thead>
                                        <tbody role="alert" aria-live="polite" aria-relevant="all">
                                            {tableContent.tableRows}
                                        </tbody>
                                    </table> 
                                    <Modal.Footer style={{'text-align':'left'}}>
                                        {this.props.type === 'SelectedItem' ?
                                            <div>
                                                <button className="btn btn-primary" onClick={this.submit.bind(this, tableContent)}>
                                                    Confirm
                                                </button>
                                                <a className="btn btn-default" onClick={this.props.changeHandler('cancelModal').bind(this, {})}>Cancel</a></div> : ''}

                                    </Modal.Footer>
                                </div>
                            
        } else {
            renderedContent = null;  
        }
        return(
            <div>
                {renderedContent}
            </div>
        );
    }
});
module.exports = ItemTable;











