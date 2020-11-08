import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  withStyles,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import { getSession, Session } from 'next-auth/client';
import React, { Component } from 'react';
import theme from '../../theme';

const styles = {
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
};

type TodoItem = {
  partitionKey: string;
  rowKey: string;
  name: string;
  isComplete: boolean;
};

type TodoProps = {
  // using `interface` is also ok
  items: Array<TodoItem>;
  classes: any;
  session?: Session;
};
type TodoState = {
  items: { [key: string]: TodoItem }; // like this
};

class Todos extends Component<TodoProps, TodoState> {
  state: TodoState = {
    items: this.props.items?.reduce((dict, item) => {
      dict[item.rowKey] = item;
      return dict;
    }, {}),
  };

  render() {
    const session = this.props.session;
    console.log('state: ', this.state);
    console.log('props: ', this.props);
    const { classes, items } = this.props;

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
}

export default withStyles(styles)(Todos);

// This gets called on every request
export async function getServerSideProps(context) {
  const session = await getSession(context);
  let content = null;

  if (session) {
    const hostname = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const options = { headers: { cookie: context.req.headers.cookie } };
    const res = await fetch(`${hostname}/api/todo`, options);
    content = await res.json();
  }

  // Pass data to the page via props
  return { props: { items: content, session: session } };
}
