'use client';

import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


// Фонт тохиргоо
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Хэсгийн Стиль (Header ба Footer)

// Header Компонент
const Header = () => {
  const router = useRouter();

  // Гарах үйлдэл
  function logoutHandler() {
    try {
      localStorage.removeItem("token");
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Гарах явцад алдаа гарлаа:", error);
    }
  }

  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    logoutHandler();
  };

  return (
    <header className="headerspec">
      <div className="containerspec">
        <h1 className="logospec">Бараа бүртгэл</h1>
        <nav className="navspec">
          {/* Логин байгаа эсэхийг шалгахгүйгээр бүх хариулт */}
          <Link href={"/product"} className="linkspec">
            Бараа
          </Link>
          <Link href={"/products"} className="linkspec">
            Бараа бүртгэх
          </Link>
          <Link href={"/"} className="linkspec" onClick={handleLogout}>
            Гарах
          </Link>
        </nav>
      </div>
    </header>
  );
};

// Footer Компонент
const Footer = () => {
  return (
    <footer className="footerspec">
      <p>© 2024 Бараа бүртгэлийн систем. Бүх эрх хуулиар хамгаалагдсан.</p>
    </footer>
  );
};

// Үндсэн Layout Компонент
export default function Layout({ children }: { children: React.ReactNode }) {
  const bodyStyle = {
    margin: 0,
    padding: 0,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const mainStyle = {
    flexGrow: 1, // Үлдсэн орон зайг эзлэх
  };

  return (
    <html lang="en">
      <body>
        
        <main className="min-h-screen mt-5" style={mainStyle}>{children}</main>
        
      </body>
    </html>
  );
}
