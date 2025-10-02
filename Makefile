.PHONY: all build up down restart logs clean re status

all: build up

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

restart:
	docker compose down
	docker compose up

logs:
	docker compose logs -f

clean:
	docker compose down -v
	docker system prune -af

re: clean
	docker compose build --no-cache
	docker compose up

status:
	docker compose ps
