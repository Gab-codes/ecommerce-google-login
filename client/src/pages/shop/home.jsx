import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Glasses,
  Link2,
  Package,
  PackageSearch,
  ShirtIcon,
  ShoppingBag,
  ShoppingBasket,
  SprayCan,
  Wallet,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import { getFeatureImages } from "@/store/common-slice";
import ProductDetailsDialog from "@/components/shop/product-details";
import ShoppingProductTitle from "@/components/shop/product-title";
import menImg from "../../assets/men.jpg";
import womenImg from "../../assets/women.jpg";
import womenComboImg from "../../assets/women-combo.jpg";
import menComboImg from "../../assets/men-combo.png";

const categoriesWithImage = [
  { id: "men", label: "Men", image: menImg },
  { id: "women", label: "Women", image: womenImg },
  { id: "menCombo", label: "Men Combo", image: menComboImg },
  { id: "womenCombo", label: "Women Combo", image: womenComboImg },
];

const productTypesWithIcon = [
  { id: "wristwatch", label: "Wristwatch", icon: WatchIcon },
  { id: "sunglasses", label: "Sunglasses", icon: Glasses },
  { id: "perfume", label: "Perfume", icon: SprayCan },
  { id: "belts", label: "Belts", icon: Link2 },
  { id: "armpitPurse", label: "Armpit Purse", icon: Wallet },
  { id: "accessories", label: "Accessories", icon: PackageSearch },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[450px] sm:h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesWithImage.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={categoryItem.image}
                    alt={categoryItem.label}
                    className="w-20 h-20 mb-4 rounded-full object-cover"
                  />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Product
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {productTypesWithIcon.map((productItem) => (
              <Card
                key={productItem.id}
                onClick={() =>
                  handleNavigateToListingPage(productItem, "product")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <productItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{productItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Latest Collection
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList
                  .slice(0, 16)
                  .map((productItem) => (
                    <ShoppingProductTitle
                      key={productItem.id}
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  ))
              : null}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
