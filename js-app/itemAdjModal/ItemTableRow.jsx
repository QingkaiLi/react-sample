var QtyAdjustmentComponent = require('./QtyAdjustmentComponent');
var securityStore = require('../../../stores/securityStore');

var ItemTableRow = React.createClass({

    render:function(){
    	var item = this.props.item;
    	var changeHandler = this.props.changeHandler;
        var lineId = item.lineId;
        var tableRowCheckBox = '';
        var tableRowQty = '';
        var loginSpoof = securityStore.getSpoofPrefix();
        var urlSpoof = 'http://'+loginSpoof+'walmart.com/ip/' + item.usItemID;

        if (this.props.type === 'UnSelected'){
            tableRowCheckBox =   <td className="line_cb"><input type='checkbox'
                                        onClick={this.props.changeHandler('checkBox').bind(this, item)}/>
                                 </td>;
            tableRowQty = <td className="line_qty"> {item.Quantity}</td>
        }
        if (this.props.type === 'SelectedItem'){
            tableRowQty =  <QtyAdjustmentComponent item = {item} changeHandler = {changeHandler} />
        }
        var usItemNumber =  <td className="line_id" style={{'font-weight': 'bold'}} >
                                <a href={urlSpoof} target= "_blank"> {item.usItemID} </a>
                            </td>
        return(
            <tr key={lineId}>
                {tableRowCheckBox}
                {usItemNumber}
                <td className="line_name" style={{'font-weight': 'bold'}}>{item.productName}</td>
                {tableRowQty}
            </tr>
        );
    }
});
module.exports = ItemTableRow;
