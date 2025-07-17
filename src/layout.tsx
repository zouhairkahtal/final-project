import { Outlet } from "react-router-dom";
import { Nav } from "./components/Nav";

export function Layout() {
  return (
    <div>
      <div >
        <Nav/>
        <Outlet />
      </div>
    </div>
  );
}
