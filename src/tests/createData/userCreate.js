const User = require("../../models/User");

const userCreate = async () => {
    await User.create({
            "firstName": "Juan",
            "lastName": "Juan",
            "email": "juan@gmail.com",
            "password": "juan1234",
            "phone": "+52-99661122"
    });
}

module.exports = userCreate;