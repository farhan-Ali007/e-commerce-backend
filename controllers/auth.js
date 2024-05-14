const User = require("../models/user");

const createOrUpdateUser = async (req, res) => {
    const { name, picture, email, role } = req.user;
    const defaultName = email.split("@")[0];

    try {
        let user = await User.findOneAndUpdate(
            { email },
            { name: defaultName, picture, role: role ? role : "Subscriber" }, // Ensuring role isn't null/undefined
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        console.log("User updated/created: ", user);
        res.json(user);
    } catch (error) {
        console.error("Error creating/updating user: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const currentUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { createOrUpdateUser, currentUser };
