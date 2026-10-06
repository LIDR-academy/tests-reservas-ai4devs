// La base de pruebas. En el contenedor, HOST_PRUEBAS es el servicio db_pruebas (puerto 5432).
export const conexion = {
  host: process.env.HOST_PRUEBAS,
  port: 5432,
  user: 'postgres',
  password: 'x',
  database: 'reservas_pruebas',
}
