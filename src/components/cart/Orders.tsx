import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContextProvider";
import { useApiGet } from "../../api/ApiGet";
import { useApiMutation } from "../../api/ApiMutation";
import { apiUrl } from "../../api/api";

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useApiGet({
    queryKey: "my-orders",
    endpoint: "/api/Orders/my-orders",
    enabled: isAuthenticated, // only fetch if logged in
  });
  const { mutate: cancelOrder } = useApiMutation("put", "/api/Orders/","my-orders");

  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      const ongoing = orders.filter((o) =>
        ["Processing", "On the Way"].includes(o.orderStatus)
      );
      const past = orders.filter((o) =>
        ["Delivered", "Completed", "Cancelled"].includes(o.orderStatus)
      );
      setOngoingOrders(ongoing);
      setPastOrders(past);
    }
  }, [orders]);
  const handleCancelOrder = async(orderId: string) => {
    cancelOrder(`${orderId}/cancel`, {
      onSuccess: () => {
        toast.success("Order cancelled successfully");
        refetch();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to cancel order");
      },
    });
  };

  if (isLoading) return <p className="p-6">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-600">Failed to load orders.</p>;

  const renderOrderCard = (order) => (
    <div
      key={order._id}
      className="border p-4 rounded shadow bg-white space-y-3 mb-4"
    >
      <div className="flex justify-between text-sm text-gray-600">
        <span>Order ID: {order._id}</span>
        <span>{new Date(order.createdAt).toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-medium">
        <p className="text-indigo-700">Total: Rs. {order.totalPrice}</p>

        <p>
          Payment Method:
          <span className="text-gray-600"> {order.paymentMethod}</span>
        </p>
        <p>
          Payment:{" "}
          <span
            className={
              order.paymentStatus === "Paid"
                ? "text-green-600"
                : "text-yellow-600"
            }
          >
            {order.paymentStatus}
          </span>
        </p>
        <p>
          Status:
          <span
            className={`${
              order.orderStatus === "Cancelled"
                ? "text-red-600"
                : order.orderStatus === "Delivered" ||
                  order.orderStatus === "Completed"
                ? "text-green-600"
                : "text-blue-600"
            }`}
          >
            {order.orderStatus}
          </span>
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-1">Items:</h4>
        <ul className="pl-4 list-disc text-sm">
          {order.items.map((item) => (
            <li key={item.product}>
              <div className="flex gap-2 items-center">
                <img
                  src={`${apiUrl}/uploads/${item.image}`}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <span>
                  {item.name} × {item.quantity} — Rs.{" "}
                  {item.price * item.quantity}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-gray-700 flex justify-between">
        <p>
          📦 Delivery: {order.deliveryInfo.name}, {order.deliveryInfo.phone},{" "}
          {order.deliveryInfo.address}
        </p>
        {order.orderStatus === "Processing" && (
          <button
            onClick={() => handleCancelOrder(order._id)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-blue-700">
          Ongoing Orders
        </h3>
        {ongoingOrders.length > 0 ? (
          ongoingOrders.map(renderOrderCard)
        ) : (
          <p className="text-gray-500">No ongoing orders found.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-green-700">
          Completed / Cancelled Orders
        </h3>
        {pastOrders.length > 0 ? (
          pastOrders.map(renderOrderCard)
        ) : (
          <p className="text-gray-500">No past orders found.</p>
        )}
      </section>
    </div>
  );
};

export default Orders;
