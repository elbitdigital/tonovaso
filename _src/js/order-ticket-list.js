
/* Order Ticket List */

var OrderTicketList = (function () {

	/**
	 * Order Ticket List constructor
	 * @constructor
	 */
	function OrderTicketList(element, orderItem) {

		var self = this;

		this.element = element;
		this.orderItem = orderItem;
		this.list = [];

		if (this.orderItem && this.element) {

			//console.log(data);
			database.ref('transactions/' + this.orderItem.reference + '/tickets/').on('child_added', function (snap) {

				var orderTicketItem = new OrderTicketItem(snap.val(), self.orderItem);
				self.push(orderTicketItem);

			});

		}

	}

	OrderTicketList.prototype.build = function () {

		this.element.innerHTML = '';

		for (var i = this.list.length; i--; )
			this.element.appendChild(this.list[i].element);

	};

	OrderTicketList.prototype.push = function (orderTicketItem) {

		this.list.push(orderTicketItem);
		this.build();

	};

	return OrderTicketList;

})();