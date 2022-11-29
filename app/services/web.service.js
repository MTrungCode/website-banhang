const { ObjectId } = require("mongodb");

class WebService {
    constructor(client) {
        this.Product = client.db().collection('products');
        this.User = client.db().collection('users');
    }
    extractProductData(payload) {
        const product = {
            name: payload.name,
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

    extractUserDataSignup(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            password: payload.password,    
            favorite: payload.favorite,        
        };

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]    
        );
        return user;
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

    async signup(payload) {
        const user = this.extractUserDataSignup(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            {  $set: { favorite: user.favorite === true } },
            { returnDocument: "after", upsert: true }
        );        
        return result.value;
    }

    async findUser(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
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