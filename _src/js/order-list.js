
/* Order List */

var OrderList = (function () {

	/**
	 * Order List constructor
	 * @constructor
	 */
	function OrderList(element, database) {

		this.element = element;
		this.database = database;

		// bloqueia o build enquanto o delay de 3000 milisegundos não passar
		this.locked = true;

		// global list
		this.list = [];

		// global list view
		this.view = [];

		this.config = {
			orderType: 'time',
			orderReverse: false,
			approvedOnly: true
		}

	}

	/**
	 * build the list
	 * se tiver uma findString, a função mostra apenas entradas com nome que inclua a string
	 * @param findString {String}
	 */
	OrderList.prototype.build = function (findString) {

		// fix findString value
		findString = !!findString ? findString.toLowerCase() : '';

		this.element.innerHTML = '';

		if (!this.locked) {

			var self = this;

			function appendOrderItem(orderItemElement) {

				self.element.appendChild(orderItemElement);

			}

			for (var i = this.list.length; i--; ) {

				// permite apenas transações com estado
				if (!!this.list[i].status) {

					var addToViewList = false;

					// permite apenas transações com nome parecido com a findString
					if (this.list[i].clientName)
						addToViewList = this.list[i].clientName.toLowerCase().includes(findString);

					if (addToViewList)
						appendOrderItem(this.list[i].element);

				}

			}

		}

	};

	OrderList.prototype.buildViewList = function () {



	};

	OrderList.prototype.isInList = function (orderItem) {

		var filterItemReference = this.list.filter(function (orderListItem) {

			return orderListItem.reference == orderItem.reference;

		});

		return !!filterItemReference.length;

	};

	OrderList.prototype.push = function (orderItem) {

		// check if order item is on order list
		if (!this.isInList(orderItem))
			this.list.push(orderItem);

	};

	OrderList.prototype.start = function () {

		var self = this;

		this.database.ref('transactions/').on('child_added', function (snap) {

			// create the order item object
			var orderItem = new OrderItem(snap.val());

			// push order item object to order list
			self.push(orderItem);

			document.getElementById('orderList-count').innerText = self.list.length + ' registro processados';

			if (!self.locked)
				self.build();

			if (!snap.val().reference)
				console.log(snap.key);

		});

		setTimeout(function () {

			self.locked = false;
			self.build();

		}, 3000);

	};

	return OrderList;

})();