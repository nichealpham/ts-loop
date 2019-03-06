import { CommonFunctions } from "../utils/common";

export default () => {
    return function authenticator (req: any, res: any, next: any) {
        req.isAuthenticated = false;
        if (!req.headers['_uuid'] && !req.query['_uuid']) {
            next(CommonFunctions.systemError('UNAUTHENTICATED'));
        }
        if (!req.headers['authorization'] && !req.query['authorization']) {
            next(CommonFunctions.systemError('UNAUTHENTICATED'));
        }
        req.isAuthenticated = true;
        req.userAuthen = {
            _id: req.headers['_uuid'] || req.query['_uuid'],
            accessToken: req.headers['authorization'] || req.query['authorization'],
            email: req.headers['email'] || req.query['email'],
        };
        next();
    }
};