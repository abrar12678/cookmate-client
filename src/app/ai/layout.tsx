import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools",
  description: "Generate recipes from ingredients with AI or analyze food photos for instant nutritional breakdown.",
};

export default function AILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
