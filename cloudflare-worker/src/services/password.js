const crypto = require("node:crypto");

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

function hashPassword(password) {

    const salt = crypto.randomBytes(16).toString("hex");

    const hash = crypto.pbkdf2Sync(
        password,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        DIGEST
    ).toString("hex");

    return {
        salt,
        hash
    };

}

function verifyPassword(password, salt, hash) {

    const verify = crypto.pbkdf2Sync(
        password,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        DIGEST
    ).toString("hex");

    return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(verify)
    );

}

module.exports = {
    hashPassword,
    verifyPassword
};
