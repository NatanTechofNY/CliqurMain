Meteor.methods({
	createEvent: function(data) {
		
		if(Meteor.isServer){

			if(Events.find().count() !== 2176782336) {
				if(typeof data.eventName !== "string" || data.eventName.trim().length < 4)
					throw new Meteor.Error('Event name must be longer than 4 characters.');
				else if(typeof data.pin === "string" && (data.pin.length !== 4 || !/^\d+$/.test(data.pin)))
					throw new Meteor.Error('Pin must be four digits.');
				else if(!Usrs.findOne({"_id": data.eventOwnerCompanyId}))
					throw new Meteor.Error('Session owner does not exist');


				var sessionId;
				while(!Events.findOne({"eventId": eventId})){
					eventId = Random.hexString(6);
					if(!Events.findOne({"_id": eventId}))
						break;
				}


				var obj = {
					createdAt: new Date(),
					eventId: eventId,
					eventName: data.eventName,
					eventOwnerCompanyId: data.eventOwnerCompanyId,
					userList: [{
						attendeeId: data.attendeeId,
						userId: data.eventOwnerCompanyId
					}],
					clickerData: {
						countDownSetAt: new Date(),
						responses: []
					},
				attendeeCount: data.attendeeCount,
				typeOfEvent: data.typeOfEvent
				};
				if (typeof data.pin === "string") {obj.pin = data.pin; obj.hasPin = true;};
				Events.insert(obj);


				return sessionId;

			}
			else throw new Meteor.Error('Out of session for the day. Please try again later.');
		}
	},
	removeAttendeeFromSession: function(data) {
		if(typeof data.userId !== "string" || !data.userId.trim().length)
			throw new Meteor.Error('Invalid student identifier');
		else if(typeof data.eventId !== "string" || !Events.findOne({"_id": data.eventId}))
			throw new Meteor.Error('Invalid session identifier');

		var sessionItem =  Events.findOne({"_id": data.eventId});
		if (sessionItem.eventOwnerCompanyId === data.userId)
			throw new Meteor.Error('Cannot remove event owner from event.');
		else{
			var idx = -1;
			sessionItem.userList.forEach(function(g, ix) {
				if (g.userId === data.userId){
					idx = ix;
					return true;
				};
			});

			if (idx !== -1) {
				sessionItem.userList.splice(idx, 1);
				Events.update({"_id": data.eventId}, {$set: {"userList": sessionItem.userList}});
			};

		};

	}
});