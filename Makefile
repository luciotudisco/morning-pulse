.PHONY: help lint format check fix lint-fix deploy-heroku

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

lint: ## Run ruff linter
	uv run ruff check .

format: ## Format code with ruff
	uv run ruff format .

fix: ## Run ruff linter and auto-fix issues
	uv run ruff check --fix .

all: lint format ## Run both linting and formatting

deploy-heroku: ## Deploy workflows subdirectory to Heroku
	git subtree push --prefix workflows heroku main

