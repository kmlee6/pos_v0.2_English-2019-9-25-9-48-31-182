'use strict';

const receiptTemplate = 
"***<store earning no money>Receipt ***\n\
<SUBTOTAL>\
----------------------\n\
<TOTALPRICE>\n\
**********************"

const subTotalTemplate = "Name：<NAME>，Quantity：<QUANTITY> <UNIT>，Unit：<PRICE> (yuan)，Subtotal：<SUBTOTAL> (yuan)"
const totalPriceTemplate = "total price：<TOTALPRICE> (yuan)"


function countByBarCode(inputs){
	let itemCount = [...new Set(inputs)]
							.map(targetId => {
								return {id: targetId, 
										count: inputs.filter(itemId => itemId===targetId).length};
							})
	return itemCount;
}

function mapItemById(itemCount){
	let itemDetails = loadAllItems()
	itemDetails = new Map(itemDetails.map(item => [item.barcode, item]))
	let items = itemCount.map(targetItem => {
							let item = itemDetails.get(targetItem.id);
							item.totalCount=targetItem.count;
							return item;
						 })
	return items;
}

function getItemByBarcode(inputs){
	let itemCount = countByBarCode(inputs);
	let items = mapItemById(itemCount);
	return items;
}

function calculatePrice(items){
	let totalPrice = items.map(item => {
								item.subTotal = item.price*item.totalCount;
								return item
							})
						  .reduce((total, item) => {
						  		return total+item.subTotal
						  	}, 0)
	return {subTotal: items, totalPrice: totalPrice};
}

function generateReceipt(subTotal, totalPrice){
	let subTotalString = subTotal.map(item => {
									const plurality = item.totalCount>1?"s":"";
									return subTotalTemplate
												.replace("<NAME>", item.name)
												.replace("<QUANTITY>", item.totalCount)
												.replace("<UNIT>", item.unit+plurality)
												.replace("<PRICE>", item.price.toFixed(2))
												.replace("<SUBTOTAL>", item.subTotal.toFixed(2))
									})
								  .reduce((subTotalString, subString) => {return subTotalString+subString+"\n"}, "");
	let totalPriceString = totalPriceTemplate.replace("<TOTALPRICE>", totalPrice.toFixed(2));
	let receipt = receiptTemplate
						.replace("<SUBTOTAL>", subTotalString)
						.replace("<TOTALPRICE>", totalPriceString)
	return receipt;
}

function printReceipt(inputs) {
	let items = getItemByBarcode(inputs);
	let {subTotal, totalPrice} = calculatePrice(items);
	let receipt = generateReceipt(subTotal, totalPrice)
	console.log(receipt)
}
