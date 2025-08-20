import type { JSX } from "react";
import { AiOutlineProduct } from "react-icons/ai";

import {
  MdInventory2,

  MdOutlineLogout,
 
} from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../AuthContextProvider";
interface IAdminSidebarData {
  title: string;
  path: string;
  icon: JSX.Element;
  id: number;
}

const adminSidebarData: IAdminSidebarData[] = [

  { title: "AddProducts", path: "/admin/add-product", icon: <AiOutlineProduct />, id: 5 },
  { title: "Inventory", path: "/admin/products", icon: <MdInventory2 />, id: 6 },
  { title: "Orders", path: "/admin/orders", icon: <TbReportAnalytics />, id: 9 },
  
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // ✅ reset context state and remove token
    navigate("/"); // or "/" as you prefer
  };
  return (
    <>
      <aside className="flex flex-col justify-between w-64 min-h-screen   bg-indigo-600  ">
        {/* Logo and Title */}
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="logo.png"
              alt="Logo"
              className="h-10 w-10 object-cover rounded"
            />
            <span className="text-xl font-semibold text-gray-800">Nepali Luga</span>
          </Link>
        </div>

        <hr className="border-t border-gray-300" />

        {/* Navigation Links */}
        <nav className="px-4 mt-4 flex-1 overflow-y-auto text-white">
          <ul className="space-y-5">
            {adminSidebarData.map((item, index) => {
              return (
                <li>
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex py-2 px-3 rounded hover:bg-gray-400  ${
                        isActive
                          ? "bg-gray-300 text-indigo-600 font-semibold"
                          : ""
                      }`
                    }
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout at bottom */}
        <div className="px-4 mb-10">
          <hr className="border-t  border-gray-300 mb-3 mt-3" />
          <div className="flex  border-0 rounded items-center gap- py-2 px-3 text-gray-100  ">
            <span
              className="cursor-pointer"
              onClick={() => {
                handleLogout();
              }}
            >
              <MdOutlineLogout />
            </span>
            <span
              className="cursor-pointer"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
