var Schema = {};

Schema.BizUsers = new SimpleSchema({
        createdAt: {
            type: Date,
            optional: false
        },
        fullName: {
            type: String,
            optional: false
        },
        attendeeId: {
            type: String,
            optional: false
        },
        verificationId: {
            type: String,
            optional: false
        }
    })
    BizUsers = new Meteor.Collection("bizusers");
    
    
    BizUsers.attachSchema(Schema.BizUsers);