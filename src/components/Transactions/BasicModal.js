import React from 'react';
import Modal from 'react-modal';

const BasicModal = ({ isOpen, onRequestClose, transaction, categories, handleInputChange, openMoreModal, calculateAmount, updateTransaction }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="modal-overlay"
        >
            {transaction && (
                <div>
                    <h2>Assign Category</h2>

                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="text"
                            name="date"
                            value={transaction.date}
                            className="input-field read-only"
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount:</label>
                        <input
                            type="text"
                            name="amount"
                            value={calculateAmount(transaction)}
                            className="input-field read-only"
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={transaction.description}
                            className="input-field read-only"
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">Category:</label>
                        <select
                            name="category_id"
                            value={transaction.category_id}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-buttons">
                        <button className="button" onClick={onRequestClose}>Cancel</button>
                        <button className="button" onClick={openMoreModal}>More</button>
                        <button className="button" onClick={updateTransaction}>Save</button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default BasicModal;
