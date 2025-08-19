import type { JSX } from "react";
import { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { MdCategory, MdOutlineHome, MdOutlineLogout } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApiGet } from "../../../api/ApiGet";
import { useCart } from "../../cart/CartCXontext";
import { useAuth } from "../../../AuthContextProvider";

interface IAdminSidebarData {
  title: string;
  path: string;
  icon: JSX.Element;
  id: number;
}

const adminSidebarData: IAdminSidebarData[] = [
  { title: "Home", path: "/", icon: <MdOutlineHome />, id: 1 },
  { title: "Products", path: "/products", icon: <AiOutlineProduct />, id: 3 },
];

const Navbar = () => {
  const navigate = useNavigate();
  const{isAuthenticated,initData}=useAuth()
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { cartItems } = useCart();
const cartCount = cartItems.length;

  const { data: categories = [] } = useApiGet({
    queryKey: "category",
    endpoint: `/api/categories/category`,
  });

  const handleCategoryClick = (category: string) => {
    navigate("/products", { state: { scrollToCategory: category } });
    setDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between bg-indigo-600 text-white px-6 py-3 shadow-md relative z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="logo.png"
          alt="Logo"
          className="bg-white h-10 w-10 object-cover rounded-4xl "
        />
        <span className="text-xl font-semibold">Nepali Luga</span>
      </Link>

      {/* Nav Links */}
      <nav className="flex items-center gap-6 relative">
        {adminSidebarData.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-1 px-3 py-2 rounded hover:bg-white hover:text-indigo-600 ${
                isActive
                  ? "bg-white text-indigo-600 font-semibold underline"
                  : ""
              }`
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}

        {/* Categories Dropdown */}
        <div
          className="relative"
         
        >
         <div  onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)} >
           <button className="flex items-center gap-1 px-3 py-2 rounded hover:bg-white hover:text-indigo-600">
            <MdCategory />
            <span>Categories</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
         </div>
        </div>
      </nav>

      {/* Right-side Icons: Cart + Login */}
     <div className="flex items-center gap-6">
      <div
        onClick={() => navigate("/cart")}
        className="relative cursor-pointer"
      >
        <FaShoppingCart className="text-2xl" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {cartCount}
          </span>
        )}
      </div>

      {isAuthenticated ? (
  <div className="flex items-center gap-3 relative">
    {/* 👤 User Icon + Name + Dropdown */}
    <div className="relative">
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setUserDropdownOpen((prev) => !prev)}
      >
        <FaUserCircle className="text-2xl" />
        <span className="text-xs font-medium">{initData?.username || "User"}</span>
      </div>

      {userDropdownOpen && (
        <div className="absolute top-full mt-2 right-0 w-40 bg-white text-gray-800 rounded-md shadow-lg z-50">
          {/* <button
            onClick={() => {
              navigate("/account");
              setUserDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
          >
            My Account
          </button> */}
          <button
            onClick={() => {
              navigate("/orders");
              setUserDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-indigo-100"
          >
            Orders
          </button>
          {/* Add more items as needed */}
        </div>
      )}
    </div>

    {/* 🚪 Logout Button */}
    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
      className="bg-white text-indigo-600 px-3 py-1 rounded"
    >
      Logout
    </button>
  </div>
) : (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          <MdOutlineLogout />
          <span>Login / Sign Up</span>
        </div>
      )}
    </div>
    </header>
  );
};

export default Navbar;
