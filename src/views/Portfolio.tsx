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

export function Portfolio() {
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
  return (
    <>
      <div className="w-full h-full bg-fuchsia-200 flex items-center justify-center">
        <div className="bg-white w-[40rem] h-[25rem] rounded-xl ">
          <div className="w-full h-40  flex items-center justify-center">
            <h1 className=" text-3xl font-semibold text-fuchsia-900">
              User Info
            </h1>
          </div>
          <div className="w-96 px-10 flex mb-4 ">
            <h2 className="mr-2 text-xl font-semibold text-fuchsia-950 ">First Name :</h2>
            <h1 className="text-xl  text-blue-950">{data?.firstName}</h1>
          </div>
          <div className="w-96 px-10 flex mb-4 ">
            <h2 className="mr-2 text-xl font-semibold text-fuchsia-950 ">Last Name :</h2>
            <h1 className="text-xl  text-blue-950">{data?.lastName}</h1>
          </div>
          <div className="w-96 px-10 flex mb-4 ">
            <h2 className="mr-2 text-xl font-semibold text-fuchsia-950 ">Email :</h2>
            <h1 className="text-xl  text-blue-950">{data?.email}</h1>
          </div>

<div className=" w-full flex justify-end px-20">

         <button className=" px-8 py-2 rounded-xl bg-fuchsia-900 text-white font-medium tracking-widest	hover:bg-fuchsia-800 ">
            edit        
         </button>
</div>
          
        </div>
      </div>
    </>
  );
}
