import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../AuthContextProvider";
import { useApiGet } from "../../../api/ApiGet";
import { apiUrl } from "../../../api/api";
import { useCart } from "../../cart/CartCXontext";
import type { ProductType } from "../../types/ProductType";
import { Card } from "../../ui/Cards";
import { Button } from "../../ui/Button";

interface ProductDetailsProps {
  id: string;
}

const ProductDetails = ({ id }: ProductDetailsProps) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const { data: product, isLoading } = useApiGet<ProductType>({
    endpoint: `api/products/product/${id}`,
    queryKey: `product-${id}`,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  const productId = product._id ?? "unknown"; // fallback if _id is undefined
  const categoryName = product.category?.name ?? "Uncategorized"; // fallback if category is undefined

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const size = selectedSize[productId];
    if (!size) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    addToCart({ ...product, size });
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const size = selectedSize[productId];
    if (!size) {
      toast.error("Please select a size before adding to cart");
      return;
    }

    addToCart({ ...product, size });
    setTimeout(() => navigate("/cart"), 200);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Card
      key={productId}
      imageSrc={`${apiUrl}/uploads/${product.image}`}
      cardClassName="w-xl"
      renderContent={() => (
        <>
          <div className="relative">
            {isOutOfStock && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                Out of Stock
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="text-gray-600 mb-2">{categoryName}</p>
          <p className="text-indigo-600 font-bold text-lg mb-4">Rs. {product.price}</p>
          <p>{product.description}</p>

          <div className="flex flex-wrap gap-3">
            {["S", "M", "X", "XL", "XXL", "XXXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() =>
                  setSelectedSize((prev) => ({ ...prev, [productId]: size }))
                }
                disabled={isOutOfStock}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                  selectedSize[productId] === size
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {!isOutOfStock && (
            <div className="flex justify-between mt-4">
              <Button
                onClick={handleBuyNow}
                variant="secondary"
                className="px-3 py-1 text-sm bg-gray-300"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
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

export default ProductDetails;
