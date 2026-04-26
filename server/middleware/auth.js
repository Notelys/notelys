import jwt from 'jsonwebtoken';
import { ERRORS } from '../constants/error-messages.js';

export const verifyJWT = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null){
        return res.status(401).json({ error: ERRORS.UNAUTHORIZED });
    }
    
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if(err){
            const message = err.name === 'TokenExpiredError'
                ? ERRORS.TOKEN_EXPIRED
                : ERRORS.TOKEN_INVALID;
            const status = err.name === 'TokenExpiredError' ? 401 : 403;
            return res.status(status).json({ error: message });
        }

        req.user = user.id
        next()
    })

};
