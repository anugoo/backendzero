"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendRequest, convertToMD5password } from "../../utils/api"; // ✅ Hash function import хийсэн

export default function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get("token");
    if (!resetToken) {
      setError("Токен байхгүй байна");
    } else {
      setToken(resetToken);
    }
  }, []);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Нууц үг хоосон байж болохгүй");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const hashedPassword = convertToMD5password(newPassword); // ✅ Hash хийж байна

      const response = await sendRequest("http://localhost:8000/user/", "POST", {
        action: "resetpassword",
        token,
        newpass: hashedPassword, // ✅ Hashed password илгээж байна
      });

      if (response.resultCode === 3019) {
        setSuccessMessage("Нууц үг амжилттай шинэчлэгдлээ");
        setError(null);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setSuccessMessage("");
        setError(response.resultMessage);
      }
    } catch (err) {
      console.error(err);
      setError("Нууц үг шинэчлэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-200">
        <h2 className="text-center text-2xl font-semibold">Нууц үг шинэчлэх</h2>
        {successMessage && <p className="text-center text-green-600">{successMessage}</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        <div className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
              Шинэ нууц үг
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Шинэ нууц үг оруулна уу"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Нууц үгээ баталгаажуулах
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Нууц үгээ дахин оруулна уу"
            />
          </div>

          <div className="text-center">
            <button
              onClick={handlePasswordReset}
              disabled={loading}
              className={`w-full py-3 mt-4 ${loading ? "bg-gray-400" : "bg-blue-600"} text-white rounded-md`}
            >
              {loading ? "Шинэчлэж байна..." : "Шинэчилэх"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
