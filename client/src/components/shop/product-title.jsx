import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Pagination } from "swiper/modules";

export default function ShoppingProductTitle({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto cursor-pointer">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          {product?.images?.length > 1 ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true }}
              modules={[Pagination]}
            >
              {product.images.map((imgUrl, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={imgUrl}
                    alt={product?.title}
                    className="w-full h-200px object-cover rounded-t-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={product?.images[0]}
              alt={product?.title}
              className="w-full h-200px object-cover rounded-t-lg"
            />
          )}
          {product?.totalStock === 0 ? (
            <Badge className="absolute z-40 top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute z-40 top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute z-40 top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg sm:text-lg font-semibold text-primary`}
            >
              {`₦${new Intl.NumberFormat("en-NG", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(product?.price)}`}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg sm:text-lg font-semibold text-primary">
                {`₦${new Intl.NumberFormat("en-NG", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(product?.salePrice)}`}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
