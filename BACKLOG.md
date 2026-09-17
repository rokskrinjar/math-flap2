# Backlog

## Open items

- [ ] Commit the code and push it to GitHub (`rokskrinjar/math-flap2`). Nothing is committed yet.
- [ ] Connect the GitHub repo to the Vercel project so every push to `main` deploys. For now, deploy by hand with `vercel.cmd --prod`.
- [ ] Owl wing flap on each tap. A squash-and-stretch fake was tried on 2026-09-17 and rejected — it looked bad. Do it properly instead: 4 owl frames (wings up → down → up → rest), cycled in `drawBird()` in public/game.html. Waiting on the frames.
- [ ] Decide whether to clear the test players and scores created during setup (2026-09-17) from the production database.
