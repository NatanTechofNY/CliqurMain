Meteor.startup(function () {

    Router.configure({
        notFoundTemplate: 'notFound',
        loadingTemplate: 'loader',
        thankYouTemplate: 'thankYou',
        trackPageView: true
    });

    Router.map(function() {
        this.route("splashPage", {
            path: "/",
            onBeforeAction: function() {
                if (Session.get('userSessItem') && Session.get('userSessItem').sessionId) {
                    Router.go('/d/'+Session.get('userSessItem').sessionId, {replaceState: true});
                }
                else
            	   this.next();
            },
            template: function() {
                return Meteor.Device.isPhone() || Meteor.Device.isTablet()? 'indexItem': 'index2';
            },
            onAfterAction: function() {
                if (!Meteor.isClient) {
                    return false;
                };
                SEO.set({
                    "title": "Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Welcome to Cliqur',
                        'image': ''
                    }
                });
                document.title = 'Cliqur';
            },
            data: function(){
                
            },
        }),
    this.route("about", {
            path: "/about",
            onBeforeAction: function() {
                   this.next();
            },
            template: 'about',
            onAfterAction: function() {
                SEO.set({
                    "title": "About Us | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'About Us | Cliqur',
                        'image': ''
                    }
                });
                document.title = 'About Us | Cliqur';
            }
        }),

    this.route("contact", {
            path: "/contact",
            onBeforeAction: function() {
                   this.next();
            },
            template: 'contact',
            onAfterAction: function() {
                SEO.set({
                    "title": "Contact | Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Contact | Cliqur',
                        'image': ''
                    }
                });
                document.title = 'Contact | Cliqur';
            }
        }),
        this.route("business", {
            path: "/business",
            onBeforeAction: function() {
                if (Session.get('userSessItem') && Session.get('userSessItem').eventId) {
                    Router.go('/b/'+Session.get('userSessItem').eventId, {replaceState: true});
                }
                else
                   this.next();
            },
            template: 'businessPage',
            onAfterAction: function() {
                SEO.set({
                    "title": "Cliqur Business",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Welcome to Cliqur',
                        'image': ''
                    }
                });
                document.title = 'Cliqur Business';
            }
        }),
        this.route("splash", {
            path: "/splash",
            onBeforeAction: function() {
                   this.next();
            },
            template: 'splashPage',
            onAfterAction: function() {
                SEO.set({
                    "title": "Cliqur",
                    "meta" : {
                        'description': '',
                        'keywords': ''
                    },
                    "og" : {
                        'title': 'Welcome to Cliqur',
                        'image': ''
                    }
                });
                document.title = 'Cliqur';
            }
        })//,
        // this.route("index2", {
        //     path: "/index2",
        //     onBeforeAction: function() {
        //            this.next();
        //     },
        //     template: 'index2',
        //     onAfterAction: function() {
        //         SEO.set({
        //             "title": "Cliqur",
        //             "meta" : {
        //                 'description': '',
        //                 'keywords': ''
        //             },
        //             "og" : {
        //                 'title': 'Welcome to Cliqur',
        //                 'image': ''
        //             }
        //         });
        //         document.title = 'Cliqur';
        //     }
        // })
        
    });


    if (Meteor.isClient) {
        return SEO.config({
            "title": "Cliqur",
            "meta" : {
                'description': '',
                'keywords': ''
            },
            "og" : {
                'title': 'Cliqur',
                'image': ''
            }
        });
    };
});