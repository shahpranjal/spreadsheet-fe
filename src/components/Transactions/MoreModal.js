import React from 'react';
import Modal from 'react-modal';

const MoreModal = ({
                       isOpen,
                       onRequestClose,
                       transaction,
                       users,
                       banks,
                       categories,
                       handleInputChange,
                       onHide,
                       goToPreviousTransaction,
                       goToNextTransaction,
                       isFirstTransaction,
                       isLastTransaction
                   }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="modal-overlay"
        >
            {transaction && (
                <div>
                    <h2>More Transaction Details</h2>

                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="text"
                            name="date"
                            value={transaction.date}
                            className="input-field"
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={transaction.description}
                            className="input-field"
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">Category:</label>
                        <select
                            name="category_id"
                            value={transaction.category_id || ''}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="debit">Debit:</label>
                        <input
                            type="text"
                            name="debit"
                            value={transaction.debit}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="credit">Credit:</label>
                        <input
                            type="text"
                            name="credit"
                            value={transaction.credit}
                            onChange={handleInputChange}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="user_id">User:</label>
                        <select
                            name="user_id"
                            value={transaction.user_id}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bank_id">Bank:</label>
                        <select
                            name="bank_id"
                            value={transaction.bank_id}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            {banks.map(bank => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            name="status"
                            value={transaction.status}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            <option value="pending">Pending</option>
                            <option value="processed">Processed</option>
                            <option value="skip">Skip</option>
                        </select>
                    </div>

                    <div className="modal-buttons">
                        <button className="button" onClick={goToPreviousTransaction}
                                disabled={isFirstTransaction}>Previous
                        </button>
                        <button className="button" onClick={onHide}>Hide</button>
                        <button className="button" onClick={goToNextTransaction} disabled={isLastTransaction}>Next</button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default MoreModal;
