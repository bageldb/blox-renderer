#!/usr/bin/env bash
#
# Production Blox renderers deploy only from CMS build hooks. Netlify does not
# run an ignore command for build-hook deploys, so returning 0 here cancels
# automatic Git builds without blocking Blox publish/redeploy builds.
echo "netlify-hook-only: ignoring automatic Git build; Blox hooks are authoritative."
exit 0
