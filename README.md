# Lab 7

Kevin Cohen

## Check Your Understanding
1. I would put my automated tests within a GitHub action that runs whenever code is pushed. This ensures that every PR automatically validates core end-to-end testing before merging. It also allows gives engineers more time to manually test things that aren't systematic enough for automation to handle.
2. No. E2E testing with Puppeteer is for simulating UI flow. To test function output, we could use Jest.
3. Navigation mode reloads the page and measures metrics during the full load. Snapshot mode captures the page's current DOM and analyzes for things like accessibility and best practices without measuring load performance.
4. Optimize images, trim/minify JS, add key metadata




