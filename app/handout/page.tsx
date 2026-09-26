import type { Metadata } from "next";
import { HandoutMaker } from "@/components/HandoutMaker";

export const metadata: Metadata = { title: "Make handouts" };

export default function HandoutPage() {
  return <HandoutMaker />;
}
