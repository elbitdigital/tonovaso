

/* Order Ticket Item */

var OrderTicketItem = (function () {

	/**
	 * Order Ticket Item constructor
	 * @constructor
	 */
	function OrderTicketItem(data, orderItem) {

		var self = this;

		if (data && orderItem) {

			this.orderItem = orderItem;

			this.reference = data.reference;
			this.id = data.id;
			this.amount= data.amount;
			this.description = data.description;

			this.createElement();

			database.ref('transactions/' + this.orderItem.reference + '/tickets/' + data.reference + '/').child('shipped').on('value', function (snap) {

				self.updateShippingStatus(snap.val());

			});

		}

	}

	OrderTicketItem.prototype.updateShippingStatus = function (data) {

		this.shipping = data;

		if (!this.shipping) {

			this.element.innerHTML = "<span>" + this.id + "</span>";
			this.element.innerHTML += "<button>" + 'RETIRAR' + "</button>";

		}

	};

	OrderTicketItem.prototype.createElement = function () {

		this.element = document.createElement('div');
		this.element.className  = 'OrderTicketItem';
		this.element.dataset.itemReferenceId = this.reference;

	};

	return OrderTicketItem;

})();