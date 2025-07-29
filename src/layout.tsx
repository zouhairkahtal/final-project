import { Outlet } from "react-router-dom";
import { Nav } from "./components/Nav";

export function Layout() {
  return (
    <div className="h-screen flex flex-col">

      <header className="h-16 mt-5">
        <Nav />
      </header>

 
      <main className="flex-1 overflow-auto  flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
