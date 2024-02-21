const User = require("../../models/User");

const userCreate = async () => {
    await User.create({
        firstName: "Dergi",
        lastName: "Samlop",
        email: "dergisamlop@gmail.com",
        password: "dergi1234",
        phone: "1234567890",
    });
}

module.exports = userCreate;