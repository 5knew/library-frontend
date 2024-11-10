import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faUserLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import UserService from '../../Services/UserManagingService/UserService';
import { useNavigate } from 'react-router-dom';

import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


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
    <TableRow className="hover:bg-muted transition-colors duration-150">
      <TableCell>
        <span className="font-medium">{user.firstName} {user.lastName}</span>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell className="text-center">
        <Badge className={`font-semibold ${user.accountNonLocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {user.accountNonLocked ? 'Enabled' : 'Disabled'}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center space-x-2">
          {userRole === 'ROLE_ADMIN' && (
            <>
              {user.accountNonLocked ? (
                <Button onClick={handleDeactivate} variant="destructive" size="sm" className="transition-all duration-150 ease-in-out">
                  <FontAwesomeIcon icon={faUserLock} />
                </Button>
              ) : (
                <Button onClick={handleActivate} variant="success" size="sm" className="transition-all duration-150 ease-in-out">
                  <FontAwesomeIcon icon={faUserCheck} />
                </Button>
              )}
              <Button onClick={handleUpdateClick} variant="outline" size="sm" className="text-blue-500 hover:text-blue-600 transition-all duration-150 ease-in-out">
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button onClick={handleDelete} variant="destructive" size="sm" className="text-red-500 hover:text-red-600 transition-all duration-150 ease-in-out">
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default UserDetail;