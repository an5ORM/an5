.PHONY: help install build test clean release release-all dryrun pull status lint

CLI := node an5Cli/dist/index.js

help: ## Show this help
	@echo "an5 Workspace Commands:"
	@echo "  make install     - Install all workspace dependencies"
	@echo "  make build       - Build all modules"
	@echo "  make test        - Run all tests"
	@echo "  make clean       - Clean all dist/node_modules"
	@echo "  make release     - Release current repo"
	@echo "  make release-all - Release all repos in workspace (run weekly)"
	@echo "  make dryrun      - Preview release"
	@echo "  make pull        - Update submodules"
	@echo "  make status      - Show git status"
	@echo "  make generate    - Run code generator"
	@echo "  make llm-status  - Check LLM config"

install: ## Install all workspace dependencies
	npm install

build: ## Build all modules
	npm run build

test: ## Run all tests
	npm run test

clean: ## Clean all dist and node_modules
	rm -rf $$(find . -maxdepth 4 -name node_modules -o -name dist | grep -v "^\./\.git")
	@echo "Cleaned all node_modules and dist directories"

generate: ## Run code generator
	npm run generate

release: ## Release current repo
	$(CLI) release . --push

release-all: ## Release all repos in workspace (run weekly)
	$(CLI) ws . --push --tag v$$(node -p "new Date().toISOString().slice(0,10).replaceAll('-','.')")

dryrun: ## Preview workspace release
	$(CLI) ws . --dry-run

pull: ## Pull latest for all submodules
	git submodule update --remote --merge
	git add -A
	git commit -m "chore: update submodules" || echo "No submodule updates"

llm-status: ## Check LLM configuration
	node -e "const e=process.env; console.log('LLM_PROVIDER:', e.LLM_PROVIDER||'(not set, default: openai)'); console.log('LLM_API_KEY:', e.LLM_API_KEY ? '*** set ***' : '(not set)'); console.log('LLM_MODEL:', e.LLM_MODEL||'(not set, using default)'); console.log('LLM_ENDPOINT:', e.LLM_ENDPOINT||'(not set)')"

status: ## Show git status of all repos
	git status --short
	git submodule foreach --quiet 'echo "=== $$name ==="; git status --short; echo ""'

lint: ## Run TypeScript type checking on all modules
	@echo "Checking an5Orm..."; cd an5Orm && npx tsc --noEmit; \
	echo "Checking an5Client..."; cd ../an5Client && npx tsc --noEmit; \
	echo "Checking an5Adapters..."; cd ../an5Adapters && npx tsc --noEmit; \
	echo "Checking an5Agent..."; cd ../an5Agent && npx tsc --noEmit; \
	echo "All checks passed!"
