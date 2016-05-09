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
    'click #fullscreen': function() {

  var el = document.body;

  // Supports most browsers and their versions.
  var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen 
  || el.mozRequestFullScreen || el.msRequestFullScreen;

  if (requestMethod) {

    // Native full screen.
    requestMethod.call(el);

  } else if (typeof window.ActiveXObject !== "undefined") {

    // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");

    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
},
	});
};