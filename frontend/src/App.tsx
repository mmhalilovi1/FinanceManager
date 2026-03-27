import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type ExpenseType = 'INCOME' | 'EXPENSE'

type Category = {
  name: string
  tag: string
}

type Expense = {
  title: string
  description?: string
  amount: number
  date: string
  type: ExpenseType
}

type Budget = {
  limit_amount: number
  month: number
  year: number
}

type MonthlyStat = {
  month: string
  amount: number
  categories: Array<{ category: Category }>
}

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string>('')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [stats, setStats] = useState<MonthlyStat[]>([])

  const [newExpense, setNewExpense] = useState({
    title: '',
    description: '',
    amount: '' as unknown as number,
    date: new Date().toISOString().slice(0, 10),
    type: 'EXPENSE' as ExpenseType,
    category: '',
  })

  const [newBudget, setNewBudget] = useState({
    limit_amount: '' as unknown as number,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  const headers = useMemo(() => {
    const result: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      result.Authorization = `Bearer ${token}`
    }
    return result
  }, [token])

  const api = async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> | undefined),
      },
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(body || `${res.status} ${res.statusText}`)
    }
    return res.json().catch(() => null)
  }

  const showMessage = (text: string, durationMs = 4000) => {
    setMessage(text)
    setTimeout(() => setMessage(null), durationMs)
  }

  const loadData = async () => {
    if (!token) return
    try {
      const [cat, exp, bud, stat] = await Promise.all([
        api('/categories'),
        api('/expense'),
        api('/budget'),
        api('/stats/monthly'),
      ])
      setCategories(cat)
      setExpenses(exp)
      setBudgets(bud)
      setStats(stat)
    } catch (error) {
      setMessage((error as Error).message)
    }
  }

  const login = async () => {
    if (!name || !password) {
      showMessage('Please supply name and password')
      return
    }

    setLoading(true)
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          name,
          // backend expects "password_hash" (see backend DTO/controller)
          // this implementation sends raw password; backend may need verify fix.
          password_hash: password,
        }),
      })

      setToken(data.accessToken)
      setUsername(data.username)
      localStorage.setItem('finance_manager_token', data.accessToken)
      setMessage('Logged in successfully')
      setPassword('')
      await loadData()
    } catch (error) {
      showMessage(`Login failed: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const register = async () => {
    if (!name || !email || !password) {
      showMessage('Please fill name, email and password')
      return
    }

    setLoading(true)
    try {
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      showMessage('Registration successful, please login', 6000)
      setAuthMode('login')
    } catch (error) {
      showMessage(`Register failed: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUsername('')
    localStorage.removeItem('finance_manager_token')
    setExpenses([])
    setBudgets([])
    setCategories([])
    setStats([])
  }

  const addExpense = async () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.category) {
      showMessage('Enter title, amount, category and date for expense')
      return
    }

    setLoading(true)
    try {
      await api('/expense', {
        method: 'POST',
        body: JSON.stringify({
          title: newExpense.title,
          description: newExpense.description || undefined,
          amount: Number(newExpense.amount),
          date: newExpense.date,
          type: newExpense.type,
          category_id: newExpense.category,
        }),
      })
      setNewExpense({
        title: '',
        description: '',
        amount: 0 as unknown as number,
        date: new Date().toISOString().slice(0, 10),
        type: 'EXPENSE',
        category: '',
      })
      showMessage('Expense created')
      await loadData()
    } catch (error) {
      showMessage(`Create expense failed: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const addBudget = async () => {
    if (!newBudget.limit_amount || !newBudget.month || !newBudget.year) {
      showMessage('Need limit amount, month and year')
      return
    }

    setLoading(true)
    try {
      await api('/budget', {
        method: 'POST',
        body: JSON.stringify({
          limit_amount: Number(newBudget.limit_amount),
          month: Number(newBudget.month),
          year: Number(newBudget.year),
        }),
      })
      setNewBudget({
        limit_amount: 0 as unknown as number,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })
      showMessage('Budget created')
      await loadData()
    } catch (error) {
      showMessage(`Create budget failed: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('finance_manager_token')
    if (token) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    loadData().catch((error) => showMessage((error as Error).message))
    api('/auth/me', { method: 'GET' })
      .then((u) => setUsername(u.name || u.username || ''))
      .catch(() => {})
  }, [token])

  return (
    <div className="app">
      <header>
        <h1>Finance Manager</h1>
        {token && (
          <div className="user-bar">
            <span>Hi, {username}</span>
            <button onClick={handleLogout} className="secondary">
              Logout
            </button>
          </div>
        )}
      </header>

      {message && <div className="alert">{message}</div>}

      {token ? (
        <main>
          <section className="grid-2">
            <div className="card">
              <h2>Add Expense</h2>
              <label>
                Title
                <input
                  value={newExpense.title}
                  onChange={(e) => setNewExpense((s) => ({ ...s, title: e.target.value }))}
                  placeholder="Coffee"
                />
              </label>
              <label>
                Description
                <input
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Starbucks"
                />
              </label>
              <label>
                Amount
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((s) => ({ ...s, amount: Number(e.target.value) }))}
                />
              </label>
              <label>
                Date
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense((s) => ({ ...s, date: e.target.value }))}
                />
              </label>
              <label>
                Type
                <select
                  value={newExpense.type}
                  onChange={(e) => setNewExpense((s) => ({ ...s, type: e.target.value as ExpenseType }))}
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </label>
              <label>
                Category
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense((s) => ({ ...s, category: e.target.value }))}
                >
                  <option value="">Choose category</option>
                  {categories.map((c) => (
                    <option key={`${c.name}-${c.tag}`} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={addExpense} disabled={loading}>
                Save Expense
              </button>
            </div>

            <div className="card">
              <h2>Add Budget</h2>
              <label>
                Month
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={newBudget.month}
                  onChange={(e) => setNewBudget((s) => ({ ...s, month: Number(e.target.value) }))}
                />
              </label>
              <label>
                Year
                <input
                  type="number"
                  min={2026}
                  value={newBudget.year}
                  onChange={(e) => setNewBudget((s) => ({ ...s, year: Number(e.target.value) }))}
                />
              </label>
              <label>
                Limit Amount
                <input
                  type="number"
                  value={newBudget.limit_amount}
                  onChange={(e) => setNewBudget((s) => ({ ...s, limit_amount: Number(e.target.value) }))}
                />
              </label>
              <button onClick={addBudget} disabled={loading}>
                Save Budget
              </button>
            </div>
          </section>

          <section className="grid-3">
            <div className="card">
              <h2>Categories</h2>
              {categories.length === 0 ? (
                <p>No categories found</p>
              ) : (
                <ul>
                  {categories.map((cat) => (
                    <li key={`${cat.name}-${cat.tag}`}>{cat.name} ({cat.tag})</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card">
              <h2>Expenses</h2>
              {expenses.length === 0 ? (
                <p>No expenses yet</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, idx) => (
                      <tr key={`${expense.title}-${expense.date}-${idx}`}>
                        <td>{expense.title}</td>
                        <td>{expense.amount}</td>
                        <td>{expense.type}</td>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="card">
              <h2>Budgets</h2>
              {budgets.length === 0 ? (
                <p>No budgets yet</p>
              ) : (
                <ul>
                  {budgets.map((budget, idx) => (
                    <li key={`${budget.month}-${budget.year}-${idx}`}>
                      {budget.month}/{budget.year} - {budget.limit_amount}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="card">
            <h2>Monthly Stats</h2>
            {stats.length === 0 ? (
              <p>No statistics yet</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total</th>
                    <th>Categories</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat) => (
                    <tr key={stat.month}>
                      <td>{stat.month}</td>
                      <td>{stat.amount}</td>
                      <td>
                        {stat.categories.map((c) => c.category.name).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      ) : (
        <main className="auth-card">
          <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          {authMode === 'register' && (
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          )}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            onClick={authMode === 'login' ? login : register}
            disabled={loading}
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="switch">
            {authMode === 'login'
              ? 'Need an account?'
              : 'Already have account?'}
            <button
              className="link"
              onClick={() => {
                setMessage(null)
                setAuthMode(authMode === 'login' ? 'register' : 'login')
              }}
            >
              {authMode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </main>
      )}
    </div>
  )
}

export default App
