import React, { useState, ChangeEvent } from "react";

interface SpendingLimits {
  Groceries: number;
  Transportation: number;
  Healthcare: number;
  Utility: number;
  Charity: number;
  Miscellaneous: number;
}

interface SpendingLimitModalProps {
  onClose: () => void;
  onSave: () => void; // Notify parent when limits are saved
}

const SpendingLimitModal: React.FC<SpendingLimitModalProps> = ({
  onClose,
  onSave,
}) => {
  const [limits, setLimits] = useState<SpendingLimits>({
    Groceries: 200,
    Transportation: 50,
    Healthcare: 100,
    Utility: 150,
    Charity: 50,
    Miscellaneous: 100,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Spending limits saved:", limits);
    onSave(); // Notify parent that limits are saved
    onClose(); // Close modal
  };

  const handleChange = (category: keyof SpendingLimits, value: string) => {
    setLimits({ ...limits, [category]: parseFloat(value) || 0 });
  };

  return (
    <div className="modal">
      <h2>Set Monthly Spending Limits</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(limits).map((category) => (
          <div key={category}>
            <label>
              {category}:
              <input
                type="number"
                value={limits[category as keyof SpendingLimits]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(category as keyof SpendingLimits, e.target.value)
                }
                required
              />
            </label>
          </div>
        ))}
        <button type="submit">Save Limits</button>
      </form>
    </div>
  );
};

export default SpendingLimitModal;
