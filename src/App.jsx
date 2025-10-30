import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Menus from "./pages/Menus";
import MenuList from "./pages/menus/MenuList";
import MenuItemsList from "./pages/menus/MenuItemList";
import CategoryList from "./pages/categories/CategoryList";
import AuthForm  from "./components/layout/AuthForm";
import HomePage from "./pages/Home";
// import Tables from "./pages/Tables";
// import Reservations from "./pages/Reservations";
// import Dashboard from "./pages/Dashboard";

const allPageRouter = createBrowserRouter([
   {
    path: "/",
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
    path: "/admin",
    element: <DashboardLayout />, // 👈 Common layout for all pages
    children: [
      { path: "admin/menus", element: <MenuList /> }, 
      { path: "admin/menus/items", element: <MenuItemsList /> },
      { path: "admin/menus/categories", element: <CategoryList /> },
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
