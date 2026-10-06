CREATE TABLE salas (
  id serial PRIMARY KEY,
  nombre text NOT NULL UNIQUE,
  aforo integer
);
CREATE TABLE reservas (
  id serial PRIMARY KEY,
  sala text NOT NULL,
  inicio timestamptz NOT NULL,
  fin timestamptz NOT NULL
);
