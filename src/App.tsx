import { Layout } from "../src/layout";
import { LogIn } from "../src/views/LogIn";
import { Dashboard } from "../src/views/dashboard";
import { SingUP } from "./views/SingUP";
import { HomePage } from "../src/views/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,

} from '@tanstack/react-query'


const queryClient=  new QueryClient();
function App() {
  const router = createBrowserRouter([
    {
      path: "/",

      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "HomePage",
          element: <HomePage />,
        },
        {
          path: "LogIn",
          element: <LogIn />,
        },
        {
          path: "SingUP",
          element: <SingUP />,
        },
        {
          path: "Dashboard",
          element: <Dashboard />,
        },
        {
          path: "*",
          element: (
            <h1 className="text-center text-2xl text-red-600">
              404 - Page Not Found
            </h1>
          ),
        },
 
      ],
    },
  ]);
  return(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
 


}

export default App;
