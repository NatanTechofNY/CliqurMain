if (Meteor.isServer) {
	Meteor.publish('userDoc', function (userId) {
		return Usrs.find({"_id": userId});
	});
	Meteor.publish('listOfUsers', function (userIds) {
		return Usrs.find({"_id": {"$in": userIds.list}});
	});


};