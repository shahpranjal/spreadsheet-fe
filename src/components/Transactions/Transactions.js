import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import './Transactions.css';
import '../styles/common.css';
import BasicModal from './BasicModal';
import MoreModal from './MoreModal';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banks, setBanks] = useState([]);
    const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        description: '',
        category: '',
        status: '',
        user: ''
    });

    useEffect(() => {
        fetchTransactions();
        fetchUsers();
        fetchCategories();
        fetchBanks();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                goToPreviousTransaction();
            } else if (e.key === 'ArrowRight') {
                goToNextTransaction();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedTransaction]);

    useEffect(() => {
        filterTransactions();
    }, [filters, transactions]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${config.transactionUrl}`);
            setTransactions(response.data);
            setFilteredTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${config.usersUrl}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${config.categoriesUrl}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBanks = async () => {
        try {
            const response = await axios.get(`${config.banksUrl}`);
            setBanks(response.data);
        } catch (error) {
            console.error('Error fetching banks:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedTransaction({
            ...selectedTransaction,
            [name]: value
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const updateTransaction = async () => {
        try {
            const response = await axios.put(`${config.transactionUrl}/${selectedTransaction.id}`, selectedTransaction);
            const updatedTransaction = response.data.transaction;

            setTransactions(transactions.map(t =>
                t.id === updatedTransaction.id ? updatedTransaction : t
            ));
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const openBasicModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsBasicModalOpen(true);
    };

    const closeBasicModal = () => {
        setIsBasicModalOpen(false);
        setSelectedTransaction(null);
    };

    const openMoreModal = () => {
        setIsBasicModalOpen(false);
        setIsMoreModalOpen(true);
    };

    const closeMoreModal = () => {
        setIsMoreModalOpen(false);
        setSelectedTransaction(null);
    };

    const openBasicModalFromMore = () => {
        setIsMoreModalOpen(false);
        setIsBasicModalOpen(true);
    };

    const calculateAmount = (transaction) => {
        return transaction.debit - transaction.credit;
    };

    const goToPreviousTransaction = async () => {
        const currentIndex = transactions.findIndex(t => t.id === selectedTransaction.id);
        if (currentIndex > 0) {
            if (hasTransactionChanged()) {
                await updateTransaction();
            }
            closeMoreModal();
            openBasicModal(transactions[currentIndex - 1]);
        }
    };

    const goToNextTransaction = async () => {
        const currentIndex = transactions.findIndex(t => t.id === selectedTransaction.id);
        if (hasTransactionChanged()) {
            await updateTransaction();
        }
        closeMoreModal();
        if (currentIndex < transactions.length - 1) {
            openBasicModal(transactions[currentIndex + 1]);
        } else {
            closeBasicModal();
        }
    };

    const hasTransactionChanged = () => {
        const originalTransaction = transactions.find(t => t.id === selectedTransaction.id);
        return JSON.stringify(originalTransaction) !== JSON.stringify(selectedTransaction);
    };

    const filterTransactions = () => {
        let filtered = transactions;

        if (filters.dateStart) {
            filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(filters.dateStart));
        }

        if (filters.dateEnd) {
            filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(filters.dateEnd));
        }

        if (filters.description) {
            filtered = filtered.filter(transaction => transaction.description.toLowerCase().includes(filters.description.toLowerCase()));
        }

        if (filters.category) {
            filtered = filtered.filter(transaction => transaction.category_id === parseInt(filters.category));
        }

        if (filters.status) {
            filtered = filtered.filter(transaction => transaction.status === filters.status);
        }

        if (filters.user) {
            filtered = filtered.filter(transaction => transaction.user_id === parseInt(filters.user));
        }

        setFilteredTransactions(filtered);
    };

    return (
        <div className="transactions-page">
            <h2>Transactions</h2>

            <div className="filters">
                <input
                    type="date"
                    name="dateStart"
                    value={filters.dateStart}
                    onChange={handleFilterChange}
                    placeholder="Date Start"
                />
                <input
                    type="date"
                    name="dateEnd"
                    value={filters.dateEnd}
                    onChange={handleFilterChange}
                    placeholder="Date End"
                />
                <input
                    type="text"
                    name="description"
                    value={filters.description}
                    onChange={handleFilterChange}
                    placeholder="Description"
                />
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processed">Processed</option>
                    <option value="skip">Skip</option>
                </select>
                <select
                    name="user"
                    value={filters.user}
                    onChange={handleFilterChange}
                >
                    <option value="">All Users</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            <table className="transactions-table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>User</th>
                </tr>
                </thead>
                <tbody>
                {filteredTransactions.map(transaction => (
                    <tr key={transaction.id} onClick={() => openBasicModal(transaction)}>
                        <td>{transaction.date}</td>
                        <td>{transaction.description}</td>
                        <td>{calculateAmount(transaction)}</td>
                        <td>
                            <span>{categories.find(category => category.id === transaction.category_id)?.name || '-'}</span>
                        </td>
                        <td>
                                <span>
                                    {transaction.status
                                        ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
                                        : 'Pending'}
                                </span>
                        </td>
                        <td>{users.find(user => user.id === transaction.user_id)?.name || 'Unknown User'}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <BasicModal
                isOpen={isBasicModalOpen}
                onRequestClose={closeBasicModal}
                transaction={selectedTransaction}
                categories={categories}
                handleInputChange={handleInputChange}
                openMoreModal={openMoreModal}
                calculateAmount={calculateAmount}
                goToPreviousTransaction={goToPreviousTransaction}
                goToNextTransaction={goToNextTransaction}
                isFirstTransaction={transactions[0]?.id === selectedTransaction?.id}
                isLastTransaction={transactions[transactions.length - 1]?.id === selectedTransaction?.id}
            />

            <MoreModal
                isOpen={isMoreModalOpen}
                onRequestClose={closeMoreModal}
                transaction={selectedTransaction}
                users={users}
                banks={banks}
                categories={categories}
                handleInputChange={handleInputChange}
                onHide={openBasicModalFromMore}
                goToPreviousTransaction={goToPreviousTransaction}
                goToNextTransaction={goToNextTransaction}
                isFirstTransaction={transactions[0]?.id === selectedTransaction?.id}
                isLastTransaction={transactions[transactions.length - 1]?.id === selectedTransaction?.id}
            />
        </div>
    );
};

export default Transactions;
