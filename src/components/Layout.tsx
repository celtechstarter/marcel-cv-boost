import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AccessibilityTools } from "@/components/AccessibilityTools";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <Navigation />
      {children}
      <Footer />
      <AccessibilityTools />
    </div>
  );
};

export default Layout;