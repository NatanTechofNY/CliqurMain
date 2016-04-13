var Schema = {};

Schema.Usrs = new SimpleSchema({
        createdAt: {
            type: Date,
            optional: false
        },
        fullName: {
            type: String,
            optional: false
        },
        studentId: {
            type: String,
            optional: false
        }
    })
    Usrs = new Meteor.Collection("usrs");
    
    
    Usrs.attachSchema(Schema.Usrs);