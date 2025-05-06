"use client";  // Mark the component as a Client Component

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";  // Use this for client-side navigation
// import { sendRequest } from "../../../utils/api";

// interface Product {
//   pid: number;
//   pname: string;
//   too: number;
//   une: number;
//   image?: string;
//   sname: string;
//   tname: string;
//   status: boolean;
//   receptiondate: Date;
// }


// interface Response {
//   resultCode: number;
//   resultMessage: string;
//   data: Product[];
//   size: number;
//   action: string;
//   curdate: string;
// }

// const ProductDetailPage = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);


//   const { id }: any = useParams();
//   console.log("Hi lalraa", id);
//   useEffect(() => {
//     if (id) {
//       fetchProductDetail(Number(id));
//     }
//   }, [id]);

//   const fetchProductDetail = async (id: number) => {
//     try {
//       const surl = "http://localhost:8000/product/";
//       const smethod = "POST";
//       const sbody = { action: "productdetail", pid: id };

//       const response = await sendRequest(surl, smethod, sbody);

//       console.log("Product Detail Response:", response);

//       if (!response) {
//         setError("No response received from the server.");
//         return;
//       }

//       if (response.resultCode === 3028) {
//         setProduct(response.data[0]);
//       } else {
//         setError("Error: " + response.resultMessage);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       setError("Failed to fetch product detail: " + (error instanceof Error ? error.message : "Unknown error"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const styles = {
//     container: {
//       maxWidth: "900px",
//       margin: "0 auto",
//       padding: "20px",
//       fontFamily: "'Roboto', sans-serif",
//       backgroundColor: "#fff",
//       borderRadius: "10px",
//       boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//     },
//     heading: {
//       textAlign: "center" as const,
//       fontSize: "2.5rem",
//       color: "#333",
//       marginBottom: "20px",
//       fontWeight: "700",
//     },
//     error: {
//       color: "#e74c3c",
//       fontWeight: "600",
//       textAlign: "center" as const,
//     },
//     productImage: {
//       width: "100%",
//       height: "400px",
//       objectFit: "cover",
//       borderRadius: "10px",
//       marginBottom: "20px",
//     },
//     productDetails: {
//       fontSize: "1.2rem",
//       color: "#555",
//       marginBottom: "10px",
//     },
//     price: {
//       color: "#27ae60",
//       fontWeight: "600",
//       fontSize: "1.5rem",
//     },
//     quantity: {
//       color: "#2980b9",
//       fontWeight: "600",
//     },
//     status: {
//       fontSize: "1.2rem",
//       fontWeight: "600",
//       color: "#e67e22",
//       marginTop: "10px",
//     },
//   };

//   if (loading) {
//     return <p style={styles.error}>Loading...</p>;
//   }

//   if (error) {
//     return <p style={styles.error}>{error}</p>;
//   }

//   if (!product) {
//     return <p style={styles.error}>No product found.</p>;
//   }

//   const handleDeleteProduct = async (pid: number) => {
//     try {
//       let surl = "http://localhost:8000/product/";
//       let smethod = "POST";
//       let sbody = { action: "deleteproduct", pid };

//       const response: Response = await sendRequest(surl, smethod as any, sbody);
//       if (response.resultCode === 3032) {
//         console.log(response.data);
//         setProducts(products.filter((product) => product.pid !== pid));
//       } else {
//         setError("Error: " + response.resultMessage);
//       }
//     } catch (error) {
//       setError("Failed to delete product: " + (error instanceof Error ? error.message : "Unknown error"));
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>{product.pname}</h1>
//       {product.image && (
//         <img
//           src={`${product.image}`}
//           alt={product.pname} className="w-full h-[400px] object-cover rounded-[10px] mb-5"
//         />
//       )}
//       <h2>{product.pname}</h2>
//       <p>Төрөл: {product.tname} </p>
//       <p>Нийлүүлэгч: {product.sname} </p>
//       <p>Үнэ: {product.une}</p>
//       <p>Үлдэгдэл: {product.too} ш</p>
//       <p>
//         Бүртгэсэн огноо:
//         {product.receptiondate
//           ? new Date(product.receptiondate).toISOString().split('T')[0]
//           : "Огноо байхгүй"}
//       </p>

