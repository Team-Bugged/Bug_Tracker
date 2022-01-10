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

//@desc Adding new project
//@route POST /addproject
router.post("/addproject", actions.addProject);

//@desc Adding new bug
//@route POST /addbug
router.post("/addbug", actions.addBug);

router.post("/assignbug", actions.assignBug);

module.exports = router;
