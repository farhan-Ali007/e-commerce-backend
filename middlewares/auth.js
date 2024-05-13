const admin = require("../firebase/index");

const authCheck = async (req, res, next) => {
    // Debugging: log incoming request headers
    console.log("Request headers:", req.headers);

    // Check for token in the authtoken header
    const token = req.headers.authtoken;

    if (!token) {
        return res.status(401).json({
            error: "No token provided"
        });
    }

    try {
        // Verify the token
        const firebaseUser = await admin.auth().verifyIdToken(token);
         console.log("Firebase user in auth check", firebaseUser);
        req.user = firebaseUser;
        next();
    } catch (error) {
        console.error("Error verifying Firebase token:", error);
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};

module.exports = authCheck;
