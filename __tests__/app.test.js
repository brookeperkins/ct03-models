const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Cat = require('../lib/models/cats');

describe('03-models routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a new cat via POST', async() => {
    const response = await request(app)
      .post('/api/v1/cats')
      .send({ name: 'Nomi', age: 5, weight: '16 lbs' });

    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });
  });

  it('deletes a cat by id via DELETE', async() => {
    const createdCat = await Cat.insert({
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });

    const response = await request(app)
      .delete(`/api/v1/cats/${createdCat.id}`);

    expect(response.body).toEqual({
      id: createdCat.id,
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });
  });
});
