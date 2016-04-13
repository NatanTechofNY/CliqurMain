Meteor.methods({
	addBizUser: function(data) {
		if(Meteor.isServer){
			if (typeof data.fullName !== "string" || !data.fullName.trim().length) {
				throw new Meteor.Error('Please provide valid full name.')
			} else if(typeof data.attendeeId !== "string" || !data.attendeeId.trim().length) {
				throw new Meteor.Error('Please provide valid ID');
			}



			var userId = Usrs.insert({
				createdAt: new Date(),
				fullName: data.fullName,
				attendeeId: data.attendeeId,
				verificationId: data.verificationId
			});


			if (Events.findOne({"eventId": data.eventToAddToId})) {
				var list = Events.findOne({"eventId": data.eventToAddToId});
				if(data.attendeeId === 'EventOwner' && list.userList.length !== 0) {
					throw new Meteor.Error('Invalid event ID');
				}


				if (list.hasPin && list.pin.toString() !== data.pinr.toString())
					throw new Meteor.Error('Incorrect PIN. Try again.');

				list = list.userList;
				var containsIndex = -1;
				if (list.some(function(g, idx) {
					if (g.studentId === data.attendeeId) {
						containsIndex = idx;
						return true;
					};
				})) {
					list.slice(containsIndex, 1);
				};

				list.push({
					userId: userId,
					attendeeId: data.attendeeId
				});

				Events.update({"eventId": data.eventToAddToId}, {$set: {"userList": list}});

			}
			else if(typeof data.eventToAddToId === 'string' && data.eventToAddToId.length) {
				throw new Meteor.Error('Event pertaining to given session ID could not be found.');
			};
			return userId;
		}
	}
});