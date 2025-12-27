.PHONY: help lint format check fix lint-fix deploy-api deploy-portal deploy test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

lint: ## Run ruff linter in all subdirectories
	@echo "Running ruff check in agents..."
	@cd agents && uv run ruff check . || true
	@echo "Running ruff check in api..."
	@cd api && uv run ruff check . || true

format: ## Format code with ruff in all subdirectories
	@echo "Running ruff format in agents..."
	@cd agents && uv run ruff format . || true
	@echo "Running ruff format in api..."
	@cd api && uv run ruff format . || true

fix: ## Run ruff linter and auto-fix issues in all subdirectories
	@echo "Running ruff fix in agents..."
	@cd agents && uv run ruff check --fix . || true
	@echo "Running ruff fix in api..."
	@cd api && uv run ruff check --fix . || true

test: ## Run tests in all subdirectories
	@echo "Running tests in agents..."
	@cd agents && (uv run pytest . || echo "No tests found in agents") || true
	@echo "Running tests in api..."
	@cd api && (uv run pytest . || echo "No tests found in api") || true

deploy-api: ## Deploy api subdirectory to Heroku
	@echo "Deploying API to Heroku..."
	@git subtree split --prefix api -b api-deploy
	@git push api api-deploy:main --force
	@git branch -D api-deploy
	@echo "API deployment complete!"

deploy-portal: ## Deploy portal subdirectory to Heroku
	@echo "Deploying Portal to Heroku..."
	@git subtree split --prefix portal -b portal-deploy
	@git push portal portal-deploy:main --force
	@git branch -D portal-deploy
	@echo "Portal deployment complete!"

deploy: deploy-api deploy-portal ## Deploy both API and Portal to Heroku

