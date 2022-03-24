# Grafana backend codebase

The code [styleguide](STYLEGUIDE.md) and brief description of the [architecture](ARCHITECTURE.md)

# On going refactorings.
These issues are not something we want to address all at once but something we will improve over time. Since Grafana is released at a regular schedule the prefer approuch is to do this in batches. Not only is it easier to review, it also reduces the risk of conflicts when cherry-picking fixes from master to release branches. Changes that spawn multiple locations are therefore prefered in the end of the release cycle since we make fewer patch releases in the end of the cycle.

## Global state
Global state makes testing and debugging software harder and its something we want to avoid when possible.
Unfortunately, there is quite a lot of global state in Grafana. The way we want to migrate away from this
is to use the `inject` package to wire up all dependencies either in `pkg/cmd/grafana-server/main.go` or
self registering using `registry.RegisterService` ex https://github.com/grafana/grafana/blob/master/pkg/services/cleanup/cleanup.go#L25

## Reduce the use of the init() function
Should only be used to register services/implementations.

## Settings refactoring
The plan is to move all settings to from package level vars in settings package to the [setting.Cfg](https://github.com/grafana/grafana/blob/df917663e6f358a076ed3daa9b199412e95c11f4/pkg/setting/setting.go#L210) struct. To access the settings services/components can inject this setting.Cfg struct.

[Cfg struct](https://github.com/grafana/grafana/blob/df917663e6f358a076ed3daa9b199412e95c11f4/pkg/setting/setting.go#L210)
[Injection example](https://github.com/grafana/grafana/blob/df917663e6f358a076ed3daa9b199412e95c11f4/pkg/services/cleanup/cleanup.go#L20)

## Reduce the use of Goconvey
We want to migrated away from using Goconvey and use stdlib testing as its the most common approuch in the GO community and we think it will make it easier for new contributors. Read more about how we want to write tests in the [ARCHITECTURE.MD](ARCHITECTURE.md#Testing) docs.

## Sqlstore refactoring
The sqlstore handlers all use a global xorm engine variable. This should be refactored to use the Sqlstore instance.

## Avoid global HTTP Handler functions
HTTP handlers should be refactored to so the handler methods are on the HttpServer instance or a more detailed handler struct. E.g (AuthHandler). This way they get access to HttpServer service dependencies (& Cfg object) and can avoid global state

## Date comparison
Newly introduced date columns in the database should be stored as epochs if date comparison is required. This permits to have a unifed approach for comparing dates against all the supported databases instead of handling seperately each one of them. In addition to this, by comparing epochs error pruning transformations from/to other time zones are no more needed.

# Dependency management

Documented in [UPDRAGING_DEPENDENCIES.md](https://github.com/grafana/grafana/blob/master/UPGRADING_DEPENDENCIES.md).
