export function isKeyDown(key: string) {
  return keys[key] || false;
}

const keys: { [key: string]: boolean } = {};

document.addEventListener("keydown", (e) => {
  if (!listenToKeys.has(e.key)) {
    return;
  }

  keys[e.key] = true;
  e.preventDefault();
});
document.addEventListener("keyup", (e) => {
  if (!listenToKeys.has(e.key)) {
    return;
  }

  keys[e.key] = false;

  if (e.key === " ") {
    location.reload();
  }
});

const listenToKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  " ",
]);
