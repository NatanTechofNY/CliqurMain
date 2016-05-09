if (Meteor.isClient) {
	var tempRet;
        Template.public2.helpers({
        className: function() {
            return Sessions.findOne({"sessionId": Router.current().params.sessionId}).sessionName;
        },
        sess: function() {
            return Sessions.findOne({"sessionId": Router.current().params.sessionId}).sessionId;
        },
        lecturerName: function() {
            var sessionOwnerId = Sessions.findOne({"sessionId": Router.current().params.sessionId});
            if (sessionOwnerId) sessionOwnerId = sessionOwnerId.sessionOwnerId;
            var subn = Meteor.subscribe('userDoc', sessionOwnerId);
            if(subn.ready()) {
                return Usrs.findOne({"_id": sessionOwnerId}).fullName;
            };
        }, 
        pushedQuestion: function() {
            return Questions.findOne({"parentSessionId": Router.current().params.sessionId});
        },
        questionAuthor: function() {
            var authorId = Questions.findOne({"parentSessionId": Router.current().params.sessionId}).authorId;
            var subn = Meteor.subscribe('userDoc', authorId);
            if(subn.ready()) {
                return Usrs.findOne({"_id": authorId}).fullName;
            };
        },
        voteDistribution: function() {
            if (Sessions.findOne({"sessionId": Router.current().params.sessionId})) {
                var sess = Sessions.findOne({"sessionId": Router.current().params.sessionId});
                if (sess.clickerData && sess.clickerData.sets) {
                    var $D = sess.clickerData.sets[sess.clickerData.sets.length - 1];
                    if ($D && $D.responses && $D.responses.length) {
                        var $R = $D.responses;
                        var totalResp = $R.length;
                        var rsA,rsB,rsC,rsD;
                        rsA = rsB = rsC = rsD = 0;
                        $R.forEach(function (g) {
                            if (g.responseIndex === 0)
                                rsA++;
                            else if(g.responseIndex === 1)
                                rsB++;
                            else if(g.responseIndex === 2)
                                rsC++;
                            else if(g.responseIndex === 3)
                                rsD++;
                        });
                        setTimeout(function() {
                            $('[data-factor]').each(function() {
                                $(this).css('width', Math.abs(parseFloat($(this).attr('data-factor'))*100 - 1.2).toFixed(1)  + '%');
                            });
                        }, 500);
                ///--------------------*****-----------------------//
                        return {
                            responseCount: {
                                total: totalResp,
                                a: rsA,
                                b: rsB,
                                c: rsC,
                                d: rsD,
                            },
                            wholes: {
                                total: totalResp,
                                a: rsA/totalResp,
                                b: rsB/totalResp,
                                c: rsC/totalResp,
                                d: rsD/totalResp
                            }
                        };
                ///--------------------*****-----------------------//

                    }
                    else{
                        $('[data-factor]').each(function() {
                            $(this).css('width', '1%');
                        });
                    };
                };
            };
        },
        pollTime: function() {
            var thisTime = Session.get('time');
            var sess = Sessions.findOne({"sessionId": Router.current().params.sessionId});
            if ((thisTime) - new Date(sess.clickerData.countDownSetAt).getTime() > (sess.clickerData.maxSeconds*1000) || !sess.clickerData.maxSeconds) {
                return "0s";
            }
            else{
                return parseInt(sess.clickerData.maxSeconds - ((thisTime - new Date(sess.clickerData.countDownSetAt).getTime())/1000))+"s";
            };
        }
    });
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