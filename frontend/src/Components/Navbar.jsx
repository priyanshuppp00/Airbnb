import { useContext, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Menu, X, Globe } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { isDarkMode } = useContext(AppContext);
  const { user, logout } = useContext(UserContext);
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const links = user
    ? [
        { label: "Home", path: "/" },
        { label: "Booking", path: "/booking" },
        { label: "Favourite", path: "/favourite" },
        { label: "Host Homes", path: "/host-homes" },
        { label: "Add Home", path: "/add-home" },
        { label: "Contact", path: "/contact" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Contact", path: "/contact" },
      ];

  const dropdownLinks = user
    ? [
        { label: "Profile", path: "/profile" },
        { label: "Help", path: "/help" },
      ]
    : [
        { label: "Sign up", path: "/signup" },
        { label: "Login", path: "/login" },
        { label: "Help", path: "/help" },
      ];

  const toggleNav = useCallback(() => setNavOpen((prev) => !prev), []);
  const toggleDropdown = useCallback(
    () => setDropdownOpen((prev) => !prev),
    []
  );

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const avatarSrc = user?.profilePic
    ? user.profilePic
    : user
    ? `https://ui-avatars.com/api/?name=${user.firstName || "User"}+${
        user.lastName || ""
      }&background=E5E7EB&color=111827`
    : `https://api.dicebear.com/7.x/bottts/svg?seed=random${Math.floor(
        Math.random() * 10000
      )}`;

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

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6" role="menubar">
          {links.map((link) => (
            <li key={link.path} role="none">
              <Link
                to={link.path}
                className={`capitalize text-xl transition-transform duration-200 ease-in-out hover:scale-[1.03] ${
                  pathname === link.path ? "font-bold" : ""
                }`}
                role="menuitem"
                aria-current={pathname === link.path ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-4">
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

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer hover:shadow bg-white/10"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-controls="user-dropdown"
            >
              {dropdownOpen ? <X /> : <Menu />}
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <ul
                id="user-dropdown"
                className={`absolute right-0 z-50 w-48 mt-2 overflow-hidden border rounded-lg shadow-lg ${
                  isDarkMode
                    ? "bg-red-100 text-gray-900"
                    : "bg-red-500 text-slate-100"
                }`}
                role="menu"
              >
                {dropdownLinks.map((link) => (
                  <li key={link.path} role="none">
                    <Link
                      to={link.path}
                      className="block px-4 py-2 capitalize text-lg hover:bg-opacity-20"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {user && (
                  <li role="none">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-lg hover:bg-opacity-20"
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

        {/* Mobile Toggle */}
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
          {navOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {navOpen && (
        <div className="px-6 pt-6 pb-4 space-y-4 bg-red-600 md:hidden">
          <ul className="flex flex-col gap-4" role="menubar">
            {links.map((link) => (
              <li key={link.path} role="none">
                <Link
                  to={link.path}
                  onClick={() => setNavOpen(false)}
                  className={`capitalize text-lg text-white ${
                    pathname === link.path ? "font-bold" : ""
                  }`}
                  role="menuitem"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-white/30 flex flex-col gap-2">
            {dropdownLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setNavOpen(false)}
                className="block py-2 text-white hover:underline"
              >
                {link.label}
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
