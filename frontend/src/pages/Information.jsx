import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Information = () => {
    const navigate = useNavigate();

    const [cumulativeExpenses, setCumulativeExpenses] = useState(new Array(12).fill(0))
    const [user, setUser] = useState(null);
    const [salaries, setSalaries] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // ✅ Initialize user once
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (!savedUser) {
            navigate("/login");
            return;
        }
        setUser(savedUser);
    }, [navigate]);

    // ✅ Fetch data after user is set
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch expenses
                const expRes = await fetch(`${API_URL}/expense/all`);
                const expData = await expRes.json();
                if (expData.success) setExpenses(expData.expenses);
                console.log(expData)

                const monRes = await fetch(`${API_URL}/expense/monthly`);
                const monData = await monRes.json();

                if (monData.success) {
                    monData.expenses.forEach((item) => {
                        // month in API is 1-based, subtract 1 for 0-based index
                        const monthIndex = item.month - 1;
                        cumulativeExpenses[monthIndex] = item.total_amount;
                    });

                    setCumulativeExpenses(cumulativeExpenses);
                    // cumulativeExpenses now looks like:
                    // [217800, 112100, 0, 0, 0, 0, 0, 122500, 212600, 264800, 0, 0]
                }

                // Fetch salaries
                const salRes = await fetch(`${API_URL}/salary/user/${user.id}`);
                const salData = await salRes.json();
                setSalaries(salData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Sort expenses by date (latest first)
    const sortedExpenses = useMemo(() => {
        return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [expenses]);

    const totalPages = Math.ceil(sortedExpenses.length / pageSize);
    const paginatedExpenses = sortedExpenses.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    if (loading) return <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <div className="flex space-x-2">
            <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.75s]"></span>
            <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.5s]"></span>
            <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.25s]"></span>
        </div>
    </div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Salaries Section */}
            <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Salaries by Month
                </h2>
                <ul className="space-y-3">
                    {salaries.map((sal, idx) => (
                        <li
                            key={idx}
                            className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-sm hover:shadow-md transition"
                        >
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                {new Date(sal.salary_date).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            <span className="font-semibold text-green-600 dark:text-green-400 flex gap-2">
                                ₹{sal.amount}
                                /
                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    ₹{cumulativeExpenses[idx]}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Expenses Section */}
            <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Expenses
                    </h2>

                    {/* Page Size Selector */}
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="p-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        <option value="5">5 / page</option>
                        <option value="10">10 / page</option>
                        <option value="20">20 / page</option>
                    </select>
                </div>

                {/* Expenses Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm text-left">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700">
                                <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">
                                    Date
                                </th>
                                <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">
                                    Category
                                </th>
                                <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedExpenses.map((exp, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    <td className="p-3 text-gray-700 dark:text-gray-300">
                                        {new Date(exp.expense_date).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="p-3 text-gray-700 dark:text-gray-300">
                                        {exp.category_name}
                                    </td>
                                    <td className="p-3 font-semibold text-red-500 dark:text-red-400">
                                        ₹{exp.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-gray-600 dark:text-gray-300">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Information;
