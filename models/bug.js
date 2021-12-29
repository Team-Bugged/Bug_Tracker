var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bugSchema = new Schema({
    //bugTitle
    bugTitle: {
        type: String,
        require: true,
    },
    //newfield
    bugStatus: {
        type: String,
        require: true,
    },
    bugDescription: {
        type: String,
        require: true,
    },
    bugSeverity: {
        type: String,
        require: true,
    },    
    //newfield
    bugPriority: {
        type: String,
        require: true,
    },
    //bugDueDate
    bugDueDate: {
        type: Date,
        require: true,
    },
    // comments: {
    //     type: Array, 
    // },

})

bugSchema.pre('save', function(next) {
    var bug = this;
    return next()
})

module.exports = mongoose.model('Bug', bugSchema)