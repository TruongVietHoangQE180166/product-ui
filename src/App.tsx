import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';
import DeleteModal from './components/DeleteModal';
import type { Product, ProductFormData } from './types/product';
import { deleteProduct } from './services/api';
import { isAuthenticated } from './services/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
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

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleAuthChange = () => {
    setIsLoggedIn(isAuthenticated());
  };

  const handleAuthSuccess = () => {
    handleAuthChange();
    navigateTo('home');
  };

  const navigateTo = (page: string, product: Product | null = null) => {
    if (page === 'form' && !isAuthenticated()) {
      setCurrentPage('login');
      return;
    }

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
    if (!isAuthenticated()) {
      alert('You need to login to delete products');
      navigateTo('login');
      return;
    }
    
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
        if (err.message.includes('Authentication required')) {
          alert('Your session has expired. Please login again.');
          handleAuthChange(); 
          navigateTo('login');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        navigateTo={navigateTo}
        isLoggedIn={isLoggedIn} 
        onAuthChange={handleAuthChange}
      />
      
      {currentPage === 'home' && (
        <HomePage
          products={products}
          setProducts={setProducts}
          navigateTo={navigateTo}
          confirmDelete={confirmDelete}
          isLoggedIn={isLoggedIn}
        />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          navigateTo={navigateTo} 
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      
      {currentPage === 'register' && (
        <RegisterPage 
          navigateTo={navigateTo}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      
      {currentPage === 'detail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          navigateTo={navigateTo}
          confirmDelete={confirmDelete}
          isLoggedIn={isLoggedIn}
        />
      )}
      
      {currentPage === 'form' && isLoggedIn && (
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
          navigateTo={navigateTo}
          onSuccess={() => {
            navigateTo('home');
          }}
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