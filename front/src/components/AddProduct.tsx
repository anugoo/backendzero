'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { sendRequest } from '../utils/api'

interface ProductData {
  pname: string
  sid: number
  tid: number
  too: number
  une: number
  status: boolean
  image?: string
}

interface Supplier {
  sid: number
  sname: string
}

interface Type {
  tid: number
  tname: string
}

export default function AddProduct() {
  const router = useRouter()
  const [productData, setProductData] = useState<ProductData>({
    pname: '',
    sid: 0,
    tid: 0,
    too: 0,
    une: 0,
    status: true,
    image: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [types, setTypes] = useState<Type[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchSuppliers()
    fetchTypes()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await sendRequest(
        'http://localhost:8000/product/',
        'POST',
        { action: 'getsupplier' }
      )
      if (response.resultCode === 3034) {
        setSuppliers(response.data)
      } else {
        setError('Failed to fetch suppliers')
      }
    } catch (error) {
      console.error('Fetch suppliers error:', error)
      setError('An error occurred while fetching suppliers')
    }
  }

  const fetchTypes = async () => {
    try {
      const response = await sendRequest(
        'http://localhost:8000/product/',
        'POST',
        { action: 'getturul' }
      )
      if (response.resultCode === 3036) {
        setTypes(response.data)
      } else {
        setError('Failed to fetch types')
      }
    } catch (error) {
      console.error('Fetch types error:', error)
      setError('An error occurred while fetching types')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setProductData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onloadend = () => {
            const base64String = reader.result as string
            setProductData(prev => ({ ...prev, image: base64String }))
            setImagePreview(reader.result as string)
        }

        reader.readAsDataURL(file) // Convert the file to Base64
    }
}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await sendRequest(
        'http://localhost:8000/product/',
        'POST',
        { action: 'addproduct', ...productData }
      )

      if (response.resultCode === 3030) {
        router.push('/product') // Redirect to products list after successful addition
      } else {
        setError(response.resultMessage || 'Failed to add product')
      }
    } catch (error) {
      setError('An error occurred while adding the product')
      console.error('Add product error:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6"> Бараа нэмэх</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pname" className="block text-sm font-medium text-gray-700"> Барааны нэр</label>
          <input
            type="text"
            id="pname"
            name="pname"
            value={productData.pname}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="sid" className="block text-sm font-medium text-gray-700">Нийлүүлэгч</label>
          <select
            id="sid"
            name="sid"
            value={productData.sid}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">сонгох</option>
            {suppliers.map((supplier) => (
              <option key={supplier.sid} value={supplier.sid}>
                {supplier.sname}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tid" className="block text-sm font-medium text-gray-700">Барааны төрөл</label>
          <select
            id="tid"
            name="tid"
            value={productData.tid}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">
              сонгох
            </option>
            {types.map((type) => (
              <option key={type.tid} value={type.tid}>
                {type.tname}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="too" className="block text-sm font-medium text-gray-700">Тоо ширхэг</label>
          <input
            type="number"
            id="too"
            name="too"
            value={productData.too}
            onChange={handleChange}
            required
            min="0"
            step="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="une" className="block text-sm font-medium text-gray-700">Нэгжийн үнэ</label>
          <input
            type="number"
            id="une"
            name="une"
            value={productData.une}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Төлөв</label>
          <select
            id="status"
            name="status"
            value={productData.status.toString()}
            onChange={(e) => setProductData(prev => ({ ...prev, status: e.target.value === 'true' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Барааны зураг</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        {imagePreview && (
          <div>
            <p className="block text-sm font-medium text-gray-700">Image Preview</p>
            <img src={imagePreview} alt="Product preview" className="mt-2 max-w-xs h-auto" />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Бараа нэмэх
          </button>
        </div>
      </form>
    </div>
  )
}

