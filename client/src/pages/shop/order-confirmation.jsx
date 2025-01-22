import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { capturePayment } from "@/store/shop/order-slice";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderConfirmationPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const reference = params.get("reference");

  useEffect(() => {
    if (reference) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(
        capturePayment({
          reference,
          orderId,
          paymentMethod: "Cash on delivery",
        })
      ).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          toast.success("Your order has been placed successfully.");
        }
      });
    }
  }, [reference, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center my-[100px] p-6">
      <CheckCircle
        className="text-green-500 h-24 w-24 mb-6"
        aria-label="Order placed successfully"
      />
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Your Order Has Been Placed Successfully!
      </h1>

      <Button onClick={() => navigate("/shop/account")}>
        View Your Orders
      </Button>
    </div>
  );
}
