import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const handleWhatsAppCheckout = () => {
    const whatsappNumber = "+2348033662950";
    const messageIntro =
      cartItems.length > 1
        ? "Hello, I want to purchase these products:"
        : "Hello, I want to purchase this product:";

    const messageBody = cartItems
      .map(
        (item) =>
          `\n- ${item.title} (₦${
            item.salePrice > 0 ? item.salePrice : item.price
          } x ${item.quantity})\n  Image: ${item.image}`
      )
      .join("");

    const message = encodeURIComponent(messageIntro + messageBody);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");
    setOpenCartSheet(false);
  };

  function handleNavigateToHomePage() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    navigate(`/shop/listing`);

    setOpenCartSheet(false);
  }

  return (
    <SheetContent className="sm:max-w-md overflow-auto">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item?.id} cartItem={item} />
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button onClick={handleNavigateToHomePage} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
      {cartItems && cartItems.length > 0 && (
        <>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                {`₦${new Intl.NumberFormat("en-NG", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalCartAmount)}`}
              </span>
            </div>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout", {
                state: { from: location.pathname },
              });
              setOpenCartSheet(false);
            }}
            className="w-full mt-6"
          >
            Checkout
          </Button>
          <Button
            onClick={handleWhatsAppCheckout}
            className="w-full mt-6 bg-green-500 hover:bg-green-600"
          >
            Checkout on WhatsApp
          </Button>
        </>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
