Meteor.methods({
	addUser: function(data) {
		if(Meteor.isServer){
			if (typeof data.fullName !== "string" || !data.fullName.trim().length) {
				throw new Meteor.Error('Please provide valid full name.')
			} else if(typeof data.studentId !== "string" || !data.studentId.length) {
				throw new Meteor.Error('Please provide valid ID');
			}



			var userId = Usrs.insert({
				createdAt: new Date(),
				fullName: data.fullName,
				studentId: data.studentId
			});


			if (Sessions.findOne({"sessionId": data.sessionToAddToId})) {
				var list = Sessions.findOne({"sessionId": data.sessionToAddToId});

				if (list.sessLoc) {
					if (typeof data.locData !== "object") {
						throw new Meteor.Error("Invalid location information provided.");
					};

					function distance(lat1, lon1, lat2, lon2) {
						var p = 0.017453292519943295;    // Math.PI / 180
						var c = Math.cos;
						var a = 0.5 - c((lat2 - lat1) * p)/2 + 
							c(lat1 * p) * c(lat2 * p) * 
							(1 - c((lon2 - lon1) * p))/2;

						return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
					};
					if (distance(list.sessLoc.lati, list.sessLoc.longi, data.locData.lati, data.locData.longi) > (list.maxLocRange?  list.maxLocRange*0.0003048: 0.3048)) {
						throw new Meteor.Error("Blocked by location-based security of session.");
					};

				};

				if(data.studentId === 'SessionOwner' && list.userList.length !== 0) {
					throw new Meteor.Error('Invalid student ID');
				}


				if (list.hasPin && list.pin.toString() !== data.pinr.toString())
					throw new Meteor.Error('Incorrect PIN. Try again.');

				list = list.userList;
				var containsIndex = -1;
				if (list.some(function(g, idx) {
					if (g.studentId === data.studentId) {
						containsIndex = idx;
						return true;
					};
				})) {
					list.slice(containsIndex, 1);
				};

				list.push({
					userId: userId,
					studentId: data.studentId
				});

				Sessions.update({"sessionId": data.sessionToAddToId}, {$set: {"userList": list}});

			}
			else if(typeof data.sessionToAddToId === 'string' && data.sessionToAddToId.length) {
				throw new Meteor.Error('Session pertaining to given session ID could not be found.');
			};

			return userId;
		}
	}
});