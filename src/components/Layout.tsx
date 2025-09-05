import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
    </div>
  );
};

export default Layout;