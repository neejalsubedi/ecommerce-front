import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../../../api/api";
import { useApiGet } from "../../../api/ApiGet";
import { useAuth } from "../../../AuthContextProvider";
import { useCart } from "../../cart/CartCXontext";
import type { ProductType } from "../../types/ProductType";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Cards";

const ProductsList = () => {
  const { state } = useLocation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stock, setStock] = useState<boolean>(true);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: products = [] } = useApiGet<ProductType[]>({
    endpoint: "api/products/product",
    queryKey: "products",
  });

  const allCategories = [
    "All",
    ...Array.from(
      new Set(products.map((p) => p.category?.name).filter(Boolean))
    ),
  ];

  useEffect(() => {
    if (state?.scrollToCategory) {
      const el = categoryRefs.current[state.scrollToCategory];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [state]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group all products by category (for second section)
  const groupedProducts: Record<string, typeof products> = {};
  products.forEach((product) => {
    const categoryName = product.category?.name || "Uncategorized";
    if (!groupedProducts[categoryName]) {
      groupedProducts[categoryName] = [];
    }
    groupedProducts[categoryName].push(product);
  });

  const handleAddToCart = (product: ProductType) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = (product: ProductType) => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    addToCart(product);
    setTimeout(() => navigate("/cart"), 200);
  };

  useEffect(() => {
    const outOfStock = products.some((product) => product.stock === 0);
    setStock(!outOfStock);
  }, [products]);

  const renderCard = (product: (typeof products)[number]) => (
    <Card
      key={product._id}
      imageSrc={`${apiUrl}/uploads/${product.image}`}
      renderContent={() => (
        <>
          <h4 className="text-lg font-semibold">{product.name}</h4>
          <p className="text-sm text-gray-500">{product.category?.name}</p>
          <p className="text-indigo-600 font-bold mb-2">Rs. {product.price}</p>
          <p className="text-sm text-gray-500">
            Stock:{" "}
            <span className={`text-sm font-medium ${!stock?"text-red-500":"text-gray-500 "}`}>
              {product.stock}
            </span>
          </p>

          <div className="flex justify-between">
            <Button
              onClick={() => handleBuyNow(product)}
              variant="secondary"
                        className={`px-3 py-1 text-sm ${
                !stock ? "bg-red-500 cursor-not-allowed hover:bg-red-500" : "bg-gray-300"
              }`}
              disabled={!stock}
            >
              Buy Now
            </Button>

            <Button
              onClick={() => handleAddToCart(product)}
              variant="primary"
              className={`px-3 py-1 text-sm ${
                !stock ? "bg-red-500 cursor-not-allowed hover:bg-red-500" : "bg-blue-500"
              }`}
              disabled={!stock}
            >
              Add to Cart
            </Button>
          </div>
        </>
      )}
    />
  );

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Products</h2>

      {/* Filters */}
      <div className="flex justify-between sm:flex-row gap-4 mb-8 items-center">
        <input
          type="text"
          placeholder="Search products..."
          className="bg-white w-full sm:w-1/2 border border-gray-300 p-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="bg-white w-full sm:w-1/4 border border-gray-300 p-2 rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {allCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Show all filtered products in a flat grid */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
          {selectedCategory === "All"
            ? "All Products"
            : `Products in ${selectedCategory}`}
        </h3>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(renderCard)}
          </div>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>

      {/* Separator */}
      <hr className="my-12 border-gray-300" />

      {/* Show all products grouped by category with headings */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-indigo-700">
          Products by Category
        </h3>
        {Object.entries(groupedProducts).map(([categoryName, products]) => (
          <div
            key={categoryName}
            ref={(el) => {
              categoryRefs.current[categoryName] = el;
            }}
            className="mb-12 scroll-mt-24"
          >
            <h4 className="text-xl font-semibold mb-3">{categoryName}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(renderCard)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
