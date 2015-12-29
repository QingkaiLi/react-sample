'use strict'
var _ = require('underscore');

var constructPayload = function(data){
    if (data && data.length === 0){
        return false
    }
    function splitBySubOrder() {
        var subOrder = {};
        for(var index in data) {
            if (subOrder[data[index].subOrderNo]) {
                subOrder[data[index].subOrderNo].push(data[index])
            } else
                subOrder[data[index].subOrderNo] = [data];
        }
        return subOrder;
    }

    function splitByPurchaseOrder(subOrder){
        var purchaseOrderObj = {}
        var outPut = [];
        for (var index in subOrder) {
            if(! purchaseOrderObj[data[index].purchaseOrderNo]){
                purchaseOrderObj[data[index].purchaseOrderNo] = {purchaseOrderNo:data[index].purchaseOrderNo,purchaseOrderShipments:buildPurchaseOrdershippmentByPackageASN()}
            } 

        }
        for (var key in purchaseOrderObj){
            if (purchaseOrderObj.hasOwnProperty(key)) {
                outPut.push(purchaseOrderObj[key]);
            }
            
        }
        // console.log('inside of splitByPurchaseOrder');
        // console.dir(outPut);
        return outPut;
    }

    function buildPurchaseOrdershippmentByPackageASN(){
        var orderShippmentObj = {}
        var outPut = [];
        for (var i in data) {
            if(! orderShippmentObj[data[i].packageASN]){
                orderShippmentObj[data[i].packageASN] = [ {packageASN: data[i].packageASN, poOrderLines: build_poOrderLines(data[i].packageASN), purchaseOrderShipmentLines: data[i].purchaseOrderShipmentLines } ]
            } 
        }
        for (var index in orderShippmentObj){
            if (orderShippmentObj.hasOwnProperty(index)) {
                outPut.push(orderShippmentObj[index]);
            }
        }
        return _.flatten(outPut);
    }
    
    
    function build_poOrderLines(packageASN){
        var output = [];
        for (var i in data) {
            if(data[i].packageASN === packageASN){
                output.push({primeLineNo: data[i].primeLineNo})
            }
        }
        return output;
    }


    var finalPayload = function() {
        var orders = [];
        var subOrderMap = splitBySubOrder();
        for (var index in subOrderMap) {
            orders.push({orderNo: index, orderSubGroups: [{purchaseOrders: splitByPurchaseOrder(subOrderMap[index]) } ]});
        }
        return {orders: orders}
    }


    return finalPayload();
}


var submitPayload = function(data, callback, orderNo, toggleSpinner){
    toggleSpinner();
    var url = '/api/orders/pickupFromStore';
    var payLoad = constructPayload(dt);
    // console.log('--------------> Making manual pickup request');
    // console.dir(payLoad);
    var that = this;

    $.ajax({
        url: url,
        dataType: 'json',
        headers: {'Content-Type': 'application/json; charset=UTF-8'},
        type: 'POST',
        data: JSON.stringify(payLoad),
        success: function (data) {
            console.log('MANUAL PICK COMPLETED:')
            console.dir(data);
            toggleSpinner();
            // will change when BE response is known
            callback({
                status: "success",
                lines: dt,
                manualPickUpSuccessful: {
                    msg: 'Manual pickup request has been submitted'
                }});
        },

        error: function (xhr, status, err) {
            if(xhr.status === '200'){
                toggleSpinner();
                callback({
                        manualPickUpSuccessful: {
                            msg: 'Manual pickup request has been submitted'
                        }
                    });
            }

            // console.log('MANUAL PICK FAILED, STATUS IS :')
            // console.dir(status);
            toggleSpinner();
            callback({
                manualPickUpFailed: {
                    msg: 'System Error. Please try again later or capture details and escalate.'
                }});
        }
    });

}



module.exports = submitPayload;