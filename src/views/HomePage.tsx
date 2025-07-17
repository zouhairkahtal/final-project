import { NavLink } from "react-router-dom";

export function HomePage() {
  return (
    <div className=" w-screen h-screen bg-Purple200 flex items-center justify-center">
      <div className="w-contactUsdevWidth h-contactUsdevHeight flex bg-white rounded-3xl p-5 ">
           <NavLink
              to={"/dashboard"}
             >
        <button>
            Home page
            </button>
            </NavLink>
      </div>
    </div>
  );
}
