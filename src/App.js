import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BankPage from './components/BankPage';
import UsersPage from './components/UsersPage';
import UploadCsvPage from './components/UploadCsvPage';
import CategoriesPage from './components/CategoriesPage';
import TransactionsPage from './components/TransactionsPage';

function App() {
    return (
        <Router>
            <div className="App">
                <h1>Banking App</h1>
                <Routes>
                    <Route path="/banks" element={<BankPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/upload-csv" element={<UploadCsvPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/" element={<h2>Welcome to the Banking App</h2>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
