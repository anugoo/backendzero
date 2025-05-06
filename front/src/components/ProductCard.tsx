import { useState } from 'react';

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

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onToggleWishlist }: ProductCardProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false); // Track if the product is in the wishlist

  const handleWishlistToggle = async () => {
    onToggleWishlist(product); // Trigger wishlist toggle in the parent
    setIsInWishlist(!isInWishlist); // Toggle local state

    // Call the backend to update the wishlist status
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(token);
      if (userData.uid) {
        const response = await fetch('http://localhost:8000/product/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'togglewishlist',
            uid: userData.uid,
            pid: product.pid,
          }),
        });
        const data = await response.json();
        if (data.message) {
          console.log(data.message); // Handle success message
        } else if (data.error) {
          console.error(data.error); // Handle error message
        }
      }
    }
  };

  return (
    <div className="relative bg-white shadow-md rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Image section */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.pname}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Discount badge (if applicable) */}
        {product.too > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.too} ширхэг үлдсэн
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{product.pname}</h3>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Ангилал:</span> {product.tname}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Брэнд:</span> {product.sname}
          </p>
          <p className="text-lg font-semibold text-indigo-600">
            {product.une.toLocaleString()}₮
          </p>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
        >
          Сагсанд нэмэх
        </button>
      </div>

      {/* Wishlist toggle button (heart icon) */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${isInWishlist ? 'text-red-500' : 'text-gray-600'} hover:text-red-500`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ProductCard;
