import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import useMediaQuery from "@/hooks/use-media-query";
import { Drawer, DrawerContent } from "../ui/drawer";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    )
      .unwrap()
      .then((data) => {
        if (data?.success) {
          setRating(0);
          setReviewMsg("");
          dispatch(getReviews(productDetails?._id));
          toast.success("Review added successfully!");
        }
      })
      .catch((error) => {
        const message = error || "An unexpected error occurred.";
        toast.error(message);
      });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <>
      <div className="rounded-lg">
        {productDetails?.images?.length > 1 ? (
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            grabCursor={true}
          >
            {productDetails.images.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imgUrl}
                  alt={productDetails?.title}
                  className="aspect-square w-full object-cover max-w-[400px] max-h-[400px] sm:max-w-[600px] sm:max-[h-600px]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src={productDetails?.images[0]}
            alt={productDetails?.title}
            className="aspect-square w-full object-cover max-w-[400px] max-h-[400px] sm:max-w-[600px] sm:max-[h-600px]"
          />
        )}
      </div>

      <div>
        <div>
          <h1 className="text-2xl font-extrabold">{productDetails?.title}</h1>
          <p className="text-muted-foreground text-lg mb-2 mt-2">
            {productDetails?.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p
            className={`text-xl font-bold text-primary ${
              productDetails?.salePrice > 0 ? "line-through" : ""
            }`}
          >
            {`₦${new Intl.NumberFormat("en-NG", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(productDetails?.price)}`}
          </p>
          {productDetails?.salePrice > 0 && (
            <p className="text-xl font-bold text-muted-foreground">
              {`₦${new Intl.NumberFormat("en-NG", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(productDetails?.salePrice)}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            <StarRatingComponent
              rating={averageReview}
              size="w-3.5 h-3.5 sm:w-5 sm:h-5"
            />
          </div>
          <span className="text-muted-foreground">
            ({averageReview.toFixed(1)})
          </span>
        </div>

        <div className="mt-5 mb-5">
          {productDetails?.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Out of Stock
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() =>
                handleAddToCart(productDetails?._id, productDetails?.totalStock)
              }
            >
              Add to Cart
            </Button>
          )}
        </div>

        <Separator />

        <div className="max-h-[300px] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="grid gap-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <div key={reviewItem?._id} className="flex gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>
                      {reviewItem?.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{reviewItem?.userName}</h3>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <StarRatingComponent rating={reviewItem?.reviewValue} />
                    </div>
                    <p className="text-muted-foreground">
                      {reviewItem.reviewMessage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <h1>No Reviews</h1>
            )}
          </div>

          <div className="mt-10 flex-col flex gap-2 relative">
            <Label>Write a review</Label>
            <div className="flex gap-1">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
                size="w-3.5 h-3.5 sm:w-4 sm:h-4"
              />
            </div>
            <Input
              name="reviewMsg"
              value={reviewMsg}
              onChange={(event) => setReviewMsg(event.target.value)}
              placeholder="Write a review..."
              className="!w-[95%] ms-1"
            />
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === ""}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[80vh] sm:max-h-[97vh] overflow-auto sm:p-7 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleDialogClose}>
      <DrawerContent className="max-h-[83vh]">
        <div className="relative grid grid-cols-1 gap-6 max-h-[80vh] h-full overflow-y-auto p-4 w-full">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ProductDetailsDialog;
