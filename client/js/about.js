if (Meteor.isClient) {
	
	Template.about.events({
       	'click #home_btn': function() {
       		Router.go("/");
       	}
  });
};
