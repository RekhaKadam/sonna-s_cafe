import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface IceCreamUpsellProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addIceCream: boolean, iceCreamType?: string) => void;
  itemName: string;
}

const IceCreamUpsell: React.FC<IceCreamUpsellProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName 
}) => {
  const [selectedIceCream, setSelectedIceCream] = useState<string>('');

  const iceCreamOptions = [
    {
      id: 'vanilla',
      name: 'Vanilla Ice Cream',
      price: 50,
      image: '/ice-cream-vanilla.jpg', // You'll need to add this image
      description: 'Creamy vanilla ice cream'
    },
    {
      id: 'chocolate',
      name: 'Chocolate Ice Cream',
      price: 60,
      image: '/ice-cream-chocolate.jpg', // You'll need to add this image
      description: 'Rich chocolate ice cream'
    },
    {
      id: 'strawberry',
      name: 'Strawberry Ice Cream',
      price: 55,
      image: '/ice-cream-strawberry.jpg', // You'll need to add this image
      description: 'Fresh strawberry ice cream'
    }
  ];

  const handleConfirm = (addIceCream: boolean) => {
    onConfirm(addIceCream, selectedIceCream);
    setSelectedIceCream('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              🍦 Add Ice Cream?
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-center">
              Make your <span className="font-semibold text-amber-600">{itemName}</span> even better with delicious ice cream!
            </p>

            {/* Ice Cream Options */}
            <div className="space-y-3">
              {iceCreamOptions.map((iceCream) => (
                <div
                  key={iceCream.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedIceCream === iceCream.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-300 hover:border-amber-300'
                  }`}
                  onClick={() => setSelectedIceCream(iceCream.id)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="iceCream"
                      value={iceCream.id}
                      checked={selectedIceCream === iceCream.id}
                      onChange={() => setSelectedIceCream(iceCream.id)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    
                    {/* Ice Cream Image Placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🍦</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{iceCream.name}</div>
                      <div className="text-sm text-gray-600">{iceCream.description}</div>
                      <div className="font-bold text-amber-600">+₹{iceCream.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => handleConfirm(true)}
                disabled={!selectedIceCream}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  selectedIceCream
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="inline h-5 w-5 mr-2" />
                Add Selected Ice Cream
              </button>
              
              <button
                onClick={() => handleConfirm(false)}
                className="w-full py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No Thanks, Just Add {itemName}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IceCreamUpsell;
