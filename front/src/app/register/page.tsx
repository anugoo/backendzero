"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendRequest, convertToMD5password } from "../../utils/api";
import Link from "next/link";

interface Data {
  uid: number;
  uname: string;
  lname: string;
  fname: string;
}

interface Response {
  resultCode: number;
  resultMessage: string;
  data: Data[];
  size: number;
  action: string;
  curdate: string;
}

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName) {
      setError("Бүх талбаруудыг бөглөнө үү.");
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = convertToMD5password(password);
      let surl = "http://localhost:8000/user/";
      let smethod = "POST";
      let sbody = {
        action: "register",
        uname: email,
        upassword: hashedPassword,
        lname: lastName,
        fname: firstName,
      };

      const response: Response = await sendRequest(surl, smethod as any, sbody);

      if (response.resultCode === 200) {
        setSuccessMessage(response.resultMessage);
        setError("");
      } else {
        setSuccessMessage("");
        setError(response.resultMessage);
      }
    } catch (err) {
      console.log(err);
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-xl">Ачааллаж байна...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Бүртгүүлэх</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="И-мэйл хаягаа оруулна уу"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Нууц үгээ оруулна уу"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Овгоо оруулна уу"
          />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Нэрээ оруулна уу"
          />
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm text-center">{successMessage}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Бүртгүүлэх
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Өмнө нь бүртгүүлсэн үү?{' '}
            <Link href="/login" className="text-indigo-500 hover:underline">Энд дарж нэвтрэнэ үү</Link>
          </p>
        </div>
      </div>
    </div>
  );
}