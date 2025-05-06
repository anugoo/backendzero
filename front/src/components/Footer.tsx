// components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TechShop</h3>
              <p>Таны технологийн хэрэгцээг хангах найдвартай хамтрагч</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Холбоос</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300">Тухай</a></li>
                <li><a href="#" className="hover:text-blue-300">Үйлчилгээ</a></li>
                <li><a href="#" className="hover:text-blue-300">Холбоо барих</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Холбоо барих</h3>
              <p>Утас: +976 9911-2233</p>
              <p>Имэйл: info@techshop.mn</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>© 2025 TechShop. Бүх эрх хуулиар хамгаалагдсан.</p>
          </div>
        </div>
      </footer>
    );
  }