NPM = pnpm
ifeq ($(NPM), npm)
    LOCKFILE = package-lock.json
else ifeq ($(NPM), yarn)
	LOCKFILE = yarn.lock
else ifeq ($(NPM), pnpm)
	LOCKFILE = pnpm-lock.yaml
endif

.PHONY: help ## Show this help message
help:
	@echo "Available commands:"
	@echo ""
	@grep -E '^\.PHONY: [a-zA-Z_-]+ ## .*$$' $(MAKEFILE_LIST) | sed 's/^\.PHONY: //' | awk 'BEGIN {FS = " ## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

.PHONY: dev ## Run dev server
dev: install
	@$(NPM) run dev

.PHONY: install
install: node_modules

# `|| (touch ...)` is added in case install updates mtime of node_modules but doesn't actually finish successfully
# touch at the end is added because mtimes on dirs change only when adding/removing files
node_modules: package.json $(LOCKFILE)
	@$(NPM) install || (touch package.json; exit 1)
	@touch node_modules

.PHONY: build ## Create the static files for deployment
build: dist

dist: node_modules src astro.config.ts tsconfig.json $(shell find src -type f)
	@$(NPM) run build || (touch astro.config.ts; exit 1)
	@touch dist

.PHONY: analyze ## Run build with rollup bundle visualizer
analyze: install
	@$(NPM) run analyze

.PHONY: clean ## Clean up build artifacts and all the dependencies
clean:
	@rm -rf node_modules
	@rm -rf dist

.PHONY: serve ## Run a preview server of a local production build
serve: build
	@$(NPM) run preview --host $(or $(host), '0.0.0.0')

.PHONY: format ## Run prettier on all files
format:
	@pre-commit run prettier --all-files

.PHONY: check ## Run astro check
check: install
	@$(NPM) run check

.PHONY: pre-commit ## Run pre-commit on all files
pre-commit:
	@pre-commit run --all-files

.PHONY: spellcheck ## Run spellchecker
spellcheck:
	@pre-commit run vale --all-files

.PHONY: lhci ## Run Ligthouse CI
lhci:
	@npx @lhci/cli@0.14.0 collect -n 1
	@npx @lhci/cli@0.14.0 assert

.PHONY: post ## Create a new blog post with the given title (title="<post_title>")
post:
	@../scripts/add-draft.sh "$(title)"

.PHONY: til ## Create a new TIL entry with the given title (title="<post_title>")
til:
	@../scripts/add-draft.sh --til "$(title)"
