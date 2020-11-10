import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import TodoItem from '../models/TodoItem';

type TodoListItemProps = { onDelete: () => void; onToggle: () => void; item: TodoItem };

export default function TodoListItem({ item, onDelete, onToggle }: TodoListItemProps) {
  const labelId = `checkbox-list-label-${item.rowKey}`;

  return (
    <ListItem role={undefined} dense button onClick={onToggle}>
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
      <ListItemSecondaryAction onClick={onDelete}>
        <IconButton edge="end" aria-label="comments">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
