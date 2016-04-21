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
			var subjLine = data.isMC? 'Poll report for: ': 'Attendance report for: '
			Meteor.Mailgun.send({
				to: data.to,

				from: 'Reports@cliqur.com',
				subject: subjLine + data.className,
				html: sanitizeHtml(data.reportHtml, {
					allowedTags: ['h1', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'p1', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' , 'section', 'button'],
  					allowedAttributes: {
  						'*': ['style', 'id']
  					}
				})
			});
		},
		sendContact: function (d) {
			check([d.nm, d.em, d.ms], [String]);
			if (d.ph) check([d.ph], [String]);
			if (d.ms.length < 5) throw new Meteor.Error('Please write a longer message.')
				else if (d.ms.length > 5000) throw new Meteor.Error('Max 5,000 chars for the message.');


			var newhtml = d.ms.replace(/&/g, '&amp;').replace(/</g, '&#60;').replace(/>/g, '&#62;').replace(/\n\s*\n/g, '\n\n').replace(/\n/g, '<br />');
			var tohtmlize = sanitizeHtml(newhtml, {
				allowedTags: ['br'],
					allowedAttributes: []
			});
			var htmlIn = '<div><strong>Email by: '+d.nm+' | Sender address: '+d.em+' | Phone: '+(d.ph? d.ph: 'no phone number given.')+'</strong><br />' + tohtmlize.toString() + '</div>';
			Meteor.Mailgun.send({
				to: 'cliqur.contact@gmail.com',

				from: d.em,
				subject: 'Contact Form | Filled by ' + d.nm,
				html: htmlIn
			});
		}
	});
};