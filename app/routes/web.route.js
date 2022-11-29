const express = require("express");
const website = require("../controllers/web.controller");

const router = express.Router();

router.route("/")
    .get(website.findAll)
    .post(website.create)
    .delete(website.delete);  

router.route("/:id")
    .get(website.findOne)
    .put(website.update)
    .delete(website.delete);

router.route("/login")
    .post(website.login);

router.route("/signup")
    .post(website.signup)

module.exports = router;