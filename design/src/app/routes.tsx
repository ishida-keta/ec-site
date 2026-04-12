import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { HomePage } from "./components/HomePage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { OrderCompletePage } from "./components/OrderCompletePage";
import { MyPage } from "./components/MyPage";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminProducts } from "./components/admin/AdminProducts";
import { AdminOrders } from "./components/admin/AdminOrders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "products/:id", Component: ProductDetailPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "order-complete", Component: OrderCompletePage },
      { path: "mypage", Component: MyPage },
      { path: "login", Component: LoginPage },
      {
        path: "admin",
        Component: AdminDashboard,
        children: [
          { index: true, Component: AdminProducts },
          { path: "products", Component: AdminProducts },
          { path: "orders", Component: AdminOrders },
        ],
      },
    ],
  },
]);
