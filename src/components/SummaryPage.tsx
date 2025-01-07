"use client";

import React from "react";

// Define types for expenses and data
interface Expense {
  amount: number;
  purpose: string;
}

interface ExpenseData {
  date: string;
  expenses: Record<string, Expense>;
  total: number;
}

// Example data
const exampleData: ExpenseData[] = [
  {
    date: "2025-01-05",
    expenses: {
      Groceries: { amount: 50, purpose: "Weekly groceries" },
      Transportation: { amount: 20, purpose: "Bus tickets" },
      Healthcare: { amount: 30, purpose: "Pharmacy visit" },
      Utility: { amount: 40, purpose: "Electric bill" },
      Charity: { amount: 10, purpose: "Donation" },
      Miscellaneous: { amount: 15, purpose: "Snacks" },
    },
    total: 165,
  },
  {
    date: "2025-01-06",
    expenses: {
      Groceries: { amount: 70, purpose: "Dinner ingredients" },
      Transportation: { amount: 10, purpose: "Cab ride" },
      Healthcare: { amount: 0, purpose: "" },
      Utility: { amount: 0, purpose: "" },
      Charity: { amount: 5, purpose: "Charity event" },
      Miscellaneous: { amount: 25, purpose: "Movie snacks" },
    },
    total: 110,
  },
];

const SummaryPage: React.FC = () => {
  return (
    <div className="summary-container">
      <h2>Expense Summary</h2>
      <div className="table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Groceries</th>
              <th>Transportation</th>
              <th>Healthcare</th>
              <th>Utility</th>
              <th>Charity</th>
              <th>Miscellaneous</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {exampleData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                {Object.keys(entry.expenses).map((category) => (
                  <td
                    key={category}
                    title={entry.expenses[category].purpose || "No details available"}
                  >
                    {entry.expenses[category].amount > 0
                      ? `$${entry.expenses[category].amount}`
                      : "-"}
                  </td>
                ))}
                <td>${entry.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryPage;
