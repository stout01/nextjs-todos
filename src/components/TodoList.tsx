import { List, ListItem, ListItemIcon, TextField, withStyles } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Session } from 'next-auth/client';
import React, { Component } from 'react';
import TodoItem from '../models/TodoItem';
import theme from '../theme';
import TodoListItem from './ListItem';

const styles = {
  root: {
    backgroundColor: theme.palette.background.paper,
  },
};

type TodoProps = {
  items: Array<TodoItem>;
  classes: any;
  session?: Session;
};
type TodoState = {
  items: { [key: string]: TodoItem };
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

  handleToggle = async (item: TodoItem): Promise<void> => {
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
  };

  handleDelete = async (item: TodoItem): Promise<void> => {
    item.isComplete = !item.isComplete;

    await fetch(`/api/todo/${item.rowKey}`, {
      method: 'DELETE',
    });

    this.setState((state) => {
      const updatedState = { items: { ...state.items } };
      delete updatedState.items[item.rowKey];

      return updatedState;
    });
  };

  handleAdd = async (): Promise<void> => {
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
  };

  handleAddItemChange = (event): void => {
    this.setState(() => ({ addItemText: event.target.value }));
  };

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
        {items.map((item) => (
          <TodoListItem
            key={item.rowKey}
            item={item}
            onDelete={() => this.handleDelete(item)}
            onToggle={() => this.handleToggle(item)}
          ></TodoListItem>
        ))}
        <ListItem role={undefined} dense button>
          <ListItemIcon onClick={this.handleAdd}>
            <AddCircleIcon />
          </ListItemIcon>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              this.handleAdd();
            }}
          >
            <TextField value={addItemText} onChange={this.handleAddItemChange} label="Add an item" />
          </form>
        </ListItem>
      </List>
    );
  }
}

export default withStyles(styles)(TodoList);
