if (Meteor.isClient) {
    Template.create_session.destroyed = function () {
      Session.set('newUserList', undefined);
    };
  
  var hammertime, toggleElement;
  Template.create_session.rendered = function() {
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
            if(Users.findOne({"_id": g.userId})){
              return Users.findOne({"_id": g.userId})
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
            Meteor.call('createDocument', {listed: list}, function (e, res) {
              if (e)
                return alert(e.error);
              else if(res){



                  download(res, "attendance.html", "text/html")


            //    var byteCharacters = atob(res);
            //    var byteNumbers = new Array(byteCharacters.length);
                // for (var i = 0; i < byteCharacters.length; i++) {
                //  byteNumbers[i] = byteCharacters.charCodeAt(i);
                // };
                // var byteArray = new Uint8Array(byteNumbers);

                // var blob = new Blob([byteArray], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}); `

            //     var blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});//application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                // saveAs(blob, "attendance.xlsx");
                // window.open(res, "_blank");
              }
            });
          };
        },
        'click #changeToThisPublic': function(e) {
           Meteor.call('toggleQuestion', {target: true, questionId: $('input[name="optionsRadios"]:checked').val(), sessionId: Router.current().params.sessionId, userId: Session.get('userSessItem').userId}, function (err, res) {
            if (err) {
              alert(err.error);
            } else
            alert("Question has been publicly shared.");
          });
        },
        'click #deleteThisQuestion': function() {
          if (confirm('Are you sure you want to delete this question?')) {
            Meteor.call('removeQuestion', {questionId: $('input[name="optionsRadios"]:checked').val(), sessionId: Router.current().params.sessionId, userId: Session.get('userSessItem').userId}, function (err, res) {
              if (err) {
                alert(err.error);
              };
            });
          };
        },
        'click #resetPollBtn': function() {
          if (confirm('Are you sure you want to reset the polls?')) {
            Meteor.call('resetClickerData', {sessionId: Router.current().params.sessionId, userId: Session.get('userSessItem').userId}, function (e, res) {
              if (e)
                alert(e.error);
            });
          };
        },
        'focus #autoSelectrLoc': function(e) {
          setTimeout(function() {$('#autoSelectrLoc').select();}, 12);
        },
        'submit #customQuestionSubmit': function(e) {
          e.preventDefault();
          var q = $('input[name="creatorQuestion"]').val().trim();
          if (q && q.length) {
            q = q.replace(/&/g, '&amp;').replace(/</g, '&#60;').replace(/>/g, '&#62;').replace(/\n\s*\n/g, '\n\n').replace(/\n/g, '<br>');
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
                $('input[name="creatorQuestion"]').val('');
                Meteor.call('toggleQuestion', {target: true, questionId: d, sessionId: Router.current().params.sessionId, userId: Session.get('userSessItem').userId}, function (err, res) {
                  if (err) {
                    alert(err.error);
                  } else
                    alert("Question has been publicly shared.");
                });
              }
            });
          };
          
        },
        'click #timerSetBtn': function() {
          if ($('input[name="timeSet60"]').is(':checked') &&  $('input[name="timeSet"]').val().length) return alert('Please select only one of the two options');
          var timingCheck = $('input[name="timeSet60"]').is(':checked')? 60: $('input[name="timeSet"]').val();
          if (timingCheck && timingCheck.toString().length) {
            var obj = {
              "sessionId": Session.get('userSessItem').sessionId,
              "userId": Session.get('userSessItem').userId,
              "maxSecs": parseInt(timingCheck)
            };
            Meteor.call('setTiming', obj, function (error, result) {
              $('input[name="timeSet60"]').attr('checked', false);
              $('input[name="timeSet"]').val('');
              if (error)
                alert(error.error);
            });
          }
        },
        'click #timerEndBtn': function() {
          var obj = {
            "sessionId": Session.get('userSessItem').sessionId,
            "userId": Session.get('userSessItem').userId,
            "maxSecs": 1
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
          document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
        },
        'click #create_closeNav_btn': function() {
          document.getElementById("mySidenav").style.width = "0";
          document.getElementById("create_id_body").style.marginLeft = "0";
          document.body.style.backgroundColor = "white";
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
                return Users.findOne({"_id": g.userId});
              });
              Session.set('newUserList', list);
              return list;
          }
          else return [{"fullName": "Loading..."}];
        }
        else return [{"fullName": "Loading..."}];
      },
      questionItem: function() {
        return Questions.find();
      },
      thisAuthorName: function() {
        if (Questions.findOne()) {
            var sr = Users.findOne({"_id": this.authorId});
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
