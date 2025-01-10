'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import { fetchExpenses } from '@/redux/expenseSlice'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const categories = ['Groceries', 'Transportation', 'Healthcare', 'Utility', 'Charity', 'Miscellaneous']

export default function ExpenseSummary() {
  const dispatch = useDispatch<AppDispatch>()
  const { expenses, error, status } = useSelector((state: RootState) => state.expenses)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenses())
    }
  }, [dispatch, status])

  if (error) {
    return <div>Error: {error}</div>
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  // Group expenses by date
  const groupedByDate = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = {}
    }
    if (!acc[date][expense.category]) {
      acc[date][expense.category] = []
    }
    acc[date][expense.category].push(expense)
    return acc
  }, {} as Record<string, Record<string, { amount: number; purpose: string }[]>>)

  // Calculate category totals
  const categoryTotals = categories.reduce((totals, category) => {
    totals[category] = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0)
    return totals
  }, {} as Record<string, number>)

  return (
    <div className="expense-summary">
      <h2>Expense Summary</h2>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            {categories.map((category) => (
              <th key={category}>{category}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByDate).map(([date, categoryData]) => (
            <tr key={date}>
              <td>{date}</td>
              {categories.map((category) => (
                <td key={category}>
                  {categoryData[category] ? (
                    categoryData[category].map((expense, idx) => (
                      <div
                        key={idx}
                        data-tooltip-id={`tooltip-${date}-${category}-${idx}`}
                        data-tooltip-content={`Purpose: ${expense.purpose}, Amount: $${expense.amount.toFixed(2)}`}
                      >
                        ${expense.amount.toFixed(2)}
                        <Tooltip id={`tooltip-${date}-${category}-${idx}`} />
                      </div>
                    ))
                  ) : (
                    'x'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            {categories.map((category) => (
              <td key={category}>
                <strong>{categoryTotals[category] || '-'}</strong>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
