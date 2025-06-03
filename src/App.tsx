import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';
import DeleteModal from './components/DeleteModal';
import type { Product, ProductFormData } from './types/product';
import { deleteProduct } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    isActive: true,
    image: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const navigateTo = (page: string, product: Product | null = null) => {
    setCurrentPage(page);
    setSelectedProduct(product);
    if (page === 'form') {
      if (product) {
        setFormData({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          stock: product.stock,
          isActive: product.isActive,
          image: product.image || '',
        });
        setIsEditing(true);
      } else {
        setFormData({
          id: '',
          name: '',
          price: '',
          description: '',
          category: '',
          stock: '',
          isActive: true,
          image: '',
        });
        setIsEditing(false);
      }
    }
  };

  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        setShowDeleteModal(false);
        setProductToDelete(null);
        if (currentPage === 'detail') {
          navigateTo('home');
        }
      } catch (err: any) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} navigateTo={navigateTo} />
      {currentPage === 'home' && (
        <HomePage
          products={products}
          setProducts={setProducts}
          navigateTo={navigateTo}
          confirmDelete={confirmDelete}
        />
      )}
      {currentPage === 'detail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          navigateTo={navigateTo}
          confirmDelete={confirmDelete}
        />
      )}
      {currentPage === 'form' && (
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
          navigateTo={navigateTo}
        />
      )}
      <DeleteModal
        show={showDeleteModal}
        product={productToDelete}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}