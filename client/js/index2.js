if (Meteor.isClient) {
	Template.index2.helpers({
		currentYear: function () {
			return 1900 + new Date().getYear();
		}
	});
};