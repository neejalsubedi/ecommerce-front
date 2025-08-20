/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState,  } from "react";
import { MdShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useApiGet } from "../../../api/ApiGet";
import type { ProductType } from "../../types/ProductType";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Cards";
import { apiUrl } from "../../../api/api";

const Home = () => {
  const { data: products = [] } = useApiGet<ProductType[]>({
    endpoint: "/api/products/product",
    queryKey: "products",
  });

  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [suggestions, setSuggestions] = useState<ProductType[]>([]);

const handleSearchChange = (e:any) => {
  const value = e.target.value;
  setSearch(value);

  if (!value.trim()) {
    setSuggestions([]);
  } else {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  }
};



  const handleSearchSubmit = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filtered.length > 0) {
      navigate("/products?search=" + encodeURIComponent(search));
    } else {
      alert("No products found matching your search.");
    }
  };

  return (
    <div className="min-h-screen text-gray-800 flex flex-col">
      <main className="px-4 md:px-16 py-12 md:py-20 bg-gradient-to-br from-white to-gray-100 flex flex-col gap-10">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-indigo-700">
              Elevate Your Wardrobe Today
            </h2>
            <p className="text-lg mb-6 text-gray-700">
              Discover premium fashion pieces for every style. Tailored for
              trendsetters and everyday icons.
            </p>
            <div className="mb-2 relative">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search clothing, shoes, accessories..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {search && (
                <ul className="absolute z-10 bg-white shadow rounded w-full mt-1 max-h-40 overflow-y-auto">
                  {suggestions.length > 0 ? (
                    suggestions.map((product) => (
                      <li
                        key={product._id}
                        className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-sm"
                        onClick={() =>
                          navigate(
                            `/products?search=${encodeURIComponent(product.name)}`
                          )
                        }
                      >
                        {product.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 text-sm">
                      No products found
                    </li>
                  )}
                </ul>
              )}
            </div>
            <Button
              onClick={handleSearchSubmit}
              className="text-lg flex items-center gap-2 mt-2"
            >
              <MdShoppingCart /> Shop Now
            </Button>
          </div>
          <div>
            <img
              src="/clothes-laptop-bed-arrangement-high-angle.jpg"
              alt="Fashion Collection"
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
          </div>
        </section>

        {/* Featured Styles */}
        <section className="py-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-indigo-800">
            Featured Styles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <Card
                key={product._id}
                title={product.name}
                description={product.description}
                imageSrc={`${apiUrl}/uploads/${product.image}`}
                imageAlt={product.name}
                showButton
                buttonLabel="Shop Now"
                onButtonClick={() => navigate("/products")}
              />
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-indigo-50 p-6 md:p-12 rounded-xl">
          <h3 className="text-2xl font-semibold mb-6 text-center text-indigo-800">
            Why Choose Nepali Luga?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {[
              {
                title: "Premium Quality",
                image: "/premium-quality-golden-design-badge-collection-vector.jpg",
                text: "Curated fabrics and lasting styles.",
              },
              {
                title: "Express Shipping",
                image: "/istockphoto-849921508-612x612.jpg",
                text: "Fast delivery across the country.",
              },
              {
                title: "Varieties",
                image: "/images (2).jpg",
                text: "Easy returns within 7 days of delivery.",
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="text-lg font-bold mb-2 text-indigo-700">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
