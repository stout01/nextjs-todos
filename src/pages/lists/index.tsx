import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import { getSession, useSession } from 'next-auth/client';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Todo({ items }) {
  const classes = useStyles();
  const [session, loading] = useSession();

  // When rendering client side don't display anything until loading is complete
  if (loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return <div>ACCESS DENIED!</div>;
  }

  return (
    <List className={classes.root}>
      {items.map((item) => {
        const labelId = `checkbox-list-label-${item.rowKey}`;

        return (
          <ListItem key={item.rowKey} role={undefined} dense button>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.isComplete}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={item.name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
      <ListItem role={undefined} dense button>
        <ListItemIcon>
          <AddCircleIcon />
        </ListItemIcon>
        <TextField id="standard-basic" label="Standard" />
      </ListItem>
    </List>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const session = await getSession(context);
  let content = null;

  if (session) {
    const hostname = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const options = { headers: { cookie: context.req.headers.cookie } };
    const res = await fetch(`${hostname}/api/lists`, options);
    content = await res.json();
  }

  // Pass data to the page via props
  return { props: { items: content } };
}

export default Todo;
