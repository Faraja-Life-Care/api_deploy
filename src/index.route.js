const router = require("express").Router();

router.use("/users", require("./users/user.route"));
router.use("/clients", require("./clients/client.route"));
router.use("/consumptions", require("./consumptions/consumption.route"));

module.exports = router;
