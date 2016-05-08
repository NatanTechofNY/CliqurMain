if (Meteor.isClient) {
	var tempRet;
	Template.public2.events({
'click #openup': function() {	
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
    },
    'click .cd-panel': function() {	
        if ( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) {
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    },
	});
};