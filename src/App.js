import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Bank from './components/Bank/Bank';
import Users from './components/Users/Users';
import UploadCsv from './components/UploadCsv/UploadCsv';
import Categories from './components/Categories/Categories';
import Transactions from './components/Transactions/Transactions';
import Dropdown from './components/Dropdown/Dropdown';

function App() {
    return (
        <Router>
            <div className="App">
                <Dropdown /> {/* Include the dropdown navigation */}
                <Routes>
                    <Route path="/banks" element={<Bank />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/upload-csv" element={<UploadCsv />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/" element={<h2>Welcome to the Banking App</h2>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
