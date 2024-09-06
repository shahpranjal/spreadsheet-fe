import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import './Transactions.css';
import '../styles/common.css';
import BasicModal from './BasicModal'; // Import BasicModal
import MoreModal from './MoreModal'; // Import MoreModal

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banks, setBanks] = useState([]);
    const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

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
            closeMoreModal();
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
        setIsBasicModalOpen(false); // Close basic modal
        setIsMoreModalOpen(true); // Open more modal
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
                updateTransaction={updateTransaction}
            />

            <MoreModal
                isOpen={isMoreModalOpen}
                onRequestClose={closeMoreModal}
                transaction={selectedTransaction}
                users={users}
                banks={banks}
                categories={categories}
                handleInputChange={handleInputChange}
                updateTransaction={updateTransaction}
                onHide={openBasicModalFromMore}
            />
        </div>
    );
};

export default Transactions;
