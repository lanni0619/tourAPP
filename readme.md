# Tours Booking App 🥾

> Deployment URL: https://tourapp-production.up.railway.app/

## Outline

- [Tech Stack](#Tech-Stack)
- [Dependencies](#Dependencies)
- [Website Guideline](#Website-Guideline)
- [API Guideline](#API-Guideline)
- [Technological Detail](#Technological-Detail)

## Tech Stack

[**Node.js**](https://nodejs.org/docs/latest/api/) for the servers runtime environment.
[**Express.js**](https://expressjs.com/) for the web framework.
[**MongoDB**](https://www.mongodb.com/docs/) for the NOSQL database.
[**Pug**](https://pugjs.org/api/getting-started.html) for the server site rendering.

## Dependencies

[![@stripe/stripe-js](https://img.shields.io/badge/@stripe/stripe--js-%5E4.4.0-blue)](https://stripe.com/docs/js)
[![axios](https://img.shields.io/badge/axios-%5E1.7.5-blue)](https://axios-http.com/docs/intro)
[![bcryptjs](https://img.shields.io/badge/bcryptjs-%5E2.4.3-blue)](https://github.com/dcodeIO/bcrypt.js)
[![compression](https://img.shields.io/badge/compression-%5E1.7.4-blue)](https://github.com/expressjs/compression)
[![cookie-parser](https://img.shields.io/badge/cookie--parser-%5E1.4.6-blue)](https://github.com/expressjs/cookie-parser)
[![core-js](https://img.shields.io/badge/core--js-%5E3.38.1-blue)](https://github.com/zloirock/core-js)
[![dotenv](https://img.shields.io/badge/dotenv-%5E16.4.5-blue)](https://github.com/motdotla/dotenv)
[![esbuild](https://img.shields.io/badge/esbuild-0.23.1-blue)](https://esbuild.github.io/)
[![express](https://img.shields.io/badge/express-%5E4.19.2-blue)](https://expressjs.com/)
[![express-mongo-sanitize](https://img.shields.io/badge/express--mongo--sanitize-%5E2.2.0-blue)](https://github.com/fiznool/express-mongo-sanitize)
[![express-rate-limit](https://img.shields.io/badge/express--rate--limit-%5E7.4.0-blue)](https://github.com/nfriedly/express-rate-limit)
[![helmet](https://img.shields.io/badge/helmet-%5E3.16.0-blue)](https://helmetjs.github.io/)
[![hpp](https://img.shields.io/badge/hpp-%5E0.2.3-blue)](https://github.com/analog-nico/hpp)
[![html-to-text](https://img.shields.io/badge/html--to--text-%5E9.0.5-blue)](https://github.com/html-to-text/node-html-to-text)
[![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-%5E9.0.2-blue)](https://github.com/auth0/node-jsonwebtoken)
[![mongoose](https://img.shields.io/badge/mongoose-%5E8.0.0-blue)](https://mongoosejs.com/)
[![morgan](https://img.shields.io/badge/morgan-%5E1.10.0-blue)](https://github.com/expressjs/morgan)
[![multer](https://img.shields.io/badge/multer-%5E1.4.5--lts.1-blue)](https://github.com/expressjs/multer)
[![nodemailer](https://img.shields.io/badge/nodemailer-%5E6.9.14-blue)](https://nodemailer.com/about/)
[![nodemailer-brevo-transport](https://img.shields.io/badge/nodemailer--brevo--transport-%5E2.1.0-blue)](https://github.com/leoditomi/nodemailer-brevo-transport)
[![pug](https://img.shields.io/badge/pug-%5E3.0.3-blue)](https://pugjs.org/api/getting-started.html)
[![sharp](https://img.shields.io/badge/sharp-%5E0.32.6-blue)](https://sharp.pixelplumbing.com/)
[![slugify](https://img.shields.io/badge/slugify-%5E1.6.6-blue)](https://github.com/simov/slugify)
[![stripe](https://img.shields.io/badge/stripe-%5E16.10.0-blue)](https://stripe.com/docs/api)
[![validator](https://img.shields.io/badge/validator-%5E13.12.0-blue)](https://github.com/validatorjs/validator.js)
[![xss-clean](https://img.shields.io/badge/xss--clean-%5E0.1.4-blue)](https://github.com/jsonmaur/xss-clean)

## Website Guideline

**Signup an account if this's your first time here.**<br>
**In the Profile, you can do something like:**

1. Update your email, password & photo
2. Find all your booked tours.
3. Find all reviews you leave and edit/delete it if you want.

**In each tour detail page, you can:**

1. Find more information about this tour.
2. Find landmarks on the map for your daily itinerary.
3. Find all reviews in relation to this tour.
4. Book a tour (The button located at the bottom of page)
5. Enter a fake credit card number to book (4242 4242 4242 4242 | Expired date, CVS & name are not specified)
6. Leave a comment. Booking button will be replaced with review form if you have booked.<br>

**Other features must use API function such as POST tour, forgetPassword & resetPassword ...etc**<br>

**Test account**

- Lead-guide account (email: aarav@example.com, password: test1234) which is authorized to post tour by API.

## API Guideline

**You can find all available API function & description in the [POSTMAN Document](https://documenter.getpostman.com/view/36501836/2sA3s4jq31).**

**Auth API**

- Please log in using "login" API before accessing data.
- Use forgetPassword route to get resetPassword URL if you forgot your password.
- The resetPassword URL will be sent to your email which you registered with.
- The resetPassword URL will expire in 10 minutes.

**Data API**

- We have 4 type of data which you can access by api function.
- Tour data is opened to all users including those who are not logged in.
- Review data are only for "user" & "admin" account.
- Booking data are only for "lead-guide" & "admin" acount.
- User data are only for "admin" account.

## Technological Detail

##### Code Architecture

<img src="https://i.imgur.com/FURkkmY.jpeg" alt="backend-architecture" style="width:500px;"/>

- Using MVC architecture
- Separating routers and controllers to keep the codebase organized, maintainable, and scalable.
- In controller, it's only concern about application's implementation such as:
  - Managing requests and responses.
  - About app's more technical aspects.
  - Bridge between model and view layers.
- The model which acutally solves the business problem such as
  - Create a tours in database.
  - Checking if user's password is correct.
  - Validating user input data.
  - Ensuring only users who bought tour can review it.

##### View Route

<img src="https://i.imgur.com/kwwtTlu.jpeg" alt="view-route" style="width:500px;"/>

- All data used to displayed with the front end are processed in view routes
- The "isLoggedIn" middleware is only used to detect login or not.
- The "protect" middleware must login to access.

##### Tour Route

<img src="https://i.imgur.com/Fvo1rn3.jpeg" alt="tour-route" style="width:500px;"/>

- This routes contain basic CRUD operation, statistic and geospatial query api.
- CRUD operations are comply with RESTful architecture.
- Statistic data API are built by mongodb aggregation pipeline.

##### Review Route

<img src="https://i.imgur.com/Kml4UvL.jpeg" alt="tour-route" style="width:500px;"/>

- This routes contain basic CRUD operation, statistic and geospatial query api.
- CRUD operations are comply with RESTful architecture.
- Statistic data API are built by mongodb aggregation pipeline.

##### User Route

<img src="https://i.imgur.com/gwVzj9w.jpeg" alt="user-route" style="width:500px;"/>

- CRUD operation is similar with other route but only restrict to admin.
- POST /forgotPassword route will send resetPassword URL with token to your email.
- PATCH /updateMe route is used to update user name, email and avatar.
- PATCH /deleteMe route is only change account to inactive account.
- Only admin have right to truly delete account.
