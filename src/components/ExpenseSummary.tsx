'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { fetchExpenses, addExpenseAsync } from '@/redux/expenseSlice'

export default function ExpenseSummary() {
  const dispatch = useDispatch<AppDispatch>()
  const { expenses, error, status } = useSelector((state: RootState) => state.expenses)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenses())
    }
  }, [dispatch, status])

  const handleAddExpense = () => {
    // Example of adding a new expense
    const newExpense = {
      amount: 150,
      category: 'Entertainment',
      purpose: 'Movie night',
      date: new Date().toISOString(),
    }
    dispatch(addExpenseAsync(newExpense))
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  // Group expenses by date and then by category
  const groupedByDate = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = {}
    }
    if (!acc[date][expense.category]) {
      acc[date][expense.category] = { total: 0, items: [] }
    }
    acc[date][expense.category].total += expense.amount
    acc[date][expense.category].items.push(expense)
    return acc
  }, {} as Record<string, Record<string, { total: number; items: typeof expenses }>>)

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>
      <button onClick={handleAddExpense}>Add Example Expense</button>
      {Object.entries(groupedByDate).map(([date, categories]) => (
        <div key={date} className="day-summary">
          <h3>{date}</h3>
          {Object.entries(categories).map(([category, data]) => (
            <div key={category} className="category-summary">
              <h4>{category}</h4>
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Amount ($)</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((expense, index) => (
                    <tr key={index}>
                      <td>{expense.amount}</td>
                      <td title={expense.purpose}>{expense.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="category-total">
                <strong>Total for {category}: ${data.total}</strong>
              </div>
            </div>
          ))}
          <div className="day-total">
            <strong>
              Daily Total: $
              {Object.values(categories).reduce((sum, categoryData) => sum + categoryData.total, 0)}
            </strong>
          </div>
        </div>
      ))}
    </div>
  )
}
