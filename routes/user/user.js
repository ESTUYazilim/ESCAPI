const router = require("express").Router();
const { verifyTokenAndAdmin } = require('../../routes/auth/verifyToken');
const UserModel = require('../../models/UserModel');

// get all registered users
router.get("/list", verifyTokenAndAdmin, async (req, res) => {
    // get users
    UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.json({ message: err }));
});

// get all registered authorized (administrator) users
router.get("/listadmins", verifyTokenAndAdmin, async (req, res) => {
    // get users
    UserModel.find({
        isAdmin: true
    })
    .then(users => res.json(users))
    .catch(err => res.json({ message: err }));
});


module.exports = router;