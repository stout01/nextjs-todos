import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import UserIcon from './UserIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function PageLayout({ children }) {
  const classes = useStyles();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            To Do
          </Typography>
          <UserIcon></UserIcon>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
}
