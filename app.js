const port = process.env.PORT || 1812;
require('dotenv').config();
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');
// async errors


const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products Route</a>')
})

app.use('/api/v1/products', productsRouter);
// Products route


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.URL);
        app.listen(port, console.log(`Listen On http://localhost:${port}`));
    } catch (error) {
        console.log(error)
    }
}

start();