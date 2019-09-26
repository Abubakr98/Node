const products = require('../app/controllers/products');
const auth = require('../app/controllers/auth');
const authMiddleWare = require('../middleware/auth');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        next();
    });

    //product
    app.get('/',
        // authMiddleWare,
        products.getAll);
    app.get('/products',
        // authMiddleWare,
        products.getAllJSon);
    app.get('/products/:id',
        // authMiddleWare,
        products.getById);
    app.put('/products/:id',
        // authMiddleWare,
        products.updateOne);
    app.delete('/products/:id',
        // authMiddleWare,
        products.removeOne);
    app.post('/products',
        // authMiddleWare,
        products.createOne);

    app.get('/user/:id',
        // authMiddleWare,
        auth.getUser);

    //auth
    app.post('/signin', auth.signIn);
    app.post('/registration', auth.registration);
    app.post('/refresh-tokens', auth.refreshTokens);
}