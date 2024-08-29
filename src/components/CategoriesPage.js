import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import config from '../config';
import './CategoriesPage.css';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updatedCategoryName, setUpdatedCategoryName] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        axios.get(`${config.baseUrl}/api/categories`)
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the categories!", error);
                setError(error);
                setLoading(false);
            });
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setUpdatedCategoryName(category.name);
        setIsEditModalOpen(true);
    };

    const handleCreateCategoryClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateCategory = () => {
        axios.post(`${config.baseUrl}/api/categories/create_category`, { name: newCategoryName })
            .then(response => {
                setCategories([...categories, response.data]);
                setNewCategoryName("");
                setIsCreateModalOpen(false);
            })
            .catch(error => {
                console.error("There was an error creating the category!", error);
                setError(error);
            });
    };

    const handleUpdateCategory = () => {
        axios.put(`${config.baseUrl}/api/categories/${selectedCategory.id}`, { name: updatedCategoryName })
            .then(response => {
                setCategories(categories.map(category => category.id === selectedCategory.id ? response.data : category));
                setIsEditModalOpen(false);
            })
            .catch(error => {
                console.error("There was an error updating the category!", error);
                setError(error);
            });
    };

    const handleDeleteCategory = () => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            axios.delete(`${config.baseUrl}/api/categories/${selectedCategory.id}`)
                .then(() => {
                    setCategories(categories.filter(category => category.id !== selectedCategory.id));
                    setIsEditModalOpen(false);
                })
                .catch(error => {
                    console.error("There was an error deleting the category!", error);
                    setError(error);
                });
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCategory(null);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewCategoryName("");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="categories-container">
            <h2>Categories</h2>
            <ul className="categories-list">
                {categories.map(category => (
                    <li key={category.id} onClick={() => handleCategoryClick(category)} className="category-name">
                        {category.name}
                    </li>
                ))}
            </ul>
            <button className="button create-button" onClick={handleCreateCategoryClick}>Create</button>

            {/* Edit/Delete Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit Category"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Edit Category</h2>
                <input
                    type="text"
                    value={updatedCategoryName}
                    onChange={(e) => setUpdatedCategoryName(e.target.value)}
                    className="input-field"
                />
                <div className="modal-buttons">
                    <button className="button" onClick={handleUpdateCategory}>Update</button>
                    <button className="button delete-button" onClick={handleDeleteCategory}>Delete</button>
                    <button className="button" onClick={closeEditModal}>Cancel</button>
                </div>
            </Modal>

            {/* Create Category Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={closeCreateModal}
                contentLabel="Create Category"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Create Category</h2>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="input-field"
                    placeholder="Enter category name"
                />
                <div className="modal-buttons">
                    <button className="button" onClick={handleCreateCategory}>Save</button>
                    <button className="button" onClick={closeCreateModal}>Cancel</button>
                </div>
            </Modal>
        </div>
    );
};

export default CategoriesPage;
