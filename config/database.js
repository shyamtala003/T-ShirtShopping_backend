const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    let connect = await mongoose.connect(process.env.DB_URL);
    if (connect) {
      return "database connection established";
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectToDB;
