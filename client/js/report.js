if (Meteor.isClient) {
	Template.report.helpers({
		thisTime: function () {
			return moment().format('LL');
		},
		d: function () {
			return Session.get('reportData');
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
				if (e)
					alert(e.error);
				else alert('Report sent!');
				window.close();
			});
		}
	});
	Template.report.destroyed = function () {
		Session.setPersistent('reportData', undefined);
	};

};


