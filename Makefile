# Atajos para comprobar los ejemplos. Todo corre dentro de contenedores: no hace falta tener
# Node ni PostgreSQL instalados, solo Docker (con Docker Compose), make y git.
UID_GID := $(shell id -u):$(shell id -g)
export UID_GID
DC := docker compose --profile herramientas
LECCIONES := $(notdir $(wildcard lecciones/*))

.PHONY: help instalar down reset verificar par l1 l2 l3 l4 l5

help:
	@echo "make l1 ... l5             ejecuta los ejemplos de la lección N y enseña sus salidas"
	@echo "make l2 PASO=1c            ejecuta un solo paso (los ids están en lecciones/*/pasos.tsv)"
	@echo "make verificar             comprueba que todas las salidas coinciden con las de las lecciones"
	@echo "make par LECCION=2-segundo-caso CODIGO=02-general.ts SUITE=t4-borde.spec.ts   una variante contra una suite"
	@echo "make down                  apaga las bases y borra sus datos"
	@echo "make reset                 lo apaga todo y borra node_modules"

instalar:
	@[ -d node_modules/.bin ] || $(DC) run --rm app npm install --no-audit --no-fund --loglevel=error

l1 l2 l3 l4 l5: instalar
	@./scripts/correr.sh $$(ls lecciones | grep '^$(subst l,,$@)-') $(PASO)

verificar: instalar
	@./scripts/verificar.sh $(LECCION)

par: instalar
	@$(DC) run --rm -T app ./scripts/par.sh $(LECCION) $(CODIGO) $(SUITE)

down:
	docker compose --profile herramientas down -v

reset: down
	rm -rf node_modules .salidas
