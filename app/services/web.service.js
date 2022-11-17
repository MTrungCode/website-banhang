const { ObjectId } = require("mongodb");

class WebService {
    constructor(client) {
        this.Product = client.db().collection('products');
    }
    extractProductData(payload) {
        const product = {
            title: payload.title,
            description: payload.description,
            thumbar: payload.thumbar,
            ingredients: payload.ingredients,
            method: payload.method,
            favorite: payload.favorite,
        };

        Objects.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]    
        );
        return product;
    }

    async create(payload) {
        const product = this.extractProductData(payload);
        console.log(product);
        const result = await this.Product.findOneAndUpdate(
            product,
            {  $set: { favorite: product.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
}

module.exports = WebService;