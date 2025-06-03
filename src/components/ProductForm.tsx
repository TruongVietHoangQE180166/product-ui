import { useState } from 'react';
import { ArrowLeft, Upload, X, Check } from 'lucide-react';
import type { ProductFormData } from '../types/product';
import { createProduct, updateProduct } from '../services/api';

const API_URL = 'https://product-manage-1gs3.onrender.com';

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  isEditing: boolean;
  navigateTo: (page: string) => void;
}

export default function ProductForm({ formData, setFormData, isEditing, navigateTo }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Hình ảnh không được vượt quá 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: isEditing ? '' : undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('id', String(formData.id));
      data.append('name', formData.name);
      data.append('price', String(formData.price));
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('stock', String(formData.stock || 0));
      data.append('isActive', String(formData.isActive));

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      } else if (isEditing && typeof formData.image === 'string' && formData.image) {
        data.append('image', formData.image); // Gửi URL ảnh cũ
      }

      if (isEditing) {
        await updateProduct(Number(formData.id), data);
      } else {
        await createProduct(data);
      }
      navigateTo('home');
    } catch (err: any) {
      console.error('Error creating/updating product:', err.response?.data || err.message);
      setError(err.response?.data?.error?.message || err.message || 'Đã xảy ra lỗi');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageSrc = () => {
    if (formData.image instanceof File) {
      return URL.createObjectURL(formData.image);
    }
    if (typeof formData.image === 'string' && formData.image) {
      return `${API_URL}${formData.image}`; // Ghép với API_URL
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('home')}
        className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition-all duration-200 ease-in-out"
        aria-label="Quay lại danh sách sản phẩm"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Quay lại sản phẩm</span>
      </button>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
          {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="id">
                Mã sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                disabled={isEditing}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="price">
                Giá <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="stock">
                Tồn kho
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-600 font-medium">
                      <span className="text-blue-600">Nhấn để tải lên</span> hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, hoặc GIF (Tối đa 5MB)</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/gif"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {getImageSrc() ? (
                <div className="relative inline-block">
                  <img
                    src={getImageSrc() || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                    alt="Xem trước sản phẩm"
                    className="w-40 h-40 object-cover rounded-xl shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                    aria-label="Xóa hình ảnh"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                  Không có ảnh
                </div>
              )}
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
              Sản phẩm đang hoạt động
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <Check size={20} />
              )}
              <span>{isEditing ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}</span>
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}