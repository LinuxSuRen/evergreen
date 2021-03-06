NODE:=../tools/node
COMPOSE:=../tools/compose
IMAGE_NAME:=jenkinsciinfra/evergreen-backend

all: check docs container

check: depends lint
	$(MAKE) migrate
	$(MAKE) unit
	$(MAKE) acceptance

lint: depends
	$(NODE) npm run eslint

unit:
	$(COMPOSE) run -e NODE_ENV=test --rm node npm run jest

acceptance:
	$(COMPOSE) run -e NODE_ENV=test --rm node npm run acceptance

watch:
	$(COMPOSE) run -e NODE_ENV=test --rm node jest --bail --watchAll


depends: package.json
	# Checking to see if the directory exists because npm install updates the
	# directory every time it runs, busting the GNU/Make cache causing rebuilds
	@if [ ! -d node_modules ]; then \
		$(NODE) npm install; \
	fi;

docs: depends

migrate: depends
	$(COMPOSE) up -d db
	../scripts/check-psql
	$(COMPOSE) run --rm node sequelize db:migrate
	$(COMPOSE) run --rm node sequelize db:seed:all

run: migrate
	$(COMPOSE) up node

container: depends check Dockerfile
	docker build -t $(IMAGE_NAME):latest .

clean:
	$(COMPOSE) down || true
	rm -rf node_modules
	docker rmi $$(docker images -q -f "reference=$(IMAGE_NAME)") || true

.PHONY: all check clean container depends migrate unit acceptance
