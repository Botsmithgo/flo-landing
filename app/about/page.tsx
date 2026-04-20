import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "Our Story — True beauty starts with clean water",
  description:
    "Feels Like Om builds filters that quiet the chemistry of your daily water. Our story, our principles, and why water is the quietest ingredient in your routine.",
};

export default function AboutPage() {
  return <AboutContent />;
}
