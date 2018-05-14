export const NODE_FLAGS = new RegExp(
  [
    "abort-on-uncaught-exception",
    "enable-fips",
    "experimental-modules",
    "experimental-vm-modules",
    "force-fips",
    "icu-data-dir=.+",
    "inspect-brk(=.+)?",
    "inspect-port=.+",
    "inspect(=.+)?",
    "napi-modules",
    "no-deprecation",
    "no-force-async-hooks-checks",
    "no-warnings",
    "openssl-config=.+",
    "pending-deprecation",
    "preserve-symlinks",
    "prof-process",
    "redirect-warnings=.+",
    "throw-deprecation",
    "tls-cipher-list=.+",
    "trace-deprecation",
    "trace-event-categories",
    "trace-event-file-pattern",
    "trace-events-enabled",
    "trace-sync-io",
    "trace-warnings",
    "track-heap-objects",
    "use-bundled-ca",
    "use-openssl-ca",
    "v8-options",
    "v8-pool-size=.+",
    "zero-fill-buffers",
    "harmony.*",
    ["r .+", "require .+"]
  ]
    .map(flag => {
      if (Array.isArray(flag)) {
        return `-${flag[0]}|--${flag[1]}`;
      }

      return `--${flag}`;
    })
    .join("|")
);
