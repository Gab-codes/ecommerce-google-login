import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/dashboard";
import AdminOrders from "./pages/admin/orders";
import AdminProducts from "./pages/admin/products";
import AdminFeatures from "./pages/admin/features";
import ShoppingLayout from "./components/shop/layout";
import NotFound from "./pages/not-found";
import ShopHome from "./pages/shop/home";
import ShopListing from "./pages/shop/listing";
import ShopCheckout from "./pages/shop/checkout";
import ShopAccount from "./pages/shop/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import SearchProducts from "./pages/shop/search";
import OrderConfirmationPage from "./pages/shop/order-confirmation";
import TotalUsers from "./pages/admin/users";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <>
        <div className="h-screen flex justify-center items-center">
          <img
            src="/loading.gif"
            alt="loading"
            className="w-full sm:w-[50%] object-cover"
          />
        </div>
      </>
      // <div className="space-y-6 p-8">

      //   <div className="space-y-4">
      //     <Skeleton className="w-full h-[400px] rounded-lg" />
      //     <Skeleton className="w-3/4 h-8" />
      //     <Skeleton className="w-1/2 h-6" />
      //   </div>

      //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      //     {Array.from({ length: 3 }).map((_, index) => (
      //       <div key={index} className="space-y-3">
      //         <Skeleton className="w-full h-[200px] rounded-lg" />
      //         <Skeleton className="w-3/4 h-5" />
      //         <Skeleton className="w-1/2 h-4" />
      //       </div>
      //     ))}
      //   </div>

      //   <div className="space-y-2 mt-8">
      //     <Skeleton className="w-1/2 h-4" />
      //     <Skeleton className="w-1/3 h-4" />
      //   </div>
      // </div>
    );
  }

  return (
    <div className="flex flex-col overflow-auto bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        />
        <Route
          path="/home"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        />
        {/* Auth Routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="users" element={<TotalUsers />} />
        </Route>

        {/* Shop Routes */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShopHome />} />
          <Route path="listing" element={<ShopListing />} />
          <Route path="checkout" element={<ShopCheckout />} />
          <Route path="account" element={<ShopAccount />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="order-return" element={<OrderConfirmationPage />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
        <Route path="/unauth-page" element={<UnauthPage />} />
      </Routes>
    </div>
  );
}

export default App;
