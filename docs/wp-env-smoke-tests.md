# wp-env Smoke Tests

This repository does not run `wp-env` in the default CI workflow yet. That is intentional: Docker-based WordPress runtime checks are heavier than the current static validation job.

Use this plan when adding runtime coverage.

## Goal

Validate that a fixture plugin can be activated in WordPress and that basic admin/frontend/block routes do not fatal.

## Candidate Flow

```bash
npm install
npx wp-env start
npx wp-env run cli wp plugin activate sample-plugin
npx wp-env run cli wp plugin list
npx wp-env stop
```

## What To Check

- plugin activation and deactivation;
- REST route registration;
- block registration;
- admin settings page load;
- PHP warnings/fatals in logs;
- rendered frontend output for escaped content;
- no duplicate SEO output when an SEO fixture is added later;
- public/private cache behavior when cache fixtures are added later.

## CI Recommendation

Keep this as a separate `workflow_dispatch` job until it is stable and fast. Do not require Docker in the default validation workflow until the runtime scenarios are worth the added cost.

