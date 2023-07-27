const assert = require('assert');
const request = require('supertest');
const app = require('../src/app');

describe('Self-service beer tap dispensers API', () => {
  let dispenserId;

  it('should return a dispenser', async () => {
    const response = await request(app).get('/dispensers/64c0d6ed7b4c83d5cbd773b0');
    console.log("This is the id: " + JSON.stringify(response.body.id))
    dispenserId = response.body.id
    assert.strictEqual(response.body.drink_name, "coca cola zero");
    assert.strictEqual(response.body.flow_volume, 0.05);
  });

  it('should get all dispensers', async () => {
    const response = await request(app).get('/dispensers');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(Array.isArray(response.body)).toBe(true)
  });


  it('should open the selected dispenser', async () => {
    const response = await request(app).put(`/dispensers/${dispenserId}/open`)
    console.log("dipsid: " + JSON.stringify(response.body.is_open))
    assert.strictEqual(response.body.is_open, "open");

  });

  it('should open the dispenser again', async () => {
    const response = await request(app).put(`/dispensers/${dispenserId}/open`)
    console.log("dipsid11: " + JSON.stringify(response.body.is_open))
    assert.strictEqual(response.body.is_open, "already_open");

  });

  it('should close the dispenser', async () => {
    const response = await request(app).put(`/dispensers/${dispenserId}/close`)
    console.log("dipsid2: " + JSON.stringify(response.body.is_open))
    assert.strictEqual(response.body.is_open, "closed");

  });
});
