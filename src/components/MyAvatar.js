// hooks
import useAuth from '../hooks/useAuth';
//
import { MAvatar } from './@material-extend';
import createAvatar from '../utils/createAvatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <MAvatar
      src={user.photoURL}
      alt={user.name}
      color={user.photoURL ? 'default' : createAvatar(user.name).color}
      {...other}
    >
      {createAvatar(user.name).name}
    </MAvatar>
  );
}
