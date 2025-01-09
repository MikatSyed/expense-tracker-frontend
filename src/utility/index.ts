import { Expense } from "@/redux/expenseSlice"

export interface CategoryTotal {
  category: string
  total: number
}

export const getCategoryTotals = (expenses: Expense[]): CategoryTotal[] => {
  const totals = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0
    }
    acc[expense.category] += expense.amount
    return acc
  }, {} as Record<string, number>)

  // Convert to an array of { category, total }
  return Object.entries(totals).map(([category, total]) => ({
    category,
    total,
  }))
}
