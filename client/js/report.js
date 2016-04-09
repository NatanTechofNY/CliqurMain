if (Meteor.isClient) {
	Template.report.helpers({
		thisTime: function () {
			return moment().format('LL');
		},
		usr: function () {
			return this.valueOf();
		}
		

	});

};


