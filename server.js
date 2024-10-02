const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Subscribe Uncaught Exceptions
// Example: console.log(x); (x is undefine variable)
process.on('uncaughtException', (err) => {
  console.log(`💥[Uncaught Exception] Shuting down...`);
  console.log(err);
  process.exit(1);
});

// dotenv
dotenv.config({ path: './config.env' });
const app = require('./app');

// mongoose
const DB_URL = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB_URL)
  .then(() => console.log('DB connection successful (MongoDB Atlas Database)'));

// Server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Subscribe Unhandled Rejections
// Last Safety Net
process.on('unhandledRejection', (err) => {
  console.log(`💥[Unhandled Rejection] Error from outside of express.`);
  console.log(err);
  console.log('Shuting down...');
  // https://nodejs.org/docs/v20.16.0/api/tls.html#serverclosecallback
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, Shutting down gracefully🫶');
  server.close(() => {
    console.log('Process terminated🤚');
  });
});
