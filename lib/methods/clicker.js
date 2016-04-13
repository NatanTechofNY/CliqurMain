Meteor.methods({
	resetClickerData: function(data) {
		if(typeof data.sessionId !== "string" || !Sessions.findOne({"sessionId": data.sessionId}))
			throw new Meteor.Error('Invalid session identifier');
		else if(Sessions.findOne({"sessionId": data.sessionId}).sessionOwnerId !== data.userId)
			throw new Meteor.Error('Unauthorized access.');

		Sessions.update({"sessionId": data.sessionId}, {$set: {clickerData: {responses: [], maxSeconds: 0}}});

	},
	addResponses: function(data){
		if(typeof data.sessionId !== "string" || !Sessions.findOne({"sessionId": data.sessionId}))
			throw new Meteor.Error('Invalid session identifier');
		else if(typeof data.respIndx !== "number" || data.respIndx < 0 || data.respIndx > 3)
			throw new Meteor.Error('Invalid response index');

		var usr = Usrs.findOne({"_id": data.userId, "studentId": data.studentId});
		if (!usr)
			throw new Meteor.Error('Invalid user identifier');

		var sess = Sessions.findOne({"sessionId": data.sessionId});
		if ((new Date()).getTime() - new Date(sess.clickerData.countDownSetAt).getTime() > (sess.clickerData.maxSeconds*1000) || !sess.clickerData.maxSeconds)
			throw new Meteor.Error('Voting Expired');


		var resps = sess.clickerData.responses;

		if (!resps) {
			resps = [];
		};
		
		resps.forEach(function(g, i) {
			if (g.studentId === data.studentId)
				resps.splice(i, 1);
		});

		resps.push({
			responseIndex: data.respIndx,
			userName: usr.fullName,
			studentId: data.studentId
		});

		Sessions.update({"sessionId": data.sessionId}, {$set: {clickerData: {maxSeconds: sess.clickerData.maxSeconds, countDownSetAt: sess.clickerData.countDownSetAt, responses: resps}}});
	},
	setTiming: function(data) {
		if(typeof data.sessionId !== "string" || !Sessions.findOne({"sessionId": data.sessionId}))
			throw new Meteor.Error('Invalid session identifier');
		else if(Sessions.findOne({"sessionId": data.sessionId}).sessionOwnerId !== data.userId)
			throw new Meteor.Error('Unauthorized access.');
		else if(typeof data.maxSecs !== "number" || isNaN(data.maxSecs) || data.maxSecs < 1) {
			throw new Meteor.Error('Invalid timer');
		};

		var $thisTime = data.thisTime
		if(!($thisTime instanceof Date)) $thisTime = new Date();


		var sess = Sessions.findOne({"sessionId": data.sessionId});
		Sessions.update({"sessionId": data.sessionId}, {$set: {clickerData: {responses: sess.clickerData.responses? sess.clickerData.responses: [], countDownSetAt: $thisTime, maxSeconds: data.maxSecs}}});
	}
	
});