import React, { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard';
import Charts from './pages/Charts';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Expenses from './pages/Expenses';
import Income from './pages/Income';


const App = () => {
  const [income, setIncome] = useState([]);
const [expense, setExpense] = useState([]);

  
  return (
    <div>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Dashboard income={income} expense={expense} />} />
        <Route path='/charts' element={<Charts />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/budget' element={<Budget income={income} expense={expense}/>} />
        <Route path='/expenses' element={<Expenses expense={expense} setExpense={setExpense} />} />
        <Route path='/income' element={<Income income={income} setIncome={setIncome} />} />
      </Routes>
    </div>
  )
}

export default App