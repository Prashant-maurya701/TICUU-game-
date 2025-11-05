# TODO: Fix Sound Toggle to Mute All Audio

## Current Issue
- Sound toggle buttons synchronize, but not all audio plays check the `soundEnabled` flag.
- Audio still plays even when toggled off in several places.

## Tasks
- [ ] Add `if (soundEnabled)` checks to all audio play calls in my.js
- [ ] Test sound toggle on both screens to ensure all audio is muted/unmuted
- [ ] Verify edge cases like toggling during playback

## Files to Edit
- my.js: Update audio play calls to be conditional on soundEnabled

## Followup Steps
- Deploy and test on localhost or Netlify
- Confirm all audio respects the toggle state
