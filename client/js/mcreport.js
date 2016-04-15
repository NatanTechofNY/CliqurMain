if (Meteor.isClient) {
	Template.mcreport.helpers({
		ThisUserName: function () {
			var usrItem = Usrs.findOne({"_id": Session.get('userSessItem').userId});
			if (usrItem) {
				return usrItem.fullName;
			};
		},
		session: function () {
			return Session.get('reportData');
		},
		todaysDay: function() {
			return moment().format('LL');
		},
		students: function() {
			var sess = Session.get('reportData');
			var sets = sess.clickerData.sets;
			if (sets) {
				var studentsList = [];

				sets.forEach(function($t, $qIdx) {
					var resps = $t.responses;
					var $tQ = $t.question;
					resps.forEach(function($tat) {
						var studId = $tat.studentId;
						var respI = $tat.responseIndex;
						var listIdx = -1;
						
						studentsList.forEach(function($g, $idx) {
							if ($g.studentId === studId) listIdx = $idx;
						});

						if (listIdx !== -1) studentsList[listIdx].responseList[$qIdx] = respI;
						else{
							var name = $tat.userName;
							var tempArr = [];
							tempArr[$qIdx] = respI;
							studentsList.push({
								fullName: name,
								studentId: studId,
								responseList: tempArr
							});
						};
					});
				});

				//fill up empty responses
				studentsList.map(function($stud) {
					for (var i = 0; i < $stud.responseList.length; i++) {
						if (typeof $stud.responseList[i] === "undefined") $stud.responseList[i] = "No response";
					};
					return $stud;
				});

				return studentsList;
			};
		}
	});
};