require('dotenv').config();

const Product = require('./models/product');
const connectDB = require('./db/connect');

const jsonProducts = require('./products.json');

const start = async () => {
    try {
        await connectDB(process.env.URL);
        await Product.deleteMany();
        await Product.create(jsonProducts);
        console.log('Success!!!');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1); // catch error
    }
};
start();