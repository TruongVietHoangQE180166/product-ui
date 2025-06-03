import { useState, useRef } from "react";
import { ArrowLeft, Upload, X, Check } from "lucide-react";
import type { ProductFormData } from "../types/product";
import { createProduct, updateProduct } from "../services/api";
import { AlertCircle, XCircle, Loader2 } from "lucide-react";

const API_URL = "https://product-manage-1gs3.onrender.com";

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  isEditing: boolean;
  navigateTo: (page: string) => void;
}

export default function ProductForm({
  formData,
  setFormData,
  isEditing,
  navigateTo,
}: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateNumericInput = (value: string, fieldName: string): boolean => {
    // Allow empty string for optional fields
    if (value === "") return true;

    // Check if the value contains only numbers (and decimal point for price)
    const isValidNumber =
      fieldName === "price" ? /^\d*\.?\d*$/.test(value) : /^\d*$/.test(value);

    if (!isValidNumber) {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: "Please enter numbers only",
      }));
      return false;
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    // Validate numeric fields
    if (["id", "price", "stock"].includes(name)) {
      if (!validateNumericInput(value, name)) {
        return; // Don't update state if validation fails
      }
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const imageInputRef = useRef<HTMLInputElement>(null); // Tạo ref cho input file

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must not exceed 5MB");
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: isEditing ? "" : undefined });
    if (imageInputRef.current) {
      imageInputRef.current.value = ""; // Reset input file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Check for validation errors
    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix the validation errors before submitting");
      setIsLoading(false);
      return;
    }

    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.category
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("id", String(formData.id));
      data.append("name", formData.name);
      data.append("price", String(formData.price));
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("stock", String(formData.stock || 0));
      data.append("isActive", String(formData.isActive));

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      } else if (
        isEditing &&
        typeof formData.image === "string" &&
        formData.image
      ) {
        data.append("image", formData.image); // Send old image URL
      }

      if (isEditing) {
        await updateProduct(Number(formData.id), data);
      } else {
        await createProduct(data);
      }
      navigateTo("home");
    } catch (err: any) {
      console.error(
        "Error creating/updating product:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.error?.message || err.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getImageSrc = () => {
    if (formData.image instanceof File) {
      return URL.createObjectURL(formData.image);
    }
    if (typeof formData.image === "string" && formData.image) {
      return `${API_URL}${formData.image}`; // Concatenate with API_URL
    }
    return null;
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigateTo("home")}
          className="group flex items-center space-x-2 text-white hover:text-indigo-500 mb-8 transition-all duration-300"
          aria-label="Back to product list"
        >
          <ArrowLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium text-lg">Back to Products</span>
        </button>

        {/* Form Container */}
        <div className="group bg-gray-900 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border border-slate-700 group-hover:border-indigo-500 transition-all duration-300">
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">
            {isEditing ? "Edit Product" : "New Product"}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border-2 border-red-500 p-4 rounded-xl mb-6 flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <p className="text-red-500 font-semibold text-lg">{error}</p>
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product ID */}
              <div className="space-y-2">
                <label
                  className="block text-base font-medium text-gray-300"
                  htmlFor="id"
                >
                  Product ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={isEditing}
                  className={`w-full px-5 py-3.5 bg-slate-800 rounded-xl border-2 ${
                    fieldErrors.id ? "border-red-500" : "border-slate-700"
                  } focus:ring-0 focus:border-indigo-500 focus:shadow-sm transition-all text-white`}
                />
                {fieldErrors.id && (
                  <p className="text-red-500 text-sm font-medium mt-1 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{fieldErrors.id}</span>
                  </p>
                )}
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <label
                  className="block text-base font-medium text-gray-300"
                  htmlFor="name"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-slate-800 rounded-xl border-2 border-slate-700 focus:border-indigo-500 focus:shadow-sm transition-all text-white"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label
                  className="block text-base font-medium text-gray-300"
                  htmlFor="price"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-5 py-3.5 bg-slate-800 rounded-xl border-2 ${
                      fieldErrors.price ? "border-red-500" : "border-slate-700"
                    } focus:border-indigo-500 focus:shadow-sm transition-all text-white`}
                    placeholder="0.00"
                  />
                </div>
                {fieldErrors.price && (
                  <p className="text-red-500 text-sm font-medium mt-1 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{fieldErrors.price}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  className="block text-base font-medium text-gray-300"
                  htmlFor="category"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-slate-800 rounded-xl border-2 border-slate-700 focus:border-indigo-500 focus:shadow-sm transition-all text-white"
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label
                  className="block text-base font-medium text-gray-300"
                  htmlFor="stock"
                >
                  Stock Quantity
                </label>
                <input
                  type="text"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={`w-full px-5 py-3.5 bg-slate-800 rounded-xl border-2 ${
                    fieldErrors.stock ? "border-red-500" : "border-slate-700"
                  } focus:border-indigo-500 focus:shadow-sm transition-all text-white`}
                  placeholder="0"
                />
                {fieldErrors.stock && (
                  <p className="text-red-500 text-sm font-medium mt-1 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{fieldErrors.stock}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                className="block text-base font-medium text-gray-300"
                htmlFor="description"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-5 py-3.5 bg-slate-800 rounded-xl border-2 border-slate-700 focus:border-indigo-500 focus:shadow-sm transition-all text-white resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-base font-medium text-gray-300 mb-2">
                Product Image
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-700 rounded-xl cursor-pointer bg-slate-800 hover:bg-slate-700/50 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-300 font-medium">
                        <span className="text-indigo-500">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, or GIF (Max 5MB)
                      </p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg,image/gif"
                      onChange={handleImageUpload}
                      ref={imageInputRef}
                    />
                  </label>
                </div>
                {getImageSrc() ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        getImageSrc() ||
                        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                      }
                      alt="Product preview"
                      className="w-40 h-40 object-cover rounded-xl shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                      aria-label="Remove image"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-indigo-500 border-2 border-slate-700 rounded-lg focus:ring-indigo-500 focus:ring-2 transition-all"
                />
              </div>
              <label
                htmlFor="isActive"
                className="text-base font-medium text-gray-300"
              >
                Product is active
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 pt-8 border-t border-slate-700">
              <button
                onClick={handleSubmit}
                disabled={isLoading || Object.keys(fieldErrors).length > 0}
                className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 ${
                  isLoading || Object.keys(fieldErrors).length > 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-[1.02]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-lg">Processing...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} className="flex-shrink-0" />
                    <span className="text-lg">
                      {isEditing ? "Update Product" : "Create Product"}
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={() => navigateTo("home")}
                className="px-8 py-4 border-2 border-slate-700 text-gray-300 rounded-xl hover:bg-slate-700/50 hover:border-indigo-500 transition-all duration-300 hover:scale-[1.02]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
