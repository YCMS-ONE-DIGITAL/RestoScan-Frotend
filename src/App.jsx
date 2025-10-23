import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Menus from "./pages/Menus";
import MenuList from "./pages/menus/MenuList";
import MenuItemsList from "./pages/menus/MenuItemList";
import CategoryList from "./pages/categories/CategoryList";
// import Tables from "./pages/Tables";
// import Reservations from "./pages/Reservations";
// import Dashboard from "./pages/Dashboard";

const allPageRouter = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />, // 👈 Common layout for all pages
    children: [
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
