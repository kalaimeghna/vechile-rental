import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Vehicle Rental Platform. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
