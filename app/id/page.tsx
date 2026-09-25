import type { Metadata } from "next";
import { IdGuide } from "@/components/IdGuide";

export const metadata: Metadata = { title: "Get your ID" };

export default function IdPage() {
  return <IdGuide />;
}
