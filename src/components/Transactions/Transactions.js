import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import './Transactions.css';
import '../styles/common.css';
import Modal from 'react-modal';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banks, setBanks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showMoreFields, setShowMoreFields] = useState(false);

    useEffect(() => {
        fetchTransactions();
        fetchUsers();
        fetchCategories();
        fetchBanks();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${config.transactionUrl}`);
            setTransactions(response.data);
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

    const updateTransaction = async () => {
        try {
            const response = await axios.put(`${config.transactionUrl}/${selectedTransaction.id}`, selectedTransaction);
            const updatedTransaction = response.data.transaction;

            setTransactions(transactions.map(t =>
                t.id === updatedTransaction.id ? updatedTransaction : t
            ));
            closeModal();
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const openModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
        setShowMoreFields(false); // Initially hide extra fields
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    // Calculate Amount (debit - credit)
    const calculateAmount = (transaction) => {
        return transaction.debit - transaction.credit;
    };

    return (
        <div className="transactions-page">
            <h2>Transactions</h2>

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
                    {transactions.map(transaction => (
                        <tr key={transaction.id} onClick={() => openModal(transaction)}>
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

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                {selectedTransaction && (
                    <div>
                        <h2>Edit Transaction</h2>

                        {/* Show Amount as debit - credit */}
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="text"
                            name="amount"
                            value={calculateAmount(selectedTransaction)}
                            className={`input-field ${!showMoreFields ? 'read-only' : ''}`}
                            readOnly
                        />

                        <label htmlFor="date">Date</label>
                        <input
                            type="text"
                            name="date"
                            value={selectedTransaction.date}
                            className={`input-field ${!showMoreFields ? 'read-only' : ''}`}
                            readOnly={!showMoreFields}
                        />

                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={selectedTransaction.description}
                            className={`input-field ${!showMoreFields ? 'read-only' : ''}`}
                            readOnly={!showMoreFields}
                        />

                        <label htmlFor="category_id">Category</label>
                        <select
                            name="category_id"
                            value={selectedTransaction.category_id}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Show additional fields when "More" is clicked */}
                        {showMoreFields && (
                            <>
                                <label htmlFor="debit">Debit</label>
                                <input
                                    type="text"
                                    name="debit"
                                    value={selectedTransaction.debit}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />

                                <label htmlFor="credit">Credit</label>
                                <input
                                    type="text"
                                    name="credit"
                                    value={selectedTransaction.credit}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />

                                <label htmlFor="user_id">User</label>
                                <select
                                    name="user_id"
                                    value={selectedTransaction.user_id}
                                    onChange={handleInputChange}
                                    className="select-field"
                                >
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="bank_id">Bank</label>
                                <select
                                    name="bank_id"
                                    value={selectedTransaction.bank_id}
                                    onChange={handleInputChange}
                                    className="select-field"
                                >
                                    {banks.map(bank => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="status">Status</label>
                                <select
                                    name="status"
                                    value={selectedTransaction.status}
                                    onChange={handleInputChange}
                                    className="select-field"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processed">Processed</option>
                                    <option value="skip">Skip</option>
                                </select>
                            </>
                        )}

                        <div className="modal-buttons">
                            <button className="button" onClick={() => setShowMoreFields(!showMoreFields)}>
                                {showMoreFields ? 'Hide' : 'More'}
                            </button>
                            <button className="button" onClick={closeModal}>Cancel</button>
                            <button className="button" onClick={updateTransaction}>Save</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Transactions;
