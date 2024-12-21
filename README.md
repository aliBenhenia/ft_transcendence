# Transcendence
# Docker Compose Setup for Dynamic API Base URL

This guide shows how to configure a dynamic base URL for your Next.js front-end to communicate with the Django back-end in a Docker Compose environment. By using environment variables, you can easily switch between `localhost` and other IP addresses when needed.

## Overview

We are using Docker Compose to set up two services:

- **Django (backend)**: A Django back-end service that provides an API.
- **Next.js (frontend)**: A Next.js front-end service that communicates with the back-end.

In this setup, the base URL of the API (`NEXT_PUBLIC_API_URL`) is configurable via environment variables in the `docker-compose.yml` file. By default, it points to `localhost`, but you can update it with your local IP or external domain.

---

## 1. Docker Compose Setup

Below is the `docker-compose.yml` file setup for the Next.js and Django application:

### `docker-compose.yml`

```yaml
version: '2.29.2'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    
    image: django
    container_name: django
    ports:
      - 9003:8001
    volumes:
      - ./backend/source:/server
    networks:
      - mynetwork
  
  nextjs:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: nextjs
    environment:
      NEXT_PUBLIC_API_URL: "http://localhost:9003"  # Change this to your local IP or keep it as localhost
    ports:
      - 9001:3000
    volumes:
      - ./Frontend:/app
      - /app/node_modules
    command: npm run dev

networks:
  mynetwork:
    driver: bridge
