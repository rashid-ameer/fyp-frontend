import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';
import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import doneAllFill from '@iconify/icons-eva/done-all-fill';
// material
import { alpha } from '@mui/material/styles';

import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';

import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import useAuth from '../../hooks/useAuth';
import mockData from '../../utils/mock-data';
// components
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import { MIconButton } from '../../components/@material-extend';
import { useDispatch, useSelector } from '../../redux/store';
import {
  getAnnouncementList,
  deleteAnnouncement,
  getAnnouncementListByStudent,
  updateNotificationSetReadStatus
} from '../../redux/slices/announcement';

// ----------------------------------------------------------------------

const TITLES = [
  'Your order is placed',
  'Sylvan King',
  'You have new message',
  'You have new mail',
  'Delivery processing'
];

const DESCRIPTIONS = [
  'waiting for shipping',
  'answered to your comment on the SIBAU FYPMS',
  '5 unread messages',
  'sent from Guido Padberg',
  'Your order is being shipped'
];

const TYPES = ['order_placed', 'friend_interactive', 'chat_message', 'mail', 'order_shipped'];

const AVATARS = [null, mockData.image.avatar(2), null, null, null];

const UNREADS = [true, true, false, false, false];

const MOCK_NOTIFICATIONS = [...Array(5)].map((_, index) => ({
  id: mockData.id(index),
  title: TITLES[index],
  description: DESCRIPTIONS[index],
  avatar: AVATARS[index],
  type: TYPES[index],
  createdAt: mockData.time(index),
  isUnRead: UNREADS[index]
}));

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_package.svg" />,
      title
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_shipping.svg" />,
      title
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_mail.svg" />,
      title
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_chat.svg" />,
      title
    };
  }
  return {
    avatar: <img alt={notification.title} src={notification.avatar} />,
    title
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification }) {
  // const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      to={PATH_DASHBOARD.general.viewAnnouncements}
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <img alt={notification.title} src="/static/icons/ic_notification_mail.svg" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={notification.title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date(notification.createdAt))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function NotificationsPopover() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { announcementList } = useSelector((state) => state.announcement);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const getCountUnReadNotifications = () => {
    const totalUnRead = announcementList.filter((item) => item.status_viewed === 0).length;
    return totalUnRead;
  };

  useEffect(() => {
    dispatch(user.role.role_name === 'Student' ? getAnnouncementListByStudent(user?.id || '') : getAnnouncementList());
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    dispatch(updateNotificationSetReadStatus(user?.id || ''));
    dispatch(user.role.role_name === 'Student' ? getAnnouncementListByStudent(user?.id || '') : getAnnouncementList());
    // dispatch(user.role.role_name === 'Student' ? getAnnouncementListByStudent(user?.id || '') : getAnnouncementList());
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge badgeContent={getCountUnReadNotifications()} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 360 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {getCountUnReadNotifications()} unread messages
            </Typography>
          </Box>

          {getCountUnReadNotifications() > 0 && (
            <Tooltip title=" Mark all as read">
              <MIconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </MIconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {announcementList
              .slice(0, getCountUnReadNotifications() < 3 ? getCountUnReadNotifications() : 2)
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification.announcement ? notification.announcement : notification}
                />
              ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {announcementList
              .slice(getCountUnReadNotifications(), announcementList.length < 5 ? announcementList.length : 4)
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification.announcement ? notification.announcement : notification}
                  component={RouterLink}
                  to={PATH_DASHBOARD.general.viewAnnouncements}
                />
              ))}
          </List>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple component={RouterLink} to={PATH_DASHBOARD.general.viewAnnouncements}>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
