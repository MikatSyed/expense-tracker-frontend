'use client'

import { useState } from 'react'
import ExpenseForm from '@/components/ExpenseForm'
import SpendingLimitSetup from '@/components/SpendingLimitSetup'

export default function Main() {
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isLimitsUpdated, setIsLimitsUpdated] = useState(false);

  const handleOpenModal = () => {
    setIsLimitModalOpen(true)
  }


  const handleCloseModal = () => {
    setIsLimitModalOpen(false)
  }


  const handleLimitsUpdated = () => {
    setIsLimitsUpdated(true) 
    setIsLimitModalOpen(false) 
  }

  return (
    <main className="container">
   

      
      {!isLimitsUpdated && (
        <button onClick={handleOpenModal} className="btn-set-limit">
          SET YOUR LIMIT
        </button>
      )}

 
      {isLimitModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <SpendingLimitSetup onClose={handleCloseModal} onLimitsUpdated={handleLimitsUpdated} />
          </div>
        </div>
      )}

    
    

    </main>
  )
}
