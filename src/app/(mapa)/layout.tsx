import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
export default function MapaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
