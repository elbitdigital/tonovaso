
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

		// global list view list
		this.viewList = [];

		// a diferença entre viewList e list, é que na list, ficam armazenados os dados 'seguros', na listView, os dados são apenas ordenados

		this.config = {
			orderType: 'time',
			orderReverse: false,
			approvedOnly: true,
			hiddenCanceled: true
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

			// se não tiver uma viewList, cria uma
			if (!this.viewList.length)
				this.buildViewList();

			var self = this;

			// função para fazer o append dos items dentro da lista, usada no próximo for
			function appendOrderItem(orderItemElement) {

				self.element.appendChild(orderItemElement);

			}

			for (var i = 0; i < this.viewList.length; i++) {

				// permite apenas transações com estado
				if (!!this.list[i].status) {

					var addToViewList = false;

					// permite apenas transações com nome parecido com a findString
					if (this.list[i].clientName)
						addToViewList = this.list[i].clientName.toLowerCase().includes(findString);

					if (this.config.hiddenCanceled && !findString.length)
						if (this.list[i].status == 'Cancelada' || this.list[i].status == 'Pagamento negado pela empresa de cartão de crédito')
							addToViewList = false;

					if (addToViewList)
						appendOrderItem(this.list[i].element);

				}

			}

		}

	};

	OrderList.prototype.buildViewList = function () {

		var viewList = this.list;

		viewList.sort(function (a, b) {

			if (a.clientName > b.clientName) {
				return 1;
			}
			if (a.clientName < b.clientName) {
				return -1;
			}
			// a must be equal to b
			return 0;

		});

		this.viewList = viewList;

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

			if (!self.locked) {
				self.buildViewList();
				self.build();
			}

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