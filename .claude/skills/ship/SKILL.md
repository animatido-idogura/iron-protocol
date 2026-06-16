---
name: ship
description: Release routine for the IRON PROTOCOL app (creative-mpc). Use after finishing ANY code change to index.html / sw.js / rules — bumps the on-screen version, commits, pushes to GitHub, and deploys live to Firebase Hosting. Triggers on "ship it", "deploy", "publish", "push live", "release", or whenever a fix is done and should go live.
---

# Ship IRON PROTOCOL

The release routine for this project. Run **every time** a code change is finished
so the live site at https://iron-protocol-music.web.app stays current.

## Project facts
- **App:** IRON PROTOCOL — AI workout music generator (single-page `index.html`).
- **Live URL:** https://iron-protocol-music.web.app (Firebase Hosting).
- **Firebase project:** `iron-protocol-music` (already the default; user is logged into the CLI).
- **GitHub:** https://github.com/animatido-idogura/iron-protocol — branch `main`.
- **Creator email:** `animatido@gmail.com` (the admin / only uploader).
- **Version constant:** `const APP_VERSION = 'V0.x.y'` near the top of the `<script>` in `index.html`.
  Shown as a glowing-green badge in the header + login + page title.
- **Rules files:** `firestore.rules`, `storage.rules`, wired by `firebase.json` / `.firebaserc`.

## The routine (do these in order)

1. **Bump the version.** Edit `APP_VERSION` in `index.html` — increment the last
   number (e.g. `V0.1.8` → `V0.1.9`). Always bump on every fix; the user uses the
   green badge to confirm they're on the right build.

2. **Commit.** Stage the changed files and commit. Put the new version in the commit
   subject, e.g. `Short summary of the fix (V0.1.9)`. End the message with:
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

3. **Push to GitHub:** `git push origin main`.
   - If push is rejected, the remote has newer commits (the user sometimes edits on
     GitHub web). `git fetch`, inspect `HEAD..origin/main`, and re-apply changes onto
     the latest version rather than force-pushing — never clobber their work.

4. **Deploy to Firebase Hosting:**
   - Code only changed → `firebase deploy --only hosting`
   - Rules also changed (`firestore.rules` / `storage.rules`) → `firebase deploy`
     (full) or `firebase deploy --only hosting,firestore:rules,storage`.

5. **Report back:** state the new version (e.g. **V0.1.9**) and remind that the live
   URL is updated. Tell the user to refresh and confirm the version badge.

## Notes
- The script in `index.html` is an ES module, so any function called from inline
  `onclick=` must be assigned to `window.` (follow the existing pattern).
- A service worker (`sw.js`, cache `iron-protocol-vN`) caches the app — after a deploy,
  the user may need a hard refresh to see changes. Bump the SW cache name if you change
  caching behavior.
