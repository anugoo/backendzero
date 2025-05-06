'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/solid'; // Сагсны icon

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ fname?: string; userrole?: string } | null>(null);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      } catch (e) {
        console.error('Сагсны мэдээлэл алдаатай байна:', e);
        setCartCount(0);
      }
    };

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = JSON.parse(token);
          setIsLoggedIn(true);
          setUser(userData);
        } catch (e) {
          console.error('Токены мэдээлэл алдаатай байна:', e);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    updateCartCount();
    checkLoginStatus();

    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    setIsLoggedIn(false);
    setUser(null);
    setCartCount(0);
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <Link href="/">TechShop</Link>
        </div>
        <div className="space-x-6 flex items-center">
          <Link href="/" className="hover:text-blue-600 transition">
            Бүтээгдэхүүн
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Холбоо барих
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center text-blue-600 hover:text-blue-700 transition"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
                {cartCount}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <>
              {user?.userrole === '2' && (
                <Link href="/product" className="hover:text-blue-600 transition">
                  Админ
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              >
                Гарах
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/register"
                className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition"
              >
                Бүртгүүлэх
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}