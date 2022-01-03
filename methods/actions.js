var helper = require("./helper");
var User = require("../models/user");
var Project = require("../models/project");
var Bug = require("../models/bug");

const signUp = (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ success: false, msg: "Enter all fields" });
  } else {
    var newUser = User({
      email: req.body.email,
      password: req.body.password,
    });
    User.findOne(
      {
        email: req.body.email,
      },
      function (err, user) {
        if (err) throw err;
        if (user) {
          res.status(403).send({ success: false, msg: "User exists" });
        }
        newUser.save(function (err, newUser) {
          if (err) {
            console.log(err);
            res.json({ success: false, msg: "Failed to save" });
          } else {
            res.json({ success: true, msg: "Successfully Saved" });
          }
        });
      }
    );
  }
};

const login = (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    function (err, user) {
      if (err) throw err;
      if (!user) {
        res.status(404).send({
          success: false,
          msg: "Authentication failed, User not found",
        });
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            token = helper.encodeToken(user._id);
            res.json({ success: true, token: token });
          } else {
            res.status(403).send({
              success: false,
              msg: "Authentication failed, wrong password",
            });
          }
        });
      }
    }
  );
};

const getInfo = (req, res) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    let userID = helper.getUserId(req);
    res.json({ success: true, msg: userID });
  } else {
    res.json({ success: false, msg: "No headers" });
  }
};

const addProject = (req, res) => {
  let userID = helper.getUserId(req);

  let newProject = Project({
    projectTitle: req.body.projectTitle,
    projectDescription: req.body.projectDescription,
    projectStartDate: req.body.projectStartDate,
    projectOwner: userID,
    projectStatus: req.body.projectStatus,
  });

  newProject.save(function (err, savedProject) {
    if (err) {
      console.log(err);
      res.json({ success: false, msg: "Failed to save" });
    } else {
      User.findOneAndUpdate(
        { _id: userID },
        { $push: { projects: savedProject._id } },
        (err, user) => {
          if (err) {
            res.send(err);
          } else {
            res.json({ projectDetail: savedProject, userDetail: user });
          }
        }
      );
    }
  });
};

const addBug = (req, res) => {
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
      console.log(err);
      res.json({ success: false, msg: "Failed to save" });
    } else {
      Project.findOneAndUpdate(
        { _id: projectID },
        { $push: { bugs: savedBug._id } },
        (err, project) => {
          if (err) {
            res.send(err);
          } else {
            res.json({ projectDetail: project, bugDetail: savedBug });
          }
        }
      );
    }
  });
};

module.exports = { signUp, login, addProject, addBug, getInfo };
