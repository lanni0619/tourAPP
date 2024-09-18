# Tours Booking App 🥾

> Deployment URL: https://tourapp-production.up.railway.app/

## Outline

- [Tech Stack](#Tech-Stack)
- [Dependencies](#Dependencies)
- [Website Guideline](#Website-Guideline)
- [API Guideline](#API-Guideline)
- [Technological Block Diagram](#Technological-Block-Diagram)

## Tech Stack

- For the servers runtime environment  
  [![Node](https://img.shields.io/badge/Node.js-43853D.svg?logo=node.js&logoColor=white)](https://nodejs.org/docs/latest/api/)

- For the web framework  
  [![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)

- For the NOSQL database  
  [![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/docs/)

- For the server site rendering  
  [![Pug](https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454)](https://pugjs.org/api/getting-started.html)

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

- Signup an account if this's your first time here.<br><br>
- In the Profile, you can do something like:

  1. Update your email, password & photo
  2. Find all your booked tours.
  3. Find all reviews you leave and edit/delete it if you want.<br><br>

- In each tour detail page, you can:
  1. Find more information about this tour.
  2. Find landmarks on the map for your daily itinerary.
  3. Find all reviews in relation to this tour.
  4. Book a tour (The button located at the bottom of page)
  5. Enter a fake credit card number to book (Use Financial API called Stripe | Test Mode)
  6. Leave a comment. The booking button will be replaced with review form if you have booked.<br><br>
- Other features must use API function such as post a tour, forgetPassword & resetPassword ...etc<br><br>
- Test account
  - Lead-guide (email: aarav@example.com, password: test1234) which have authorization to post tour by API.

## API Guideline

You can find all available API function & description in the [POSTMAN Document](https://documenter.getpostman.com/view/36501836/2sA3s4jq31).

- Auth API

  - Please log in using "login" API before accessing data.
  - Use forgetPassword route to get resetPassword URL(Send to your email) if you forgot your password.

- Data API

  - We have 4 type of data which you can access by api function.
  - Tour data is opened to all users including those who are not logged in.
  - Review data are only for "user" & "admin" account.
  - Booking data are only for "lead-guide" & "admin" acount.
  - User data are only for "admin" account.

## Technological Block Diagram

- Backend - Using MVC Architecture
  <img src="https://i.imgur.com/akq64Dq.jpeg" alt="backend-architecture" style="width:500px;"/>
- Error handler - Process error message in different way between development & production mode
  <img src="https://i.imgur.com/g5FyCWJ.jpeg" alt="error-handler" style="width:500px;"/>
- More detail about routes & controller ([Click Me](https://drive.google.com/file/d/1xrgAqek2ow_CuhxzXMxvWQvAU3BZ8s7M/view?usp=sharing))
