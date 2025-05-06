'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Product {
  id: number;
  name: string;
  supplierName: string;
  category: string;
  quantity: number;
  price: number;
  details: string;
  registrationDate: string;
  image: string;
}

// Sample Product Data (in a real-world app, this would come from an API or database)
const products: Product[] = [
  { 
    id: 1, 
    name: "Product Name 1", 
    supplierName: "Supplier 1", 
    category: "Category 1", 
    quantity: 100, 
    price: 19.99, 
    details: "This is a great product.", 
    registrationDate: "2024-12-01", 
    image: "https://via.placeholder.com/150" 
  },
  { 
    id: 2, 
    name: "Product Name 2", 
    supplierName: "Supplier 2", 
    category: "Category 2", 
    quantity: 50, 
    price: 29.99, 
    details: "High-quality materials.", 
    registrationDate: "2024-11-20", 
    image: "https://via.placeholder.com/150" 
  },
  { 
    id: 3, 
    name: "Product Name 3", 
    supplierName: "Supplier 3", 
    category: "Category 3", 
    quantity: 30, 
    price: 49.99, 
    details: "Stylish and durable. Perfect for outdoor activities.", 
    registrationDate: "2024-10-10", 
    image: "https://via.placeholder.com/150" 
  },
];

const ProductEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const selectedProduct = products.find((prod) => prod.id === parseInt(id as string));
      if (selectedProduct) {
        setProduct(selectedProduct);
      }
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const handleSave = () => {
    // Save changes here
    alert('Product updated!');
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="product-edit p-6">
      <h2 className="text-3xl font-bold">Edit Product</h2>

      <div className="mt-4">
        <label className="block text-sm font-semibold">Product Name</label>
        <input 
          type="text" 
          value={product.name} 
          onChange={(e) => setProduct({ ...product, name: e.target.value })} 
          className="mt-2 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold">Price</label>
        <input 
          type="number" 
          value={product.price} 
          onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })} 
          className="mt-2 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold">Details</label>
        <textarea 
          value={product.details} 
          onChange={(e) => setProduct({ ...product, details: e.target.value })} 
          className="mt-2 p-2 w-full border rounded-md"
        />
      </div>

      <button 
        onClick={handleSave} 
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
        Save Changes
      </button>
    </div>
  );
};

export default ProductEditPage;
