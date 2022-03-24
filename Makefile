-include local/Makefile

.PHONY: all deps-go deps-js deps build-go build-server build-cli build-js build build-docker-dev build-docker-full lint-go gosec revive golangci-lint go-vet test-go test-js test run clean devenv devenv-down revive-alerting

GO = GO111MODULE=on go
GO_FILES ?= ./pkg/...
SH_FILES ?= $(shell find ./scripts -name *.sh)

all: deps build

deps-go:
	$(GO) run build.go setup

deps-js: node_modules

deps: deps-js

build-go:
	@echo "build go files"
	$(GO) run build.go build

build-server:
	@echo "build server"
	$(GO) run build.go build-server

build-cli:
	@echo "build in CI environment"
	$(GO) run build.go build-cli

build-js:
	@echo "build frontend"
	yarn run build

build: build-go build-js

build-docker-dev:
	@echo "build development container"
	@echo "\033[92mInfo:\033[0m the frontend code is expected to be built already."
	$(GO) run build.go -goos linux -pkg-arch amd64 ${OPT} build pkg-archive latest
	cp dist/grafana-latest.linux-x64.tar.gz packaging/docker
	cd packaging/docker && docker build --tag grafana/grafana:dev .

build-docker-full:
	@echo "build docker container"
	docker build --tag grafana/grafana:dev .

test-go:
	@echo "test backend"
	$(GO) test -v ./pkg/...

test-js:
	@echo "test frontend"
	yarn test

test: test-go test-js

clean:
	@echo "cleaning"
	rm -rf node_modules
	rm -rf public/build

node_modules: package.json yarn.lock
	@echo "install frontend dependencies"
	yarn install --pure-lockfile --no-progress

scripts/go/bin/revive: scripts/go/go.mod
	@cd scripts/go; \
	$(GO) build -o ./bin/revive github.com/mgechev/revive

scripts/go/bin/gosec: scripts/go/go.mod
	@cd scripts/go; \
	$(GO) build -o ./bin/gosec github.com/securego/gosec/cmd/gosec

scripts/go/bin/bra: scripts/go/go.mod
	@cd scripts/go; \
	$(GO) build -o ./bin/bra github.com/unknwon/bra

scripts/go/bin/golangci-lint: scripts/go/go.mod
	@cd scripts/go; \
	$(GO) build -o ./bin/golangci-lint github.com/golangci/golangci-lint/cmd/golangci-lint

revive: scripts/go/bin/revive
	@echo "lint via revive"
	@scripts/go/bin/revive \
		-formatter stylish \
		-config ./scripts/go/configs/revive.toml \
		$(GO_FILES)

revive-alerting: scripts/go/bin/revive
	@echo "lint alerting via revive"
	@scripts/go/bin/revive \
		-formatter stylish \
		./pkg/services/alerting/...

# TODO recheck the rules and leave only necessary exclusions
gosec: scripts/go/bin/gosec
	@echo "lint via gosec"
	@scripts/go/bin/gosec -quiet \
		-exclude=G104,G107,G201,G202,G204,G301,G304,G401,G402,G501 \
		-conf=./scripts/go/configs/gosec.json \
		$(GO_FILES)

golangci-lint: scripts/go/bin/golangci-lint
	@echo "lint via golangci-lint"
	@scripts/go/bin/golangci-lint run \
		--config ./scripts/go/configs/.golangci.yml \
		$(GO_FILES)

go-vet:
	@echo "lint via go vet"
	@$(GO) vet $(GO_FILES)

lint-go: go-vet golangci-lint revive revive-alerting gosec

# with disabled SC1071 we are ignored some TCL,Expect `/usr/bin/env expect` scripts
shellcheck: $(SH_FILES)
	@docker run --rm -v "$$PWD:/mnt" koalaman/shellcheck:stable \
	$(SH_FILES) -e SC1071

run: scripts/go/bin/bra
	@scripts/go/bin/bra run

# create docker-compose file with provided sources and start them
# example: make devenv sources=postgres,openldap
ifeq ($(sources),)
devenv:
	@printf 'You have to define sources for this command \nexample: make devenv sources=postgres,openldap\n'
else
devenv: devenv-down
	$(eval targets := $(shell echo '$(sources)' | tr "," " "))

	@cd devenv; \
	./create_docker_compose.sh $(targets) || \
	(rm -rf {docker-compose.yaml,conf.tmp,.env}; exit 1)

	@cd devenv; \
	docker-compose up -d --build
endif

# drop down the envs
devenv-down:
	@cd devenv; \
	test -f docker-compose.yaml && \
	docker-compose down || exit 0;
