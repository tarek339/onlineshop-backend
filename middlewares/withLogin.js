const jwt = require("jsonwebtoken");

const withLogin = async (req, res, next) => {
    try {
        const token = req.get("Authorization") // check Authorization
        console.log(token)
        const tokenData = jwt.verify(token, "secret123") // veryfiy token data
        req.userId = tokenData.userId

        next() // allows next controller to be executed
    } 
    catch (err) {
        res.status(422).json({
            message:"Please log in!"
          })
    }
}

module.exports = withLogin