var Schema = {};

Schema.Events = new SimpleSchema({
        createdAt: {
            type: Date,
            optional: false
        },
        eventId: {
            type: String,
            optional: false
        },
        eventName: {
            type: String,
            optional: true
        },
        pin: {
            type: String,
            optional: true
        },
        hasPin: {
            type: Boolean,
            optional: false,
            defaultValue: false
        },
        eventOwnerCompanyId: {
            type: String,
            optional: false,
            regEx: SimpleSchema.RegEx.Id
        },
        userList: {
            type: [Object],
            optional: false,
            blackbox: true
        },
        clickerData: {
            type: Schema.ClickerItem,
            optional: true
        }
    });
    
    
    Events = new Meteor.Collection("event");
    
    
    Events.attachSchema(Schema.Events);