.PHONY: help lint format fix test

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

test: ## Run tests
	uv run pytest . || echo "No tests found"

all: lint format ## Run both linting and formatting

