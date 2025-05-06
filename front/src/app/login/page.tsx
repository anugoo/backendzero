'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendRequest, convertToMD5password } from '../../utils/api';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';

interface Data {
  uid: number;
  uname: string;
  lname: string;
  fname: string;
  lastlogin: string;
}

interface Response {
  resultCode: number;
  resultMessage: string;
  data: Data[];
  size?: number;
  action?: string;
  curdate?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const hashedPassword = convertToMD5password(password);
      const surl = 'http://localhost:8000/user/';
      const smethod = 'POST';
      const sbody = { action: 'login', uname: email, upassword: hashedPassword };
      const response: Response = await sendRequest(surl, smethod as any, sbody);

      console.log('Серверээс ирсэн хариу:', response);

      if (response.resultCode === 1002 && response.data?.length) {
        const userData = response.data[0];
        localStorage.setItem('token', JSON.stringify(userData));
        router.push('/');
        // window.location.reload(); // Заавал биш, учир нь router.push хангалттай
      } else if (response.resultCode === 1004) {
        setError('И-мэйл эсвэл нууц үг буруу байна.');
      } else if (response.resultCode === 5001) {
        setError('Сервер дээр алдаа гарлаа. Дахин оролдоно уу.');
      } else if (response.resultCode === 3006) {
        setError('И-мэйл эсвэл нууц үг оруулаагүй байна.');
      } else {
        setError(response.resultMessage || 'Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.');
      }
    } catch (err) {
      console.error('Нэвтрэх алдаа:', err);
      setError('Сервертэй холбогдоход алдаа гарлаа. Сервер ажиллаж байгаа эсэхийг шалгана уу.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-center text-xl text-gray-600">Ачааллаж байна...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Нэвтрэх</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <Mail className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
              placeholder="И-мэйл хаягаа оруулна уу"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
            <Lock className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
              placeholder="Нууц үгээ оруулна уу"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white transition ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Бүртгэлгүй юу?{' '}
            <Link href="/register" className="text-indigo-500 hover:underline">
              Бүртгүүлэх
            </Link>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Нууц үгээ мартсан уу?{' '}
            <Link href="/forgot" className="text-indigo-500 hover:underline">
              Энд дарж сэргээнэ үү
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}