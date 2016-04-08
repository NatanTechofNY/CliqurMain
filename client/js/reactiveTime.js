if (Meteor.isClient) {
	Meteor.setInterval(function() {
		Session.set("time", new Date().getTime());
	}, 1000);
};