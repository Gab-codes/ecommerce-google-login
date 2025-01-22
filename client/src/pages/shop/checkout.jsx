import Address from "@/components/shop/address";
import img from "../../assets/account.jpeg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shop/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";


function ShopCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { paymentURL, isLoading } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCashLoading, setIsCashLoading] = useState(false);
  const { addressList } = useSelector((state) => state.shopAddress);


  useEffect(() => {
    if (addressList && addressList.length > 0) {
      const selectedAddress = addressList.find(addr => addr._id === currentSelectedAddress?._id);
      setCurrentSelectedAddress(selectedAddress || addressList[0]);
    }
  }, [addressList, currentSelectedAddress?._id]);
  

  const totalCartAmount = cartItems?.items?.reduce(
    (sum, currentItem) =>
      sum +
      (currentItem.salePrice > 0 ? currentItem.salePrice : currentItem.price) *
        currentItem.quantity,
    0
  ) || 0;


  function handleInitiatePaystackPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
  
    if (!currentSelectedAddress) {
      toast.error("Please select an address to proceed.");
      return;
    }
  
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      email: user?.email,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        state: currentSelectedAddress?.state,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "cancelled",
      paymentMethod: "paystack",
      paymentStatus: "failed",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      reference: "",
    };
  
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
        toast.error("Payment initiation failed. Please try again.");
      }
    });
  }

  const generateRandomAlphanumeric = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  const randomReference = `cod${generateRandomAlphanumeric(10)}`;
  

  function handleCashOnDelivery() {
    
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    
    if (!currentSelectedAddress) {
      toast.error("Please select an address to proceed.");
      return;
    }
    
    if (currentSelectedAddress?.state?.toLowerCase() !== "lagos") {
      toast.error("Cash on Delivery is only available within Lagos.");
      return;
    }
    
    setIsCashLoading(true);
    
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      email: user?.email,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        state: currentSelectedAddress?.state,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "processing",
      paymentMethod: "Cash on delivery",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      reference: randomReference,
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        navigate(`/shop/order-return?reference=${randomReference}`);

      } else {
        toast.error("Failed to place the order. Please try again.");
      }
    });
  }

  const handleWhatsAppCheckout = () => {
    const whatsappNumber = "+2348171981099";
    const messageIntro = cartItems.items.length > 1 
      ? "Hello, I want to purchase these products:"
      : "Hello, I want to purchase this product:";

    const messageBody = cartItems.items
      .map(
        (item) =>
          `\n- ${item.title} (₦${item.salePrice > 0 ? item.salePrice : item.price} x ${item.quantity})\n  Image: ${item.image}`
      )
      .join("");

    const message = encodeURIComponent(messageIntro + messageBody);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");
  };

  useEffect(() => {
    if (paymentURL) {
      window.location.href = paymentURL;
    }
  }, [paymentURL]);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems?.items?.length > 0 &&
            cartItems.items.map((item) => (
              <UserCartItemsContent key={item._id} cartItem={item} />
            ))}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                {`₦${new Intl.NumberFormat('en-NG', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalCartAmount)}`}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full">
          <Button
            onClick={handleInitiatePaystackPayment}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing Paystack Payment..." : "Checkout with Paystack"}
          </Button>
          </div>
          <div className="mt-4 w-full">
          <Button
            onClick={handleCashOnDelivery}
            className="w-full bg-[#007BFF] text-white hover:bg-[#0056b3] transition duration-200"
            disabled={isCashLoading} 
          >
            {isCashLoading ? "Processing Cash on Delivery..." : "Checkout with Cash on Delivery"}
          </Button>
          </div>
          <div className="flex justify-center gap-3 items-center">
            <Separator className="w-[40%] border-t-2 border-gray-300" aria-hidden="true" />
            <span className="border rounded-full p-1.5 text-sm font-semibold uppercase bg-white shadow-md">Or</span>
            <Separator className="w-[40%] border-t-2 border-gray-300" aria-hidden="true" />
          </div>
          <div className="-mt-5 w-full">
            <Button
              onClick={handleWhatsAppCheckout}
              className="w-full mt-6 bg-green-500 hover:bg-green-600"
            >
              Checkout on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default ShopCheckout;
