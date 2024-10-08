const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB_URL = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(
    DB_URL,
    // to deal some deprecation warningw
    {
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // useUnifiedTopology: true,
    },
  )
  .then(() => console.log('DB connection successful'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    // await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    // await Tour.deleteMany();
    await User.deleteMany();
    // await Review.deleteMany();
    console.log('data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// console.log(process.argv);
// The command will add string (--import/--delete) to process.argv[2]
// node .\dev-data\data\import-dev-data.js --import
// node .\dev-data\data\import-dev-data.js --delete

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
