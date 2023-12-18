import carPath from "./assets/car.png";
import roadPath from "./assets/road.jpg";

const imagePaths = {
  car: carPath,
  road: roadPath,
} as const;

const loadingImages: Promise<void>[] = [];

export function loadImage(src: string) {
  const image = new Image();

  loadingImages.push(
    new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
      image.src = src;
    })
  );

  return image;
}

export const images = Object.fromEntries(
  Object.entries(imagePaths).map(([key, value]) => [key, loadImage(value)])
) as Record<keyof typeof imagePaths, HTMLImageElement>;

export function waitForImages() {
  return Promise.all(loadingImages);
}
