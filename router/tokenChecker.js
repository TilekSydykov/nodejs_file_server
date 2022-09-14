const jwt = require('jsonwebtoken')
const config = require('../config')
const userRepository = require('../repository/user.repository')

module.exports = (req,res,next) => {
    const token = req.headers['authorization'] ? req.headers['authorization'].split('Bearer ')[1]: ''
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).json({"error": true, "message": 'Unauthorized access or token expired' });
            }
            userRepository.getById(decoded.id).then(result => {
                if (result.length > 0 && result[0].token && result[0].token === token) {
                    req.user = result[0]
                    req.decoded = decoded;
                    next();
                } else {
                    return res.status(401).json({"error": true, "message": 'Unauthorized access or token expired' });
                }
            })
        });
    } else {
        return res.status(403).send({
            "error": true,
            "message": 'No token provided.'
        });
    }
}
