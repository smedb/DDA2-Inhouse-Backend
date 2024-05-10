const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true, 
        index: {
            unique: true,
            partialFilterExpression: {email: {$type: "string"}}
        }
    },
    password: { // TODO: ENCRYPT WITH JWT
        type: String,
        required: false
    }
    // TODO: ADD remaining properties such as picture, job, salary, etc
});

module.exports = mongoose.model('Users', userSchema);
