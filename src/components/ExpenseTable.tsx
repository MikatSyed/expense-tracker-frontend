"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  deleteExpenseAsync,
  fetchExpenses,
  updateExpenseAsync,
} from "@/redux/expenseSlice";
import { useAppDispatch } from "@/redux/hooks/useAppDispatch";
import { FiEdit, FiTrash } from "react-icons/fi"; 

const ExpenseTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses, status, error } = useSelector((state: RootState) => state.expenses);

  const [editingExpense, setEditingExpense] = useState<null | {
    _id: string;
    date: string;
    category: string;
    purpose: string;
    amount: number;
  }>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchExpenses());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <div className="loader">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="error-message">Error: {error}</div>;
  }

  function handleDelete(id: string | undefined) {
    if (id) {
      dispatch(deleteExpenseAsync(id));
    }
  }

  function handleEditSubmit() {
    if (editingExpense) {
      const { _id, ...updates } = editingExpense;
      dispatch(updateExpenseAsync({ id: _id, updates }));
      setEditingExpense(null);
    }
  }

  return (
    <div className="expense-summary">
      <h2>Expenses List</h2>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Purpose</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense: any) => (
            <tr key={expense._id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.category}</td>
              <td>{expense.purpose}</td>
              <td>${expense.amount.toFixed(2)}</td>
              <td>
                <button
                  style={{ marginRight: "10px" }}
                  onClick={() => setEditingExpense(expense)}
                >
                  <FiEdit size={16} />
                </button>
                <button onClick={() => handleDelete(expense._id)}>
                  <FiTrash size={16} /> 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
      {editingExpense && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Edit Expense</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
            >
              <label className="expense-level">
                Category:
                <input
                  type="text"
                  value={editingExpense.category}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      category: e.target.value,
                    })
                  }
                />
              </label>
              <label className="expense-label">
                Purpose:
                <input
                  type="text"
                  value={editingExpense.purpose}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      purpose: e.target.value,
                    })
                  }
                />
              </label>
             
              <label className="expense-level">
                Amount:
                <input
                  type="number"
                  value={editingExpense.amount}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingExpense(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );


};

export default ExpenseTable;
