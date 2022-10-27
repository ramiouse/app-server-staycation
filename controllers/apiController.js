const Item = require("../models/Item");
const Treasure = require("../models/Activity");
const Traveler = require("../models/Booking");
const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Booking = require("../models/Booking");
const Member = require("../models/Member");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title country city price unit imageId")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" });

      const categories = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title country city isPopular imageId",
          perDocumentLimit: 4,
          options: { sort: { sumBooking: -1 } }, // SORT DESCENDING
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      const traveler = await Traveler.find();
      const treasure = await Treasure.find();
      const city = await Item.find();

      for (let i = 0; i < categories.length; i++) {
        for (let x = 0; x < categories[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: categories[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          // update 'isPopular' when it is
          // includes of itemId on categories and higher rank of booking total
          if (categories[i].itemId[0] === categories[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      // testimonial data
      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.5,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      // return value as 'json'
      res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        categories,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  detailsPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "featuredId",
          select: "_id name qty imageUrl",
        })
        .populate({
          path: "activityId",
          select: "_id name type imageUrl itemId",
        })
        .populate({
          path: "imageId",
          select: "_id imageUrl",
        });

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.5,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      const bank = await Bank.find();
      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      }); //...item._doc ambil data nya aja
    } catch (error) {
      return;
    }
  },

  bookingPage: async (req, res) => {
    const fields = ({
      itemId,
      duration,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body);

    if (!req.file) {
      return res.status(404).json({ message: "Image not found" });
    }

    let i = 0;
    let postNull = [];
    for (let key in fields) {
      if (Object.keys(fields[key])) {
        if (fields[key] == "") postNull.push({ key: "undefined value" });
      }
      i++;
    }
    const item = await Item.findOne({ _id: itemId });
    const invoice = Math.floor(1000000 + Math.random() * 9000000);
    let total = item.price * duration;
    let tax = total * 0.1; // 10 percent

    // console.log(total);
    // console.log(invoice);
    // console.log(tax);

    if (postNull.length)
      return res.status(404).json({ message: "Lengkapi semua field !" });

    item.sumBooking += 1;
    await item.save();

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: (total += tax),
      itemId: {
        _id: item._id,
        title: item.title,
        price: item.price,
        duration: duration,
      },
      memberId: member.id,
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankFrom,
        accountHolder: accountHolder,
      },
    };

    const booking = await Booking.create(newBooking);

    res.status(201).json({ message: "Success Booking", booking });
  },
};
