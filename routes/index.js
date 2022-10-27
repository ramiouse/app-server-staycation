var express = require("express");
var router = express.Router();

/* GET home page (first load page). */
router.get("/", function (req, res, next) {
  res.redirect("/admin/signin");
});

module.exports = router;
