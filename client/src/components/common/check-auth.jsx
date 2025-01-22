import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation();
    const fromPath = location.state?.from || "/shop/home"; 


    if (location.pathname === "/" || location.pathname === "/home") {
        return <Navigate to="/shop/home" replace />;
    }

    if (isAuthenticated && user?.role === "admin") {
        if (location.pathname.includes("/shop")) {
            return <Navigate to="/admin/dashboard" />;
        }
    }


    const publicRoutes = ["/shop/home", "/shop/listing", "/shop/search"]; 
    if (publicRoutes.includes(location.pathname)) {
        return <>{children}</>; // Allow public access
    }


    if (!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        return <Navigate to='/auth/login' />;  
    }


    if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("admin")) {
        return <Navigate to="/unauth-page" />;
    }

    return <>{children}</>;
}
