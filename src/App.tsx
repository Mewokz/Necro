import { AssetGate } from "./components/AssetGate";
import { MainLayout } from "./components/layout/MainLayout";
import { Analytics } from "@vercel/analytics/next";

export default function App() {
  return (
    <AssetGate>
      <MainLayout />
      <Analytics />
    </AssetGate>
  );
}
