"use client";

import React, { useState } from "react";
import ExpenseInput from "./ExpenseInput";
import SpendingLimitModal from "./SpendingLimitModal";
import SummaryPage from "./SummaryPage";

const Home = () => {
  const [showModal, setShowModal] = useState(false); 
  const [limitsSet, setLimitsSet] = useState(false); 

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLimitsSaved = () => {
    setShowModal(false); 
    setLimitsSet(true); 
  };

  return (
    <div>
   
      {limitsSet && <><ExpenseInput />
        <SummaryPage/>
      </>}
      
      <div className="container">
       
        {!limitsSet && (
          <button onClick={() => setShowModal(true)}>SET YOUR LIMIT</button>
        )}
      </div>

      {/* Show modal if the user clicks the button */}
      {showModal && (
        <SpendingLimitModal
          onClose={handleCloseModal}
          onSave={handleLimitsSaved}
        />
      )}
    </div>
  );
};

export default Home;
