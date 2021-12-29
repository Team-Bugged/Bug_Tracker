var User = require('../models/user')
var Project = require('../models/project')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const { db } = require('../models/user')
var Bug = require('../models/bug')

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
                        var token = jwt.encode(user, config.secret)
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
            return res.json({success: true, msg: decodedtoken.usn, email: decodedtoken.email})
        }
        else {
            return res.json({success: false, msg: 'No headers'})
        }
    },
    addproject: function(req, res) {
        if ((!req.body.projectTitle) || (!req.body.projectDescription)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newProject = Project({
                projectTitle: req.body.projectTitle,
                projectDescription: req.body.projectDescription,
            });
            newProject.save(function (err, newProject) {
                if (err) {
                    console.log(err)
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully Saved'})
                }
            })
        }
    },
    addbug: function(req, res) {
        if ((!req.body.bugTitle) || (!req.body.bugDescription) || (!req.body.bugSeverity) || (!req.body.bugDueDate)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newBug = Bug({
                bugTitle: req.body.bugTitle,
                bugDescription: req.body.bugDescription,
                bugSeverity: req.body.bugSeverity,
                bugDueDate: req.body.bugDueDate,
                comments: req.body.comments,
                reviews: req.body.reviews,
            });
            newBug.save(function (err, newBug) {
                if (err) {
                    console.log(err)
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully Saved'})
                }
            })
        }
    }
}

module.exports = functions