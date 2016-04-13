if (Meteor.isClient) {
	
	Template.contact.events({
       	'click #home_btn': function() {
       		Router.go("/");
       	}
  });
};
