'use strict';

var Reflux = require('reflux');
var AdjustmentModalContainer = require('./itemAdjModal/modalContainer.jsx');

{
	....
}
<AdjustmentModalContainer onClose={this.closeMoreDialog} selectedData={this.state.checkedBox}
	manualPickupEligibleItems={this.state.allItems}
	orderSource={this.props.orders[0].orderSource}
	orderNo={this.props.orders[0].orderNo}
	title={'Manual Pickup'}/>
            
{
	....
}