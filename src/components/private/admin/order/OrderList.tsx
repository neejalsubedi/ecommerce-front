/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../AuthContextProvider";
import { useApiGet } from "../../../../api/ApiGet";
import { useApiMutation } from "../../../../api/ApiMutation";
import { apiUrl } from "../../../../api/api";

const statusOptions = ["Processing", "On the Way", "Delivered", "Completed", "Cancelled"] as const;
const paymentStatusOptions = ["Pending", "Paid", "Failed"] as const;
const ITEMS_PER_PAGE = 5;

// ✅ Define types for order items and orders
interface OrderItem {
  product: string; // product ID
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface User {
  username?: string;
  email?: string;
}

interface Order {
  _id: string;
  user?: User;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: typeof paymentStatusOptions[number];
  orderStatus: typeof statusOptions[number];
  size?: string;
  createdAt: string;
  items: OrderItem[];
}

const OrderList = () => {
  const { initData } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // ✅ Type API response
  const {
    data: orders = [] as Order[],
    refetch,
    isLoading,
  } = useApiGet<Order[]>({
    endpoint: "/api/orders/all",
    queryKey: "all-orders",
  });

  const { mutate: updateOrderStatus } = useApiMutation("put", "/api/orders");
  const { mutate: updatePaymentStatus } = useApiMutation("put", "/api/orders");

  const handleStatusChange = (orderId: string, newStatus: typeof statusOptions[number]) => {
    updateOrderStatus(
      { path: `/${orderId}/update-order-status`, body: { orderStatus: newStatus } },
      {
        onSuccess: () => {
          toast.success("Order status updated");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to update status");
        },
      }
    );
  };

  const handlePaymentChange = (orderId: string, newPaymentStatus: typeof paymentStatusOptions[number]) => {
    updatePaymentStatus(
      { path: `/${orderId}/update-payment-status`, body: { paymentStatus: newPaymentStatus } },
      {
        onSuccess: () => {
          toast.success("Payment status updated");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to update payment status");
        },
      }
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const created = new Date(order.createdAt).toLocaleDateString().toLowerCase();
      const hasProductMatch = order.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      return (
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        created.includes(search.toLowerCase()) ||
        hasProductMatch
      );
    });
  }, [orders, search]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (!initData?.role || initData.role !== "Admin") {
    return <p className="text-red-500 font-semibold text-center mt-10">Unauthorized: Admins only</p>;
  }

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-10 bg-white h-full mt-5 rounded-2xl flex flex-col">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700 text-center">All Orders</h2>

      <input
        type="text"
        placeholder="Search by Order ID, Username, Product, or Date"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-2 rounded w-full mb-6"
      />

      <div className="flex-1 overflow-y-auto pr-1 space-y-8">
        {paginatedOrders.length === 0 ? (
          <p className="text-center text-gray-600">No matching orders found.</p>
        ) : (
          paginatedOrders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg shadow-md p-6 bg-white">
              <div className="text-sm text-gray-500 mb-2">Order ID: {order._id}</div>
              <div className="mb-2">
                <strong>User:</strong> {order.user?.username || "N/A"} ({order.user?.email || "N/A"})
              </div>
              <div className="mb-2"><strong>Total:</strong> Rs. {order.totalPrice}</div>
              <div className="mb-2"><strong>Payment:</strong> {order.paymentMethod}</div>
              <div className="mb-2"><strong>Size:</strong> {order.size}</div>
              <div className="mb-4 text-sm text-gray-600">
                Placed: {new Date(order.createdAt).toLocaleString()}
              </div>

              <div className="flex flex-wrap gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Status</label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value as typeof statusOptions[number])}
                    className="border border-gray-300 rounded px-3 py-1 mt-1 text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentChange(order._id, e.target.value as typeof paymentStatusOptions[number])}
                    className="border border-gray-300 rounded px-3 py-1 mt-1 text-sm"
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Items</h4>
                <div className="max-h-52 overflow-y-auto pr-2 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center gap-4 bg-gray-50 p-2 rounded border border-gray-100"
                    >
                      <img
                        src={`${apiUrl}/uploads/${item.image}`}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          Quantity: {item.quantity} &nbsp; | &nbsp; Price: Rs. {item.price} &nbsp; | &nbsp; Subtotal: Rs. {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${page === i + 1 ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
