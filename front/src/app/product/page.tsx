'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "../../utils/api";

interface Data {
  pid: number;
  pname: string;
  too: number;
  une: number;
  image?: string; // Base64 string
}

interface Response {
  resultCode: number;
  resultMessage: string;
  data: Data[];
  size: number;
  action: string;
  curdate: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // useRouter hook-ийг ашиглах

  const fetchAllProducts = async () => {
    try {
      let surl = "http://localhost:8000/product/";
      let smethod = "POST";
      let sbody = { action: "allproducts" };

      const response: Response = await sendRequest(surl, smethod as any, sbody);

      console.log("Response:", response);

      if (!response) {
        setError("No response received from the server.");
        return;
      }

      if (response.resultCode === 3032) {
        setProducts(response.data);
      } else {
        setError("Error: " + response.resultMessage);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch all products: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Дэлгэрэнгүй хуудас руу шилжих функц
  const handleDetailsClick = (pid: number) => {
    router.push(`/product/${pid}`); // pid-ийг URL д тавьж шилжих
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center" as const,
      fontSize: "2.5rem",
      color: "#333",
      marginBottom: "20px",
      fontWeight: "700",
    },
    message: {
      textAlign: "center" as const,
      fontSize: "1.2rem",
      color: "#666",
    },
    error: {
      color: "#e74c3c",
      fontWeight: "600",
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
    },
    productCard: {
      border: "1px solid #ddd",
      borderRadius: "15px",
      padding: "15px",
      textAlign: "center" as const,
      transition: "transform 0.3s, box-shadow 0.3s",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    productCardHover: {
      transform: "scale(1.05)",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
    },
    productImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "15px",
    },
    productName: {
      fontSize: "1.5rem",
      color: "#2c3e50",
      margin: "10px 0",
      fontWeight: "700",
    },
    productDetails: {
      fontSize: "1rem",
      color: "#555",
    },
    price: {
      color: "#27ae60",
      fontWeight: "600",
      fontSize: "1.2rem",
    },
    quantity: {
      color: "#2980b9",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}> Бүх бараа </h1>
      {loading ? (
        <p style={styles.message}>Loading...</p>
      ) : error ? (
        <p style={{ ...styles.message, ...styles.error }}>{error}</p>
      ) : products.length === 0 ? (
        <p style={styles.message}>No products found.</p>
      ) : (
        <div style={styles.productsGrid}>
          {products.map((product) => (
            <div
              style={styles.productCard}
              key={product.pid}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {product.image && (
                <img
                  src={`${product.image}`}
                  alt={product.pname}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
              )}
              <h2 style={styles.productName}>{product.pname}</h2>
              <p style={{ ...styles.productDetails, ...styles.price }}>
                <strong>Үнэ:</strong> {product.une} 
              </p>
              <p style={{ ...styles.productDetails, ...styles.quantity }}>
                <strong>Үлдэгдэл:</strong> {product.too} ш
              </p>
              <button 
                onClick={() => handleDetailsClick(product.pid)} // Product-ийг дэлгэрэнгүй харах
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                Дэлгэрэнгүй
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
