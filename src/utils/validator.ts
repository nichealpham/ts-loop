let validator = require('validator');

let email = function (value) { 
    if (!validator.isLength(value, { min: 6, max: 40 })) {
        return false;
    };
    if (!validator.isEmail(value)) {
        return false;
    };
    return true;
}

let text = function (value) {
    // if (!validator.isAlphanumeric(value)) {
    //     return false;
    // };
    return true;
}

let phone = function (value) {
    if (!validator.isMobilePhone(value)) {
        return false;
    };
    return true;
}

let password = function (value) { 
    // if (!validator.isLength(value, { min: 6, max: 25 })) {
    //     return false;
    // };
    return true;
}

export default {
    email,
    phone,
    text,
    password,
}