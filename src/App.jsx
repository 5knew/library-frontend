// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/auth/Signin';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './components/ProtectedLayout';

import Books from './pages/BookManaging/Books';
import AddBook from './pages/BookManaging/AddBook';
import UpdateBook from './pages/BookManaging/UpdateBook';
import UsersPage from './pages/UserManaging/UsersPage';
import AddUserPage from './pages/UserManaging/AddUserPage';
import UpdateUserPage from './pages/UserManaging/UpdateUserPage';
import ReservationsPage from './pages/ReservationManaging/ReservationsPage';
import CategoryForm from './pages/CategoryManaging/CategoryForm';
import AuthorForm from './pages/AuthorManaging/AuthorForm';
import BookCopyList from './pages/BookCopyManaging/BookCopyList';
import AddBookCopy from './pages/BookCopyManaging/AddBookCopy';
import UpdateBookCopy from './pages/BookCopyManaging/UpdateBookCopy';
import BooksWithCopies from './pages/BookWithCopies/BooksWithCopies';
import CartPage from './pages/CartItemManaging/CartPage';
import PaymentDetailPage from './pages/PaymentManaging/PaymentDetailPage';
import PaymentsListPage from './pages/PaymentManaging/PaymentsListPage';
import CreatePaymentPage from './pages/PaymentManaging/CreatePaymentPage';

import './index.css';
import ProfilePage from './pages/UserProfileManaging/ProfilePage';
import FavoritesPage from './pages/UserProfileManaging/FavoritesPage';
import ThemeProvider from './components/ThemeProvider';

const App = () => {
  const handleSignIn = (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  };

  return (
    <ThemeProvider defaultTheme="system">
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
            <Route path="/signup" element={<Signup />} />

            {/* All protected routes go inside ProtectedLayout */}
            <Route path="/" element={<ProtectedLayout><Books /></ProtectedLayout>} />

            {/* Other routes for different components */}
            <Route path="/add-book" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN']}><ProtectedLayout><AddBook /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/update-book/:bookId" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN']}><ProtectedLayout><UpdateBook /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute acceptedRoles={['ROLE_ADMIN', 'ROLE_LIBRARIAN']}><ProtectedLayout><UsersPage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN']}><ProtectedLayout><CategoryForm /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/add-category" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN']}><ProtectedLayout><CategoryForm /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/authors" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN']}><ProtectedLayout><AuthorForm /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/add-author" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN']}><ProtectedLayout><AuthorForm /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/add-user" element={<ProtectedRoute acceptedRoles={['ROLE_ADMIN']}><ProtectedLayout><AddUserPage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/update-user/:userId" element={<ProtectedRoute acceptedRoles={['ROLE_ADMIN']}><ProtectedLayout><UpdateUserPage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN']}><ProtectedLayout><ReservationsPage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/book-copies" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN', 'ROLE_STUDENT']}><ProtectedLayout><BookCopyList /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/add-book-copy" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN']}><ProtectedLayout><AddBookCopy /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/update-book-copy/:bookCopyId" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN']}><ProtectedLayout><UpdateBookCopy /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/books-with-copies" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN', 'ROLE_STUDENT']}><ProtectedLayout><BooksWithCopies /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute acceptedRoles={['ROLE_STUDENT', 'ROLE_LIBRARIAN', 'ROLE_ADMIN']}><ProtectedLayout><CartPage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN', 'ROLE_STUDENT']}><ProtectedLayout><PaymentsListPage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/payments/:id" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN', 'ROLE_STUDENT']}><ProtectedLayout><PaymentDetailPage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/create-payment" element={<ProtectedRoute acceptedRoles={['ROLE_LIBRARIAN', 'ROLE_ADMIN', 'ROLE_STUDENT']}><ProtectedLayout><CreatePaymentPage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute acceptedRoles={['ROLE_ADMIN', 'ROLE_LIBRARIAN', 'ROLE_STUDENT']}><ProtectedLayout><ProfilePage /></ProtectedLayout></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute acceptedRoles={['ROLE_ADMIN', 'ROLE_LIBRARIAN', 'ROLE_STUDENT']}><ProtectedLayout><FavoritesPage /></ProtectedLayout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
