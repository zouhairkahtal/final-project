import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BudgetForm() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(""); // format YYYY-MM
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in");
      setIsSubmitting(false);
      return;
    }

    if (!category || !amount || !month) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/budgets",
        {
          category,
          amount: parseFloat(amount),
          month,
          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add budget");

      console.log(category,month)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

      <div className="w-full h-full flex items-center justify-center ">

  


    <div className="w-[400px] bg-white rounded-3xl p-8 shadow-lg ">
      <h1 className="text-2xl font-bold mb-6">Add New Budget</h1>

      {error && (
        <p className="mb-4 text-red-600 font-semibold">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Category
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Food, Rent, etc."
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label>
          Amount ($)
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label>
          Month
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded-md  hover:border-solid hover:border-2 hover:border-black hover:bg-white hover:text-black  transition duration-300"
        >
          {isSubmitting ? "Adding..." : "Add Budget"}
        </button>
      </form>
    </div>
        </div>
  );
}
