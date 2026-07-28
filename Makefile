SHELL := powershell.exe
.PHONY: help install build test clean release release-all dryrun pull status

CLI := node mssqlCli/dist/index.js

help: ## Show this help
	@Write-Host "MSSQL Workspace Commands:"; \
	Write-Host "  make install    - Install all workspace dependencies"; \
	Write-Host "  make build      - Build all modules"; \
	Write-Host "  make test       - Run all tests"; \
	Write-Host "  make clean      - Clean all dist/node_modules"; \
	Write-Host "  make release    - Release current repo"; \
	Write-Host "  make release-all - Release all repos"; \
	Write-Host "  make dryrun     - Preview release"; \
	Write-Host "  make pull       - Update submodules"; \
	Write-Host "  make status     - Show git status"; \
	Write-Host "  make generate   - Run code generator"; \
	Write-Host "  make llm-status - Check LLM config"

install: ## Install all workspace dependencies
	@npm install

build: ## Build all modules
	@npm run build

build: ## Build all modules
	@npm run build

test: ## Run all tests
	@npm run test

clean: ## Clean all dist and node_modules
	@Get-ChildItem -Path . -Filter "node_modules" -Directory -Recurse | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue; \
	Get-ChildItem -Path . -Filter "dist" -Directory -Recurse | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue; \
	Write-Host "Cleaned all node_modules and dist directories"

generate: ## Run code generator
	@npm run generate

release: ## Release current repo
	@$(CLI) release . --push

release-all: ## Release all repos in workspace (run weekly)
	@$(CLI) ws . --push --tag v$(shell date +%Y.%m.%d)

dryrun: ## Preview workspace release
	@$(CLI) ws . --dry-run

pull: ## Pull latest for all submodules
	@git submodule update --remote --merge
	@git add -A
	@git commit -m "chore: update submodules" || echo "No submodule updates"

llm-status: ## Check LLM configuration
	@node -e "const e=process.env; console.log('LLM_PROVIDER:', e.LLM_PROVIDER||'(not set, default: openai)'); console.log('LLM_API_KEY:', e.LLM_API_KEY ? '*** set ***' : '(not set)'); console.log('LLM_MODEL:', e.LLM_MODEL||'(not set, using default)'); console.log('LLM_ENDPOINT:', e.LLM_ENDPOINT||'(not set)')"

status: ## Show git status of all repos
	@$(foreach repo,$(wildcard */.),echo "=== $(repo:/=) ==="; git -C $(repo) status --short; echo "";)

lint: ## Run TypeScript type checking on all modules
	@Write-Host "Checking mssqlOrm..."; cd mssqlOrm; npx tsc --noEmit; \
	Write-Host "Checking mssqlClient..."; cd ../mssqlClient; npx tsc --noEmit; \
	Write-Host "Checking mssqlAdapters..."; cd ../mssqlAdapters; npx tsc --noEmit; \
	Write-Host "Checking mssqlAgent..."; cd ../mssqlAgent; npx tsc --noEmit; \
	Write-Host "All checks passed!"
