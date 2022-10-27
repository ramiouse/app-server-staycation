const router = require("express").Router(); // install router
const adminController = require("../controllers/adminController");
const { upload, uploadMultiple } = require("../middlewares/multer");
const auth = require("../middlewares/auth");
// ENDPOINT (GET, POST, PUT, DELETE)

// ENDPOINT SIGNIN
router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.actionSignin);
router.get("/logout", adminController.actionLogout);

// using 'auth' for signin/ login
router.use(auth);

// ENDPOINT DASHBOARD
router.get("/dashboard", adminController.viewDashboard);

// ENDPOINT CATEGORY
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

// ENDPOINT BANK
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

// ENDPOINT ITEM
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.get("/item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id/:categoryId", adminController.deleteItem);

// ENDPOINT DETAIL ITEM
router.get("/item/show-detail-item/:itemId", adminController.viewDetailItem);

// sub feature
router.post("/item/add/feature", upload, adminController.addFeature);
router.put("/item/update/feature", upload, adminController.editFeature);
router.delete("/item/:itemId/feature/:id", adminController.deleteFeature);

// sub activity
router.post("/item/add/activity", upload, adminController.addActivity);
router.put("/item/update/activity", upload, adminController.editActivity);
router.delete("/item/:itemId/activity/:id", adminController.deleteActivity);

// ENDPOINT BOOKING
router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.showDetailBooking);
router.put("/booking/:id/confirmation", adminController.actionConfirmation);
router.put("/booking/:id/reject", adminController.actionReject);

module.exports = router;
