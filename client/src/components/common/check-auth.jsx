import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const fromPath = location.state?.from || "/shop/home";

  if (location.pathname === "/" || location.pathname === "/home") {
    return <Navigate to="/shop/home" replace />;
  }

  // Admin redirection for authenticated users with admin role
  if (isAuthenticated && user?.role === "admin") {
    if (location.pathname.includes("/shop")) {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  const publicRoutes = ["/shop/home", "/shop/listing", "/shop/search"];

  // Check for product page route
  const isProductPage = location.pathname.startsWith("/shop/product/");

  // Allow access to public routes and product details page
  if (publicRoutes.includes(location.pathname) || isProductPage) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated and trying to access a restricted page
  if (
    !isAuthenticated &&
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/register")
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect to unauthenticated page if user is trying to access admin pages
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  return <>{children}</>;
}
