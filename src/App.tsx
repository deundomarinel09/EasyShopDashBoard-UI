import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";
import Loading from "./components/common/Loading";
import ProtectedRoute from "./contexts/ProtectedRoute";


// Lazy loaded components
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const OrdersPage = lazy(() => import("./pages/orders/OrdersPage"));
const ProductsPage = lazy(() => import("./pages/products/ProductsPage"));
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));
const ProductFormPage = lazy(() => import("./pages/products/ProductFormPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const VerifyOtp = lazy(() => import("./pages/auth/otpVerification"));


function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/otp" element={<VerifyOtp />} />


        <Route
  path="/"
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="/dashboard" replace />} />
  <Route path="dashboard" element={<DashboardPage />} />
  <Route path="users" element={<UsersPage />} />
  <Route path="orders" element={<OrdersPage />} />
  <Route path="products" element={<ProductsPage />} />
  <Route path="products/new" element={<ProductFormPage />} />
  <Route path="products/edit/:id" element={<ProductFormPage />} />
  <Route path="reports" element={<ReportsPage />} />
</Route>


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
