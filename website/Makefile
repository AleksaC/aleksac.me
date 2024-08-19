NPM = pnpm
ifeq ($(NPM), npm)
    LOCKFILE = package-lock.json
else ifeq ($(NPM), yarn)
	LOCKFILE = yarn.lock
else ifeq ($(NPM), pnpm)
	LOCKFILE = pnpm-lock.yaml
endif

# placed at the top of the file for make to run it if no target is specified
.PHONY: dev
dev: install
	@$(NPM) run dev

.PHONY: install
install: node_modules

# `|| (touch ...)` is added in case install updates mtime of node_modules but doesn't
# actually finish successfully
# touch at the end is added because mtimes on dirs change only when adding/removing files
node_modules: package.json $(LOCKFILE)
	@$(NPM) install || (touch package.json; exit 1)
	@touch node_modules

.PHONY: build
build: dist

# TODO: proper dependencies
dist: node_modules src astro.config.ts tailwind.config.ts tsconfig.json $(shell find src -type f)
	@$(NPM) run build || (touch astro.config.ts; exit 1)
	@touch dist

.PHONY: analyze
analyze: install
	@$(NPM) run analyze

.PHONY: format
format:
	@pre-commit run prettier --all-files

.PHONY: check
check: install
	@$(NPM) run check

.PHONY: pre-commit
pre-commit:
	@pre-commit run --all-files

.PHONY: spellcheck
spellcheck:
	@pre-commit run vale --all-files

.PHONY: serve
serve: build
	@$(NPM) run preview

.PHONY: lhci
lhci:
	@npx @lhci/cli@0.14.0 collect -n 1
	@npx @lhci/cli@0.14.0 assert

.PHONY: post
post:
	@../scripts/add-draft.sh "$(title)"

.PHONY: til
til:
	@../scripts/add-draft.sh --til "$(title)"

.PHONY: clean
clean:
	@rm -rf node_modules
	@rm -rf dist
