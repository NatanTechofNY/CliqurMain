Meteor.startup(function () {

  
    Router.map(function() {
        this.route("dashboard", {
            path: "/d/:sessionId",
            waitOn: function() {
                var ses = Sessions.findOne({"sessionId": Router.current().params.sessionId});
                if (ses && Session.get('userSessItem') && ses.sessionOwnerId === Session.get('userSessItem').userId) {
                    return Meteor.subscribe('adminQuestions', Router.current().params.sessionId);
                }
                else if(Session.get('userSessItem') && Session.get('userSessItem').userId){
                    return [Meteor.subscribe('userQuestions', {sessid: Router.current().params.sessionId, authorId: Session.get('userSessItem').userId}), Meteor.subscribe('publicQuestions', Router.current().params.sessionId)];
                }
                else this.ready();
            },
            onBeforeAction: function() {
                if (!Sessions.findOne({"sessionId": Router.current().params.sessionId}) || !Session.get('userSessItem') || !Session.get('userSessItem').userId) {
                    if (Session.get('userSessItem') && Session.get('userSessItem').sessionId === Router.current().params.sessionId)
                        Session.setPersistent('userSessItem', {});
                    Router.go('/doesntexist', {replaceState: true});
                }
                else this.next();
            },
            template: function() {
                var ses = Sessions.findOne({"sessionId": Router.current().params.sessionId});
                if (ses && ses.sessionOwnerId === Session.get('userSessItem').userId)
                    return 'create_session2';
                else
                    return 'crowd_session';
            },
            onAfterAction: function() {
                if (!Meteor.isClient) {
                    return false;
                };
                var ses = Sessions.findOne({"sessionId": this.params.sessionId});
                var prestr = ses? ses.sessionName: "Session";
                SEO.set({
                    "title": prestr + " | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Welcome to Cliqur',
                        'image': ''
                    }
                });
                document.title = prestr + ' | Cliqur';
            },
            data: function(){
                
            },
        }),
                this.route("dashboard2", {
            path: "/i/:sessionId",
            waitOn: function() {
                var ses = Sessions.findOne({"sessionId": Router.current().params.sessionId});
                if (ses && Session.get('userSessItem') && ses.sessionOwnerId === Session.get('userSessItem').userId) {
                    return Meteor.subscribe('adminQuestions', Router.current().params.sessionId);
                }
                else if(Session.get('userSessItem') && Session.get('userSessItem').userId){
                    return [Meteor.subscribe('userQuestions', {sessid: Router.current().params.sessionId, authorId: Session.get('userSessItem').userId}), Meteor.subscribe('publicQuestions', Router.current().params.sessionId)];
                }
                else this.ready();
            },
            onBeforeAction: function() {
                if (!Sessions.findOne({"sessionId": Router.current().params.sessionId}) || !Session.get('userSessItem') || !Session.get('userSessItem').userId) {
                    if (Session.get('userSessItem') && Session.get('userSessItem').sessionId === Router.current().params.sessionId)
                        Session.setPersistent('userSessItem', {});
                    Router.go('/doesntexist', {replaceState: true});
                }
                else this.next();
            },
            template: function() {
                var ses = Sessions.findOne({"sessionId": Router.current().params.sessionId});
                if (ses && ses.sessionOwnerId === Session.get('userSessItem').userId)
                    return 'create_session2';
                else
                    return 'crowd_session';
            },
            onAfterAction: function() {
                if (!Meteor.isClient) {
                    return false;
                };
                var ses = Sessions.findOne({"sessionId": this.params.sessionId});
                var prestr = ses? ses.sessionName: "Session";
                SEO.set({
                    "title": prestr + " | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Welcome to Cliqur',
                        'image': ''
                    }
                });
                document.title = prestr + ' | Cliqur';
            },
            data: function(){
                
            },
        }),
        this.route("dashboardBiz", {
            path: "/b/:eventId",
            waitOn: function() {
                var ses = Events.findOne({"eventId": Router.current().params.eventId});
                if (ses && Session.get('userSessItem') && ses.eventOwnerCompanyId === Session.get('userSessItem').userId) {
                    return Meteor.subscribe('adminQuestions', Router.current().params.sessionId);
                }
                else if(Session.get('userSessItem') && Session.get('userSessItem').userId){
                    return [Meteor.subscribe('userQuestions', {sessid: Router.current().params.eventId, authorId: Session.get('userSessItem').attendeeId}), Meteor.subscribe('publicQuestions', Router.current().params.eventId)];
                }
                else this.ready();
            },
            onBeforeAction: function() {
                if (!Events.findOne({"eventId": Router.current().params.eventId}) || !Session.get('userSessItem') || !Session.get('userSessItem').attendeeId) {
                    if (Session.get('userSessItem') && Session.get('userSessItem').eventId === Router.current().params.eventId)
                        Session.setPersistent('userSessItem', {});
                    Router.go('/doesntexist', {replaceState: true});
                }
                else this.next();
            },
            template: function() {
                var ses = Events.findOne({"eventId": Router.current().params.eventId});
                if (ses && ses.eventOwnerCompanyId === Session.get('userSessItem').attendeeId)
                    return 'create_event';
                else
                    return 'crowd_event';
            },
            onAfterAction: function() {
                if (!Meteor.isClient) {
                    return false;
                };
                var ses = Sessions.findOne({"eventId": this.params.eventId});
                var prestr = ses? ses.eventName: "Event";
                SEO.set({
                    "title": prestr + " | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Welcome to Cliqur',
                        'image': ''
                    }
                });
                document.title = prestr + ' | Cliqur';
            },
            data: function(){
                
            },
        }),
        this.route("publicView", {
            path: "/d/:sessionId/p",
            waitOn: function() {
                return [Meteor.subscribe('publicQuestions', Router.current().params.sessionId), Meteor.subscribe('sessionDataLimited', Router.current().params.sessionId)];
            },
            onBeforeAction: function() {
                if (!Sessions.findOne({"sessionId": Router.current().params.sessionId})) {
                    Router.go('/doesntexist', {replaceState: true});
                }
                else this.next();
            },
            template: 'publicview',
            onAfterAction: function() {
                if (!Meteor.isClient) {
                    return false;
                };
                var ses = Sessions.findOne({"sessionId": this.params.sessionId});
                var prestr = ses? ses.sessionName: "Session";
                SEO.set({
                    "title": prestr + " - Public view| Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Welcome to Cliqur',
                        'image': ''
                    }
                });
                document.title = prestr + ' - Public view | Cliqur';
            },
            data: function(){
                
            },
        }),
                this.route("public2", {
            path: "/d/:sessionId/pp",
            waitOn: function() {
                return [Meteor.subscribe('publicQuestions', Router.current().params.sessionId), Meteor.subscribe('sessionDataLimited', Router.current().params.sessionId)];
            },
            onBeforeAction: function() {
                if (!Sessions.findOne({"sessionId": Router.current().params.sessionId})) {
                    Router.go('/doesntexist', {replaceState: true});
                }
                else this.next();
            },
            template: 'public2',
            onAfterAction: function() {
                if (!Meteor.isClient) {
                    return false;
                };
                var ses = Sessions.findOne({"sessionId": this.params.sessionId});
                var prestr = ses? ses.sessionName: "Session";
                SEO.set({
                    "title": prestr + " - Public View | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Cliqur',
                        'image': ''
                    }
                });
                document.title = prestr + ' - Public View | Cliqur';
            },
            data: function(){
                
            },
        }),
        this.route("thankyou", {
            path: "/endsession",
            onBeforeAction: function() {
                if (Session.get('userSessItem') && Session.get('userSessItem').sessionId) {
                    Router.go('/d/'+Session.get('userSessItem').sessionId, {replaceState: true});
                }
                else
                   this.next();
            },
            template: 'thankYou',
            onAfterAction: function() {
                SEO.set({
                    "title": "Thank you! | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Welcome to Cliqur',
                        'image': ''
                    }
                });
                document.title = 'Thank you! | Cliqur';
            }
        }),
        this.route("report", {
            path: "/report",
            onBeforeAction: function() {
                   this.next();
            },
            template: 'report',
            onAfterAction: function() {
                SEO.set({
                    "title": "Report | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Report',
                        'image': ''
                    }
                });
                document.title = 'Report | Cliqur';
            }
        }),
        this.route("mcreport", {
            path: "/mcreport",
            onBeforeAction: function() {
                   this.next();
            },
            template: 'mcreport',
            onAfterAction: function() {
                SEO.set({
                    "title": "Questions Report | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Questions Report',
                        'image': ''
                    }
                });
                document.title = 'Questions Report | Cliqur';
            }
        })
    });
});