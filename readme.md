# Booking Tour App

Deployment URL 🥾:
https://tourapp-production.up.railway.app/

## Outline

- [Overview](#overview)
- [API Features](#api-features)
- [Data Model](#data-model)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Website Guideline](#website-guideline)
- [API Guideline](#API-Guideline)

## Overview

- **Tech Stack**
  [![Node](https://img.shields.io/badge/Node.js-43853D.svg?logo=node.js&logoColor=white)](https://nodejs.org/docs/latest/api/)
  [![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/docs/)
- **Architecture**: Server-side rendering | MVC
- **API**: CRUD | Statistics | Login | Logut | Signup
- **DB**: Referencing | Embedding | Pre-Post hook
- **Optimization**: Index | Redis | Aggregation
- **Authentication**: JWT | Refresh & Access Token | Whitelist
- **Security**: Rate Limiter | XSS | NoSQL Injection
- **Deployment**: Docker | Nginx | AWS EC2

## API Features

- Restful API with CRUD operations.
- Using mongodb aggregation pipeline to generate statistics.
- Using cache to reduce database loading.
- Using express error handling middleware to collect error message.
- Exposing known error or generic message to client in production.
  <li>More information in <a href="https://documenter.getpostman.com/view/36501836/2sA3s4jq31">POSTMAN Document</a></li>
</ul>

## Data Model

- User, Tour, Review, Booking and Location collections are built.
- Modeling data by relationship type and access pattern.
- Using index & compound index to improve performance.
- Using pre and post hook to add custom logic.

<img src="https://i.imgur.com/32yGZz3.png" width="660px"></img>

## Authentication

- Protecting routes by JWT and role-based access control.
- Using redis to build JWT whitelist.
- Refresh & access token are sent when login
- Refresh token used to re-authenticate user & obtain new access token.
- Access token used to gain access of resouce.

  | role/resource | tour | user | review | booking |
  | ------------- | ---- | ---- | ------ | ------- |
  | guest         | ⭕   | ❌   | ❌     | ❌      |
  | user          | ⭕   | ❌   | ⭕     | ❌      |
  | lead-guide    | ⭕   | ❌   | ❌     | ⭕      |
  | admin         | ⭕   | ⭕   | ⭕     | ⭕      |

## Deployment

- Running docker container in AWS EC2 instances.
- Using nginx as a reverse proxy.
- Enable https using certbot for secure connection.

<img src="https://i.imgur.com/MhHkr0w.jpeg" width="360px"></img>

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
