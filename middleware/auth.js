import JWT from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            next("acess denied")
        }
        const token = authHeader.split('')[1]

        const verified = JWT.verify(token, process.env.SECRET_KEY)
        req.user = verified
        next()

    } catch (err) {
        next('Auth failed')
    }
}

export default authMiddleware;