const Joi = require('@hapi/joi');

// register validation
const registerValidation = (body) =>{
    // create schema
    const schema = Joi.object({
        secret: Joi.string()
            .hex()
            .length(32)
            .required(),
        name: Joi.string()
            .min(6)
            .required(),
        studentNumber: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .email()
            .required(),
        department: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    });

    // validate schema
    return schema.validate(body);
}

// login validation
const loginValidation = (body) =>{
    // create schema
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    });

    // validate schema
    return schema.validate(body);
}

// export validations
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;