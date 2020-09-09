const pool = require('../utils/pool');

class Transport {
  id;
  name;
  wheels;
  color;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.wheels = row.wheels;
    this.color = row.color;
  }

  static async insert(transport) {
    const { rows } = await pool.query(
      'INSERT INTO transports (name, wheels, color) VALUES ($1, $2, $3) RETURNING *',
      [transport.name, transport.wheels, transport.color]
    );

    return new Transport(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM transports WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Transport(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM transports'
    );

    return rows.map(row => new Transport(row));
  }

  static async update(id, updatedTransport) {
    const { rows } = await pool.query(
      `UPDATE transports
       SET name=$1,
           wheels=$2,
           color=$3
       WHERE id = $4
       RETURNING *
      `,
      [updatedTransport.name, updatedTransport.wheels, updatedTransport.color, id]
    );

    return new Transport(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM transports WHERE id = $1 RETURNING *',
      [id]
    );

    return new Transport(rows[0]);
  }
}

module.exports = Transport;
