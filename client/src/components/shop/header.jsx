import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  UserCog,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { googleLogout } from "@react-oauth/google";
import { fetchCategories } from "@/store/admin/category-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import CustomDropdown from "../ui/custom-dropdown";

function MenuItems({ setOpenCartSheet }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, loading } = useSelector((state) => state.adminCategories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { product: [getCurrentMenuItem.id] }
        : null;

    window.scrollTo({ top: 0, behavior: "smooth" });

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?product=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);

    setOpenCartSheet(false);
  }

  return (
    <div className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {/* Static menu items */}
      <button
        onClick={() => handleNavigate({ id: "home", path: "/shop/home" })}
        className="lg:text-sm lg:hover:text-blue-600 font-medium cursor-pointer pb-1 relative transition-colors"
      >
        Home
      </button>
      <button
        onClick={() =>
          handleNavigate({ id: "products", path: "/shop/listing" })
        }
        className="lg:text-sm lg:hover:text-blue-600 font-medium cursor-pointer pb-1 relative transition-colors"
      >
        All Products
      </button>

      {/* Dynamic categories */}
      <>
        {loading ? (
          <span>Loading Categories...</span>
        ) : (
          categories.map((category) =>
            category.subcategories?.length > 0 ? (
              <CustomDropdown
                key={category._id}
                label={category.name}
                items={category.subcategories.map((sub) => ({
                  id: sub.toLowerCase(),
                  label: sub,
                }))}
                onItemClick={(item) =>
                  handleNavigate({
                    id: item.id,
                    path: `/shop/listing?product=${item.id}`,
                  })
                }
              />
            ) : (
              <button
                key={category._id}
                onClick={() =>
                  handleNavigate({
                    id: category.name.toLowerCase(),
                    path: `/shop/listing?product=${category.name.toLowerCase()}`,
                  })
                }
                className="lg:text-sm lg:hover:text-blue-600 font-medium cursor-pointer pb-1 relative transition-colors"
              >
                {category.name}
              </button>
            )
          )
        )}
      </>

      {/* Search (always at the end) */}
      <button
        onClick={() => handleNavigate({ id: "search", path: "/shop/search" })}
        className="lg:text-sm lg:hover:text-blue-600 font-medium cursor-pointer pb-1 relative transition-colors"
      >
        Search
      </button>
    </div>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await googleLogout();
      dispatch(logoutUser());
    } catch (error) {
      console.error("Google Sign-Out Error:", error);
    }

    window.location.reload();
  };

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  function HandleAccount() {
    navigate("/shop/account");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="flex lg:items-center flex-row gap-2.5 sm:gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold lg:text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={HandleAccount}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            onClick={() => navigate("/auth/login")}
            className="hidden sm:block"
          >
            <span>Sign In</span>
          </Button>
          <button
            onClick={() => navigate("/auth/login")}
            className=" cursor-pointer sm:hidden"
          >
            <User className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>
        <div className="flex gap-2">
          <div className="lg:hidden">
            <HeaderRightContent />
          </div>
          <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs overflow-y-auto"
            >
              <MenuItems setOpenCartSheet={setOpenCartSheet} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
