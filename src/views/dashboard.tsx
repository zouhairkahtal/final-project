//dashboard 
 
 import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const fetchDashboardData = async (): Promise<DashboardData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  const response = await axios.get("http://localhost:3000/api/analytics/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

type Budget = {
  id: string;
  userId: string;
  category: string;
  amount: number;
  month: string; // "YYYY-MM"
  spent: number;
  createdAt: string;
  updatedAt: string;
};

type DashboardData = {
  totalExpenses: number;
  totalBudget: number;
  budgets: Budget[];  
};


export function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    retry: false,
  });


  if (isLoading) return <p>Loading dashboard...</p>;

  if (isError) {
    return (
      <div>
        <p>Error loading dashboard: {(error as Error).message}</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Expenses</h2>
          <p className="text-2xl text-red-500">
            ${data?.totalExpenses?.toFixed(2) ?? "0.00"}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Budget</h2>
          <p className="text-2xl text-green-500">
            ${data?.totalBudget?.toFixed(2) ?? "0.00"}
          </p>
        </div>
      </div>

      

     

     
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Budgets</h2>
        {data?.budgets && data.budgets.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Month</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Spent</th>
                <th className="py-2 px-4">What's left</th>
              </tr>
            </thead>
            <tbody>
              {data.budgets.map((budget) => (
                <tr key={budget.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{budget.category}</td>
                  <td className="py-2 px-4">{budget.month}</td>
                  <td className="py-2 px-4">${budget.amount.toFixed(2)}</td>
                  <td className="py-2 px-4">${budget.spent.toFixed(2)}</td>
                  <td className="py-2 px-4">${budget.amount-budget.spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No budget data available.</p>
        )}
      </div>
    </div>
  );
}

