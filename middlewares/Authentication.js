
const checkCredentials = async (req, res, next) => {
    if (req.get('Authorization')) {
        const id = req.get('Authorization')
        req.user_id = id;
        next()
    } else {
        res.status(400).send({ message: 'User isnot valid' })
    }
}

module.exports = { checkCredentials }