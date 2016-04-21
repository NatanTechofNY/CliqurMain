Meteor.methods({
	resetClickerData: function(data) {

		// this method is depricated
		if(typeof data.sessionId !== "string" || !Sessions.findOne({"sessionId": data.sessionId}))
			throw new Meteor.Error('Invalid session identifier');
		else if(Sessions.findOne({"sessionId": data.sessionId}).sessionOwnerId !== data.userId)
			throw new Meteor.Error('Unauthorized access.');

		var objj = Sessions.findOne({"sessionId": data.sessionId}).clickerData;
		objj.maxSeconds = 0;
		delete objj["countDownSetAt"];
		objj.sets.push({
			responses: [],
			question: ""
		});
		Sessions.update({"sessionId": data.sessionId}, {$set: {clickerData: objj}});

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

		var setitems = sess.clickerData.sets;

		var resps = setitems[setitems.length - 1].responses;

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

		setitems[setitems.length - 1].responses = resps;

		Sessions.update({"sessionId": data.sessionId}, {$set: {clickerData: {maxSeconds: sess.clickerData.maxSeconds, countDownSetAt: sess.clickerData.countDownSetAt, sets: setitems}}});
	},
	setTiming: function(data) {
		if(typeof data.sessionId !== "string" || !Sessions.findOne({"sessionId": data.sessionId}))
			throw new Meteor.Error('Invalid session identifier');
		else if(Sessions.findOne({"sessionId": data.sessionId}).sessionOwnerId !== data.userId)
			throw new Meteor.Error('Unauthorized access.');
		else if(typeof data.maxSecs !== "number" || isNaN(data.maxSecs) || data.maxSecs < 1) {
			throw new Meteor.Error('Invalid timer');
		}
		else if(typeof data.questionItem !== "string")
			throw new Meteor.Error("Invalid question string");

		var sess = Sessions.findOne({"sessionId": data.sessionId});

		if (data.isResetPoll) {
			var objj = sess.clickerData;
			objj.maxSeconds = 0;
			delete objj["countDownSetAt"];
			objj.sets.push({
				responses: [],
				question: ""
			});
			sess.clickerData = objj;
		};

		var $thisTime = data.thisTime
		if(!($thisTime instanceof Date)) $thisTime = new Date();

		var setits = sess.clickerData.sets;
		if (setits) setits[setits.length - 1].question = data.questionItem;
		else setits = [{responses: [], question: data.questionItem}];
		Sessions.update({"sessionId": data.sessionId}, {$set: {clickerData: {sets: setits, countDownSetAt: $thisTime, maxSeconds: data.maxSecs}}});



	}
	
});