//       <div className="flex justify-between">
//         <button
//           onClick={() => handleDeleteProduct(product.pid)}
//           className="buttonspec deleteButton"
//         >
//           Устгах
//         </button>
//         <button className="buttonspec">
//           Засах
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { sendRequest } from "../../../utils/api"
import EditProduct from "@/components/EditProduct"

interface Product {
  pid: number
  pname: string
  too: number
  une: number
  image?: string
  sname: string
  tname: string
  status: boolean
  receptiondate: Date
}

interface Response {
  resultCode: number
  resultMessage: string
  data: Product[]
  size: number
  action: string
  curdate: string
}

const ProductDetailPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const { id }: any = useParams()
  const router = useRouter()

  useEffect(() => {
    if (id) {
      fetchProductDetail(Number(id))
    }
  }, [id])

  const fetchProductDetail = async (id: number) => {
    try {
      const surl = "http://localhost:8000/product/"
      const smethod = "POST"
      const sbody = { action: "productdetail", pid: id }

      const response = await sendRequest(surl, smethod, sbody)

      if (!response) {
        setError("No response received from the server.")
        return
      }

      if (response.resultCode === 3028) {
        setProduct(response.data[0])
      } else {
        setError("Error: " + response.resultMessage)
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setError("Failed to fetch product detail: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (pid: number) => {
    try {
      let surl = "http://localhost:8000/product/"
      let smethod = "POST"
      let sbody = { action: "deleteproduct", pid }

      const response: Response = await sendRequest(surl, smethod as any, sbody)
      if (response.resultCode === 3031) {
        setProducts(products.filter((product) => product.pid !== pid))
        router.push('/product') // Redirect to products list after deletion
      } else {
        setError("Error: " + response.resultMessage)
      }
    } catch (error) {
      setError("Failed to delete product: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProduct(updatedProduct)
    setIsEditing(false)
  }

  if (loading) {
    return <p className="text-center text-xl font-semibold text-gray-600">Loading...</p>
  }

  if (error) {
    return <p className="text-center text-xl font-semibold text-red-600">{error}</p>
  }

  if (!product) {
    return <p className="text-center text-xl font-semibold text-red-600">No product found.</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {isEditing ? (
        <EditProduct 
          product={product} 
          onUpdate={handleUpdateProduct} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-6">{product.pname}</h1>
          {product.image && (
            <img
              src={`${product.image}`}
              alt={product.pname}
              className="w-full h-[400px] object-cover rounded-lg mb-6"
            />
          )}
          <div className="space-y-4 text-lg">
            <p><span className="font-semibold">Төрөл:</span> {product.tname}</p>
            <p><span className="font-semibold">Нийлүүлэгч:</span> {product.sname}</p>
            <p><span className="font-semibold">Үнэ:</span> {product.une}</p>
            <p><span className="font-semibold">Тоо ширхэг:</span> {product.too} ш</p>
            <p><span className="font-semibold">Бүртгэсэн огноо:</span> {
              product.receptiondate
                ? new Date(product.receptiondate).toISOString().split('T')[0]
                : "No date available"
            }</p>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => handleDeleteProduct(product.pid)}
              className="buttonspec bg-red-500 hover:bg-red-600 text-white"
            >
              Устгах
            </button>
            <button
            onClick={() => router.push('/product')} // "product" руу чиглүүлэх
            className="buttonspec bg-gray-500 hover:bg-gray-600 text-white"
          >
            Буцах
          </button>

            <button 
              onClick={() => setIsEditing(true)}
              className="buttonspec bg-blue-500 hover:bg-blue-600 text-white"
            >
              Засах
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductDetailPage

