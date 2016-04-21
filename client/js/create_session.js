if (Meteor.isClient) {
  Blaze._allowJavascriptUrls();

  Template.create_session.destroyed = function () {
    Session.set('newUserList', undefined);
  };
  
  var hammertime, toggleElement;
  Template.create_session.rendered = function() {

    var Tabs = {

      init: function() {
        this.bindUIfunctions();
        this.pageLoadCorrectTab();
      },

      bindUIfunctions: function() {

        // Delegation
        $(document)
          .on("click", ".transformer-tabs a[href^='#']:not('.active')", function(event) {
            Tabs.changeTab(this.hash);
            event.preventDefault();
          })
          .on("click", ".transformer-tabs a.active", function(event) {
            Tabs.toggleMobileMenu(event, this);
            event.preventDefault();
          });

      },

      changeTab: function(hash) {

        var anchor = $("[href='" + hash + "']");
        var div = $(hash);

        // activate correct anchor (visually)
        anchor.addClass("active").parent().siblings().find("a").removeClass("active");

        // activate correct div (visually)
        div.addClass("active").siblings().removeClass("active");

        // update URL, no history addition
        // You'd have this active in a real situation, but it causes issues in an <iframe> (like here on CodePen) in Firefox. So commenting out.
        // window.history.replaceState("", "", hash);

        // Close menu, in case mobile
        anchor.closest("ul").removeClass("open");

      },

      // If the page has a hash on load, go to that tab
      pageLoadCorrectTab: function() {
        this.changeTab(document.location.hash);
      },

      toggleMobileMenu: function(event, el) {
        $(el).closest("ul").toggleClass("open");
      }

    };

    Tabs.init();


    hammertime = undefined;
    toggleElement = function ($el, type) {
        if (type != null) {
            if (type === 'open') {
                $el.addClass('panel-element-open');
                $el.siblings('.panel-element').removeClass('panel-element-open');
            } else if (type === 'close') {
                $el.removeClass('panel-element-open');
            }
        } else {
            if ($el.hasClass('panel-element-open')) {
                toggleElement($el, 'close');
            } else {
                toggleElement($el, 'open');
            }
        }
        return null;
    };
            
            
      if ($(window).width() < 800) {
          hammertime = $('.panel-element .element-content').hammer();
          hammertime.on('swipeleft swiperight tap', function (e) {
              var $parent;
              $parent = $(e.currentTarget).parent();
              if (e.type === 'tap') {
                  toggleElement($parent);
              } else if (e.type === 'swipeleft') {
                  if (!$parent.hasClass('panel-element-open')) {
                      toggleElement($parent, 'open');
                  }
              } else {
                  if ($parent.hasClass('panel-element-open')) {
                      toggleElement($parent, 'close');
                  }
              }
          });
      };
  };

  Template.create_session.events({
      'click .btn': function(e) {
        var $t = e.currentTarget;
        var $parent;
        $parent = $($t).parents('.panel-element');
        if ($($t).hasClass('btn-heart')) {
            if ($parent.hasClass('panel-element-hearted')) {
                return $parent.removeClass('panel-element-hearted');
            } else {
                $parent.addClass('panel-element-hearted');
                return toggleElement($parent, 'close');
            }
        } else if ($($t).hasClass('btn-hide')) {
            toggleElement($parent, 'close');
            return $parent.delay(200).fadeOut(300);
        } else if ($($t).hasClass('btn-more')) {
            if (!hammertime) {
                return toggleElement($parent);
            }
        }
      },
      'click #menu-toggle': function(e) {
        e.preventDefault();
        $('#wrapper').toggleClass("toggled");
        ga("send", "event", "Report", "Previewed", 'null', new Date().getTime());
      },
      'click #endssn': function() {
        Router.go("/endsession");
        Session.setPersistent('userSessItem', {});
      },
      'click #createAtten': function() {
        if (Sessions.findOne({"sessionId": Router.current().params.sessionId}) && Sessions.findOne({"sessionId": Router.current().params.sessionId}).userList) {
          var skipr = false;
          var list = Sessions.findOne({"sessionId": Router.current().params.sessionId}).userList.map(function(g) {
            if (skipr) return;
          if(Usrs.findOne({"_id": g.userId})){
            return Usrs.findOne({"_id": g.userId})
          }
          else{
            alert('Not all users have completely loaded');
            skipr = true;
          };
        });
        if (skipr) return;

          // Blaze.saveAsPDF(Template.report, {
          //   filename: "attendance.pdf",
          //   data: Session.get('newUserList'),
          //   orientation: "portrait",
          //   unit: "in",
          //   format: "letter"
          // });

          var o = Sessions.findOne({"sessionId": Router.current().params.sessionId});
          o.userList = list.filter(function(g) {
            return g.studentId !== "SessionOwner";
          });
          Session.setPersistent('reportData', o);
          ga("send", "event", "Report", "Opened", 'null', new Date().getTime());

          window.open("/report", "_blank", "width=660,height=600");

          // Meteor.call('createDocument', {listed: list}, function (e, res) {
          //   if (e)
          //     return alert(e.error);
          //   else if(res){



          //       download(res, "attendance.html", "text/html")


          // //    var byteCharacters = atob(res);
          // //    var byteNumbers = new Array(byteCharacters.length);
          //     // for (var i = 0; i < byteCharacters.length; i++) {
          //     //  byteNumbers[i] = byteCharacters.charCodeAt(i);
          //     // };
          //     // var byteArray = new Uint8Array(byteNumbers);

          //     // var blob = new Blob([byteArray], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}); `

          // //     var blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});//application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
          //     // saveAs(blob, "attendance.xlsx");
          //     // window.open(res, "_blank");
          //   }
          // });
        };
      },
      'click .togglePulicBtn': function(e) {
         Meteor.call('toggleQuestion', {target: true, questionId: $(e.currentTarget).parents('.panel-element').attr('data-id'), sessionId: Router.current().params.sessionId, userId: Session.get('userSessItem').userId}, function (err, res) {
          if (err) {
            alert(err.error);
          }
        });
      },
      'click .deleteQuestionBtn': function(e) {
        if (confirm('Are you sure you want to delete this question?')) {
          Meteor.call('removeQuestion', {questionId: $(e.currentTarget).parents('.panel-element').attr('data-id'), sessionId: Router.current().params.sessionId, userId: Session.get('userSessItem').userId}, function (err, res) {
            if (err) {
              alert(err.error);
            };
          });
        };
      },
      // 'click #resetPollBtn': function() {
      //   if (confirm('Are you sure you want to reset the polls?')) {
      //     Meteor.call('resetClickerData', {sessionId: Router.current().params.sessionId, userId: Session.get('userSessItem').userId}, function (e, res) {
      //       if (e)
      //         alert(e.error);
      //     });
      //   };
      // },
      'focus #autoSelectrLoc': function(e) {
        setTimeout(function() {$('#autoSelectrLoc').select();}, 3);
      },
      'submit #customQuestionSubmit': function(e) {
        e.preventDefault();
        var q = $('textarea[name="creatorQuestion"]').val().trim();
        if (q && q.length) {
          var parentSessionId = Session.get('userSessItem').sessionId;
          var authId = Session.get('userSessItem').userId;
          var obj = {
            "sessionId": parentSessionId,
            "userId": authId,
            "body": q
          };
          Meteor.call('sendQuestion', obj, function(e, d) {
            if (e) {
              alert(e.error);
            }
            else {
              $('textarea[name="creatorQuestion"]').val('');
              Meteor.call('toggleQuestion', {target: true, questionId: d, sessionId: Router.current().params.sessionId, userId: Session.get('userSessItem').userId}, function (err, res) {
                if (err) {
                  alert(err.error);
                };
              });
            }
          });
        };
        
      },
      'click #timerSetBtn': function() {
        var timingCheck = $('input[name="timeSet"]').val();
        if (!timingCheck || !timingCheck.toString().length)
          timingCheck = $('select[name="timeSet60"]').val();

          var obj = {
            "sessionId": Session.get('userSessItem').sessionId,
            "userId": Session.get('userSessItem').userId,
            "maxSecs": parseInt(timingCheck),
            "thisTime": new Date(),
            "questionItem": Questions.findOne({"parentSessionId": Router.current().params.sessionId, "isPublic": true}).body,
            "isResetPoll": true
          };
          Meteor.call('setTiming', obj, function (error, result) {
            $('input[name="timeSet"]').val('');
            if (error)
              alert(error.error);
          });
      },
      'click #timerEndBtn': function() {
        var obj = {
          "sessionId": Session.get('userSessItem').sessionId,
          "userId": Session.get('userSessItem').userId,
          "maxSecs": 1,
          "thisTime": new Date(),
          "questionItem": Questions.findOne({"parentSessionId": Router.current().params.sessionId, "isPublic": true}).body
        };
        Meteor.call('setTiming', obj, function (error, result) {
          $('input[name="timeSet60"]').attr('checked', false);
          $('input[name="timeSet"]').val('');
          if (error)
            alert(error.error);
        });
      },
      'click #create_triggerNav_btn': function() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("create_id_body").style.marginLeft = "250px";
      },
      'click #create_closeNav_btn': function() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("create_id_body").style.marginLeft = "0";
      },
      'click #pollRespReport': function() {
        var o = Sessions.findOne({"sessionId": Router.current().params.sessionId});
        Session.setPersistent('mcreportData', o);
        ga("send", "event", "McReport", "Opened", 'null', new Date().getTime());

        window.open("/mcreport", "_blank", "width=660,height=600");
      }
  });
  Template.create_session.helpers({
    pollTime: function() {
      var thisTime = Session.get('time');
      var sess = Sessions.findOne({"sessionId": Router.current().params.sessionId});
      if ((thisTime) - new Date(sess.clickerData.countDownSetAt).getTime() > (sess.clickerData.maxSeconds*1000) || !sess.clickerData.maxSeconds) {
        return false;
      }
      else{
        return parseInt(sess.clickerData.maxSeconds - ((thisTime - new Date(sess.clickerData.countDownSetAt).getTime())/1000))+"s";
      };
    },



    sessionId: function () {
      return Router.current().params.sessionId;
    },
    SessionItem: function() {
      return Sessions.findOne({"sessionId": Router.current().params.sessionId});
    },
    usersList: function() {
      if (Sessions.findOne({"sessionId": Router.current().params.sessionId})) {
        var subscribtn = Meteor.subscribe('listOfUsers', {list: Sessions.findOne({"sessionId": Router.current().params.sessionId}).userList.map(function(g) {
          return g.userId;
        })});
        if (subscribtn.ready()) {
          var list = Sessions.findOne({"sessionId": Router.current().params.sessionId}).userList.filter(function(g) {
              return g.studentId !== 'SessionOwner';
            }).map(function(g) {
              return Usrs.findOne({"_id": g.userId});
            });
            Session.set('newUserList', list);
            return list;
        }
        else return [{"fullName": "Loading..."}];
      }
      else return [{"fullName": "Loading..."}];
    },
    questionItem: function() {
      return Questions.find({}, {sort: {createdAt: -1}});
    },
    thisAuthorName: function() {
      if (Questions.findOne()) {
          var sr = Usrs.findOne({"_id": this.authorId});
          return sr && sr.fullName;
        }
        else return "Unknown";
    }
    //clickerResponse: function() {
      //var userId = Router.current().params.sessionId;
      //return Sessions.findOne({"clickerData": clickerResponse})
    //}
  });
}
