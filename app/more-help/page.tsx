import type { Metadata } from "next";
import { MoreHelp } from "@/components/MoreHelp";

export const metadata: Metadata = { title: "More help" };

export default function MoreHelpPage() {
  return <MoreHelp />;
}
