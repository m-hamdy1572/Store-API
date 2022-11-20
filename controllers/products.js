const Product = require('../models/product');
const getAllProductsStatic = async (req, res) => {
    try {
        const search = 'ab';
        const products = await Product.find({});
    //     name: { $regex: search, $options: 'i' }
    //     // i Case insensitivity to match upper and lower cases
    // });
    console.log(req.query);
    res.status(200).json({ products, nbHits: products.length });
    } catch (error) {
        res.status(500).json({ msg: error["errors"]["name"]["message"] });
    }
    
};

const getAllProducts = async (req, res) => {
    try {
        const { featured, company, name, sort, fields, numericFilters } = req.query;
        const queryObject = {};
        if (featured) {
            queryObject.featured = featured === 'true' ? true : false;
        }
        if (company) {
            queryObject.company = company;
        }
        if (name) {
            queryObject.name = { $regex: name, $options: 'i' };
        }
        if (numericFilters) {
            const operatorMap = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<': '$lt',
                '<=': '$lte',
            };
            const rexEx = /\b(<|>|>=|<=|=)\b/g;
            let filters = numericFilters.replace(
                rexEx,
                (match) => `-${operatorMap[match]}-`);
            const options = ['price', 'rating'];
            filters = filters.split(',').forEach((item) => {
                const [field, operator, value] = item.split('-')
                if (options.includes(field)) {
                    queryObject[field] = { [operator]: Number(value) };
                }
            });
        
        }
        console.log(queryObject);
        let result = Product.find(queryObject);
        if (sort) {
            const sortList = sort.split(',').join(' ');
            result = result.sort(sortList);
        } else {
            result = result.sort('createAt');
        }
        if (fields) {
            const fieldsList = fields.split(',').join(' ');
            result = result.select(fieldsList);
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        result.skip(skip).limit(limit);
        const products = await result;
        res.status(200).json({ products, nbHits: products.length });
    } catch (error) {
        res.status(500).json({ msg: error["errors"]["name"]["message"] });
    }
};
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ product });
    } catch (error) {
        res.status(500).json({ msg: error["errors"]["name"]["message"] });
    }
}
const updateProduct = async (req, res) => {
    try {
        const productID = req.query._id;
        console.log(productID);
        const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
            new: true, runValidators: true
        });
        if (!product) {
            //return next(createCustomError(`No task with id: ${taskID}`, 404));
            return res.status(404).json({ msg: `No product with id: ${productID}` });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ msg: error["errors"]["name"]["message"] });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const productID = req.query._id;
        console.log(productID);
        const product = await Product.findOneAndDelete({ _id: productID });
        if (!product) {
            //return next(createCustomError(`No task with id: ${taskID}`, 404));
            return res.status(404).json({ msg: `No product with id: ${productID}` });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ msg: error["errors"]["name"]["message"] });
    }
};
module.exports = {
    getAllProducts,
    getAllProductsStatic,
    createProduct,
    updateProduct,
    deleteProduct,
};
