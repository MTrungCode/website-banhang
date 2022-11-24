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

        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]    
        );
        return product;
    }

    async create(payload) {
        const product = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            product,
            {  $set: { favorite: product.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Product.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAllFavor() {
        const result = await this.Product.findFavorite().deleteMany({});
        return result.deletedCount;
    }
}

module.exports = WebService;