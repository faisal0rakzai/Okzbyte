
## Dual video integration and autoplay recovery

The second supplied MP4 is now used in the Innovation Showcase as a branded muted looping video card with its own poster. The hero video now uses a reusable `HeroVideo` component that explicitly retries playback on mount, `canplay`, `loadeddata`, and visibility changes while keeping `muted`, `loop`, and `playsInline` set. This addresses browsers that do not honor autoplay on the first render.
