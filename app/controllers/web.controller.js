const WebService = require("../services/web.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const Bcrypt = require('bcryptjs');

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    if (!req.body?.description) {
        return next(new ApiError(400, "Description can not be empty"));
    }
    if (!req.body?.thumbar) {
        return next(new ApiError(400, "Thumbar can not be empty"));
    }
    if (!req.body?.ingredients) {
        return next(new ApiError(400, "Ingredients can not be empty"));
    }
    if (!req.body?.method) {
        return next(new ApiError(400, "Method can not be empty"));
    }

    try {
        const webService = new WebService(MongoDB.client);
        const document = await webService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the product")
        );
    }
};

exports.signup = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    if (!req.body?.email) {
        return next(new ApiError(400, "Email can not be empty"));
    }
    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    } else if (req.body?.password.length < 8) {
        return next(new ApiError(400, "Password is at least 8 characters"));
    }
    if (!req.body?.confirmPassword) {
        return next(new ApiError(400, "ConfirmPassword can not be empty"));
    } else if (req.body?.confirmPassword != req.body?.password) {
        return next(new ApiError(400, "ConfirmPassword should like password"));
    }    
    try {
        var hashPassword = Bcrypt.hashSync(req.body?.password, 10);
        req.body.password = hashPassword;
        const webService = new WebService(MongoDB.client);
        const document = await webService.signup(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while registering the user")
        );
    }
};

exports.login = async (req, res, next) => {
    if (!req.body?.email) {
        return next(new ApiError(400, "Email can not be empty"));
    }
    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }

    try {
        const webService = new WebService(MongoDB.client);
        const document = await webService.findUser({});
        document.forEach(user => {
            if (user.email == req.body.email) {
                hash = user.password;
                if (!Bcrypt.compareSync(req.body.password, hash)) {
                    return res.send(new ApiError(400, "Password is wrong"));
                } else {
                    return res.send(user.name);
                }
            }
        });
        return res.send(new ApiError(400, "Email not exist"));
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while loging in")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const webService = new WebService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await webService.findByName(name);
        } else {
            documents = await webService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving products")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const webService = new WebService(MongoDB.client);
        const document = await webService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving product with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(404, "Data to update can not be empty"));
    }

    try {
        const webService = new WebService(MongoDB.client);
        const document = await webService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }

        return res.send({ message: "Product was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating product with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const webService = new WebService(MongoDB.client);
        const document = await webService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete product with id=${req.params.id}`)
        );
    }
};