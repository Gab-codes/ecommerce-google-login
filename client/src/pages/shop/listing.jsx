import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductFilter from "@/components/shop/filter";
import ShoppingProductTitle from "@/components/shop/product-title";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import ProductDetailsDialog from "@/components/shop/product-details";
import { toast } from "react-toastify";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

function buildQueryString(filterParams) {
  const queryParams = Object.entries(filterParams).reduce(
    (acc, [key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        acc.push(`${key}=${encodeURIComponent(value.join(","))}`);
      }
      return acc;
    },
    []
  );
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setIsDetailsDialogOpen] = useState(false);
  const productSearchParam = searchParams.get("product");

  const [page, setPage] = useState(() => {
    return sessionStorage.getItem("listingCurrentPage")
      ? Number(sessionStorage.getItem("listingCurrentPage"))
      : 1;
  });
  const limit = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const onPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("listingCurrentPage", page);
  }, [page]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const response = await dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
          page,
          limit,
        })
      );
      if (response?.payload?.pagination) {
        setTotalPages(response.payload.pagination.totalPages);
        if (page > response.payload.pagination.totalPages) {
          setPage(1);
        }
      }
      setLoading(false);
    };
    fetchProducts();
  }, [dispatch, sort, filters, page, limit]);

  const handleSortChange = (value) => setSort(value);

  const handleFilterChange = (sectionId, option) => {
    const updatedFilters = { ...filters };
    const sectionOptions = updatedFilters[sectionId] || [];

    if (sectionOptions.includes(option)) {
      updatedFilters[sectionId] = sectionOptions.filter(
        (item) => item !== option
      );
    } else {
      updatedFilters[sectionId] = [...sectionOptions, option];
    }

    setFilters(updatedFilters);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
  };

  const handleProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId));
  };

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
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [productSearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const queryString = buildQueryString(filters);
      setSearchParams(new URLSearchParams(queryString));
    }
  }, [filters]);

  useEffect(() => {
    if (productDetails) {
      setIsDetailsDialogOpen(true);
    }
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilterChange} />

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length || 0} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={handleSortChange}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-60 w-full rounded-md" />
            ))
          ) : productList?.length > 0 ? (
            productList.map((product) => (
              <ShoppingProductTitle
                key={product._id}
                product={product}
                handleGetProductDetails={handleProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>

        {productList?.length > 10 ? (
          <Pagination className="flex flex-col justify-center items-center my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => onPageChange(page > 1 ? page - 1 : page)}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={index + 1 === page}
                    onClick={() => onPageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    onPageChange(page < totalPages ? page + 1 : page)
                  }
                />
              </PaginationItem>
            </PaginationContent>
            <div className="flex items-center justify-center mt-2">
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
            </div>
          </Pagination>
        ) : (
          ""
        )}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setIsDetailsDialogOpen}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
