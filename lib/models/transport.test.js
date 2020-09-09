const fs = require('fs');
const Transport = require('./transports');
const pool = require('../utils/pool');

describe('Transport model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert new form of transportation into the database', async() => {
    const createdTransport = await Transport.insert({
      name: 'bicycle',
      wheels: 2,
      color: 'green'
    });

    const { rows } = await pool.query(
      'SELECT * FROM transports WHERE id = $1',
      [createdTransport.id]
    );

    expect(rows[0]).toEqual(createdTransport);
  });

  it('finds a type of transportation by id', async() => {
    const bicycle = await Transport.insert({
      name: 'bicycle',
      wheels: 2,
      color: 'green'
    });

    const foundBicycle = await Transport.findById(bicycle.id);

    expect(foundBicycle).toEqual({
      id: bicycle.id,
      name: 'bicycle',
      wheels: 2,
      color: 'green'
    });
  });

  it('returns null if it cant find transportation type by id', async() => {
    const transport = await Transport.findById(1234);

    expect(transport).toEqual(null);
  });

  it('finds all types of transportation', async() => {
    await Promise.all([
      Transport.insert({
        name: 'bicycle',
        wheels: 2,
        color: 'green'
      }),
      Transport.insert({
        name: 'unicycle',
        wheels: 1,
        color: 'black'
      }),
      Transport.insert({
        name: 'bus',
        wheels: 6,
        color: 'red'
      })
    ]);

    const transports = await Transport.find();

    expect(transports).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'bicycle', wheels: 2, color: 'green' },
      { id: expect.any(String), name: 'unicycle', wheels: 1, color: 'black' },
      { id: expect.any(String), name: 'bus', wheels: 6, color: 'red' }
    ]));
  });

  it('updates a row by id', async() => {
    const createdTransport = await Transport.insert({
      name: 'bicycle',
      wheels: 2,
      color: 'green'
    });

    const updatedTransport = await Transport.update(createdTransport.id, {
      name: 'unicycle',
      wheels: 1,
      color: 'black'
    });

    expect(updatedTransport).toEqual({
      id: createdTransport.id,
      name: 'unicycle',
      wheels: 1,
      color: 'black'
    });
  });

  it('deletes a row by id', async() => {
    const createdTransport = await Transport.insert({
      name: 'bicycle',
      wheels: 2,
      color: 'green'
    });

    const deletedTransport = await Transport.delete(createdTransport.id);

    expect(deletedTransport).toEqual({
      id: createdTransport.id,
      name: 'bicycle',
      wheels: 2,
      color: 'green'
    });
  });
});
