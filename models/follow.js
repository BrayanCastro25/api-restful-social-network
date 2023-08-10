const {Schemma, model} = require('mongoose');

const Follow = Schemma({
    user: {
        type: Schemma.ObjectId,
        ref: "User"
    },
    followed: {
        type: Schemma.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Follow', FollowSchemma, 'follows');