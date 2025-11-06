import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Menus from "./pages/Menus";
import MenuList from "./pages/menus/MenuList";
import MenuItemsList from "./pages/menus/MenuItemList";
import CategoryList from "./pages/categories/CategoryList";
import AuthForm from "./components/layout/AuthForm";
import HomePage from "./pages/Home";
import MenuPage from "./CustomerWebsite/pages/MenuPage";
import CustomerWebsite from "./CustomerWebsite/Main"
import OrderHistory from "./CustomerWebsite/pages/OrderHistory";
import Dashboard from "./pages/dashboard";
import Tables from "./pages/Tables";
// import Tables from "./pages/Tables";
// import Reservations from "./pages/Reservations";
// import Dashboard from "./pages/Dashboard";

const allPageRouter = createBrowserRouter([
  {
    path: "/customerwebsite",
    element: <CustomerWebsite />, // 👈 no layout, standalone page
  },
  {
    path: "/customerwebsite/orderhistory",
    element: <OrderHistory />, // 👈 no layout, standalone page
  },
  {
    path: "/customerwebsite/menu",
    element: <MenuPage />,// 👈 no layout, standalone page
  },
  {
    path: "/homepage",
    element: <HomePage />, // 👈 no layout, standalone page
  },
  {
    path: "/signup",
    element: <AuthForm />, // 👈 no layout, standalone page
  },
  {
    path: "/login",
    element: <AuthForm />, // 👈 no layout, standalone page
  },
  {
    path: "/",
    element: <DashboardLayout />, // 👈 Common layout for all pages
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/tables", element: <Tables /> },
      { path: "/menus", element: <MenuList /> },
      { path: "/menus/items", element: <MenuItemsList /> },
      { path: "/menus/categories", element: <CategoryList /> },
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
