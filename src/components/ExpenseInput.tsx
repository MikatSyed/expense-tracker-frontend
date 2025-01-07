"use client"
import React, { useState } from 'react';


interface Expense {
    id: number;
    category: string;
    purpose: string;
    amount: number;
    date: string;
}

const ExpenseInput: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [formData, setFormData] = useState<{
        category: string;
        purpose: string;
        amount: string;
    }>({
        category: 'Groceries',
        purpose: '',
        amount: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.amount && formData.purpose) {
            const newExpense: Expense = {
                id: Date.now(),
                category: formData.category,
                purpose: formData.purpose,
                amount: parseFloat(formData.amount),
                date: new Date().toLocaleString(),
            };

            setExpenses([newExpense, ...expenses]);
            setFormData({ category: 'Groceries', purpose: '', amount: '' });
        } else {
            alert('Please enter both purpose and amount!');
        }
    };

    return (
        <div className="expense-input-container">
            <h1>Expense Tracker</h1>
            <form className="expense-form" onSubmit={handleAddExpense}>
                <label htmlFor="category">Category:</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                >
                    <option value="Groceries">Groceries</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Utility">Utility</option>
                    <option value="Charity">Charity</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>

                <label htmlFor="purpose">Purpose:</label>
                <input
                    type="text"
                    name="purpose"
                    placeholder="E.g., Groceries for the week"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit">Add Expense</button>
            </form>

            <div className="expense-list">
                <h2>Expense History</h2>
                {expenses.length > 0 ? (
                    expenses.map((expense) => (
                        <div key={expense.id} className="expense-item">
                            <p>
                                <strong>{expense.category}</strong> - {expense.purpose}
                            </p>
                            <p>${expense.amount.toFixed(2)}</p>
                            <p className="expense-date">{expense.date}</p>
                        </div>
                    ))
                ) : (
                    <p>No expenses added yet.</p>
                )}
            </div>
        </div>
    );
};

export default ExpenseInput;
