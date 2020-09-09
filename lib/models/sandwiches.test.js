const fs = require('fs');
const Sandwich = require('./sandwiches');
const pool = require('../utils/pool');

describe('Sandwich model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert an new sandwich into the database', async() => {
    const createdSandwich = await Sandwich.insert({
      name: 'burger',
      layers: 5,
      main_ingredient: 'patty'
    });

    const { rows } = await pool.query(
      'SELECT * FROM sandwiches WHERE id = $1',
      [createdSandwich.id]
    );

    expect(rows[0]).toEqual(createdSandwich);
  });

  it('finds a sandwich by id', async() => {
    const burger = await Sandwich.insert({
      name: 'burger',
      layers: 5,
      main_ingredient: 'patty'
    });

    const foundBurger = await Sandwich.findById(burger.id);

    expect(foundBurger).toEqual({
      id: burger.id,
      name: 'burger',
      layers: 5,
      main_ingredient: 'patty'
    });
  });

  it('returns null if it cant find sandwich by id', async() => {
    const sandwich = await Sandwich.findById(1234);

    expect(sandwich).toEqual(null);
  });

  it('finds all sandwiches', async() => {
    await Promise.all([
      Sandwich.insert({
        name: 'burger',
        layers: 5,
        main_ingredient: 'patty'
      }),
      Sandwich.insert({
        name: 'pbj',
        layers: 3,
        main_ingredient: 'peanut butter'
      }),
      Sandwich.insert({
        name: 'club',
        layers: 20,
        main_ingredient: 'bread'
      })
    ]);

    const sandwiches = await Sandwich.find();

    expect(sandwiches).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'burger', layers: 5, main_ingredient: 'patty' },
      { id: expect.any(String), name: 'pbj', layers: 3, main_ingredient: 'peanut butter' },
      { id: expect.any(String), name: 'club', layers: 20, main_ingredient: 'bread' }
    ]));
  });

  it('updates a row by id', async() => {
    const createdSandwich = await Sandwich.insert({
      name: 'burger',
      layers: 5,
      main_ingredient: 'patty'
    });

    const updatedSandwich = await Sandwich.update(createdSandwich.id, {
      name: 'pbj',
      layers: 3,
      main_ingredient: 'peanut butter'
    });

    expect(updatedSandwich).toEqual({
      id: createdSandwich.id,
      name: 'pbj',
      layers: 3,
      main_ingredient: 'peanut butter'
    });
  });

  it('deletes a row by id', async() => {
    const createdSandwich = await Sandwich.insert({
      name: 'burger',
      layers: 5,
      main_ingredient: 'patty'
    });

    const deletedSandwich = await Sandwich.delete(createdSandwich.id);

    expect(deletedSandwich).toEqual({
      id: createdSandwich.id,
      name: 'burger',
      layers: 5,
      main_ingredient: 'patty'
    });
  });
});
