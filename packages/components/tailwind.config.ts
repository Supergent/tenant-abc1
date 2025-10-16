import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn74998dv4gxe0f64an4cn8kqs7skcfq/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
