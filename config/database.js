const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    let connect = await mongoose.connect(process.env.DB_URL);
    if (connect) {
      console.log("database connection established");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDB;
