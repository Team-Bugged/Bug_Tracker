const express = require("express");
const actions = require("../methods/actions");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/dashboard", (req, res) => {
  res.send("dashboard");
});

//@desc Adding new user
//@route POST /signup
router.post("/signup", actions.signUp);

//@desc Authenticating user
//@route POST /login
router.post("/login", actions.login);

//@desc Get info on a user
//@route GET /getinfo
router.get("/getinfo", actions.getInfo);

router.get("/getprojectinfo", actions.getProjectInfo);

router.get("/getprojectsforauser", actions.getProjectsForAUser);

router.get("/getbugsForaUser", actions.getBugsForAUser);

router.get("/getbuginfo", actions.getBugInfo);

//@desc Adding new project
//@route POST /addproject
router.post("/addproject", actions.addProject);

router.post("/editproject", actions.editProject);

//@desc Adding new bug
//@route POST /addbug
router.post("/addbug", actions.addBug);

router.post("/editbug", actions.editBug);

router.post("/assignbug", actions.assignBug);

router.post("/adddeveloper", actions.addDeveloper);

router.put('/editProject',actions.editProject);

module.exports = router;
