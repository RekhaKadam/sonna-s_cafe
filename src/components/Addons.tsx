import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { useCart, Addon } from '../contexts/CartContext';

interface AddonsProps {
  showSelector?: boolean;
}

const Addons: React.FC<AddonsProps> = ({ showSelector = true }) => {
  const { items, addAddon, removeAddon } = useCart();
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  
  // Get selected addons from all cart items
  useEffect(() => {
    const addonIds = new Set<string>();
    items.forEach(item => {
      if (item.addons) {
        item.addons.forEach(addon => {
          addonIds.add(addon.id);
        });
      }
    });
    setSelectedAddons(addonIds);
  }, [items]);
  
  // If there are no items in the cart, don't render
  if (items.length === 0) return null;
  
  const availableAddons: Addon[] = [
    {
      id: 'vanilla-ice-cream',
      name: 'Vanilla Ice Cream',
      price: 50
    },
    {
      id: 'chocolate-ice-cream',
      name: 'Chocolate Ice Cream',
      price: 60
    },
    {
      id: 'whipped-cream',
      name: 'Whipped Cream',
      price: 30
    },
    {
      id: 'caramel-sauce',
      name: 'Caramel Sauce',
      price: 25
    },
    {
      id: 'chocolate-sauce',
      name: 'Chocolate Sauce',
      price: 25
    }
  ];
  
  const isAddonSelected = (addonId: string) => {
    return selectedAddons.has(addonId);
  };
  
  const handleToggleAddon = (addon: Addon) => {
    if (isAddonSelected(addon.id)) {
      // Remove from all items
      items.forEach(item => {
        if (item.addons && item.addons.some(a => a.id === addon.id)) {
          removeAddon(item.id, addon.id);
        }
      });
    } else {
      // Add to all items
      items.forEach(item => {
        addAddon(item.id, addon);
      });
    }
  };
  
  // Get all addons from all items
  const allAddons: Addon[] = [];
  items.forEach(item => {
    if (item.addons) {
      item.addons.forEach(addon => {
        if (!allAddons.some(a => a.id === addon.id)) {
          allAddons.push(addon);
        }
      });
    }
  });
  
  if (!showSelector && allAddons.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-2">
      {showSelector ? (
        <>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add extras:</h4>
          <div className="flex flex-wrap gap-2">
            {availableAddons.map(addon => (
              <button
                key={addon.id}
                onClick={() => handleToggleAddon(addon)}
                className={`text-xs py-1 px-2 rounded-full flex items-center gap-1 transition-colors ${
                  isAddonSelected(addon.id)
                    ? 'bg-[#B87333] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isAddonSelected(addon.id) ? (
                  <>
                    <Check className="h-3 w-3" />
                    {addon.name}
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" />
                    {addon.name}
                  </>
                )}
                <span className="font-semibold">₹{addon.price}</span>
              </button>
            ))}
          </div>
        </>
      ) : allAddons.length > 0 ? (
        <div className="text-xs text-gray-600">
          <span className="font-medium">Addons:</span>{' '}
          {allAddons.map((addon, idx) => (
            <span key={addon.id}>
              {addon.name}
              {idx < allAddons.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Addons;
