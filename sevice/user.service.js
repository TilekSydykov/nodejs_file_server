const jwt = require("jsonwebtoken");
const config = require("../config");
const userRepository = require('../repository/user.repository')
const bcrypt = require('bcrypt');

const registerUser = async (user) => {
    let data = await userRepository.getById(user.id)
    if (!data[0] && user.id && user.password) {
        // register user
        user.password = await bcrypt.hash(user.password, 10)
        const tokens = signJWT({id: user.id})
        user.refresh_token = tokens.refreshToken
        user.token = tokens.token
        const data = await userRepository.insertUser(user)
        if (data.affectedRows === 0) throw new Error()
        return tokens
    } else {
       throw new Error("user exist or one of the fields required")
    }
}

const loginUser = async (user) => {
    let data = await userRepository.getById(user.id)
    if (data[0] && user.id && user.password) {
        // check password
        const userFromDb = data[0];
        if (!(await bcrypt.compare(user.password, userFromDb.password))) throw new Error("password or id not correct")
        const tokens = signJWT({id: userFromDb.id})
        const result = await userRepository.updateTokens(userFromDb.id, tokens.token, tokens.refreshToken)
        if (result.affectedRows === 0) throw new Error()
        return tokens
    } else {
        throw new Error("user not exist or one of the fields required")
    }
}

const newToken = async (user) => {
    let data = await userRepository.getByRefreshToken(user.refresh_token)
    const userFromDb = data[0];
    if (userFromDb && user.token &&
        user.token === userFromDb.token
    ) {
        // check password
        const tokens = signJWT({id: userFromDb.id})
        const result = await userRepository.updateToken(userFromDb.id, tokens.token)
        if (result.affectedRows === 0) throw new Error()
        return tokens
    } else {
        throw new Error("token not exist or deleted")
    }
}

const logOut = async (user) => {
    await userRepository.deleteTokens(user.id)
    return "ok"
}

const signJWT = data => {
    return  {
        token: jwt.sign(data, config.secret, { expiresIn: config.tokenLife}),
        refreshToken: jwt.sign(data, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
    }
}

module.exports = {
    registerUser,
    loginUser,
    logOut,
    newToken
}
