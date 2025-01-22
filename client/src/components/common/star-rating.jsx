import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange, size }) {
  // Default size if no custom size is provided
  const defaultSize = "w-3 h-3 sm:w-4 md:w-4 sm:h-4 md:h-4";

  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star}
      className={`  rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:bg-primary hover:text-primary-foreground"
      }`}
      variant="none"
      size="icon-sm"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`${size || defaultSize} ${
          star <= rating ? "fill-yellow-500" : "fill-black"
        }`}
      />
    </Button>
  ));
}

export default StarRatingComponent;
