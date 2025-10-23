import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Menus from "./pages/Menus";
import MenuList from "./pages/menus/MenuList";
// import Tables from "./pages/Tables";
// import Reservations from "./pages/Reservations";
// import Dashboard from "./pages/Dashboard";

const allPageRouter = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />, // 👈 Common layout for all pages
    children: [
      { path: "/menus", element: <MenuList /> }, // ✅ load your MenuList here
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
