import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faUserLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../Services/UserManagingService/UserService';
import { useNavigate } from 'react-router-dom';

const UserDetail = ({ user, userRole, onUserUpdated, onUserDeleted }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await UserService.deleteUser(user.id);
      onUserDeleted(user.id);
    } catch (error) {
      console.error(`Failed to delete user with ID ${user.id}:`, error);
    }
  };

  const handleUpdateClick = () => {
    navigate(`/update-user/${user.id}`);
  };

  const handleDeactivate = async () => {
    try {
      await UserService.deactivateUser(user.id);
      onUserUpdated(user.id, { accountNonLocked: false });
    } catch (error) {
      console.error(`Failed to deactivate user with ID ${user.id}:`, error);
    }
  };

  const handleActivate = async () => {
    try {
      await UserService.activateUser(user.id);
      onUserUpdated(user.id, { accountNonLocked: true });
    } catch (error) {
      console.error(`Failed to activate user with ID ${user.id}:`, error);
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
    <td className="py-3 px-6 text-left font-medium text-gray-700">{user.firstName} {user.lastName}</td>
    <td className="py-3 px-6 text-left text-gray-600">{user.email}</td>
    <td className="py-3 px-6 text-left text-gray-600">{user.role}</td>
    <td className="py-3 px-6 text-center">
        <span className={`py-1 px-3 rounded-full text-xs font-semibold ${user.accountNonLocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {user.accountNonLocked ? 'Enabled' : 'Disabled'}
        </span>
    </td>
    <td className="py-3 px-6 text-center">
        <div className="flex items-center justify-center space-x-2">
            {userRole === 'ROLE_ADMIN' && (
                <>
                    {user.accountNonLocked ? (
                        <button onClick={handleDeactivate} className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg shadow-sm transition-all duration-150 ease-in-out">
                            <FontAwesomeIcon icon={faUserLock} />
                        </button>
                    ) : (
                        <button onClick={handleActivate} className="text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-lg shadow-sm transition-all duration-150 ease-in-out">
                            <FontAwesomeIcon icon={faUserCheck} />
                        </button>
                    )}
                    <button onClick={handleUpdateClick} className="text-blue-500 hover:text-blue-600 px-3 py-2 rounded-lg transition-all duration-150 ease-in-out">
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={handleDelete} className="text-red-500 hover:text-red-600 px-3 py-2 rounded-lg transition-all duration-150 ease-in-out">
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </>
            )}
        </div>
    </td>
</tr>

  );
};

export default UserDetail;
