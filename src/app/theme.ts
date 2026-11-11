import { createDarkTheme, createLightTheme, type BrandVariants } from '@fluentui/react-components';

const primary = '#0B6E4F';
const lightnessSteps = [97, 94, 90, 84, 76, 66, 56, 48, 41, 35, 29, 24, 19, 15, 11, 8];
const brandKeys = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160] as const;

function toBrandHex(lightness: number): string {
  const red = Number.parseInt(primary.slice(1, 3), 16) / 255;
  const green = Number.parseInt(primary.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(primary.slice(5, 7), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const sourceLightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * sourceLightness - 1));
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue /= 6;
  }

  const targetLightness = lightness / 100;
  const chroma = (1 - Math.abs(2 * targetLightness - 1)) * saturation;
  const segment = hue * 6;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  const offset = targetLightness - chroma / 2;
  let channels: [number, number, number];

  if (segment < 1) channels = [chroma, secondary, 0];
  else if (segment < 2) channels = [secondary, chroma, 0];
  else if (segment < 3) channels = [0, chroma, secondary];
  else if (segment < 4) channels = [0, secondary, chroma];
  else if (segment < 5) channels = [secondary, 0, chroma];
  else channels = [chroma, 0, secondary];

  return `#${channels.map((channel) => Math.round((channel + offset) * 255).toString(16).padStart(2, '0')).join('')}`;
}

export const brandRamp = Object.fromEntries(
  brandKeys.map((key, index) => [key, toBrandHex(lightnessSteps[index])]),
) as BrandVariants;

const fontFamilyBase = '"Inter", "Segoe UI Variable", "Segoe UI", sans-serif';

export const lightTheme = { ...createLightTheme(brandRamp), fontFamilyBase };
export const darkTheme = { ...createDarkTheme(brandRamp), fontFamilyBase };
