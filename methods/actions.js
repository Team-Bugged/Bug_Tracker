var User = require('../models/user')
var Project = require('../models/project')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const { db } = require('../models/user')
var Bug = require('../models/bug')
var Project = require('../models/project')

var functions = {
    addNew: function (req, res) {
        if ((!req.body.email) || (!req.body.password)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newUser = User({
                email: req.body.email,
                password: req.body.password,
            });
            User.findOne({
                email: req.body.email,
            }, function(err, user){
                if (err) throw err
                if (user) {
                    res.status(403).send({success: false, msg: 'User exists'})
                }
                else {
                    newUser.save(function (err, newUser) {
                        if (err) {
                            console.log(err)
                            res.json({success: false, msg: 'Failed to save'})
                        }
                        else {
                            res.json({success: true, msg: 'Successfully Saved'})
                        }
                    })
                }
            })
        }
    },
    authenticate: function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) throw err
            if (!user) {
                res.status(403).send({success: false, msg: 'Authentication failed, User not found'})
            }
            else {
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(user._id, config.secret)
                        res.json({success: true, token: token})
                    }
                    else {
                        return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                    }
                })
            }
        }
        )
    },
    getinfo: function(req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({success: true, msg: decodedtoken})
        }
        else {
            return res.json({success: false, msg: 'No headers'})
        }
    },
    addproject: function(req, res) {
        let userID;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            userID = jwt.decode(token, config.secret)
        }
        // if ((!req.body.projectTitle) || (!req.body.projectDescription) || (!req.body.projectStartDate) || (!req.body.projectOwner) || (!req.body.projectStatus)) {
        //     res.json({success: false, msg: 'Enter all fields'})
        // }
        // else {
            let newProject = Project({
                projectTitle: req.body.projectTitle,
                projectDescription: req.body.projectDescription,
                projectStartDate: req.body.projectStartDate,
                projectOwner: userID,
                projectStatus: req.body.projectStatus,
            });
            newProject.save(function (err, savedProject) {
                if (err) {
                    console.log(err)
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    User.findOneAndUpdate({_id: userID},{$push: {projects: savedProject._id}}, (err,user)=>{
                        if(err){
                            res.send(err);
                        }
                        // user.projects.append[savedProject._id];
                        res.json({projectDetail: savedProject, userDetail: user})
                    })
                }
            })
        // }
    },
    addbug: function(req, res) {
        // if ((!req.body.bugTitle) || (!req.body.bugDescription) || (!req.body.bugSeverity) || (!req.body.bugDueDate)) {
        //     res.json({success: false, msg: 'Enter all fields'})
        // }
        // else {
            let projectID = req.body.projectID;
            let newBug = Bug({
                bugTitle: req.body.bugTitle,
                bugDescription: req.body.bugDescription,
                bugSeverity: req.body.bugSeverity,
                bugDueDate: req.body.bugDueDate,
                // comments: req.body.comments,
            });
            newBug.save(function (err, savedBug) {
                if (err) {
                    console.log(err)
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    Project.findOneAndUpdate({_id: projectID},{$push: {bugs: savedBug._id}}, (err,project)=>{
                        if(err){
                            res.send(err);
                        }
                        // user.projects.append[savedProject._id];
                        res.json({projectDetail: project, bugDetail: savedBug})
                    })
                }
            })
        // }
    }
}

module.exports = functions