const fs = require('fs');
const Cat = require('../lib/models/cats');
const pool = require('../lib/utils/pool');

describe('Cat model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert an new cat into the database', async() => {
    const createdCat = await Cat.insert({
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });

    const { rows } = await pool.query(
      'SELECT * FROM cats WHERE id = $1',
      [createdCat.id]
    );

    expect(rows[0]).toEqual(createdCat);
  });

  it('finds a cat by id', async() => {
    const Nomi = await Cat.insert({
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });

    const foundNomi = await Cat.findById(Nomi.id);

    expect(foundNomi).toEqual({
      id: Nomi.id,
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });
  });

  it('returns null if it cant find cat by id', async() => {
    const cat = await Cat.findById(1234);

    expect(cat).toEqual(null);
  });

  it('finds all cats', async() => {
    await Promise.all([
      Cat.insert({
        name: 'Nomi',
        age: 5,
        weight: '16 lbs'
      }),
      Cat.insert({
        name: 'Leaf',
        age: 1,
        weight: '11 lbs'
      }),
      Cat.insert({
        name: 'Kittyface',
        age: 13,
        weight: '500 lbs'
      })
    ]);

    const cats = await Cat.find();

    expect(cats).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'Nomi', age: 5, weight: '16 lbs' },
      { id: expect.any(String), name: 'Leaf', age: 1, weight: '11 lbs' },
      { id: expect.any(String), name: 'Kittyface', age: 13, weight: '500 lbs' }
    ]));
  });

  it('updates a row by id', async() => {
    const createdCat = await Cat.insert({
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });

    const updatedCat = await Cat.update(createdCat.id, {
      name: 'Leaf',
      age: 1,
      weight: '11 lbs'
    });

    expect(updatedCat).toEqual({
      id: createdCat.id,
      name: 'Leaf',
      age: 1,
      weight: '11 lbs'
    });
  });

  it('deletes a row by id', async() => {
    const createdCat = await Cat.insert({
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });

    const deletedCat = await Cat.delete(createdCat.id);

    expect(deletedCat).toEqual({
      id: createdCat.id,
      name: 'Nomi',
      age: 5,
      weight: '16 lbs'
    });
  });
});
