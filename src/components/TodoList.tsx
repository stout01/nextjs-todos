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
import { Session } from 'next-auth/client';
import React, { Component } from 'react';
import theme from '../theme';

const styles = {
  root: {
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
  addItemText: string;
};

class TodoList extends Component<TodoProps, TodoState> {
  state: TodoState = {
    items: this.props.items?.reduce((dict, item) => {
      dict[item.rowKey] = item;
      return dict;
    }, {}),
    addItemText: '',
  };

  async handleToggle(item: TodoItem) {
    item.isComplete = !item.isComplete;

    const res = await fetch(`/api/todo/${item.rowKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const content = await res.json();

    this.setState((state) => {
      const updatedState = { items: { ...state.items } };
      updatedState.items[content.rowKey] = content;
      return updatedState;
    });
  }

  async handleDelete(item: TodoItem) {
    item.isComplete = !item.isComplete;

    const res = await fetch(`/api/todo/${item.rowKey}`, {
      method: 'DELETE',
    });

    this.setState((state) => {
      const updatedState = { items: { ...state.items } };
      delete updatedState.items[item.rowKey];

      return updatedState;
    });
  }

  async handleAdd() {
    const item: Partial<TodoItem> = {
      name: this.state.addItemText,
      isComplete: false,
    };

    const res = await fetch(`/api/todo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const content = await res.json();

    this.setState((state) => {
      const updatedState = { items: { ...state.items }, addItemText: '' };
      updatedState.items[content.rowKey] = content;

      return updatedState;
    });
  }

  handleAddItemChange(event) {
    this.setState(() => ({ addItemText: event.target.value }));
  }

  render() {
    const { classes, session } = this.props;
    const items = Object.values(this.state.items);
    const addItemText = this.state.addItemText;

    // If no session exists, display access denied message
    if (!session) {
      return <div>ACCESS DENIED!</div>;
    }

    return (
      <List className={classes.root}>
        {items.map((item) => {
          const labelId = `checkbox-list-label-${item.rowKey}`;

          return (
            <ListItem key={item.rowKey} role={undefined} dense button onClick={() => this.handleToggle(item)}>
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
              <ListItemSecondaryAction onClick={() => this.handleDelete(item)}>
                <IconButton edge="end" aria-label="comments">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
        <ListItem role={undefined} dense button>
          <ListItemIcon onClick={() => this.handleAdd()}>
            <AddCircleIcon />
          </ListItemIcon>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              this.handleAdd();
            }}
          >
            <TextField
              value={addItemText}
              onChange={(event) => this.handleAddItemChange(event)}
              label="Add an item"
            />
          </form>
        </ListItem>
      </List>
    );
  }
}

export default withStyles(styles)(TodoList);
