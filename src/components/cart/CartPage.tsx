/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { useAuth } from "../../AuthContextProvider";
import { useApiMutation } from "../../api/ApiMutation";
import { apiUrl } from "../../api/api";
import { useCart } from "./CartCXontext";

// ✅ Zod Schema for validation
const deliverySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[^\d]*$/, "Name cannot contain numbers"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  email: z.email({ message: "Invalid email" }),
});

type DeliveryInfo = z.infer<typeof deliverySchema>;

const CartPage = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { initData } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | "">("");

  // ✅ Hook Form setup with zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryInfo>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  // Prefill form if user is logged in
  useEffect(() => {
    if (initData) {
      reset({
        name: initData.username || "",
        address: initData.address || "",
        phone: initData.phone || "",
        email: initData.email || "",
      });
    }
  }, [initData, reset]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { mutate: createOrder } = useApiMutation("post", "/api/Orders/place");

  // ✅ Handle form submission
  const onSubmit = async (deliveryInfo: DeliveryInfo) => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const payload = {
      items: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        size:item.size
      })),
      deliveryInfo,
    };

    if (paymentMethod === "cod") {
      createOrder(
        { ...payload, paymentMethod: "COD" },
        {
          onSuccess: () => {
            toast.success("Order placed successfully");
            setTimeout(clearCart, 3000);
            navigate("/");
          },
          onError: (err) => {
            toast.error(err.message || "Failed to place order");
          },
        }
      );
    } else {
      try {
        const res = await fetch(
          "http://localhost:5000/api/orders/khalti/initiate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (res.ok && data.payment_url && data.tempOrder) {
          localStorage.setItem(
            "khalti_temp_order",
            JSON.stringify(data.tempOrder)
          );
          // localStorage.setItem("khalti_pidx", data.pidx);
          clearCart();
          window.location.href = data.payment_url;
        } else {
          throw new Error(data.message || "Khalti payment initiation failed");
        }
      } catch (error:any) {
        toast.error("Khalti payment initiation failed",error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {/* Cart Items List */}
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center bg-white p-4 rounded shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`${apiUrl}/uploads/${item.image}`}
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item._id as string)}
                          className="px-2 py-1 bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item._id as string)}
                          disabled={item.quantity === item.stock}
                          className={`px-2 py-1 rounded ${
                            item.quantity === item.stock
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gray-200"
                          }`}
                        >
                          +
                        </button>
                        <p className="text-md text-gray-400 px-4">
                          In stock:{" "}
                          <span className="text-md text-gray-600">
                            {item.stock}
                          </span>
                        </p>
                      </div>
                      {item.quantity >= item.stock && (
                        <span className="text-red-500 text-xs mt-1">
                          Cannot increase, this is the available stock.
                        </span>
                      )}
                      {item.quantity >= 10 && (
                        <p className="text-sm text-red-500 mt-1">
                          You can order up to only 10 at once
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold text-indigo-600">
                    Rs. {item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id as string)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total: Rs. {total}</p>
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear Cart
            </button>
          </div>

          {/* ✅ Delivery Info Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 bg-white p-6 rounded-lg shadow-md space-y-6 border border-gray-200 w-full mx-auto"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              🚚 Delivery Information
            </h3>

            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", {})}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label
                htmlFor="address"
                className="block font-medium text-gray-700"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register("address")}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Street, City"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label
                htmlFor="phone"
                className="block font-medium text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phone")}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+977-98XXXXXXXX"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </form>

          {/* Payment Method */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <img src="/khalti.png" alt="Khalti" className="w-20" />
                Pay with Khalti
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={clearCart}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel Order
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={paymentMethod === "" || cartItems.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {paymentMethod === "online" ? "Pay with Khalti" : "Place Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
