const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/dashboard', (req, res) => {
    res.send('dashboard')
})


//@desc Adding new user
//@route POST /adduser
router.post('/adduser', actions.addNew)

//@desc Authenticating user
//@route POST /authenticate
router.post('/authenticate', actions.authenticate)

//@desc Get info on a user
//@route GET /getinfo
router.get('/getinfo', actions.getinfo)

//@desc Adding new project
//@route POST /addproject
router.post('/addproject', actions.addproject)

//@desc Adding new bug
//@route POST /addbug
router.post('/addbug', actions.addbug)

module.exports = router