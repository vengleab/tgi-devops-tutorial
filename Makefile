# Article Management System Makefile

.PHONY: help install test test-backend test-frontend test-all start-backend start-frontend clean

help:
	@echo "Available commands:"
	@echo "  install        - Install dependencies for backend and frontend"
	@echo "  test           - Run all tests"
	@echo "  test-backend   - Run backend tests only"
	@echo "  test-frontend  - Run frontend tests only"
	@echo "  start-backend  - Start the Express server"
	@echo "  start-frontend - Serve frontend files (requires nginx or similar)"
	@echo "  clean          - Clean up node_modules and coverage"

install:
	@echo "Installing backend dependencies..."
	cd web-server && npm install
	@echo "Installing frontend dependencies..."
	cd web-frontend && npm install

test: test-backend test-frontend

test-backend:
	@echo "Running backend tests..."
	cd web-server && npm test

test-frontend:
	@echo "Running frontend tests..."
	cd web-frontend && npm test

test-all: test
	@echo "All tests completed!"

start-backend:
	@echo "Starting backend server..."
	cd web-server && npm start

start-frontend:
	@echo "Frontend files are in web-frontend/html/"
	@echo "You can serve them with nginx using the config in nginx-config/"

clean:
	@echo "Cleaning up..."
	rm -rf web-server/node_modules
	rm -rf web-frontend/node_modules
	rm -rf web-server/coverage
	rm -rf web-frontend/coverage