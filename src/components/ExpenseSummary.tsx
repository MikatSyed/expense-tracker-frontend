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

  // Calculate the total expenses for each category
  const categoryTotals = categories.reduce((totals, category) => {
    totals[category] = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0)
    return totals
  }, {} as Record<string, number>)

  // Calculate total daily expenses
  const dailyTotals = Object.entries(groupedByDate).map(([date, categoryData]) => {
    const total = categories.reduce((sum, category) => {
      if (categoryData[category]) {
        sum += categoryData[category].reduce((categorySum, expense) => categorySum + expense.amount, 0)
      }
      return sum
    }, 0)
    return { date, total }
  })

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
            <th>Total</th> {/* Total column */}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByDate).map(([date, categoryData]) => {
            const dailyTotal = dailyTotals.find((total) => total.date === date)?.total || 0
            return (
              <tr key={date}>
                <td>{date}</td>
                {categories.map((category) => (
                  <td key={category}>
                    {/* Instead of showing each expense, show the total sum for the category */}
                    {categoryData[category] ? (
                      <>
                        <div
                          data-tooltip-id={`tooltip-${date}-${category}`}
                          data-tooltip-content={categoryData[category]
                            .map(expense => `Purpose: ${expense.purpose}, Amount: $${expense.amount.toFixed(2)}`)
                            .join(' | ')} // Concatenate all expenses in this category with their purpose and amount
                        >
                          {/* Show total sum for each category */}
                          ${categoryData[category].reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                        </div>
                        {/* Tooltip will show all individual expenses in the category */}
                        <Tooltip id={`tooltip-${date}-${category}`} />
                      </>
                    ) : (
                      'x'
                    )}
                  </td>
                ))}
                <td>{dailyTotal.toFixed(2)}</td> {/* Display total for the day */}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            {categories.map((category) => (
              <td key={category}>
                <strong>{categoryTotals[category] ? categoryTotals[category].toFixed(2) : '-'}</strong>
              </td>
            ))}
            <td>
              <strong>
                {dailyTotals.reduce((sum, { total }) => sum + total, 0).toFixed(2)}
              </strong>
            </td> 
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
