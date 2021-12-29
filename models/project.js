var mongoose = require('mongoose')
var Schema = mongoose.Schema
var projectSchema = new Schema({
    projectTitle: {
        type: String,
        require: true,
    },
    projectDescription: {
        type: String, 
        require: true,
    },
    //new
    projectStartDate: {
        type: Date, 
        require: true,
    },
    // projectContributors: {
    //     type: String, 
    //     require: true,
    // },
    projectOwner: {
        type: String, 
        require: true,
    },
    projectStatus: {
        type: String, 
        require: true,
    },
    // bugs: {
    //     type: Array, 
    //     require: true,
    // },
})

projectSchema.pre('save', function(next) {
    var project = this;
    return next()
})

module.exports = mongoose.model('Project', projectSchema)