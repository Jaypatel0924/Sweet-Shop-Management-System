import { X } from 'lucide-react';

interface AdminGuideProps {
  onClose: () => void;
}

export default function AdminGuide({ onClose }: AdminGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-candy-yellow to-candy-orange px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">👑 Admin Portal Guide</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-candy-pink/20 to-candy-purple/20 p-4 rounded-lg">
            <p className="text-gray-800">
              Welcome to the Admin Portal! 🎉 Here's how to manage your sweet shop inventory.
            </p>
          </div>

          {/* Login Credentials */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">🔐 Default Admin Credentials</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Email:</span>
                <code className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">admin@sweetshop.com</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Password:</span>
                <code className="bg-gray-200 px-3 py-1 rounded font-mono text-sm">admin123456</code>
              </div>
              <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                💡 Change your password after first login for security
              </p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">✨ Key Features</h3>
            <div className="space-y-3">
              {[
                { icon: '📊', title: 'Dashboard Stats', desc: 'View total products, inventory value & low stock alerts' },
                { icon: '➕', title: 'Add Products', desc: 'Create new sweets with name, price, stock & images' },
                { icon: '📝', title: 'Edit Products', desc: 'Update product details and inventory quantities' },
                { icon: '🗑️', title: 'Delete Products', desc: 'Remove products with confirmation safety' },
                { icon: '🎨', title: 'Custom Emojis', desc: 'Add fun emojis to represent your sweets' },
                { icon: '📦', title: 'Inventory View', desc: 'See all products in a beautiful card grid' }
              ].map((feature, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{feature.title}</p>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Use */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">📖 How to Use Admin Panel</h3>
            <div className="space-y-2">
              {[
                '1. Login with admin credentials (Email & Password above)',
                '2. Select ⚙️ Admin tab on login page',
                '3. Click 🔓 Admin Login button',
                '4. You\'ll see Admin Inventory dashboard',
                '5. Click ➕ Add Product button to add sweets',
                '6. Fill in product details (name, price, stock, image)',
                '7. View real-time stats at top of dashboard',
                '8. Manage products with Edit/Delete buttons'
              ].map((step, i) => (
                <p key={i} className="text-gray-700 p-2 bg-gray-50 rounded flex items-center gap-3">
                  <span className="text-lg font-bold text-candy-purple">{i + 1}</span>
                  {step.split(step.match(/\d+\./)?.[0] || '')[1] || step}
                </p>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">🍬 Product Information to Provide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: '📛 Name', ex: 'Gulab Jamun' },
                { label: '💰 Price', ex: '299.99' },
                { label: '📦 Stock', ex: '50 units' },
                { label: '🏷️ Category', ex: 'sweets' },
                { label: '🖼️ Image URL', ex: 'https://example.com/...' },
                { label: '😋 Emoji', ex: '🍶' }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-900">{item.label}</p>
                  <p className="text-sm text-blue-700">{item.ex}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="font-semibold text-green-900 mb-2">💡 Pro Tips</p>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Use high-quality product images</li>
              <li>✓ Write detailed descriptions for customers</li>
              <li>✓ Keep stock quantity updated</li>
              <li>✓ Use relevant emojis for visual appeal</li>
              <li>✓ Monitor low stock alerts regularly</li>
            </ul>
          </div>

          {/* Security Notice */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">🔒 Security Reminder</p>
            <p className="text-sm text-orange-800">
              Keep your admin credentials secure. Don't share your login information with anyone. The admin account has full access to inventory management.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            Got it! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
