import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  month: string;
};

export function Dashboard() {
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const [spentModalId, setSpentModalId] = useState<string | null>(null);
  const [spentInput, setSpentInput] = useState("");
  const [loadingSpentId, setLoadingSpentId] = useState<string | null>(null);

  const [open, setOpen] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBudgets = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoadingDeleteId(id); 

      await axios.delete(`http://localhost:3000/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
      setError("Failed to delete budget");
    } finally {
      setLoadingDeleteId(null); 
    }
  };
  const handleAddSpent = async (budget: Budget) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const input = prompt(`Enter amount spent for ${budget.category}:`);
    if (!input) return;

    const spentValue = parseFloat(input);
    if (isNaN(spentValue) || spentValue <= 0) {
      alert("Invalid value");
      return;
    }

    try {
      setLoadingSpentId(budget.id);

      await axios.post(
        "http://localhost:3000/api/expenses",
        {
          amount: spentValue,
          description: `Expense for ${budget.category}`,
          category: budget.category,
          date: new Date().toISOString().slice(0, 10),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchBudgets();
    } catch (err) {
      alert("Failed to add expense");
    } finally {
      setLoadingSpentId(null);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) return (
    <div className="w-full h-full  flex items-center justify-center ">
<svg fill="#000000FF"  className="w-32 animate-spin" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><circle cx="12" cy="2.5" r="1.5"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></circle></svg>
  </div>
  )

  return (
    <div className="max-w-7xl w-full  p-8  rounded-lg  bg-white bg-opacity-95 shadow-2xl   ">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <h2 className="text-2xl font-bold mb-4">Budget</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {budgets.length === 0 ? (
        <p className="text-gray-600">No budgets found.</p>
      ) : (
       

        <table className="w-full text-left border-collapse border">
          <thead className="bg-white">
            <tr className="border-b">
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Month</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Spent</th>
              <th className="py-2 px-4">What's left</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget.id} className="border-b bg-white hover:bg-gray-100">
                <td className="py-2 px-4">{budget.category}</td>
                <td className="py-2 px-4">{budget.month}</td>
                <td className="py-2 px-4">${budget.amount.toFixed(2)}</td>
                <td className="py-2 px-4 ">
                  ${budget.spent.toFixed(2)}
                  
                </td>
                <td className="py-2 px-4">
                  ${budget.amount - budget.spent}
                  
                  
                </td>
                <td className="py-2 px-4 ">
                  <button
                    onClick={() => setSpentModalId(budget.id)}
                    className="text-black hover:text-white  hover:bg-black font-bold text-lg ml-1 px-2"
                    title="Add Spent"
                  >
                    +
                  </button>
                  <Dialog
                    open={spentModalId === budget.id}
                    onClose={() => setSpentModalId(null)}
                    className="relative z-10"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:size-10">
                                <span className="text-black text-xl font-bold">
                                  +
                                </span>
                              </div>
                              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <DialogTitle
                                  as="h3"
                                  className="text-base font-semibold text-gray-900"
                                >
                                  Add Spent to {budget.category}
                                </DialogTitle>
                                <div className="mt-2">
                                  <input
                                    type="number"
                                    placeholder="Enter spent amount"
                                    className="w-full mt-2 border px-3 py-2 rounded"
                                    value={spentInput}
                                    onChange={(e) =>
                                      setSpentInput(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="button"
                              disabled={loadingSpentId === budget.id}
                              onClick={async () => {
                                const value = parseFloat(spentInput);
                                if (isNaN(value) || value <= 0) {
                                  alert("Please enter a valid amount");
                                  return;
                                }

                                const token = localStorage.getItem("token");
                                if (!token) return;

                                try {
                                  setLoadingSpentId(budget.id);
                                  await axios.post(
                                    "http://localhost:3000/api/expenses",
                                    {
                                      amount: value,
                                      description: `Expense for ${budget.category}`,
                                      category: budget.category,
                                      date: new Date()
                                        .toISOString()
                                        .slice(0, 10),
                                    },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );

                                  await fetchBudgets();
                                  setSpentModalId(null);
                                  setSpentInput("");
                                } catch (err) {
                                  alert("Failed to add expense");
                                } finally {
                                  setLoadingSpentId(null);
                                }
                              }}
                              className="inline-flex w-full justify-center   bg-black text-white py-2 rounded-md hover:border-solid hover:border-2 hover:border-black hover:bg-white hover:text-black transition   px-3 text-sm font-semibold  shadow-xs  sm:ml-3 sm:w-auto"
                            >
                              {loadingSpentId === budget.id ? (
                                <div className="h-4 w-4 border-2 border-white hover:border-black  border-t-transparent rounded-full animate-spin" />
                              ) : (
                                "Confirm"
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSpentModalId(null);
                                setSpentInput("");
                              }}
                              className="inline-flex w-full justify-center    bg-white text-black py-2 rounded-md border-solid border-2 border-black hover:bg-black hover:text-white transition   px-3 text-sm font-semibold  shadow-xs  sm:ml-3 sm:w-auto"
                            >
                              Cancel
                            </button>
                          </div>
                        </DialogPanel>
                      </div>
                    </div>
                  </Dialog>
                  

                    
                  <button
                    onClick={() => setOpen(budget.id)}
                    className="text-black hover:text-white hover:bg-black  font-bold text-xl ml-1 px-2"
                    title="Delete"
                  >
                    ×
                  </button>
                  <Dialog
                    open={open === budget.id}
                    onClose={() => setOpen(null)}
                    className="relative z-10"
                  >
                    <DialogBackdrop
                      transition
                      className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                    />

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                          transition
                          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:size-10">
                                <ExclamationTriangleIcon
                                  aria-hidden="true"
                                  className="size-6 text-black"
                                />
                              </div>
                              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <DialogTitle
                                  as="h3"
                                  className="text-base font-semibold text-gray-900"
                                >
                                  Delete budget
                                </DialogTitle>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                    Are you sure you want to delet your budget?
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="button"
                              onClick={async () => {
                                await handleDelete(budget.id);
                                setOpen(null);
                              }}
                              className="inline-flex w-full justify-center   bg-black text-white py-2 rounded-md hover:border-solid hover:border-2 hover:border-black hover:bg-white hover:text-black transition   px-3 text-sm font-semibold  shadow-xs  sm:ml-3 sm:w-auto"
                            >
                              {loadingDeleteId === budget.id ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setOpen(null)}
                              className="inline-flex w-full justify-center    bg-white text-black py-2 rounded-md border-solid border-2 border-black hover:bg-black hover:text-white transition   px-3 text-sm font-semibold  shadow-xs  sm:ml-3 sm:w-auto"
                            >
                              Cancel
                            </button>
                          </div>
                        </DialogPanel>
                      </div>
                    </div>
                  </Dialog>
                  
                  </td>
              </tr>

            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
