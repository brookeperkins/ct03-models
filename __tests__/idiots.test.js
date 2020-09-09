const fs = require('fs');
const Idiot = require('../lib/models/idiots');
const pool = require('../lib/utils/pool');

describe('Idiot model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert an new idiot into the database', async() => {
    const createdIdiot = await Idiot.insert({
      name: 'Ignatius J. Reilly',
      number_of_tweets: 0,
      catchphrase: 'I am at the moment writing a lengthy indictment against our century. When my brain begins to reel from my literary labors, I make an occasional cheese dip.'
    });

    const { rows } = await pool.query(
      'SELECT * FROM idiots WHERE id = $1',
      [createdIdiot.id]
    );

    expect(rows[0]).toEqual(createdIdiot);
  });

  it('finds an idiot by id', async() => {
    const ignatius = await Idiot.insert({
      name: 'Ignatius J. Reilly',
      number_of_tweets: 0,
      catchphrase: 'I am at the moment writing a lengthy indictment against our century. When my brain begins to reel from my literary labors, I make an occasional cheese dip.'
    });

    const foundIgnatius = await Idiot.findById(ignatius.id);

    expect(foundIgnatius).toEqual({
      id: ignatius.id,
      name: 'Ignatius J. Reilly',
      number_of_tweets: 0,
      catchphrase: 'I am at the moment writing a lengthy indictment against our century. When my brain begins to reel from my literary labors, I make an occasional cheese dip.'
    });
  });

  it('returns null if it cant find the idiot by id', async() => {
    const idiot = await Idiot.findById(1234);

    expect(idiot).toEqual(null);
  });

  it('finds all idiots', async() => {
    await Promise.all([
      Idiot.insert({
        name: 'Ignatius J. Reilly',
        number_of_tweets: 0,
        catchphrase: 'I am at the moment writing a lengthy indictment against our century. When my brain begins to reel from my literary labors, I make an occasional cheese dip.'
      }),
      Idiot.insert({
        name: 'Donald Trump',
        number_of_tweets: 1000000, 
        catchphrase: 'I know more about that than anybody, especially the scientists.'
      }),
      Idiot.insert({
        name: 'Benedict Arnold',
        number_of_tweets: 0,
        catchphrase: 'Oops, sorry (not sorry).'
      })
    ]);

    const idiots = await Idiot.find();

    expect(idiots).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'Ignatius J. Reilly', number_of_tweets: 0, catchphrase: 'I am at the moment writing a lengthy indictment against our century. When my brain begins to reel from my literary labors, I make an occasional cheese dip.' },
      { id: expect.any(String), name: 'Donald Trump', number_of_tweets: 1000000, catchphrase: 'I know more about that than anybody, especially the scientists.' },
      { id: expect.any(String), name: 'Benedict Arnold', number_of_tweets: 0, catchphrase: 'Oops, sorry (not sorry).' }
    ]));
  });

  it('updates a row by id', async() => {
    const createdIdiot = await Idiot.insert({
      name: 'Ignatius J. Reilly',
      number_of_tweets: 0,
      catchphrase: 'I am at the moment writing a lengthy indictment against our century. When my brain begins to reel from my literary labors, I make an occasional cheese dip.'
    });

    const updatedIdiot = await Idiot.update(createdIdiot.id, {
      name: 'Donald Trump',
      number_of_tweets: 1000000,
      catchphrase: 'I know more about that than anybody, especially the scientists.'
    });

    expect(updatedIdiot).toEqual({
      id: createdIdiot.id,
      name: 'Donald Trump',
      number_of_tweets: 1000000,
      catchphrase: 'I know more about that than anybody, especially the scientists.'
    });
  });

  it('deletes a row by id', async() => {
    const createdIdiot = await Idiot.insert({
      name: 'Ignatius J. Reilly',
      number_of_tweets: 0,
      catchphrase: 'I am at the moment writing a lengthy indictment against our century. When my brain begins to reel from my literary labors, I make an occasional cheese dip.'
    });

    const deletedIdiot = await Idiot.delete(createdIdiot.id);

    expect(deletedIdiot).toEqual({
      id: createdIdiot.id,
      name: 'Ignatius J. Reilly',
      number_of_tweets: 0,
      catchphrase: 'I am at the moment writing a lengthy indictment against our century. When my brain begins to reel from my literary labors, I make an occasional cheese dip.'
    });
  });
});
