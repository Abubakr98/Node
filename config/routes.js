const products = require('../app/controllers/products');
const auth = require('../app/controllers/auth');
const authMiddleWare = require('../middleware/auth');

module.exports = (app) => {
    //product
    app.get('/', 
    // authMiddleWare,
    products.getAll );
    app.get('/products', 
    // authMiddleWare, 
    products.getAllJSon);
    app.get('/products/:id', 
    // authMiddleWare ,
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

    //auth
    app.get('/signin', auth.signIn );
    app.post('/registration', auth.registration );
    app.get('/refresh-tokens', auth.refreshTokens );
}