const fs = require('fs');
const Book = require('../lib/models/books');
const pool = require('../lib/utils/pool');

describe('Book model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert an new book into the database', async() => {
    const createdBook = await Book.insert({
      name: 'Pride and Prejudice',
      pages: 432,
      genre: 'fiction'
    });

    const { rows } = await pool.query(
      'SELECT * FROM books WHERE id = $1',
      [createdBook.id]
    );

    expect(rows[0]).toEqual(createdBook);
  });

  it('finds a book by id', async() => {
    const prideAndPred = await Book.insert({
      name: 'Pride and Prejudice',
      pages: 432,
      genre: 'fiction'
    });

    const foundPridePred = await Book.findById(prideAndPred.id);

    expect(foundPridePred).toEqual({
      id: prideAndPred.id,
      name: 'Pride and Prejudice',
      pages: 432,
      genre: 'fiction'
    });
  });

  it('returns null if it cant find book by id', async() => {
    const book = await Book.findById(1234);

    expect(book).toEqual(null);
  });

  it('finds all books', async() => {
    await Promise.all([
      Book.insert({
        name: 'Pride and Prejudice',
        pages: 432,
        genre: 'fiction'
      }),
      Book.insert({
        name: 'In Cold Blood',
        pages: 300,
        genre: 'true crime'
      }),
      Book.insert({
        name: 'They Can\'t Kill Us Until They Kill Us',
        pages: 200,
        genre: 'essays'
      })
    ]);

    const books = await Book.find();

    expect(books).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'Pride and Prejudice', pages: 432, genre: 'fiction' },
      { id: expect.any(String), name: 'In Cold Blood', pages: 300, genre: 'true crime' },
      { id: expect.any(String), name: 'They Can\'t Kill Us Until They Kill Us', pages: 200, genre: 'essays' }
    ]));
  });

  it('updates a row by id', async() => {
    const createdBook = await Book.insert({
      name: 'Pride and Prejudice',
      pages: 432,
      genre: 'fiction'
    });

    const updatedBook = await Book.update(createdBook.id, {
      name: 'In Cold Blood',
      pages: 300,
      genre: 'true crime'
    });

    expect(updatedBook).toEqual({
      id: createdBook.id,
      name: 'In Cold Blood',
      pages: 300,
      genre: 'true crime'
    });
  });

  it('deletes a row by id', async() => {
    const createdBook = await Book.insert({
      name: 'Pride and Prejudice',
      pages: 432,
      genre: 'fiction'
    });

    const deletedBook = await Book.delete(createdBook.id);

    expect(deletedBook).toEqual({
      id: createdBook.id,
      name: 'Pride and Prejudice',
      pages: 432,
      genre: 'fiction'
    });
  });
});
