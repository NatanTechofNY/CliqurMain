if (Meteor.isClient) {
	
	Template.contact.events({
		'click #home_btn': function() {
			Router.go("/");
		},
		'submit form[name="contactForm"]': function(e) {
			e.preventDefault();
			var flname = e.target.fullNameinpt.value;
			var email = e.target.emailinpt.value;
			var phno = e.target.phNoInpt.value;
			var msg = e.target.msgarea.value;
			var obj = {
				nm: flname,
				em: email,
				ms: msg
			};
			if (typeof phno === "string" && phno.length) {obj.ph = phno};
			var $t = e;
			Meteor.call('sendContact', obj, function (err, result) {
				if (err) {return alert(err.error)};
				$t.target.reset();
				alert('Message sent!');
			});
		}
  });
};
