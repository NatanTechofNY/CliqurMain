if (Meteor.isClient) {
	Template.report.helpers({
		thisTime: function () {
			return moment().format('LL');
		},
		d: function () {
			var d =  Session.get('reportData');
			d.userList.map(function(a, index) {
				a.indx = index + 1;
				return a;
			})
			return d;
		}
	});

	Template.report.events({
		'click #emailreport': function () {
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
			var reportHtml = '<section style="width: 100vh; font-family: Roboto; background-color: rgba(220, 225, 227, 0.36); margin-left: auto; margin-right: auto;">' + $('section').html() + '</section>';
			Meteor.call('sendReport', {
				"to": email,
				"className": Session.get('reportData').sessionName,
				"reportHtml": reportHtml
			}, function (e, r) {
				ga("send", "event", "Report", "Emailed", 'null', new Date().getTime());
				$('#toappTo').append('<button id="emailreport" style="color: #05668d;background-color: #fff;font-size: 13px;padding: 15px;font-weight: 200;border: 1px solid #05668d;width: 150px;margin: 20px 20px 20px 0px;float: left;border-radius: 3px;">Email Report</button><button onclick="window.print()" style="color: #05668d;background-color: #fff;font-size: 13px;padding: 15px;font-weight: 200;border: 1px solid #05668d;width: 150px;margin: 20px 20px 20px 0px;float: left;border-radius: 3px;">Print Report</button>');
				if (e)
					alert(e.error);
				else alert('Report sent!');
			});
		}
	});
	Template.report.destroyed = function () {
		Session.setPersistent('reportData', undefined);
	};

};


