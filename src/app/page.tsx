
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseSummary from '@/components/ExpenseSummary'
import SpendingLimitSetup from '@/components/SpendingLimitSetup'

export default function Home() {
  return (
    <main className="container">
      <h1>Expense Tracker</h1>
      <SpendingLimitSetup />
      <ExpenseForm />
      <ExpenseSummary />
    </main>
  )
}

