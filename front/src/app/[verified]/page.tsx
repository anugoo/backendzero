"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "../../utils/api";

interface Data {}
interface Response {
  resultCode: number;
  resultMessage: string;
  data: Data[];
  size: number;
  action: string;
  curdate: string;
}

export default function Verified() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");

      console.log("👉 Token:", tokenFromUrl);
      if (!tokenFromUrl) {
        setError("Баталгаажуулалтын токен олдсонгүй.");
        setLoading(false);
        return;
      }
      setToken(tokenFromUrl);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      const surl = `http://localhost:8000/user?token=${token}`;
      const smethod = "GET";

      console.log("🔗 API хаяг:", surl);

      try {
        const response: Response | null = await sendRequest(surl, smethod);

        if (!response) {
          setError("Серверээс хоосон хариу ирлээ.");
          return;
        }

        console.log("✅ Серверийн хариу:", response);

        if (response.resultCode === 3010) {
          setSuccessMessage(response.resultMessage);
          setError(null);
          setTimeout(() => router.push("/login"), 2000);
        } else if (response.resultCode === 3011) {
          setSuccessMessage(response.resultMessage);
          setError(null);
          setTimeout(() => router.push(`/resetpassword?token=${token}`), 2000); // ✅ Токеныг дамжуулж байна
        } else {
          setSuccessMessage(null);
          setError(response.resultMessage);
        }
      } catch (err) {
        console.error("❌ API Error:", err);
        setError("Сервертэй холбогдоход алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return <p>⏳ Түр хүлээнэ үү...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-200">
        {successMessage && <p className="text-center text-green-600">{successMessage}</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
}
