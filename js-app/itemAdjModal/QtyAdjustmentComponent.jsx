var Select = require('react-select');
var ReactBootstrap = require("react-bootstrap"), Input = ReactBootstrap.Input, Alert = ReactBootstrap.Alert, Button = ReactBootstrap.Button;
var ItemTableRow = require('./ItemTableRow');

var QtyAdjustmentComponent = React.createClass({

    getOptions: function (Qty) {
        var selectOptions = [];
        for (var i = 0; i < Qty + 1; i++) {
            selectOptions.push(<option value={i}>{i}</option>);
        }
        return selectOptions;
    },
    qtyChange: function(val) {
        this.props.changeHandler('qtyDropDown')(this.props.item, val.target.value);
    },
    unSelectItem: function(item){
    	this.props.changeHandler('unselectItemBtn')(item);
    },
    render: function(){
        var item = this.props.item;
        return(
                <td className="line_qty">
                    <div style={{'display':'-webkit-inline-box'}}>
                    {this.props.richQty && item.Quantity > 1?
                        <Input type='select' onChange={this.qtyChange}
                            placeholder='select'>
                                {this.getOptions(item.Quantity)}
                        </Input>:
                        item.Quantity}
                    <Button bsStyle='danger' bsSize="xsmall" onClick={this.unSelectItem.bind(this, item)}> X </Button>
                    </div>
                </td>

            );
    }
});

module.exports = QtyAdjustmentComponent;