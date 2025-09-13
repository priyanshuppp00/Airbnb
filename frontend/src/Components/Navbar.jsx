import { useContext, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Menu, X, Search, Globe } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { isDarkMode } = useContext(AppContext);
  const { user, logout } = useContext(UserContext);
  const [nav, setNav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Navigation links based on auth
  const links = user
    ? [
        { id: 1, label: "Home", path: "/" },
        { id: 2, label: "Booking", path: "/booking" },
        { id: 3, label: "Favourite", path: "/favourite" },
        { id: 4, label: "Host Homes", path: "/host-homes" },
        { id: 5, label: "Add Home", path: "/add-home" },
        { id: 6, label: "Contact", path: "/contact" },
      ]
    : [
        { id: 1, label: "Home", path: "/" },
        { id: 2, label: "Contact", path: "/contact" },
      ];

  const dropdownLinks = user
    ? [
        { id: 1, label: "Profile", path: "/profile" },
        { id: 2, label: "Help", path: "/help" },
      ]
    : [
        { id: 1, label: "Sign up", path: "/signup" },
        { id: 2, label: "Login", path: "/login" },
        { id: 3, label: "Help", path: "/help" },
      ];

  const toggleNav = useCallback(() => setNav((prev) => !prev), []);
  const toggleMobileMenu = useCallback(
    () => setMobileMenuOpen((prev) => !prev),
    []
  );

  const handleLogout = async () => {
    await logout(); // clear user state
    setMobileMenuOpen(false); // close dropdown
    navigate("/"); // redirect to home page
  };

  return (
    <nav
      className={`fixed z-50 w-full shadow-md transition-colors ${
        isDarkMode ? "bg-red-100 text-gray-900" : "bg-red-500 text-slate-100"
      }`}
      aria-label="Primary Navigation"
    >
      <div className="flex items-center justify-between h-20 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold transition-transform hover:scale-105"
          aria-label="Airbnb Home"
        >
          Airbnb
        </Link>

        {/* Search Bar */}
        <div
          className={`items-center hidden px-4 py-2 rounded-full shadow-sm md:flex ${
            isDarkMode
              ? "bg-red-100 text-gray-900"
              : "bg-red-500 text-slate-100"
          }`}
        >
          <input
            type="text"
            placeholder="Search destinations"
            className="w-48 bg-transparent outline-none md:w-64"
            aria-label="Search destinations"
          />
          <Search className="w-4 h-4 ml-2" />
        </div>

        {/* Desktop Links */}
        <ul className="items-center hidden gap-6 md:flex" role="menubar">
          {links.map(({ id, label, path }) => (
            <li key={id} role="none">
              <Link
                to={path}
                className={`capitalize text-xl transition-all duration-200 ease-in-out transform hover:scale-[1.03] hover:text-[21px] ${
                  pathname === path ? "font-bold " : ""
                }`}
                role="menuitem"
                aria-current={pathname === path ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Controls */}
        <div className="items-center hidden gap-4 md:flex">
          <button
            className={`p-2 rounded-full transition ${
              isDarkMode
                ? "bg-red-100 hover:bg-red-200"
                : "bg-red-500 hover:bg-red-700"
            }`}
            title="Language"
            aria-label="Select Language"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={toggleMobileMenu}
              className="flex items-center gap-2 px-3 py-2 transition border rounded-full cursor-pointer hover:shadow bg-white/10"
              aria-haspopup="true"
              aria-expanded={mobileMenuOpen}
              aria-controls="user-dropdown"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
              <img
                src={
                  user && user.profilePic
                    ? `/${user.profilePic.replace(/\\/g, "/")}`
                    : user
                    ? `https://ui-avatars.com/api/?name=${
                        user.firstName || "User"
                      }+${user.lastName || ""}&background=E5E7EB&color=111827`
                    : `https://api.dicebear.com/7.x/bottts/svg?seed=random123=${Math.floor(
                        Math.random() * 10000
                      )}`
                }
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            </button>

            {mobileMenuOpen && (
              <ul
                id="user-dropdown"
                className={`absolute right-0 z-50 w-48 mt-2 overflow-hidden border border-red-200 rounded-lg shadow-lg ${
                  isDarkMode
                    ? "bg-red-100 text-gray-900"
                    : "bg-red-500 text-slate-100"
                }`}
                role="menu"
              >
                {dropdownLinks.map(({ id, label, path }) => (
                  <li key={id} role="none">
                    <Link
                      to={path}
                      className={`block px-4 py-2 capitalize text-xl transition-all duration-200 ease-in-out transform hover:scale-[1.03] hover:text-[21px] ${
                        pathname === path ? "font-bold text-white" : ""
                      }`}
                      role="menuitem"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                {user && (
                  <li role="none">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 capitalize text-xl transition-all duration-200 ease-in-out transform hover:scale-[1.03] hover:text-[21px] cursor-pointer"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Mobile Icon */}
        <div
          className="md:hidden cursor-pointer"
          onClick={toggleNav}
          role="button"
          tabIndex={0}
          aria-label="Toggle mobile navigation"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleNav();
          }}
        >
          {nav ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {nav && (
        <div className="px-6 pt-6 pb-4 space-y-4 bg-red-600 md:hidden ">
          <ul className="flex flex-col gap-4" role="menubar">
            {links.map(({ id, label, path }) => (
              <li key={id} role="none">
                <Link
                  to={path}
                  onClick={() => setNav(false)}
                  className={`capitalize text-lg text-white ${
                    pathname === path ? "font-bold" : ""
                  }`}
                  role="menuitem"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center px-4 py-2 mt-4 bg-red-500 rounded-full">
            <input
              type="text"
              placeholder="Search destinations"
              className="w-full text-white placeholder-white bg-transparent outline-none"
              aria-label="Search destinations"
            />
            <Search className="w-5 h-5 ml-2 text-white" />
          </div>

          {/* Extra Mobile Dropdown Links */}
          <div className="pt-4 border-t border-white/30">
            {dropdownLinks.map(({ id, label, path }) => (
              <Link
                key={id}
                to={path}
                onClick={() => setNav(false)}
                className="block py-2 text-white hover:underline"
              >
                {label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left block py-2 text-white hover:underline"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
