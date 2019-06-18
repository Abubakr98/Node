const products = require('../app/controllers/products');
const auth = require('../app/controllers/auth');
const authMiddleWare = require('../middleware/auth');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const mongoose = require('mongoose');

const ProductDB = mongoose.model('Product');
module.exports = (app) => {
    app.use('/graphql', graphQLHttp({
        schema: buildSchema(`
                input ProductInput {
                    name: String
                    price: Int                    
                }
                input ProductUpdateInput {
                    product_id: Int
                    name: String
                    price: Int            
                }
                type CreateProduct {
                    name: String
                    price: Int      
                }
                type UpdateProduct {
                    name: String
                    price: Int      
                }
                type Product {
                    _id: ID
                    name: String
                    price: String
                    product_id: String  
                }
                type ProductDeleted {
                    message: String
                }
                type RootQuery {
                    events: [String!]!
                    products: [Product]
                    productById(product_id: Int): Product
                    
                }
                type RootMutation {
                    createEvent(name: String): String
                    createProduct(productInput: ProductInput): CreateProduct
                    updateProduct(productUpdateInput: ProductUpdateInput): UpdateProduct
                    removeProduct(product_id: Int): ProductDeleted
                }
                schema {
                    query: RootQuery
                    mutation: RootMutation
                }
        `),
        rootValue: {
            events: () => {
                return ['some 1', 'some 2', 'some 3']
            },
            createEvent: (args) => {
                const eventName = args.name;
                return eventName;
            },
            products: () => {
                return products.getAll()
            },
            productById: (args) => {
                const bar = products.getById(args.product_id);
                return bar;
            },
            removeProduct: (args) => {
                return products.removeOne(args.product_id);
            },
            createProduct: (args) => {
                console.log(args.productInput);
                products.createOne(args.productInput)
                return args.productInput;
            },
            updateProduct: (args) => {
                // console.log(args.productUpdateInput);
                products.updateOne(args.productUpdateInput)
                return args.productUpdateInput;
            }
        },
        graphiql: true
    }));

    //product
    // app.get('/',
    //     // authMiddleWare,
    //     products.getAll);
    // app.get('/products',
    //     // authMiddleWare, 
    //     products.getAllJSon);
    // app.get('/products/:id',
    //     // authMiddleWare ,
    //     products.getById);
    // app.put('/products/:id',
    //     // authMiddleWare, 
    //     products.updateOne);
    // app.delete('/products/:id',
    //     // authMiddleWare, 
    //     products.removeOne);
    // app.post('/products',
    //     // authMiddleWare, 
    //     products.createOne);

    //auth
    app.get('/signin', auth.signIn);
    app.post('/registration', auth.registration);
    app.get('/refresh-tokens', auth.refreshTokens);
}