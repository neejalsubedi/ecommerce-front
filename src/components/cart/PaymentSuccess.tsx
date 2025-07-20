import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = localStorage.getItem("khalti_pidx");
      const tempOrder = localStorage.getItem("khalti_temp_order");

      if (!pidx || !tempOrder) {
        toast.error("Missing payment information");
        navigate("/cart");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/orders/khalti/verify-and-save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`, // optional
          },
          body: JSON.stringify({
            pidx,
            tempOrder: JSON.parse(tempOrder),
          }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("Payment verified & order placed!");
          // Clean up
          localStorage.removeItem("khalti_pidx");
          localStorage.removeItem("khalti_temp_order");
          navigate("/");
        } else {
          toast.error(data.message || "Payment verification failed");
          navigate("/");
        }
      } catch (err) {
        toast.error("Something went wrong");
        navigate("/payment-failed");
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <p className="text-lg text-gray-600">Verifying your payment, please wait...</p>
    </div>
  );
};

export default PaymentSuccess;
