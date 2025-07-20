import { Outlet } from "react-router-dom";
import { Nav } from "./components/Nav";

export function Layout() {
  return (
    <div className="h-screen flex flex-col">

      <header className="h-16">
        <Nav />
      </header>

 
      <main className="flex-1 overflow-auto ">
        <Outlet />
      </main>
    </div>
  );
}
