import Header from "../../components/LandingPage/Header";
import Footer from "../../components/LandingPage/Footer";
import Sidebar from "../../components/common/Sidebar";

export default function PointExchangeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex" style={{ background: '#fafdff' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col items-center pt-2" style={{ background: '#fafdff' }}>
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}
