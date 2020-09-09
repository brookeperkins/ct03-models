const pool = require('../utils/pool');

class Sandwich {
  id;
  name;
  layers;
  main_ingredient;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.layers = row.layers;
    this.main_ingredient = row.main_ingredient;
  }

  static async insert(sandwich) {
    const { rows } = await pool.query(
      'INSERT INTO sandwiches (name, layers, main_ingredient) VALUES ($1, $2, $3) RETURNING *',
      [sandwich.name, sandwich.layers, sandwich.main_ingredient]
    );

    return new Sandwich(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM sandwiches WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Sandwich(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM sandwiches'
    );

    return rows.map(row => new Sandwich(row));
  }

  static async update(id, updatedSandwich) {
    const { rows } = await pool.query(
      `UPDATE sandwiches
       SET name=$1,
           layers=$2,
           main_ingredient=$3
       WHERE id = $4
       RETURNING *
      `,
      [updatedSandwich.name, updatedSandwich.layers, updatedSandwich.main_ingredient, id]
    );

    return new Sandwich(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM sandwiches WHERE id = $1 RETURNING *',
      [id]
    );

    return new Sandwich(rows[0]);
  }
}

module.exports = Sandwich;
