.PHONY: delete see img live

COMPOSE = docker-compose.yml

all :
	docker-compose -f $(COMPOSE) build
	@echo "\033[0;31m[ Success !]\033[0m"

on : 
	docker-compose -f $(COMPOSE) up -d database
	docker-compose -f $(COMPOSE) up -d frontend 
	docker-compose -f $(COMPOSE) up server
	docker-compose -f $(COMPOSE) up -d redis


up :
	docker-compose -f $(COMPOSE) up backend
	@echo "\033[0;31m[ Everything is up ! ]\033[0m"


stop :
	@docker-compose -f $(COMPOSE) stop
	@echo "\033[0;31m[ All Containers are Stopped ! ]\033[0m"


delete :
	@docker rm $$(docker ps -aq) && docker rmi $$(docker images -aq)

see :
	@docker ps -a

img :
	@docker images

live :
	@docker ps
