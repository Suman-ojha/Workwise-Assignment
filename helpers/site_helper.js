const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    generateToken : async function (payload) {
        //here jwt token in encrypted into base64
        const options = { expiresIn: '1d' };
        const tokendata = payload;
        const token = jwt.sign(tokendata, JWTSECRET, options);
        const encodedToken = Buffer.from(token).toString('base64');
        return encodedToken;
    },
    decryptToken : async function (token) {
    //here we decrypt the jwt base64 encoded token
        try {
            const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
            // console.log(decodedToken,"dadta")
            // Verify and decode the JWT token
            const jwt_data = jwt.verify(decodedToken, JWTSECRET);
            return jwt_data;
        }
        catch (e) {
            return { status: 'false', message: e.message || 'Failed to authenticate token.' };
        }
    }
}