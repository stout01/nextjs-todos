import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import { signOut, useSession } from 'next-auth/client';
import React from 'react';

export default function UserIcon() {
  const [session, loading] = useSession();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading || !session) return null;

  if (session) {
    return (
      <>
        <IconButton disableFocusRipple onClick={handleIconClick}>
          <Avatar alt={session.user.name} src={session.user.image}></Avatar>
        </IconButton>
        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => signOut()}>Logout</MenuItem>
        </Menu>
      </>
    );
  }
}
