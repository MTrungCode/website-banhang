const WebService = require("../services/web.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body?.title) {
        return next(new ApiError(400, "Title can not be empty"));
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

exports.findAll = (req, res) => {
    res.send({ message: "findAll" });
};

exports.findOne = (req, res) => {
    res.send({ message: "findOne" });
};

exports.update = (req, res) => {
    res.send({ message: "update" });
};

exports.delete = (req, res) => {
    res.send({ message: "delete" });
};

exports.deleteAll = (req, res) => {
    res.send({ message: "deleteAll" });
};

exports.findAllFavorite = (req, res) => {
    res.send({ message: "findAllFavorite" });
};