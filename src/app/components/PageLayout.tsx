import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div
      className="flex h-screen"
      style={{ fontFamily: "'Poppins', sans-serif", background: "#F9FAFB" }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-[16px] pb-[24px]">
        <div className="flex items-center justify-between mb-3 px-[24px] py-[0px]">
          <h1 className="m-0 flex items-center gap-2" style={{ fontSize: "20px", fontWeight: 600, color: "#1F2937" }}>
            <span>{title}</span>
          </h1>
        </div>
        <div className="px-[24px]">
          {children}
        </div>
      </main>
    </div>
  );
}
