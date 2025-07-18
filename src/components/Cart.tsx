import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2, User, Phone, MapPin, CreditCard, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutForm {
  name: string;
  phone: string;
  deliveryMethod: 'dine-in' | 'pickup' | 'delivery';
  paymentMethod: 'razorpay' | 'cod';
  address?: string;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    phone: '',
    deliveryMethod: 'dine-in',
    paymentMethod: 'razorpay',
    address: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutForm>>({});

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CheckoutForm> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.deliveryMethod === 'delivery' && !formData.address?.trim()) {
      errors.address = 'Address is required for delivery';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }
    
    setShowOrderSuccess(true);
    setTimeout(() => {
      setShowOrderSuccess(false);
      clearCart();
      setShowCheckout(false);
      setFormData({
        name: '',
        phone: '',
        deliveryMethod: 'dine-in',
        paymentMethod: 'razorpay',
        address: ''
      });
      onClose();
    }, 3000);
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getDeliveryFee = () => {
    return formData.deliveryMethod === 'delivery' ? 50 : 0;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getDeliveryFee();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Slide-out Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <h2 className="text-xl font-bold font-display">
              {showCheckout ? 'Checkout' : 'Your Cart'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Success Message */}
        {showOrderSuccess && (
          <div className="bg-green-500 text-white p-4 text-center font-semibold">
            🎉 Order placed successfully! We'll contact you soon on WhatsApp!
          </div>
        )}

        {/* Cart Content or Checkout Form */}
        <div className="flex-1 overflow-y-auto h-full pb-32">
          {showCheckout ? (
            /* Checkout Form */
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 font-display">Order Summary</h3>
              
              {/* Order Items Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name} x {item.quantity}</span>
                    <span className="text-sm font-bold text-amber-600">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span className="font-bold">₹{getTotalPrice()}</span>
                  </div>
                  {getDeliveryFee() > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Delivery Fee:</span>
                      <span className="font-bold">₹{getDeliveryFee()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-amber-600">₹{getFinalTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <User className="h-5 w-5 mr-2 text-amber-600" />
                  Customer Details
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your WhatsApp number"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Delivery Method */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                  Delivery Method
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'dine-in', label: 'Dine-In', desc: 'Eat at restaurant' },
                    { value: 'pickup', label: 'Pickup', desc: 'Collect yourself' },
                    { value: 'delivery', label: 'Delivery', desc: '₹50 delivery fee' }
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => handleInputChange('deliveryMethod', method.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all text-center ${
                        formData.deliveryMethod === method.value
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-semibold">{method.label}</div>
                      <div className="text-xs opacity-75 mt-1">{method.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address for Delivery */}
              {formData.deliveryMethod === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                  )}
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                  Payment Method
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'razorpay', label: 'Razorpay', desc: 'UPI, Card, NetBanking', icon: '💳' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' }
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => handleInputChange('paymentMethod', method.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                        formData.paymentMethod === method.value
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{method.icon}</span>
                        <div>
                          <div className="font-semibold">{method.label}</div>
                          <div className="text-xs opacity-75">{method.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Cart Items */
            <div className="p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ShoppingCart className="h-16 w-16 mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p>Add some delicious items to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      {/* Item Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 font-display truncate">{item.name}</h3>
                        <p className="text-amber-600 font-bold">₹{item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-800 font-display">Total:</span>
              <span className="text-2xl font-bold text-amber-600">₹{showCheckout ? getFinalTotal() : getTotalPrice()}</span>
            </div>
            
            {showCheckout ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  {formData.paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Confirm Order'}
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleProceedToCheckout}
                  className="flex-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
