export function isKeyDown(key: string) {
  return keys[key] || false;
}
const keys: { [key: string]: boolean; } = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  e.preventDefault();
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;

  if (e.key === " ") {
    location.reload();
  }
});
