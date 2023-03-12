const router = require("express").Router();
const { auth, verifyTokenAndAdmin } = require('../../routes/auth/verifyToken');
const CourseModel = require('../../models/CourseModel');
const { courseValidation } = require('../../common/validation');

// get all courses
router.get('/', auth, async (req, res) => {
    // get courses
    const courses = await CourseModel.find({
        del: false
    });

    // return all active courses
    return res.status(200).json(courses);
});

// delete given course
router.delete('/:courseId', verifyTokenAndAdmin, async (req, res) => {
    var courseId = req.params.courseId;

    // check if course exists
    const course = await CourseModel.findOne({
        _id: courseId
    });

    // if course does not exist
    if (!course) {
        // return error
        return res.status(404).json("Course not found!");
    }

    // check if the course is already deleted
    if (course.del) {
        // return error
        return res.status(400).json("Course already deleted!");
    }

    // get course and update del to true
    await CourseModel.updateOne({
        _id: courseId
    }, {
        $set: {
            del: true
        }
    });

    // get course object
    const updatedCourse = await CourseModel.findOne({
        _id: courseId
    });


    // return updated course
    return res.status(200).json(updatedCourse);
});

// update given course
router.put('/:courseId', verifyTokenAndAdmin, async (req, res) => {
    // get course id
    var courseId = req.params.courseId;

    // check if the given course exists
    const course = await CourseModel.findOne({
        _id: courseId
    });

    // if course does not exist
    if (!course) {
        // return error
        return res.status(404).json("Course not found!");
    }

    // validate course
    const { error } = courseValidation(req.body);

    // if error
    if (error) {
        // return error
        return res.status(400).json(error.details[0].message);
    }

    // get course and update it
    await CourseModel.updateOne({
        _id: courseId
    }, {
        $set: {
            name: req.body.name,
            description: req.body.description,
            link: req.body.link
        }
    });

    // get updated course
    const updatedCourse = await CourseModel.findOne({
        _id: courseId
    });

    // return updated course
    return res.status(200).json(updatedCourse);
});

// create new course
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    // create new course
    const course = new CourseModel({
        name: req.body.name,
        description: req.body.description,
        link: req.body.link
    });

    // validate course
    const { error } = courseValidation(req.body);

    // if error
    if (error) {
        // return error
        return res.status(400).json(error.details[0].message);
    }

    // save course
    const savedCourse = await course.save();

    // return saved course
    return res.status(200).json(savedCourse);
});

module.exports = router;