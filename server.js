const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Subscribe Uncaught Exceptions
// Example: console.log(x); (x is undefine variable)
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception!💥 Shuting down...`);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB_URL = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB_URL).then(() => console.log('DB connection successful'));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Subscribe Unhandled Rejections
// Last Safety Net
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled Rejection!💥 Shuting down...`);
  console.log(err.name, err.message);
  // https://nodejs.org/docs/v20.16.0/api/tls.html#serverclosecallback
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught Exception
// After that, the entire node process is a so - called unclean state
// console.log(x);
