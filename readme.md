# Booking Tour App

Deployment URL 🥾: https://wang-bookingtour.com

## Outline

- [Overview](#overview)
- [Tech Stack](#Tech-Stack)
- [Website Guideline](#Website-Guideline)
- [API Guideline](#API-Guideline)

## Overview

- Designed to connects travelers with guides.
- Guide can post detailed tour information.
- User can browse tours, make bookings, leave reviews and provide ratings.
- Creating a space for interaction and feedback.

## Tech Stack

[![Node](https://img.shields.io/badge/Node.js-43853D.svg?logo=node.js&logoColor=white)](https://nodejs.org/docs/latest/api/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/docs/)
[![Pug](https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454)](https://pugjs.org/api/getting-started.html)

## Website Guideline

- Signup, Login & Logout are available.
- Profile page
  - Updating account information
  - Browsing booked tours & reviews
- Tour detail page
  - Booking a tour
  - leaving a review
- Using test credit card to book
  - Number: 4242 4242 4242 4242
  - Expired date: not specified
  - CVS: not specified
  - Name: not specified
- Test account
  | role| email | password |
  | ---------- | ------------------ | -------- |
  | user | loulou@example.com | test1234 |
  | lead-guide | steve@example.com | test1234 |

## API Guideline

<ul>
  <li>Login account before accessing.</li>
  <li>CRUD data</li>
  <li>Get statistic data</li>
    <ul>
    <li>/tours/group-by-difficulty</li>
    <li>/tours/top-5-ratings</li>
    <li>/tours/monthly-plan/:year</li>
    <li>/tours/price-bucket</li>
    <li>/tours/guide-loading</li>
    </ul>
  <li>Forgot & reset password API are available.</li>
  <li>More information in <a href="https://documenter.getpostman.com/view/36501836/2sA3s4jq31">POSTMAN Document</a></li>
</ul>

**Account permission**

| role/data  | tour | user | review | booking |
| ---------- | ---- | ---- | ------ | ------- |
| guest      | ⭕   | ❌   | ❌     | ❌      |
| user       | ⭕   | ❌   | ⭕     | ❌      |
| lead-guide | ⭕   | ❌   | ❌     | ⭕      |
| admin      | ⭕   | ⭕   | ⭕     | ⭕      |
