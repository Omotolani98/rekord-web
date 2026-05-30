import Sidebar from "@/components/Sidebar";
import CopyEnhancer from "@/components/CopyEnhancer";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs">
      <Sidebar />
      {children}
      <CopyEnhancer />
    </div>
  );
}
