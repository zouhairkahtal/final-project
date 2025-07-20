import { useEffect, useState } from "react";
import axios from "axios";

type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  month: string;
};

export function RemoveBudgets() {
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
      await axios.delete(`http://localhost:3000/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
      setError("Failed to delete budget");
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
      // نضيف expense جديد عادي، باش backend يحسب spent تلقائياً
      await axios.post(
        "http://localhost:3000/api/expenses",
        {
          amount: spentValue,
          description: `Expense for ${budget.category}`,
          category: budget.category,
          date: new Date().toISOString().slice(0, 10), // اليوم YYYY-MM-DD
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // نرجع نجيب الميزانيات المحدثة (بما فيها spent محسوب)
      fetchBudgets();
    } catch (err) {
      alert("Failed to add expense");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) return <p>Loading budgets...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Your Budgets</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {budgets.length === 0 ? (
        <p className="text-gray-600">No budgets found.</p>
      ) : (
        <ul className="space-y-4">
          {budgets.map((budget) => (
            <li
              key={budget.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded"
            >
              <div>
                <p className="font-semibold">{budget.category}</p>
                <p className="text-sm text-gray-600">
                  Budget: ${budget.amount.toFixed(2)} | Spent: ${budget.spent.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Month: {budget.month}</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleAddSpent(budget)}
                  className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                  title="Add Spent"
                >
                  + Spent
                </button>

                <button
                  onClick={() => handleDelete(budget.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-xl"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
