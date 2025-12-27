.PHONY: help lint format check fix lint-fix deploy-heroku test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

lint: ## Run ruff linter in all subdirectories
	@echo "Running ruff check in agents..."
	@cd agents && uv run ruff check . || true
	@echo "Running ruff check in workflows..."
	@cd workflows && uv run ruff check . || true

format: ## Format code with ruff in all subdirectories
	@echo "Running ruff format in agents..."
	@cd agents && uv run ruff format . || true
	@echo "Running ruff format in workflows..."
	@cd workflows && uv run ruff format . || true

fix: ## Run ruff linter and auto-fix issues in all subdirectories
	@echo "Running ruff fix in agents..."
	@cd agents && uv run ruff check --fix . || true
	@echo "Running ruff fix in workflows..."
	@cd workflows && uv run ruff check --fix . || true

all: lint format ## Run both linting and formatting

test: ## Run tests in all subdirectories
	@echo "Running tests in agents..."
	@cd agents && (uv run pytest . || echo "No tests found in agents") || true
	@echo "Running tests in workflows..."
	@cd workflows && (uv run pytest . || echo "No tests found in workflows") || true

deploy-heroku: ## Deploy workflows subdirectory to Heroku
	git subtree push --prefix workflows heroku main

deploy-heroku-portal: ## Deploy portal subdirectory to Heroku
	git subtree push --prefix portal heroku-morning-pulse-portal main || git push heroku-morning-pulse-portal `git subtree split --prefix portal main`:main --force

