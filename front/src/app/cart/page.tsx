'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  pid: number;
  pname: string;
  tname: string;
  sname: string;
  too: number;
  une: number;
  receptiondate: string;
  image: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);

    const updateCart = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(updatedCart);
    };

    window.addEventListener('storage', updateCart);
    return () => window.removeEventListener('storage', updateCart);
  }, []);

  const handleRemoveFromCart = (pid: number) => {
    const updatedCart = cartItems.filter((item) => item.pid !== pid);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Бүтээгдэхүүн сагснаас хасагдлаа!', { position: 'top-right' });
    window.dispatchEvent(new Event('storage')); // Navbar-ын тоолуурыг шинэчлэх
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    toast.success('Сагс хоослогдлоо!', { position: 'top-right' });
    window.dispatchEvent(new Event('storage')); // Navbar-ын тоолуурыг шинэчлэх
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.une, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <Navbar />
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Таны сагс</h1>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Сагс хоосон байна</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((item) => (
                <div key={item.pid} className="bg-white shadow-lg rounded-lg p-4">
                  <img
                    src={item.image}
                    alt={item.pname}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                  />
                  <h3 className="text-lg font-semibold">{item.pname}</h3>
                  <p className="text-gray-600">Үнэ: {item.une.toLocaleString()}₮</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.pid)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Хасах
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold mb-4">
                Нийт үнэ: {totalPrice.toLocaleString()}₮
              </p>
              <button
                onClick={handleClearCart}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Сагсыг хоослох
              </button>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Cart;