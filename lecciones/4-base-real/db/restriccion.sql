CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE reservas
  ADD CONSTRAINT reservas_sin_solape
  EXCLUDE USING gist (sala WITH =, tstzrange(inicio, fin) WITH &&);
