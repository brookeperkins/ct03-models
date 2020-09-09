DROP TABLE IF EXISTS cats;
DROP TABLE IF EXISTS transports;
DROP TABLE IF EXISTS sandwiches;
DROP TABLE IF EXISTS books;

CREATE TABLE cats (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  age INT CHECK (age > 0),
  weight TEXT
);

CREATE TABLE transports (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  wheels INT CHECK (wheels > 0),
  color TEXT
);

CREATE TABLE sandwiches (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  layers INT CHECK (layers > 0),
  main_ingredient TEXT
);

CREATE TABLE books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  pages INT CHECK (pages > 0),
  genre TEXT
);
