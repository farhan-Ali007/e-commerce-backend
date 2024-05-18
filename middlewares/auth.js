const admin = require("../firebase/index");
const User = require("../models/user");

const authCheck = async (req, res, next) => {
    // Debugging: log incoming request headers
    // console.log("Request headers:", req.headers);
    // Check for token in the authtoken header
    const token = req.headers.authtoken;
    // console.log("Token--->",token)
    if (!token) {
        return res.status(401).json({
            error: "No token provided"
        });
    }
    try {
        // Verify the token
        const firebaseUser = await admin.auth().verifyIdToken(token);
        // console.log("Firebase user in auth check", firebaseUser);
        req.user = firebaseUser;
        next();
    } catch (error) {
        console.error("Error verifying Firebase token:", error);
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};


const adminCheck = async (req, res, next) => {

    const { email } = req.user;

    const adminUser = await User.findOne({ email }).exec()

    if (!adminUser || adminUser.role !== "admin") {
        return res.status(404).json({
            err: "Admin resource. Access denied",
        });
    }
    next();
}


module.exports = { authCheck, adminCheck };
