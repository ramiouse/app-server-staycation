const router = require("express").Router(); // install router
const apiController = require("../controllers/apiController");
const { upload, uploadMultiple } = require("../middlewares/multer");

router.get("/landing-page", apiController.landingPage);
router.get("/detail-page/:id", apiController.detailsPage);
router.post("/booking-page", upload, apiController.bookingPage);

module.exports = router;
