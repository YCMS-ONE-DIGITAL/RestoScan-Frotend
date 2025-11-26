import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";

import AuthForm from "./components/layout/AuthForm";
import HomePage from "./pages/Home";

// Dashboard Pages
import Dashboard from "./pages/dashboard";
import Orders from "./pages/Orders";
import KOT from "./pages/KOT";
import Tables from "./pages/Tables";
import MenuList from "./pages/menus/MenuList";
import MenuItemsList from "./pages/menus/MenuItemList";
import CategoryList from "./pages/categories/CategoryList";
import Staff from "./pages/Staff";
import  Customers  from "./pages/Customers";
import Payments from "./pages/payments/payments";
import PaymentDue from "./pages/payments/paymentdue";
import POS from "./pages/Pos";
import Settings from "./pages/Settings";

// Customer Website
import CustomerWebsite from "./CustomerWebsite/Main";
import MenuPage from "./CustomerWebsite/pages/MenuPage";
import OrderHistory from "./CustomerWebsite/pages/OrderHistory";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AddRestaurant from "./pages/AddRestaurant";

const allPageRouter = createBrowserRouter([
  // ===========================
  // Customer Website Routes
  // ===========================
  {
    path: "/customerwebsite",
    element: <CustomerWebsite />,
  },
  {
    path: "/customerwebsite/orderhistory",
    element: <OrderHistory />,
  },
  {
    path: "/customerwebsite/menu",
    element: <MenuPage />,
  },

  // ===========================
  // Public Routes
  // ===========================
  {
    path: "/homepage",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <PublicRoute>
      <AuthForm />
    </PublicRoute>,
  },
  {
    path: "/login",
    element: <PublicRoute>
      <AuthForm />
    </PublicRoute>,
  },

  // ===========================
  // Dashboard (Main Layout)
  // ===========================
  {
  path: "/add-restaurant",
  element: (
    <ProtectedRoutes blockIfRestaurantExists={true}>
      <AddRestaurant />
    </ProtectedRoutes>
  ),
},
  {
    path: "/",
    element:  <ProtectedRoutes requireRestaurant={true}>
      <DashboardLayout />
    </ProtectedRoutes>,
    children: [
      { index: true, element: <Dashboard /> }, // default route
      { path: "dashboard", element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "orders/kot", element: <KOT /> },
      { path: "tables", element: <Tables /> },

      // Menus
      { path: "menus", element: <MenuList /> },
      { path: "menus/items", element: <MenuItemsList /> },
      { path: "menus/categories", element: <CategoryList /> },

      // Others
      { path: "staff", element: <Staff /> },
      { path: "customers", element: <Customers /> },
      { path: "payments", element: <Payments /> },
      { path: "payments/paymentdue", element: <PaymentDue /> },
      { path: "pos", element: <POS /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={allPageRouter} />
    </div>
  );
}

export default App;
