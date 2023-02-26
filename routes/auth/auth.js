const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/UserModel');
const { registerValidation, loginValidation } = require('../../common/validation');
const { auth } = require('./verifyToken');
const jwt = require('jsonwebtoken');

// register route
router.post('/register', async (req, res) => {
    // register validation validation
    const { error } = registerValidation(req.body);

    if (error) return res.status(400)
        .send(error.details[0].message);

    // checking if secret is correct
    const secret = process.env.AUTHENTICATION_SECRET;
    const givenSecret = req.body.secret;
    if (secret !== givenSecret) return res.status(400).send('Wrong parameters.');

    // checking if email is already taken
    var existingUser = await User.findOne({ email: req.body.email });
    
    if (existingUser) return res.status(400).send('Email is already taken.');
    
     // hash the password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
     // create new user
     const user = new User({
         name: req.body.name,
         studentNumber: req.body.studentNumber,
         email: req.body.email,
         department: req.body.department,
         password: hashedPassword,
         isAdmin: false
     });
 
     // then save user
     user.save()
         .then(savedUser => res.send({ user: savedUser._id }))
         .catch(err => res.send({ "messages": err }));
});

// login route
router.post('/login', async (req, res) => {
    // validation
    const { error } = loginValidation(req.body);

    if (error) return res.status(400)
        .send(error.details[0].message);

    // checking if email is on the database
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send('Wrong e-mail or password.');

    // check password correct
    const validPassword = await bcrypt
        .compare(req.body.password,
            user.password);

    // if not then return bad request
    if (!validPassword) return res.status(400).send('Wrong e-mail or password.');

    // create and assign jwt
    const token = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            studentNumber: user.studentNumber,
            email: user.email,
            isAdmin: user.isAdmin

        }, process.env.SECRET);

    // return jwt as auth-token in header
    res.header('auth-token', token).send(token);
});

// authorize route
router.post('/authorize', auth, async (req, res) => {
    // get auth secret from dotenv
    let authSecret = req.body.secret;

    // if auth secret is not valid then return
    if (process.env.AUTHORIZE_SECRET !== authSecret) {
        return res.status(400).send('Wrong parameters.');
    }

    // get userID then get user by id
    let userID = req.user._id;
    const user = await User.findById(userID);

    // check whether the user is already authorized
    if (user.isAdmin) {
        return res.status(400).send('User is already authorized!');
    }

    // update user
    try {
        await User.findByIdAndUpdate(userID, {
            $set: {
                id: user.id,
                email: user.email,
                name: user.name,
                studentNumber: user.studentNumber,
                password: user.password,
                date: user.date,
                isAdmin: true
            }
        }, { new: true }).then(result => {
            return res.status(200).json(result);
        });
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router