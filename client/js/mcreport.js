if (Meteor.isClient) {
	Template.mcreport.events({
		'click #sendEmail': function () {
			$('.modalItem_report').show();
		},
		'click .modalItem_report>div>span': function () {
			$('.modalItem_report').hide();
		},
		'submit form[name="emailSubmit"]': function (e) {
			e.preventDefault();
			$('.modalItem_report').hide();
			alert("Sending report...");
			var email = e.target.emailinpt.value;
			$('section button').remove();
			var reportHtml = '<section>' + $('section').html() + '</section>';
			Meteor.call('sendReport', {
				"to": email,
				"className": Session.get('reportData').sessionName,
				"reportHtml": reportHtml,
				"isMC": true
			}, function (e, r) {
				ga("send", "event", "Report", "Emailed", 'null', new Date().getTime());
				$('#toAppTo').append('<button style="color: #05668d;background-color: #fff;font-size: 13px;padding: 15px;font-weight: 200;border: 1px solid #05668d;width: 150px;margin: 20px 20px 20px 0px;float: right;border-radius: 3px; -webkit-appearance: button; cursor: pointer; text-transform: none; overflow: visible; font: inherit; display: block; background: transparent; box-sizing: border-box; align-items: flex-start; text-align: center; text-rendering: auto; letter-spacing: normal; word-spacing: normal; text-indent: 0px; text-shadow: none;" onclick="window.print();">Print</button><button style="color: #05668d;background-color: #fff;font-size: 13px;padding: 15px;font-weight: 200;border: 1px solid #05668d;width: 150px;margin: 20px 20px 20px 0px;float: right;border-radius: 3px; -webkit-appearance: button; cursor: pointer; text-transform: none; overflow: visible; font: inherit; display: block; background: transparent; box-sizing: border-box; align-items: flex-start; text-align: center; text-rendering: auto; letter-spacing: normal; word-spacing: normal; text-indent: 0px; text-shadow: none;" id="sendEmail">Email</button>');
				if (e)
					alert(e.error);
				else alert('Report sent!');
			});
		}
	});
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
					$stud.indexTransformer = $iddx + 1;
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