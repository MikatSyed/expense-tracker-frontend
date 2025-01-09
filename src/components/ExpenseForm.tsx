'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addExpenseAsync } from '@/redux/expenseSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { getCategoryTotals } from '@/utility'

const categories = ['Groceries', 'Transportation', 'Healthcare', 'Utility', 'Charity', 'Miscellaneous']

export default function ExpenseForm() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [purpose, setPurpose] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const limits = useSelector((state: RootState) => state.expenses.limits)
  const { expenses } = useSelector((state: RootState) => state.expenses)

  // Calculate current totals by category
  const categoryTotals = getCategoryTotals(expenses)
  console.log(categoryTotals, 'categoryTotals')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    // Get the current total for the selected category
    const currentTotalObj = categoryTotals.find((tot) => tot.category === category)
    const currentTotal = currentTotalObj ? currentTotalObj.total : 0
    console.log(currentTotal, 'currentTotal')

    const categoryLimit = limits[category] || Infinity
    console.log(categoryLimit, 'categoryLimit')

    // Check if adding this expense exceeds the category limit
    if (numAmount + currentTotal > categoryLimit) {
      alert(
        `This expense exceeds your ${category} limit of $${categoryLimit}. \n` +
        `Current total: $${currentTotal}, trying to add: $${numAmount}`
      )
      return
    }

    // Dispatch the action to add the expense
    dispatch(
      addExpenseAsync({
        amount: numAmount,
        category,
        purpose,
        date: new Date().toISOString(),
      })
    )

    // Clear form inputs only after the expense is successfully added
    setAmount('')
    setPurpose('')
  }

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add Expense</h2>
      <div className="form-group">
        <label htmlFor="amount">Amount ($)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="purpose">Purpose</label>
        <input
          type="text"
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Expense</button>
    </form>
  )
}
