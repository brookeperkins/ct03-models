const pool = require('../utils/pool');

class Book {
  id;
  name;
  pages;
  genre;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.pages = row.pages;
    this.genre = row.genre;
  }

  static async insert(book) {
    const { rows } = await pool.query(
      'INSERT INTO books (name, pages, genre) VALUES ($1, $2, $3) RETURNING *',
      [book.name, book.pages, book.genre]
    );

    return new Book(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM books WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Book(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM books'
    );

    return rows.map(row => new Book(row));
  }

  static async update(id, updatedBook) {
    const { rows } = await pool.query(
      `UPDATE books
       SET name=$1,
           pages=$2,
           genre=$3
       WHERE id = $4
       RETURNING *
      `,
      [updatedBook.name, updatedBook.pages, updatedBook.genre, id]
    );

    return new Book(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING *',
      [id]
    );

    return new Book(rows[0]);
  }
}

module.exports = Book;
