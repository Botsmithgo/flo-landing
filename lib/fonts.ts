import { Fraunces, Inter_Tight } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-flo",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-flo",
  weight: ["300", "400", "500", "600"],
});
