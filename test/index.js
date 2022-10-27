const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const mocha = require("mocha");
const app = require("../app");
const fs = require("fs");

chai.use(chaiHttp);
describe("API ENDPOINT TESTING", () => {
  it("GET Landing Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/member/landing-page")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("Object"); //object value
        expect(res.body).to.have.property("hero"); //have property 'hero'
        expect(res.body.hero).to.have.all.keys(
          "travelers",
          "treasures",
          "cities"
        );
        expect(res.body).to.have.property("mostPicked");
        expect(res.body.mostPicked).to.have.an("array");
        expect(res.body).to.have.property("category");
        expect(res.body.category).to.have.an("array");
        expect(res.body).to.have.property("testimonial");
        expect(res.body.testimonial).to.have.an("Object");
      });
    done(); // endofall
  });

  it("GET Detail Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/member/detail-page/5e96cbe292b97300fc902223")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("Object"); //object value

        //-- have an types
        expect(res.body.imageId).to.have.an("array");
        expect(res.body.featuredId).to.have.an("array");
        expect(res.body.activityId).to.have.an("array");
        expect(res.body.bank).to.have.an("array");
        expect(res.body.testimonial).to.have.an("object");

        //-- have an properties
        expect(res.body).to.have.property("country");
        expect(res.body).to.have.property("isPopular");
        expect(res.body).to.have.property("unit");
        expect(res.body).to.have.property("sumBooking");
        expect(res.body).to.have.property("imageId");
        expect(res.body).to.have.property("featuredId");
        expect(res.body).to.have.property("activityId");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("title");
        expect(res.body).to.have.property("price");
        expect(res.body).to.have.property("city");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("__v");
        expect(res.body).to.have.property("bank");
        expect(res.body).to.have.property("testimonial");
      });
    done(); // endofall
  });

  it("POST Booking Page", (done) => {
    const image = __dirname + "/buktibayar.jpeg";
    const dataSample = {
      image,
      idItem: "5e96cbe292b97300fc902223",
      duration: 2,
      bookingStartDate: "9-4-2022",
      bookingEndDate: "11-4-2022",
      firstName: "risqi",
      lastName: "afinnudin",
      email: "rizkiafinnudinmazid@gmail.com",
      phoneNumber: "085655156",
      accountHolder: "itce",
      bankFrom: "mandiri",
    };

    chai
      .request(app)
      .post("/api/v1/member/booking-page")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("idItem", dataSample.idItem)
      .field("duration", dataSample.duration)
      .field("bookingStartDate", dataSample.bookingStartDate)
      .field("bookingEndDate", dataSample.bookingEndDate)
      .field("firstName", dataSample.firstName)
      .field("lastName", dataSample.lastName)
      .field("email", dataSample.email)
      .field("phoneNumbe", dataSample.phoneNumber)
      .field("accountHolder", dataSample.accountHolder)
      .field("bankFrom", dataSample.bankFrom)
      .attach("image", fs.readFileSync(dataSample.image), "buktibayar.png")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object"); //object valu
        //-- have an properties
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Success Booking");
        expect(res.body).to.have.property("booking");
        expect(res.body.booking).to.have.all.keys(
          "_id",
          "invoice",
          "bookingStartDate",
          "bookingEndDate",
          "payments",
          "total",
          "itemId",
          "memberId",
          "__v"
        );
        expect(res.body.booking.payments).to.have.all.keys(
          "status",
          "proofPayment",
          "accountHolder",
          "bankFrom"
        );
        expect(res.body.booking.itemId).to.have.all.keys(
          "_id",
          "title",
          "price",
          "duration"
        );
      });
    done(); // endofall
  });
});
