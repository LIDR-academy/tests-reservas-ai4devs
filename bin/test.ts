// Configuración mínima de Japa, el ejecutor de tests que usa AdonisJS.
// Dos suites con los mismos nombres y plazos que trae de fábrica el starter kit de API de AdonisJS,
// y una variable SPEC para ejecutar un archivo concreto.
import { configure, processCLIArgs, run } from '@japa/runner'
import { assert } from '@japa/assert'

processCLIArgs(process.argv.splice(2))

configure(
  process.env.SPEC
    ? { files: [process.env.SPEC], plugins: [assert()], reporters: { activated: ['spec'] } }
    : {
        suites: [
          { name: 'unit', files: ['tests/unit/**/*.spec.ts'], timeout: 2000 },
          { name: 'functional', files: ['tests/functional/**/*.spec.ts'], timeout: 30000 },
        ],
        plugins: [assert()],
        reporters: { activated: ['spec'] },
      }
)

run()
