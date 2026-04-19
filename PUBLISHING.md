# Publishing `kurrasah`

Short checklist for releasing a new version to npm.

## 1. Bump the version

Use npm's version helper — it updates `package.json` and creates a matching git tag automatically.

```bash
# pick one, following semver:
npm version patch -w kurrasah   # bug fixes           → 0.2.2 → 0.2.3
npm version minor -w kurrasah   # new features        → 0.2.3 → 0.3.0
npm version major -w kurrasah   # breaking changes    → 0.3.0 → 1.0.0
```

## 2. Update the CHANGELOG

Edit `packages/kurrasah/CHANGELOG.md`. Add a new section under the conventions header, above the previous release. Use the subsections already established:

- **Breaking** — consumer must adapt
- **Added** — new public API
- **Changed** — non-breaking behavior changes
- **Fixed** — bug fixes
- **Notes** — behaviors worth surfacing but not strictly actionable

## 3. Publish

```bash
npm publish -w kurrasah
```

The `prepublishOnly` hook runs the full test suite and a fresh build before uploading. If either fails, the publish is aborted.

If you hit an auth issue, either the token in `~/.npmrc` has expired or you need an OTP. With a valid **Granular Access Token** (npmjs.com → Access Tokens → Generate New → Granular, with *"Bypass 2FA for publishing"* checked and *Read and write* on `kurrasah`), publishing is a single command. Otherwise pass `--otp=CODE`.

## 4. Push the tag + commit

```bash
git push --follow-tags
```

That sends the `npm version`-generated tag (e.g. `v0.2.3`) and the version-bump commit to GitHub.

## 5. Verify

- `npm view kurrasah version` should print the new version.
- The npm page at https://www.npmjs.com/package/kurrasah updates within a few seconds.
- In a throwaway project, `npm install kurrasah@latest` pulls the new version.

## Rolling back

Published packages can't be truly deleted, but within 72 hours you can `npm unpublish kurrasah@X.Y.Z`. After that, publish a follow-up patch with the fix instead.
