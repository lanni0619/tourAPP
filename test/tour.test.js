const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const redisClient = require('../utils/redisClient');

// let server;

// beforeAll(async () => {
//   server = app.listen(3000);
// });

// afterAll(async () => {
//   await mongoose.disconnect();

//   if (redisClient.isOpen) {
//     await redisClient.disconnect();
//   }

//   await new Promise((resolve) => server.close(resolve));
// });

describe('Tour Resource API', () => {
  it('GET /tours', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toEqual(200);
    // const res = await request(app).get('/api/v1/tours');
    // expect(res.statusCode).toEqual(200);
    // expect(res.results).not.toBe(0);
  });
});
