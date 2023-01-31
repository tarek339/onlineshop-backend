const jwt = require("jsonwebtoken");

const withLoginAdmin = async (req, res, next) => {
    try {
        const token = req.get("Authorization") // check Authorization
        console.log(token)
        const tokenData = jwt.verify(token, "secret123456") // veryfiy token data
        req.adminUserId = tokenData.adminUserId

        next() // allows next controller to be executed
    } 
    catch (err) {
        res.status(422).json({
            message:"Please log in!"
          })
    }
}

module.exports = withLoginAdmin