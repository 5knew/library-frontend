import React, { useState, useEffect } from 'react';
import { ReservationService } from '../../Services/ReservationService/ReservationService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../Services/UserManagingService/UserService'
import BookService from '../../Services/BookService/BookService';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Define searchQuery state variable

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await ReservationService.getAllReservations();
      setReservations(res.data);

      // Fetch and set book details
      const bookIds = [...new Set(res.data.map(r => r.bookId))];
      const bookDetails = await Promise.all(bookIds.map(id => BookService.getBookById(id)));
      setBooks(bookDetails.reduce((acc, curr) => ({ ...acc, [curr.data.id]: curr.data }), {}));

      // Fetch and set user details
      const userIds = [...new Set(res.data.map(r => r.userId))];
      const userDetails = await Promise.all(userIds.map(id => UserService.getUser(id)));
      setUsers(userDetails.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {}));


      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      ReservationService.deleteReservation(id)
        .then(() => {
          fetchReservations();
          alert('Reservation deleted successfully');
        })
        .catch(err => {
          console.error('Failed to delete reservation:', err);
          alert('Failed to delete reservation');
        });
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const updatedReservation = reservations.find(reservation => reservation.id === reservationId);
      updatedReservation.status = newStatus;
  
      await ReservationService.updateReservation(reservationId, updatedReservation);
  
      // If the new status is "Returned", call the service to increment the book's available copies
      if (newStatus === 'RETURNED') {
        await BookService.incrementAvailableCopies(updatedReservation.bookId);
      }
  
      // Refetch reservations to reflect the changes
      fetchReservations();
      alert('Reservation status updated successfully');
    } catch (err) {
      console.error('Failed to update reservation status:', err);
      alert('Failed to update reservation status');
    }
  };
  

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    ReservationService.searchReservations({ query: searchQuery })
      .then(response => {
        setReservations(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to search reservations. Please try again later.');
        setLoading(false);
        console.error(err);
      });
  };

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold text-center mb-6">All Reservations</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Search reservations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </form>
      {reservations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Reservation ID</th>
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">User FIO</th>
                <th className="py-3 px-6 text-center">Book ID</th>
                <th className="py-3 px-6 text-center">Book NAME</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {reservations.map((reservation) => (
                <tr className="border-b border-gray-200 hover:bg-gray-100" key={reservation.id}>
                  <td className="py-3 px-6 text-left whitespace-nowrap">{reservation.id}</td>
                  <td className="py-3 px-6 text-left">{reservation.userId}</td>
                  <td className="py-3 px-6 text-left">{users[reservation.userId]?.firstName} {users[reservation.userId]?.lastName}</td>
                  <td className="py-3 px-6 text-center">{reservation.bookId}</td>
                  <td className="py-3 px-6 text-center">{books[reservation.bookId]?.name}</td>
                  <td className="py-3 px-6 text-center">
                    <select
                      className="form-select block w-full mt-1"
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                    >
                      <option value="RESERVED">Reserved</option>
                      <option value="LOANED">Loaned</option>
                      <option value="RETURNED">Returned</option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-center">{reservation.reservationDate}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <div
                        onClick={() => {}} // Placeholder for edit functionality
                        className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </div>
                      <div
                        onClick={() => handleDelete(reservation.id)}
                        className="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">No reservations found.</div>
      )}
    </div>
  );
};

export default ReservationsPage;
