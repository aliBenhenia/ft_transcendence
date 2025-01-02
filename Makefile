.PHONY: delete see img live

COMPOSE = docker-compose.yml

# 90001 , 9000

all :
	docker-compose -f $(COMPOSE) build
	@echo "\033[0;31m[ Success !]\033[0m"


#docker-compose -f $(COMPOSE) up -d celery

on : 
	docker-compose -f $(COMPOSE) up server

up :
	docker-compose -f $(COMPOSE) up -d redis
	docker-compose -f $(COMPOSE) up -d nextjs
	docker-compose -f $(COMPOSE) up backend
	@echo "\033[0;31m[ Everything is up ! ]\033[0m"

# Stopping All Containers

stop :
	@docker-compose -f $(COMPOSE) stop
	@echo "\033[0;31m[ All Containers are Stopped ! ]\033[0m"

# Deleting All Containers
delete :
	@docker rm $$(docker ps -aq) && docker rmi $$(docker images -aq)

# Showing All Containers
see :
	@docker ps -a

# Showing images
img :
	@docker images

# Showing Running Containers
live :
	@docker ps

run_djn :
	docker-compose -f $(COMPOSE) run $(APP1) -d
	@echo "\033[0;31m[ Django is UP !]\033[0m"

stop_djn :
	docker-compose -f $(COMPOSE) stop $(APP1)
	@echo "\033[0;31m[ Django Has Stopped !]\033[0m"

run_db :
	docker-compose -f $(COMPOSE) run $(APP2) -d
	@echo "\033[0;31m[ PostgreSQL is UP !]\033[0m"


stop_db :
	docker-compose -f $(COMPOSE) stop $(APP2)
	@echo "\033[0;31m[ PostgreSQL Has Stopped !]\033[0m"