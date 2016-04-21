if (Meteor.isClient) {
	Template.mcreport.helpers({
		ThisUserName: function () {
			var usrItem = Usrs.findOne({"_id": Session.get('userSessItem').userId});
			if (usrItem) {
				return usrItem.fullName;
			};
		},
		session: function () {
			return Session.get('mcreportData');
		},
		todaysDay: function() {
			return moment().format('LL');
		},
		students: function() {
			var sess = Session.get('mcreportData');
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
							var tempArr = new Array(sets.length);
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
				studentsList = studentsList.map(function($stud, $iddx) {
					for (var i = 0; i < $stud.responseList.length; i++) {
						if (typeof $stud.responseList[i] === "undefined") $stud.responseList[i] = "No response"
							else if($stud.responseList[i] === 0) $stud.responseList[i] = "A";
						else if($stud.responseList[i] === 1) $stud.responseList[i] = "B";
						else if($stud.responseList[i] === 2) $stud.responseList[i] = "C";
						else if($stud.responseList[i] === 3) $stud.responseList[i] = "D";
					};
					return $stud;
				});
				return studentsList;
			};
		},
		questionNumberTransformed: function () {
			return Session.get('mcreportData').clickerData.sets.map(function(g, i) {
				g.qIdx = i + 1;
				return g;
			});
		}
	});
};