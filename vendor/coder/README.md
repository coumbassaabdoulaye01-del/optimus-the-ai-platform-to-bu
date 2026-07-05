# Coder upstream components

This directory is the target for the direct upstream Coder component sync requested for the second page.

Run:

```bash
pnpm sync:coder
```

By default, the script uses a sibling checkout at `../coder` if it exists. Otherwise it clones `https://github.com/coder/coder` and copies `site/src/components` into:

```text
vendor/coder/site/src/components
```

The current execution environment blocks GitHub clone/download traffic with `CONNECT tunnel failed, response 403`, so the direct vendored files cannot be populated here. The sync script is committed so the repo can pull the exact upstream components as soon as it runs in the user's environment where the Coder checkout is available.
