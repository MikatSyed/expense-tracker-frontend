'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLimits } from '@/redux/expenseSlice'
import { RootState } from '@/redux/store'

// List of categories
const categories = ['Groceries', 'Transportation', 'Healthcare', 'Utility', 'Charity', 'Miscellaneous']

export default function SpendingLimitSetup() {
  const dispatch = useDispatch()
  const currentLimits = useSelector((state: RootState) => state.expenses.limits)

  // Merge local state with current limits to ensure compatibility with any new categories
  const [limits, setLocalLimits] = useState<Record<string, number>>(() => {
    const initialLimits = { ...currentLimits }
    categories.forEach((category) => {
      if (!(category in initialLimits)) {
        initialLimits[category] = 0
      }
    })
    return initialLimits
  })

  const handleLimitChange = (category: string, value: string) => {
    setLocalLimits((prev) => ({
      ...prev,
      [category]: parseFloat(value) || 0, // Ensure value is numeric or defaults to 0
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLimits(limits)) // Update Redux store with new limits
    alert('Spending limits updated successfully!')
  }

  return (
    <form onSubmit={handleSubmit} className="spending-limit-form">
      <h2>Set Spending Limits</h2>
      {categories.map((category) => (
        <div key={category} className="form-group">
          <label htmlFor={`limit-${category}`}>{category} ($)</label>
          <input
            type="number"
            id={`limit-${category}`}
            value={limits[category] || ''} // Display the current limit or empty input for new categories
            onChange={(e) => handleLimitChange(category, e.target.value)}
          />
        </div>
      ))}
      <button type="submit">Update Limits</button>
    </form>
  )
}
