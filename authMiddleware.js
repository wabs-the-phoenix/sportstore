const jwt = require('jsonwebtoken');
const APP_SECRET = 'myappsecret';
const USERNAME = "admin";
const PASSWORD = "secret";

module.exports = (req, res, next) => {
    if((req.url == '/api/login' || req.url == '/login' ) && req.method == 'POST') {
        if( req.body != null && req.body.name == USERNAME
            && req.body.password == PASSWORD) {
            let token = jwt.sign({data: USERNAME, expiresIn: '1h'}, APP_SECRET);
            res.json({ success: true, token: token });
        }
        else {
            res.json({ success: false });
        }
        res.end();
        return;
    }
    else if ((((req.url.startsWith('/api/products') || req.url.startsWith('/products'))
    || (req.url.startsWith('/api/categories') || req.url.startsWith('/categories'))) && req.method 
    != 'GET')
    || ((req.url.startsWith('/api/orders') || req.url.startsWith('/orders')) && req.method == 'POST')) {
        let token = req.headers['authorization'];
        if(token != null && token.startsWith('Bearer<')) {
            try {
                token = token.substring(7, token.length - 1);
                jwt.verify(token, APP_SECRET);
                next();
                return;
            } catch (error) {
                res.statusCode = 500;
                res.end();
                return;
            }
        }
        res.statusCode = 401;
        res.end();
        return;
    }
    next();
}