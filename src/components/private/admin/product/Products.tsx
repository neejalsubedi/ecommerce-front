/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiGet } from "../../../../api/ApiGet";
import { useApiMutation } from "../../../../api/ApiMutation";
import { apiUrl } from "../../../../api/api";

// ✅ Define Product type
interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  category?: Category;
}

const Products = () => {
  const navigate = useNavigate();

  const { data: products = [], refetch } = useApiGet<Product[]>({
    queryKey: "products",
    endpoint: "/api/products/product",
  });

  const { mutate: deleteProduct } = useApiMutation("delete", "/api/products");

  // const [stockAvailable, setStockAvailable] = useState<boolean>(true);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(`/delete/${id}`, {
        onSuccess: (res: any) => {
          toast.success(res.message);
          refetch(); // refresh the list
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to delete");
        },
      });
    }
  };

  // useEffect(() => {
  //   const outOfStock = products.some((product) => product.stock === 0);
  //   setStockAvailable(!outOfStock);
  // }, [products]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Products</h2>

      <div className="max-h-[600px] overflow-y-auto pr-2 bg-gray-100 p-6 border border-gray-100 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-xl rounded-md overflow-hidden"
            >
              <img
                src={`${apiUrl}/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover p-2"
              />
              <div className="relative">
                {product.stock === 0 && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-500 mt-1">
                  Category: {product.category?.name || "N/A"}
                </p>
                <p className="text-indigo-600 font-bold mt-2">
                  Rs. {product.price}
                </p>
                <p className="text-sm text-gray-500">
                  Stock:{" "}
                  <span
                    className={`text-sm font-medium ${
                      product.stock === 0 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {product.stock}
                  </span>
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/edit-product/${product._id}`)
                    }
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
