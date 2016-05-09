var Schema = {};

Schema.ClickerResponse = new SimpleSchema({
    studentId: {
        type: String,
        optional: false
    },
    userName: {
        type: String,
        optional: false
    },
    responseIndex: {
        type: Number,
        optional: false
    }
});

Schema.ClickerSets = new SimpleSchema({
    responses: {
        type: [Schema.ClickerResponse],
        optional: true
    },
    question: {
        type: String,
        optional: true
    }
});

Schema.ClickerItem = new SimpleSchema({
    countDownSetAt: {
        type: Date,
        optional: true
    },
    sets: {
        type: [Schema.ClickerSets],
        optional: true
    },
    maxSeconds: {
        type: Number,
        optional: true
    }
});

Schema.Sessions = new SimpleSchema({
        createdAt: {
            type: Date,
            optional: false
        },
        sessionId: {
            type: String,
            optional: false
        },
        sessionName: {
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
        sessionOwnerId: {
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
        },
        sessLoc: {
            type: Object,
            optional: true,
            blackbox: true
        },
        maxLocRange: {
            type: Number,
            optional: true
        }
    });
    
    
    Sessions = new Meteor.Collection("session");
    
    
    Sessions.attachSchema(Schema.Sessions);