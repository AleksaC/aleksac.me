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
	$(NPM) run dev

.PHONY: install
install: node_modules

# `|| (touch ...)` is added in case install updates mtime of node_modules but doesn't
# actually finish successfully
# touch at the end is added because mtimes on dirs change only when adding/removing files
node_modules: package.json $(LOCKFILE)
	$(NPM) install || (touch package.json; exit 1)
	@touch node_modules

.PHONY: build
build: .next public/sitemap.xml public/feed.xml

.next public/sitemap.xml public/feed.xml: node_modules src _til _posts \
											$(wildcard *.config.js) \
											$(shell find src -type f) \
											$(wildcard */*.md)
	$(NPM) run build || (touch next.config.js; exit 1)
	@touch .next

.PHONY: analyze
analyze: install
	$(NPM) run analyze

.PHONY: format
format:
	@pre-commit run prettier --all-files

.PHONY: lint
lint:
	$(NPM) run lint

.PHONY: typecheck
typecheck:
	$(NPM) run typecheck

.PHONY: static-analysis
static-analysis: typecheck lint

.PHONY: pre-commit
pre-commit: export SKIP = eslint,tsc
pre-commit:
	@pre-commit run --all-files

.PHONY: spellcheck
spellcheck:
	@pre-commit run vale --all-files

.PHONY: serve
serve: build
	$(NPM) run start

.PHONY: post
post:
	@../scripts/add-draft.sh "$(title)"

.PHONY: til
til:
	@../scripts/add-draft.sh --til "$(title)"

.PHONY: clean
clean:
	@rm -rf node_modules
	@rm -rf .next
