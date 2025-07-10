const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-4 text-sm text-white bg-black border-t border-gray-300">
      © {currentYear}. Startup.  All rights reserved.
    </footer>
  );
};

export default Footer;
