const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGOURI, (err) => {
    !err ? console.log(`DB connection established`) : console.log(err);
  });
};

module.exports = connect;
