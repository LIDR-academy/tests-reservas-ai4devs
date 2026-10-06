// La base de trabajo es la de siempre. La de pruebas se elige con variables de entorno.
// (En la lección las dos bases son instancias en puertos distintos y se elige con DB_PUERTO;
// aquí son dos servicios de Docker Compose, con el mismo puerto y distinto nombre de máquina.)
export const conexion = {
  host: process.env.DB_HOST ?? process.env.HOST_TRABAJO,
  port: 5432,
  user: 'postgres',
  password: 'x',
  database: process.env.DB_NOMBRE ?? 'reservas_trabajo',
}
