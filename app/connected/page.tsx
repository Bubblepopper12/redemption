import type { Metadata } from "next";
import { Connected } from "@/components/Connected";

export const metadata: Metadata = { title: "Phone & internet" };

export default function ConnectedPage() {
  return <Connected />;
}
