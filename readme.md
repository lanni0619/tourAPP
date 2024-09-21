# Tours Booking App 🥾

> Deployment URL: https://tourapp-production.up.railway.app/

## Outline

- [Tech Stack](#Tech-Stack)
- [Dependencies](#Dependencies)
- [Website Guideline](#Website-Guideline)
- [API Guideline](#API-Guideline)
- [Architecture](#Architecture)

## Tech Stack

[![Node](https://img.shields.io/badge/Node.js-43853D.svg?logo=node.js&logoColor=white)](https://nodejs.org/docs/latest/api/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/docs/)
[![Pug](https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454)](https://pugjs.org/api/getting-started.html)

- Node.js: Single-thread which perfect for building fast & scalable data-intensive apps.
- Express: Use it for web frameworks to avoid reinventing the wheel.
- MongoDB: To modeling both normalization & denormalization data.
- PUG: It's default template engine of Express with simplified syntax.

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

- Signup, Login & Logout are available.
- Update your account information.
- Booking and reviewing a tour.
- Using test credit card to book
  - Number: 4242 4242 4242 4242
  - Expired date: not specified
  - CVS: not specified
  - Name: not specified
- Browse your booked tours & reviews in profile.
- Test account
  | role| email | password |
  | ---------- | ------------------ | -------- |
  | user | loulou@example.com | test1234 |
  | lead-guide | steve@example.com | test1234 |

## API Guideline

**Description**

<ul>
  <li>Login account before accessing.</li>
  <li>Forgot & reset password functions are available.</li>
  <li>CRUD data</li>
  <li>Get statistic data</li>
  <ul>
    <li>/tours/tour-stats</li>
    <li>/tours/top-5-ratings</li>
    <li>/tours/monthly-plan/:year</li>
  </ul>
  <li>More information in <a href="https://documenter.getpostman.com/view/36501836/2sA3s4jq31">POSTMAN Document</a></li>
</ul>

**Account permission**

| role/data  | tour | user | review | booking |
| ---------- | ---- | ---- | ------ | ------- |
| none       | ⭕   | ❌   | ❌     | ❌      |
| user       | ⭕   | ❌   | ⭕     | ❌      |
| lead-guide | ⭕   | ❌   | ❌     | ⭕      |
| admin      | ⭕   | ⭕   | ⭕     | ⭕      |

## Architecture

<img src="https://i.imgur.com/0yhmQE0.jpeg" alt="backend-architecture" style="width:500px; border-radius:1rem"/>

More detail about architecture, route & controller in [Google Slides](https://docs.google.com/presentation/d/1vbWrbmMSBvz7IPGzZsJV-0RqM1A33D0N/edit?usp=sharing&ouid=106614175441136000865&rtpof=true&sd=true)
