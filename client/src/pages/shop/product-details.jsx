import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { toast } from "react-toastify";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import StarRatingComponent from "@/components/common/star-rating";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ProductDetailsPage() {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
      dispatch(getReviews(productId));
    }
  }, [dispatch, productId]);

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
        toast.success("Product added to cart");
      }
    });
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

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const ReviewComponent = () => {
    return (
      <div className="mt-6">
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

        {/* Add Review */}
        <div className="mt-6 flex flex-col gap-2">
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
          <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""}>
            Submit
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="px-8 py-10 flex flex-col">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            grabCursor={true}
            className="w-full max-w-md mx-auto"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
            initialSlide={activeImageIndex}
          >
            {productDetails?.images?.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imgUrl}
                  alt={productDetails?.title}
                  className="aspect-square w-full object-cover rounded-lg shadow-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail */}
          <div className="hidden lg:flex gap-3 mt-4 justify-center">
            {productDetails?.images?.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                  index === activeImageIndex
                    ? "border-primary border-2"
                    : "border-transparent"
                }`}
                onClick={() => {
                  setActiveImageIndex(index);
                  swiperRef.current?.slideTo(index);
                }}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>

          <div className="flex items-center justify-between mt-4">
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

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <StarRatingComponent
              rating={averageReview}
              size="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-muted-foreground">
              ({averageReview.toFixed(1)})
            </span>
          </div>

          {/* Add to Cart */}
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-1/3 opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-1/4 px-10 sm:px-0 sm:w-1/3 lg:w-1/4"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews & Description */}
      <div className="container mx-auto grid grid-cols-1 gap-8 py-10">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description"> Description </TabsTrigger>
              <TabsTrigger value="reviews"> Reviews </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <p className="text-muted-foreground text-lg mt-2">
                {productDetails?.description}
              </p>
            </TabsContent>
            <TabsContent value="reviews">
              <ReviewComponent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
