import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useQuery } from "@tanstack/react-query";
type profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "transparent",

  p: 4,
};

export function Nav(): JSX.Element {
  const token = localStorage.getItem("token");
  const { data } = useQuery<profile>({
    queryKey: ["user"],
    queryFn: () =>
      fetch("http://localhost:3000/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleOpen = (): void => setIsModalOpen(true);
  const handleClose = (): void => setIsModalOpen(false);

  return (
    <Disclosure as="nav" className="bg-purple-700 text-white shadow">
      {({ open }: { open: boolean }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-white">
                  MyApp
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden sm:flex space-x-6">
                <Link
                  to="/dashboard"
                  className="hover:text-purple-200 transition"
                >
                  Dashboard
                </Link>
                <Link to="/BudgetForm" className="hover:text-purple-300">
                  Add Budget
                </Link>
                <button onClick={handleOpen} className="hover:text-purple-300">
                  Portfolio
                </button>

                <Modal
                  open={isModalOpen}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      className="bg-white w-[40rem] h-[25rem] rounded-xl "
                      id="modal-modal-description"
                      sx={{ mt: 2 }}
                    >
                      <div className="w-full h-40  flex items-center justify-center">
                        <h1 className=" text-3xl font-semibold text-fuchsia-900">
                          User Info
                        </h1>
                      </div>
                      <div className="w-96 px-10 flex mb-4 ">
                        <h2 className="mr-2 text-xl font-semibold text-fuchsia-950 ">
                          First Name :
                        </h2>
                        <h1 className="text-xl  text-blue-950">
                          {data?.firstName}
                        </h1>
                      </div>
                      <div className="w-96 px-10 flex mb-4 ">
                        <h2 className="mr-2 text-xl font-semibold text-fuchsia-950 ">
                          Last Name :
                        </h2>
                        <h1 className="text-xl  text-blue-950">
                          {data?.lastName}
                        </h1>
                      </div>
                      <div className="w-96 px-10 flex mb-4 ">
                        <h2 className="mr-2 text-xl font-semibold text-fuchsia-950 ">
                          Email :
                        </h2>
                        <h1 className="text-xl  text-blue-950">
                          {data?.email}
                        </h1>
                      </div>

                      <div className=" w-full flex justify-end px-20">
                        <button className=" px-8 py-2 rounded-xl bg-fuchsia-900 text-white font-medium tracking-widest	hover:bg-fuchsia-800 ">
                          edit
                        </button>
                      </div>
                    </Typography>
                  </Box>
                </Modal>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-white hover:text-purple-300">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Content */}
          <Disclosure.Panel className="sm:hidden px-4 pb-4">
            <div className="flex flex-col space-y-2">
              <Link to="/dashboard" className="hover:text-purple-300">
                Dashboard
              </Link>
              <Link to="/BudgetForm" className="hover:text-purple-300">
                Budget Form
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
