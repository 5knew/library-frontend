import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/book-copies';

// Function to get authorization header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to format data as FormData (to handle file uploads)
const formatAsFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
        }
    });
    return formData;
};

// Create a new book copy
const createBookCopy = async (formData) => {
    try {
        const response = await axios.post(BASE_URL, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating book copy:", error.response || error);
        throw error;
    }
};

const getCopiesByBookId = async (bookId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/book-copies/by-book/${bookId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching copies for book by ID:", error);
        throw error;
    }
};


// Update an existing book copy
const updateBookCopy = async (id, updatedBookCopyData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, updatedBookCopyData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating book copy:", error.response || error);
        throw error;
    }
};

// Get a book copy by ID
const getBookCopyById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching book copy by ID:", error.response || error);
        throw error;
    }
};

// Get all book copies
const getAllBookCopies = async () => {
    try {
        const response = await axios.get(BASE_URL, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching all book copies:", error.response || error);
        throw error;
    }
};

// Delete a book copy by ID
const deleteBookCopy = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error deleting book copy:", error.response || error);
        throw error;
    }
};

const searchBookCopies = async (filters) => {
    // Prepare the params object, including the new date fields
    const params = {
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : undefined, // Format date to yyyy-MM-dd
        endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : undefined // Format date to yyyy-MM-dd
    };

    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params,
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error searching book copies:", error.response || error);
        throw error;
    }
};


// Export the BookCopyService object with all methods
export const BookCopyService = {
    createBookCopy,
    getBookCopyById,
    getAllBookCopies,
    updateBookCopy,
    deleteBookCopy,
    searchBookCopies,
    getCopiesByBookId
};
