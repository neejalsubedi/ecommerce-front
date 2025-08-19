import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContextProvider";

interface TransactionSummary {
  transaction_id: string;
  amount: number;
  mobile: string;
  status: string;
  orderId: string;
}

const PaymentSuccess = () => {
  const { initData, loadingInitData, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to complete your order.");
      navigate("/login");
      return;
    }

    // Wait until initData is loaded before proceeding
    if (loadingInitData || !initData) {
      console.log("🛑 Waiting for initData...");
      return;
    }

    const verifyAndSaveOrder = async () => {
      const searchParams = new URLSearchParams(location.search);

      const pidx = searchParams.get("pidx");
      const status = searchParams.get("status");
      const transaction_id = searchParams.get("transaction_id");
      const amount = searchParams.get("amount");
      const mobile = searchParams.get("mobile");

      const tempOrder = localStorage.getItem("khalti_temp_order");

      if (!pidx || !tempOrder) {
        toast.error("Missing payment information.");
        navigate("/cart");
        return;
      }

      if (status !== "Completed") {
        toast.error(`Payment ${status}`);
        navigate("/cart");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/orders/khalti/verify-and-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            pidx,
            tempOrder: JSON.parse(tempOrder),
          }),
        });

        const data = await res.json();
        console.log("✅ Payment verification response:", res.status, data);

        if (res.ok) {
          setSummary({
            transaction_id: transaction_id || "",
            amount: Number(amount) / 100,
            mobile: mobile || "",
            status: status || "Completed",
            orderId: data.order._id,
          });

          toast.success("Payment verified & order placed!");
          localStorage.removeItem("khalti_temp_order");
        } else {
          toast.error(data.message || "Payment verification failed");
          navigate("/cart");
        }
      } catch (err) {
        console.error("❌ Error verifying payment:", err);
        toast.error("Something went wrong. Please try again.");
        navigate("/payment-failed");
      } finally {
        setLoading(false);
      }
    };

    verifyAndSaveOrder();
  }, [initData, loadingInitData, isAuthenticated, location.search, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-lg text-gray-600">
          Verifying your payment, please wait...
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-red-600 text-lg">
          Failed to load transaction summary.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold text-green-600 mb-4">✅ Payment Successful</h1>
      <p><strong>Transaction ID:</strong> {summary.transaction_id}</p>
      <p><strong>Amount:</strong> Rs {summary.amount}</p>
      <p><strong>Mobile:</strong> {summary.mobile}</p>
      <p><strong>Status:</strong> {summary.status}</p>

      <Link to={`/orders/${summary.orderId}`}>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Order Details
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;
