import type { Metadata } from "next";
import BathContent from "./BathContent";

export const metadata: Metadata = {
  title: "Bath Water Filter — slower rituals, cleaner water",
  description:
    "A dechlorinating bath filter that clips to your faucet. Catches chlorine and sediment before the water touches your skin. 60-day returns.",
};

export default function BathPage() {
  return <BathContent />;
}
