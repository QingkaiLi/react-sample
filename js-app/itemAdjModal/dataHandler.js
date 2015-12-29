var _ = require('underscore');

function manualPickupItemObj (USItemID, originalPrimeLineNo, productName, Quantity, purchaseOrderNo, packageASN,
              isSelectedBol, isElegible, purchaseOrderShipmentLines, tracking, lineId, originalOrderNo) {
   // debugger;
    this.usItemID = USItemID;
    this.primeLineNo = originalPrimeLineNo;
    this.productName = productName;
    this.Quantity = Quantity;
    this.purchaseOrderNo = purchaseOrderNo;
    this.packageASN = packageASN;
    this.SelectedItem = isSelectedBol;
    this.UnSelected = !this.SelectedItem && isElegible;
    this.NonEligible = !isElegible;
    this.selectedQty = 0;
    this.purchaseOrderShipmentLines = purchaseOrderShipmentLines;
    this.tracking = tracking;
    this.lineId = lineId;
    this.subOrderNo = originalOrderNo;
 }

 manualPickupItemObj.prototype.toggleSelection = function(){
    this.SelectedItem = !this.SelectedItem; 
    this.UnSelected = !this.UnSelected; 
 }
 manualPickupItemObj.prototype.updateSelectedQty = function(newQty){
    // is this necessary?
    //if(newQty <= this.cancellableQty){
        this.selectedQty = newQty;
    //}
 }


var mapSelectedObjsByPrimeLineNo = function(selectedItemObj){
    var selectedOrderStorage = {};

    for(var index in selectedItemObj){
        var itemKey = selectedItemObj[index].lineId;
        selectedOrderStorage[itemKey] = {productName: selectedItemObj[index].productName, usItemId: selectedItemObj[index].usItemId};
    }
    return selectedOrderStorage;
}

var mapPickupObjsByPrimeLineNo = function(pickupItemsObj, selectedItemObj){
    var userSelection = mapSelectedObjsByPrimeLineNo(selectedItemObj);
    var manualPickupItemStorage = []; 
    for (var key in pickupItemsObj) {
      if (pickupItemsObj.hasOwnProperty(key)) {

        var orderPrimeLine = pickupItemsObj[key].primeLineNo;
        var usItemId = pickupItemsObj[key].usItemId;
        var productName = pickupItemsObj[key].productName;
        var Quantity = pickupItemsObj[key].purchaseOrderShipmentLines && pickupItemsObj[key].purchaseOrderShipmentLines[0].quantity.measurementValue;
        var isSelectedBol = userSelection[key] && pickupItemsObj[key].manualPickupEligible ? true : false;
        var isElegible = pickupItemsObj[key].manualPickupEligible;
        var purchaseOrderNo = pickupItemsObj[key].purchaseOrderNo;

        var packageASN = pickupItemsObj[key].packageASN;
        var purchaseOrderShipmentLines = pickupItemsObj[key].purchaseOrderShipmentLines &&  pickupItemsObj[key].purchaseOrderShipmentLines;
        var tracking = pickupItemsObj[key].tracking;
        var subOrderNo = pickupItemsObj[key].subOrderNo;
        manualPickupItemStorage.push (
            new manualPickupItemObj(usItemId, orderPrimeLine, productName, Quantity, purchaseOrderNo, packageASN, isSelectedBol,
                isElegible, purchaseOrderShipmentLines, tracking,key, subOrderNo) );

      }
    }
    //console.log('==============================>');

    return manualPickupItemStorage;
}

exports.mapPickupObjsByPrimeLineNo = mapPickupObjsByPrimeLineNo;

