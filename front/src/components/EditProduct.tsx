'use client'

import { useState } from 'react'
import { sendRequest } from '../utils/api'
import { useRouter } from 'next/navigation'

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

interface EditProductProps {
    product: Product
    onUpdate: (updatedProduct: Product) => void
    onCancel: () => void
}

const EditProduct: React.FC<EditProductProps> = ({ product, onUpdate, onCancel }) => {
    const router = useRouter()
    const [editedProduct, setEditedProduct] = useState<Product>(product)
    const [base64Image, setBase64Image] = useState<string | null>(null)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditedProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const reader = new FileReader()

            reader.onloadend = () => {
                setBase64Image(reader.result as string)
            }

            reader.readAsDataURL(file) // Convert the file to Base64
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Update the product
            const surl = 'http://localhost:8000/product/'
            const smethod = 'POST'
            const sbody = {
                action: 'updateproduct',
                pname: editedProduct?.pname,
                too: editedProduct?.too,
                une: editedProduct?.une,
                image: base64Image,
                pid: editedProduct?.pid
            }

            const response = await sendRequest(surl, smethod, sbody)

            if (response.resultCode === 3029) {
                setNotification({ type: 'success', message: 'Product updated successfully!' })
                onUpdate({ ...editedProduct, image: base64Image || editedProduct.image })
                router.push('/product')
            } else {
                setNotification({ type: 'error', message: response.resultMessage || 'Failed to update product.' })
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'An unexpected error occurred. Please try again.' })
        }
    }

    return (
        <div>
            {notification && (
                <div
                    className={`${
                        notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    } p-4 mb-4 rounded`}
                >
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="pname" className="block text-sm font-medium text-gray-700">
                        Барааны нэр
                    </label>
                    <input
                        type="text"
                        id="pname"
                        name="pname"
                        value={editedProduct.pname}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="une" className="block text-sm font-medium text-gray-700">
                        Үнэ
                    </label>
                    <input
                        type="number"
                        id="une"
                        name="une"
                        value={editedProduct.une}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="too" className="block text-sm font-medium text-gray-700">
                        Тоо ширхэг
                    </label>
                    <input
                        type="number"
                        id="too"
                        name="too"
                        value={editedProduct.too}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Барааны зураг
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {base64Image && (
                        <img
                            src={base64Image}
                            alt="Selected"
                            className="mt-4 h-32 w-32 object-cover border"
                        />
                    )}
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="buttonspec">
                        Хадгалах
                    </button>
                    <button type="button" onClick={onCancel} className="buttonspec">
                        Буцах
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProduct
