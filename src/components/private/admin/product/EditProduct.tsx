/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, } from "react";
import type {ChangeEvent, FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiGet } from "../../../../api/ApiGet";
import { apiUrl } from "../../../../api/api";

// ✅ Define types
interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: Category;
  image?: string;
}

interface FormDataState {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: File | null;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const { data: categories = [] } = useApiGet<Category[]>({
    queryKey: "categories",
    endpoint: "/api/categories/category",
  });

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/product`);
        const data: Product[] = await res.json();
        const target = data.find((p) => p._id === id);
        setProduct(target || null);

        if (target) {
          setFormData({
            name: target.name,
            description: target.description,
            price: target.price.toString(),
            stock: target.stock.toString(),
            category: target.category?._id || "",
            image: null,
          });
        }
      } catch (err:any) {
        toast.error("Failed to fetch product",err);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("stock", formData.stock);
    form.append("category", formData.category);
    form.append("size", JSON.stringify(["S", "M", "XL", "XXL", "XXXL"]));

    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/products/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product updated successfully");
        navigate("/admin/products");
      } else {
        throw new Error(data.message);
      }
    } catch (err:any) {
      toast.error("Failed to update product",err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Product Name"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          placeholder="Price"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          placeholder="Stock"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {product.image && (
          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-1">Current Image:</p>
            <img
              src={`${apiUrl}/uploads/${product.image}`}
              alt="Current product"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
