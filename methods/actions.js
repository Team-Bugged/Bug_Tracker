var helper = require("./helper");
var User = require("../models/user");
var Project = require("../models/project");
var Bug = require("../models/bug");
const moment = require("moment");

const signUp = (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    res.json({ success: false, msg: "Enter all fields" });
  } else {
    var newUser = User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    User.findOne(
      {
        $or: [{ email: req.body.email }, { username: req.body.username }],
      },
      function (err, user) {
        if (err) throw err;
        if (user) {
          res.status(403).send({ success: false, msg: "User exists" });
        } else {
          newUser.save(function (err, newUser) {
            if (err) {
              console.log(err);
              res.json({ success: false, msg: "Failed to save" });
            } else {
              res.json({ success: true, msg: "Successfully Saved" });
            }
          });
        }
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
            token = helper.encodeToken(user._id, user.username);
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
    let userID = helper.getUserId(req).id;
    User.findById(userID, function (err, data) {
      res.json(data);
    });
  } else {
    res.json({ success: false, msg: "No headers" });
  }
};

const getProjectsForAUser = (req, res) => {
  const userID = helper.getUserId(req).username;

  Project.find(
    {
      $or: [
        { projectOwner: userID },
        { projectDevelopers: { $in: [`${userID}`] } },
      ],
    },
    (err, projects) => {
      res.json(projects);
    }
  );
};

const getProjectInfo = (req, res) => {
  let projectID = req.body.id;
  Project.findById(projectID, function (err, data) {
    try {
      res.json(data);
    } catch (err) {
      return err;
    }
  });
};

const getBugsForAUser = (req, res) => {
  const userID = helper.getUserId(req).username;

  Bug.find(
    {
      $or: [{ createdBy: userID }, { assignedTo: { $in: [`${userID}`] } }],
    },
    (err, bug) => {
      res.json(bug);
    }
  );
};

const getBugInfo = (req, res) => {
  let bugID = req.body.id;
  Bug.findById(bugID, function (err, data) {
    try {
      res.json(data);
    } catch (error) {
      return error;
    }
  });
};

const addProject = (req, res) => {
  let userID = helper.getUserId(req).username;

  let newProject = Project({
    projectTitle: req.body.projectTitle,
    projectDescription: req.body.projectDescription,
    projectStartDate: moment().format("DD-MM-YYYY").toString(),
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
  let userID = helper.getUserId(req).username;

  let newBug = Bug({
    createdBy: userID,
    bugTitle: req.body.bugTitle,
    bugDescription: req.body.bugDescription,
    bugStatus: req.body.bugStatus,
    bugSeverity: req.body.bugSeverity,
    bugDueDate: req.body.bugDueDate,
    // comments: req.body.comments,
  });
  newBug.save(function (err, savedBug) {
    if (err) {
      console.log(err);
      res.json({ success: false, msg: err });
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

const addDeveloper = (req, res) => {
  let developer = req.body.developer;
  let projectID = req.body.projectID;

  Project.findOneAndUpdate(
    { _id: projectID },
    { $addToSet: { projectDevelopers: developer } },
    { returnNewDocument: true },
    (err, project) => {
      if (err) {
        res.send(err);
      } else {
        res.json({ projectDetail: project });
      }
    }
  );
};

const assignBug = (req, res) => {
  let bugID = req.body.bugID;
  let assignedTo = req.body.assignedTo;
  let projectID = req.body.projectID;

  let bd, ud;
  Bug.findOneAndUpdate(
    { _id: bugID },
    { $addToSet: { assignedTo: assignedTo } },
    { returnNewDocument: true },
    (err, bugs) => {
      if (err) {
        res.send(err);
      } else {
        bd = { bugDetail: bugs };
      }
    }
  );
  User.findOneAndUpdate(
    { username: assignedTo },
    { $addToSet: { bugs: bugID } },
    { returnNewDocument: true },
    (err, user) => {
      if (err) {
        res.send(err);
      } else {
        ud = { userDetail: user };
      }
    }
  );
  Project.findOneAndUpdate(
    { _id: projectID },
    { $addToSet: { projectDevelopers: assignedTo } },
    { returnNewDocument: true },
    (err, project) => {
      if (err) {
        res.send(err);
      } else {
        res.send({ projectDetail: project, ...ud, ...bd });
      }
    }
  );
};

module.exports = {
  signUp,
  login,
  addProject,
  addBug,
  getInfo,
  assignBug,
  getProjectInfo,
  getBugInfo,
  addDeveloper,
  getProjectsForAUser,
  getBugsForAUser,
};
