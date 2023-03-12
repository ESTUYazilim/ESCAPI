
const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 256,
        min: 2
    },
    link: {
        type: String,
        required: true,
        max: 512,
        min: 2
    },
    description: {
        type: String,
        required: true,
        max: 1024,
        min: 2
    },
    del: {
        type: Boolean,
        default: false
    }
},
{timestamps: true});

module.exports = mongoose.model('CourseSchema', CourseSchema);