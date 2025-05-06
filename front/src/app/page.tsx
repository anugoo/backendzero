'use client';

import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { sendRequest } from '@/utils/api';

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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await sendRequest<Product[]>('http://localhost:8000/product/', 'POST', {
          action: 'allproducts',
        });

        if (response.data) {
          setProducts(response.data);
          const uniqueCategories = [...new Set(response.data.map((product) => product.tname))];
          setCategories(uniqueCategories);
        } else {
          setError('Бүтээгдэхүүн татахад алдаа гарлаа');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Сервертэй холбогдоход алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.tname === selectedCategory)
    : products;

  const searchedProducts = searchTerm
    ? filteredProducts.filter((product) =>
        product.pname.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredProducts;

  const handleAddToCart = (product: Product) => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');

    if (!token) {
      toast.error('Та эхлээд нэвтэрнэ үү!', { position: 'top-right' });
      setTimeout(() => (window.location.href = '/login'), 1500);
      return;
    }

    try {
      const userData = JSON.parse(token);
      if (!userData.uid || !userData.uname) {
        toast.error('Нэвтрэлтийн мэдээлэл алга байна. Дахин нэвтэрнэ үү!', {
          position: 'top-right',
        });
        setTimeout(() => (window.location.href = '/login'), 1500);
        return;
      }

      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const isProductInCart = existingCart.some((item: Product) => item.pid === product.pid);
      if (isProductInCart) {
        toast.warn('Энэ бүтээгдэхүүн аль хэдийн сагсанд байна!', { position: 'top-right' });
        return;
      }

      existingCart.push(product);
      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success('Бүтээгдэхүүн сагсанд нэмэгдлээ!', { position: 'top-right' });

      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      toast.error('Нэвтрэлтийн мэдээлэл алдаатай байна. Дахин нэвтэрнэ үү!', {
        position: 'top-right',
      });
      setTimeout(() => (window.location.href = '/login'), 1500);
    }
  };

  const handleToggleWishlist = (product: Product) => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token');

    if (!token) {
      toast.error('Та эхлээд нэвтэрнэ үү!', { position: 'top-right' });
      setTimeout(() => (window.location.href = '/login'), 1500);
      return;
    }

    try {
      const userData = JSON.parse(token);
      if (!userData.uid || !userData.uname) {
        toast.error('Нэвтрэлтийн мэдээлэл алга байна. Дахин нэвтэрнэ үү!', {
          position: 'top-right',
        });
        setTimeout(() => (window.location.href = '/login'), 1500);
        return;
      }

      const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const isProductInWishlist = existingWishlist.some((item: Product) => item.pid === product.pid);
      if (isProductInWishlist) {
        toast.warn('Энэ бүтээгдэхүүн аль хэдийн wishlist-д байна!', { position: 'top-right' });
        return;
      }

      existingWishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
      toast.success('Бүтээгдэхүүн wishlist-д нэмэгдлээ!', { position: 'top-right' });

      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      toast.error('Нэвтрэлтийн мэдээлэл алдаатай байна. Дахин нэвтэрнэ үү!', {
        position: 'top-right',
      });
      setTimeout(() => (window.location.href = '/login'), 1500);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4, // Илүү олон бүтээгдэхүүн
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    centerMode: true,
    centerPadding: '60px',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <Navbar />

      {/* 🖼 Carousel хэсэг */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 pt-10">
          <Slider {...sliderSettings}>
            {products.slice(0, 6).map((product) => (
              <div key={product.pid} className="px-4">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-2">
                  <img
                    src={product.image}
                    alt={product.pname}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* 🛒 Бүтээгдэхүүн жагсаалт + ангилал + хайлт */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Бүтээгдэхүүн хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
          
          
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Уншиж байна...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : searchedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedProducts.map((product) => (
              <ProductCard
                key={product.pid}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist} // Бүтээгдэхүүнд wishlist toggle нэмэх
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Бүтээгдэхүүн олдсонгүй</p>
        )}
      </section>

      <Footer />
    </div>
  );
}
