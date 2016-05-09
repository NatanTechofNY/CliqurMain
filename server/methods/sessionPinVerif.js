if (Meteor.isServer) {
	Meteor.methods({
		sesHasPin: function (sesid) {
			var ses = Sessions.findOne({"sessionId": sesid});

			return ses && ses.hasPin;
		},
		sessionHasGeoSecurity: function(sesid) {
			var ses = Sessions.findOne({"sessionId": sesid});

			return ses && typeof ses.sessLoc === "object";
		}
	});
};