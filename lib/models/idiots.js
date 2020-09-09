const pool = require('../utils/pool');

class Idiot {
  id;
  name;
  number_of_tweets;
  catchphrase;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.number_of_tweets = row.number_of_tweets;
    this.catchphrase = row.catchphrase;
  }

  static async insert(idiot) {
    const { rows } = await pool.query(
      'INSERT INTO idiots (name, number_of_tweets, catchphrase) VALUES ($1, $2, $3) RETURNING *',
      [idiot.name, idiot.number_of_tweets, idiot.catchphrase]
    );

    return new Idiot(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM idiots WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Idiot(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM idiots'
    );

    return rows.map(row => new Idiot(row));
  }

  static async update(id, updatedIdiot) {
    const { rows } = await pool.query(
      `UPDATE idiots
       SET name=$1,
           number_of_tweets=$2,
           catchphrase=$3
       WHERE id = $4
       RETURNING *
      `,
      [updatedIdiot.name, updatedIdiot.number_of_tweets, updatedIdiot.catchphrase, id]
    );

    return new Idiot(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM idiots WHERE id = $1 RETURNING *',
      [id]
    );

    return new Idiot(rows[0]);
  }
}

module.exports = Idiot;
