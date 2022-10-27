/* ---------------------------------------------------------
    CONSTANTA 
*/
const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Member = require("../models/Member");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const Booking = require("../models/Booking");
const Users = require("../models/Users");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");

/* ---------------------------------------------------------
    START NODULE 
*/
module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          alert,
          title: "Staycation | Login",
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/signin");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash("alertMessage", "Username nor found!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
        return "";
        // break
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Password is don't match !");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
        return "";
        // break
      }

      // add session 'user'
      req.session.user = {
        id: user.id,
        username: user.username,
      };

      // goo
      res.redirect("/admin/dashboard");
    } catch (error) {
      return ""; // must to return "", cause used async await
      res.redirect("/admin/signin");
    }
  },

  actionLogout: async (req, res) => {
    // destroy 'user'
    req.session.destroy();
    res.redirect("/admin/signin");
  },

  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("admin/dashboard/view_dashboard", {
        title: "Staycation | Dashboard",
        user: req.session.user,
        member,
        booking,
        item,
      });
    } catch (error) {
      res.redirect("/admin/dashboard");
    }
  },
  // SECTION CATEGORY
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view_category", {
        category,
        alert,
        user: req.session.user,
        title: "Staycation | Category",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      // console.log(category);
      category.name = name;
      await category.save();
      req.flash("alertMessage", "Success Update Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash("alertMessage", "Success Delete Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", "Success Add Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  // END CATEGORY

  /* ---------------------------------------------------------
     SECTION BANK 
  */
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/bank/view_bank", {
        bank,
        host: process.env.REACT_APP_HOST,
        alert,
        user: req.session.user,
        title: "Staycation | Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  addBank: async (req, res) => {
    try {
      const { name, nameBank, nomorRekening } = req.body;
      // console.log(req.file);
      await Bank.create({
        name,
        nameBank,
        nomorRekening,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Success Add Category");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });

      if (req.file == undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash("alertMessage", "Success Update Bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        const fileImagePath = path.join(`public/${bank.imageUrl}`);
        fs.existsSync(fileImagePath) ? await fs.unlink(fileImagePath) : "";

        // save all
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();

        req.flash("alertMessage", "Success Update Bank");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      req.flash("alertMessage", "Success Delete Bank");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  /* ---------------------------------------------------------
     END SECTION BANK 
  */

  /* ---------------------------------------------------------
     SECTION ITEMS 
  */

  viewItem: async (req, res) => {
    try {
      // create & show 'data relation' of table category, image, items
      const item = await Item.find()
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({
          path: "categoryId",
          select: "id name",
        });
      // console.log(item);
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        category,
        item,
        alert,
        user: req.session.user,
        title: "Staycation | Items",
        action: "view",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showImageItem: async (req, res) => {
    try {
      // type id is 'object'
      const { id } = req.params;
      // create & show 'data relation' of table category, image, items
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId", // 'referensi' relation
        select: "id imageUrl", // 'fields' to showing
      });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        category,
        item,
        alert,
        user: req.session.user,
        title: "Staycation | Show image item",
        action: "show_image",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  showEditItem: async (req, res) => {
    try {
      // type id is 'object'
      const { id } = req.params;
      // create & show 'data relation' (populate function) of table category, image, items
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "imageId", // 'referensi' relation
          select: "id imageUrl", // 'fields' to showing
        })
        .populate({
          path: "categoryId", // 'referensi' relation
          select: "id name", // 'fields' to showing
        });

      // console.log(item);
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("admin/item/view_item", {
        category,
        item,
        user: req.session.user,
        alert,
        title: "Staycation | Edit item",
        action: "edit",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, description } = req.body;
      // use 'files'cause input file type is 'multiple'
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          description,
          price,
          city,
        };
        // await will running all to ending 'await' process ?
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }

        req.flash("alertMessage", "Success add Item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, city, description } = req.body;

      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });

      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          const fileImagePath = path.join(`public/${imageUpdate.imageUrl}`);
          fs.existsSync(fileImagePath) ? await fs.unlink(fileImagePath) : "";

          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = description;
        item.categoryId = categoryId;
        await item.save();

        req.flash("alertMessage", "success update item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = description;
        item.categoryId = categoryId;
        await item.save();

        req.flash("alertMessage", "success update item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id, categoryId } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");
      for (let i = 0; i < item.imageId.length; i++) {
        // using 'promise'
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          });
      }

      const category = await Category.findOne({ _id: categoryId }).populate(
        "itemId"
      );
      for (let i = 0; i < category.itemId.length; i++) {
        if (category.itemId[i]._id.toString() === item._id.toString()) {
          // remove itemId of the collection is choose to delete
          category.itemId.pull({ _id: item._id });
          // save collection
          await category.save();
        }
      }
      // remove item 'collection'
      await item.remove();
      req.flash("alertMessage", "Success delete item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const actionView = req.flash("actionView");
      const alert = {
        message: alertMessage,
        status: alertStatus,
        actionView: actionView,
      };

      // get 'feature' or 'activity' is relationed to 'item'
      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });

      res.render("admin/item/detail_item/view_detail_item", {
        title: "Staycation | Detail Item",
        alert,
        itemId,
        user: req.session.user,
        activity,
        feature,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },

  /* ---------------------------------------------------------
    END SECTION ITEMS 
  */
  /* ---------------------------------------------------------
     SECTION FEATURE 
  */

  addFeature: async (req, res) => {
    try {
      const { name, qty, itemId } = req.body;
      // console.log(req.file);
      if (!req.file) {
        req.flash("alertMessage", "Image no found");
        req.flash("alertStatus", "danger");
        req.flash("actionView", "feature");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }

      // 'create' data and put it to the 'const'
      const feature = await Feature.create({
        name,
        qty,
        imageUrl: `images/${req.file.filename}`,
        itemId,
      });

      // add 'featuredId' to the item table 'as relationship'
      const item = await Item.findOne({ _id: itemId });
      item.featuredId.push({ _id: feature._id });

      // save it
      await item.save();

      req.flash("alertMessage", "Success Add Feature");
      req.flash("alertStatus", "success");
      req.flash("actionView", "feature");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      req.flash("actionView", "feature");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    try {
      const { id, name, qty, itemId } = req.body;
      const feature = await Feature.findOne({ _id: id });

      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMessage", "Success Update Feature");
        req.flash("alertStatus", "success");
        req.flash("actionView", "feature");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        const fileImagePath = path.join(`public/${feature.imageUrl}`);
        fs.existsSync(fileImagePath) ? await fs.unlink(fileImagePath) : "";

        // save all
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();

        req.flash("alertMessage", "Success Update Feature");
        req.flash("alertStatus", "success");
        req.flash("actionView", "feature");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      req.flash("actionView", "feature");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    try {
      const { id, itemId } = req.params;
      const feature = await Feature.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate("featuredId");
      for (let i = 0; i < item.featuredId.length; i++) {
        if (item.featuredId[i]._id.toString() === feature._id.toString()) {
          item.featuredId.pull({ _id: feature._id });
          await item.save();
        }
      }
      const fileImagePath = path.join(`public/${feature.imageUrl}`);
      fs.existsSync(fileImagePath) ? await fs.unlink(fileImagePath) : "";

      // remove item 'collection'
      await feature.remove();

      req.flash("alertMessage", "Success delete feature");
      req.flash("alertStatus", "success");
      req.flash("actionView", "feature");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      req.flash("actionView", "feature");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  /* ---------------------------------------------------------
     SECTION ACTIVITY
  */

  addActivity: async (req, res) => {
    try {
      const { name, type, itemId } = req.body;
      // console.log(req.file);
      if (!req.file) {
        req.flash("alertMessage", "Image not found");
        req.flash("alertStatus", "danger");
        req.flash("actionView", "activity");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      // 'create' data and put it to the 'const'
      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      // add 'featuredId' to the item table 'as relationship'
      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });

      // save it
      await item.save();

      req.flash("alertMessage", "Success Add Activity");
      req.flash("alertStatus", "success");
      req.flash("actionView", "activity");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("actionView", "activity");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    try {
      const { id, name, type, itemId } = req.body;
      const activity = await Activity.findOne({ _id: id });

      if (req.file == undefined) {
        // update their
        activity.name = name;
        activity.type = type;

        // save changes
        await activity.save();

        req.flash("alertMessage", "Success Update Activity");
        req.flash("alertStatus", "success");
        req.flash("actionView", "activity");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        const fileImagePath = path.join(`public/${activity.imageUrl}`);
        fs.existsSync(fileImagePath) ? await fs.unlink(fileImagePath) : "";

        // save all
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;

        // save changes
        await activity.save();

        req.flash("alertMessage", "Success Update Activity");
        req.flash("alertStatus", "success");
        req.flash("actionView", "activity");
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      req.flash("actionView", "activity");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    try {
      const { id, itemId } = req.params;
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId }).populate("activityId");
      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          // remove activityId of the collection is choose to delete
          item.activityId.pull({ _id: activity._id });

          // save collection
          await item.save();
        }
      }
      // remove 'image file'
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      // remove item 'collection'
      await activity.remove();

      req.flash("alertMessage", "Success delete activity");
      req.flash("alertStatus", "success");
      req.flash("actionView", "activity");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      req.flash("actionView", "activity");
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  /* ---------------------------------------------------------
     SECTION BOOKING 
  */
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate("memberId")
        .populate("bankId");

      // console.log(booking);
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/booking/view_booking", {
        alert,
        booking,
        user: req.session.user,
        title: "Staycation | Booking",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },

  showDetailBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id })
        .populate("memberId")
        .populate("bankId");

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/booking/show_detail_booking", {
        booking,
        alert,
        user: req.session.user,
        title: "Staycation | Detail Booking",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  actionConfirmation: async (req, res) => {
    try {
      // status: proccess, confirmation, reject
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "accept";
      await booking.save();
      req.flash("alertMessage", "Success Confirmation Payment");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/booking/${id}`);
    }
  },
  actionReject: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = "reject";
      await booking.save();
      req.flash("alertMessage", "Payment confirmation is reject");
      req.flash("alertStatus", "warning");
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/booking/${id}`);
    }
  },
};
