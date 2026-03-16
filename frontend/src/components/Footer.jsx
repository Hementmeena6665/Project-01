import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        
        {/* Company */}
        <div>
          <h2 className="text-xl font-bold mb-4">ShopEase</h2>
          <p className="text-gray-400">
            Best eCommerce platform to buy quality products at affordable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Products</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="font-semibold mb-4">Customer</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">My Account</li>
            <li className="hover:text-white cursor-pointer">Orders</li>
            <li className="hover:text-white cursor-pointer">Wishlist</li>
            <li className="hover:text-white cursor-pointer">Help</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>

          <div className="flex space-x-4 text-xl">
            <FaFacebook className="cursor-pointer hover:text-blue-500" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaInstagram className="cursor-pointer hover:text-pink-500" />
            <FaLinkedin className="cursor-pointer hover:text-blue-600" />
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-gray-400">
        © 2026 ShopEase. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;