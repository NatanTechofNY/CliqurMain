if (Meteor.isServer) {
	Meteor.startup(function () {
		Meteor.Mailgun.config({
			username: 'postmaster@cliqur.com',
			password: '49939e3e5e78b924436414d694251d6b'
		});
	});


	Meteor.methods({
		sendReport: function (data) {
			check([data.reportHtml, data.to, data.className], [String]);

			this.unblock();

			Meteor.Mailgun.send({
				to: data.to,
				from: 'reports@cliqur.com',
				subject: 'Attendance report for: ' + data.className,
				html: data.reportHtml
			});
		}
	});
};