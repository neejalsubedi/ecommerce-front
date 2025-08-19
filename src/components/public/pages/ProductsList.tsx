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
import GenericModal from "../../ui/Modal";
import ProductDetails from "./ProductDetails";

const ProductsList = () => {
  const { state } = useLocation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});

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
    const size = selectedSize[product._id];
    if (!size) {
      toast.error("Please select a size before adding to cart");
      return;
    }
    addToCart({ ...product, size: selectedSize[product._id] });
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = (product: ProductType) => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    const size = selectedSize[product._id];
    if (!size) {
      toast.error("Please select a size before adding to cart");
      return;
    }
    addToCart({ ...product, size: selectedSize[product._id] });
    setTimeout(() => navigate("/cart"), 200);
  };

  const renderCard = (product: ProductType) => {
    const isOutOfStock = product.stock === 0;

    return (
      <Card
        key={product._id}
        imageSrc={`${apiUrl}/uploads/${product.image}`}
        onClick={() => {
          setIsModalOpen(true);
          setSelectedId(product._id);
        }}
        renderContent={() => (
          <>
            <div className="relative">
              {isOutOfStock && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Out of Stock
                </div>
              )}
            </div>
            <h4 className="text-lg font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-500">{product.category?.name}</p>
            <p className="text-indigo-600 font-bold mb-2">
              Rs. {product.price}
            </p>
            <p className="text-sm text-gray-500">
              Stock:
              <span
                className={`text-sm font-medium ${
                  isOutOfStock ? "text-red-500" : "text-gray-500"
                }`}
              >
                {product.stock}
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              {["S", "M", "X", "XL", "XXL", "XXXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    setSelectedSize((prev) => ({
                      ...prev,
                      [product._id]: size,
                    }))
                  }
                  disabled={isOutOfStock}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition 
      ${
        selectedSize[product._id] === size
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
      }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {!isOutOfStock && (
              <div className="flex justify-between">
                <Button
                  onClick={() => handleBuyNow(product)}
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-gray-300"
                >
                  Buy Now
                </Button>

                <Button
                  onClick={() => handleAddToCart(product)}
                  variant="primary"
                  className="px-3 py-1 text-sm bg-blue-500"
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </>
        )}
      />
    );
  };

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
      <GenericModal
        isOpen={isModalOpen}
        toggleModal={() => {
          setIsModalOpen(false);
          setSelectedId(null);
        }}
      >
        {selectedId && <ProductDetails id={selectedId} />}
      </GenericModal>
    </div>
  );
};

export default ProductsList;
