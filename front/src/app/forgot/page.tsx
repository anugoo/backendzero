"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "../../utils/api";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";

interface Data {
  uname: string;
}
interface Response {
  resultCode: number;
  resultMessage: string;
  data: Data[];
  size: number;
  action: string;
  curdate: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loadingSendLink, setLoadingSendLink] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/product");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("И-мэйл хаягаа оруулна уу.");
      return;
    }

    setLoadingSendLink(true);
    try {
      let surl = "http://localhost:8000/user/";
      let smethod = "POST";
      let sbody = { action: "forgot", uname: email };
      const response: Response = await sendRequest(surl, smethod as any, sbody);

      if (response.resultCode === 3012) {
        setSuccessMessage(response.resultMessage);
        setError("");
      } else {
        setSuccessMessage("");
        setError(response.resultMessage);
      }
    } catch (err) {
      console.log(err);
      setError("И-мэйл илгээх явцад алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoadingSendLink(false);
    }
  };

  if (loading) return <p className="text-center text-xl">Ачааллаж байна...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Нууц үг сэргээх</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Нууц үгээ сэргээхийн тулд бүртгэлтэй и-мэйл хаягаа оруулна уу.
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              И-мэйл хаяг
            </label>
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
              <div className="p-2">
                <Mail className="text-gray-500 w-5 h-5" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 outline-none rounded-r-md"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            disabled={loadingSendLink}
          >
            {loadingSendLink ? <Loader2 className="w-5 h-5 animate-spin" /> : "И-мэйл илгээх"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Нууц үг санасан уу?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Нэвтрэх
          </Link>
        </p>
      </div>
    </div>
  );
}
