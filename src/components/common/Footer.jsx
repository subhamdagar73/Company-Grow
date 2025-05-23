import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 py-10 border-t mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-xl font-semibold">CompanyGrow</h1>
          <p className="mt-4 font-medium text-gray-800">Stay up-to-date</p>
          <div className="mt-4 flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 border rounded-l w-64 focus:outline-none"
            />
            <button className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-r">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Company</h3>
            <ul className="space-y-1">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Product</h3>
            <ul className="space-y-1">
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Resources</h3>
            <ul className="space-y-1">
              <li><a href="#">Blog</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Legal</h3>
            <ul className="space-y-1">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookies Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex justify-between items-center text-xs text-gray-500">
          <button className="border rounded px-3 py-1">English</button>
          <p>© 2023 CompanyGrow. · Privacy Policy · Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
