'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { setLimits } from '@/redux/expenseSlice'
import { RootState } from '@/redux/store'

const categories = ['Groceries', 'Transportation', 'Healthcare', 'Utility', 'Charity', 'Miscellaneous']

export default function SpendingLimitSetup({ onClose, onLimitsUpdated }: { onClose: () => void, onLimitsUpdated: () => void }) {
  const dispatch = useDispatch()
  const currentLimits = useSelector((state: RootState) => state.expenses.limits)

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
      [category]: parseFloat(value) || 0,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setLimits(limits))
    onLimitsUpdated()
    onClose()
  }

  return (
    <>
    
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Set Your Spending Limits</h2>
          <button onClick={onClose} className="btn-close">X</button>
        </div>

        <form onSubmit={handleSubmit} className="spending-limit-form">
          {categories.map((category) => (
            <div key={category} className="form-group">
              <label htmlFor={`limit-${category}`} className="form-label">{category} ($)</label>
              <input
                type="number"
                id={`limit-${category}`}
                value={limits[category] || ''}
                onChange={(e) => handleLimitChange(category, e.target.value)}
                className="form-input"
              />
            </div>
          ))}

          <div className="modal-actions">
            <button type="submit" className="btn-save">Save Limits</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
