import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";

import AddCategory from "./components/private/admin/category/AddCategory";
import Layout from "./components/public/layout/Layout";
import Home from "./components/public/pages/Home";
import ProductsList from "./components/public/pages/ProductsList";


import PrivateRoute from "./components/PrivateRoute";
import { CartProvider } from "./components/cart/CartCXontext";
import CartPage from "./components/cart/CartPage";

import AddProduct from "./components/private/admin/product/AddProduct";
import PrivateLayout from "./components/private/layout/PrivateLayout";
import Login from "./components/public/pages/Login";
import Register from "./components/public/pages/Register";
import Orders from "./components/cart/Orders";
import PaymentSuccess from "./components/cart/PaymentSuccess";
import Products from "./components/private/admin/product/Products";
import EditProduct from "./components/private/admin/product/EditProduct";
import OrderList from "./components/private/admin/order/OrderList";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Public layout
      children: [
        { index: true, element: <Home /> },
        { path: "products", element: <ProductsList /> },

        // ✅ Cart should be accessible only after login (for users)
        {
          path: "cart",
          element: (
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          ),
        },
       { path:"/orders" ,
        element: (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        ),},
        {path:"/payment-success",element:(
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        )}
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute adminOnly={true}>
          <PrivateLayout />
        </PrivateRoute>
      ),
      children: [

        { path: "add-category", element: <AddCategory /> },
        { path: "add-product", element: <AddProduct /> },
        {path:"products",element:<Products/>},
        {path:"orders",element:<OrderList/>},
        {path:"edit-product/:id",element:<EditProduct/>},
        {index:true,element:<OrderList/>}
      ],
    },
  ]);

  return (
    <CartProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </CartProvider>
  );
}

export default App;
