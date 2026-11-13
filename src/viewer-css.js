globalThis.PicoCss = `html.picoview-page,
html.picoview-page body {
  margin: 0;
  height: 100%;
  background: #111;
}

html.picoview-page body {
  overflow: hidden;
}

#picoview-root {
  position: fixed;
  inset: 0;
  color: #f4f4f5;
  font-family: system-ui, sans-serif;
  color-scheme: dark;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  cursor: default;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

.stage.is-checker {
  background-color: #d0d0d0;
  background-image:
    linear-gradient(45deg, #9a9a9a 25%, transparent 25%),
    linear-gradient(-45deg, #9a9a9a 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #9a9a9a 75%),
    linear-gradient(-45deg, transparent 75%, #9a9a9a 75%);
  background-size: 24px 24px;
  background-position: 0 0, 0 12px, 12px -12px, -12px 0;
}

.blur {
  position: absolute;
  inset: -8%;
  width: 116%;
  height: 116%;
  object-fit: cover;
  filter: blur(36px);
  pointer-events: none;
  display: none;
}

.is-blur .blur {
  display: block;
}

.frame {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(0px);
  transform-origin: 0 0;
  will-change: transform;
}

.photo {
  display: block;
  width: auto;
  height: auto;
  max-width: none;
  max-height: none;
  visibility: hidden;
}

.frame.is-shown .photo {
  visibility: visible;
}

.photo.is-pixelated {
  image-rendering: pixelated;
}

.stage:focus-visible {
  outline: 3px solid #ffb703;
  outline-offset: 3px;
}

.message {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 24px;
  text-align: center;
}

@media (forced-colors: active) {
  .stage:focus-visible {
    outline: 3px solid Highlight;
  }
}
`;
