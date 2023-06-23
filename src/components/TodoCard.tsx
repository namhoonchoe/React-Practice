import React, { useState } from "react";
import CheckBoxBlank from "./SvgIcons/CheckBoxBlank";
import "./TodoCard.css";
import EditIcon from "./SvgIcons/EditIcon";
import SaveIcon from "./SvgIcons/SaveIcon";
import DeleteIcon from "./SvgIcons/DeleteIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

interface ITodoCardProps {
  id: string;
  title: string;
  progress: string;
}

interface ITodoListItem {
  id: string;
  title: string;
  progress: string;
}

const editTodo = async (todoList: ITodoListItem) => {
  const { data } = await api.put(`todoList/${todoList.id}`, { ...todoList });
  return data;
};

const deleteTodo = async (id: string) => {
  await api.delete(`todoList/${id}`);
};

const TodoCard: React.FC<ITodoCardProps> = ({ id, title, progress }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>("");

  const queryClient = useQueryClient();

  const deleteTodoItem = useMutation({
    mutationFn: (id: string) => {
      return deleteTodo(id);
    },

    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todoList"] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Array<ITodoListItem>>([
        "todoList"
      ]);

      // Optimistically update to the new value
      if (previousTodos) {
        const newTodoList = previousTodos.filter(
          (todoItem) => todoItem.id !== id
        );
        queryClient.setQueryData(["todoList"], newTodoList);
      }

      // Return a context object with the snapshotted value
      return { previousTodos };
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(["todoList"], context?.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todoList"] });
    },
  });

  const editTodoItem = useMutation({
    mutationFn: (todoItem: ITodoListItem) => {
      return editTodo(todoItem);
    },

    onMutate: async (todoItem: ITodoListItem) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todoList",todoItem.id] });

      // Snapshot the previous value
      const previousTodo = queryClient.getQueryData<ITodoListItem>([
        "todoList",todoItem.id
      ]);

      // Optimistically update to the new value
      if (previousTodo) {
        queryClient.setQueryData(['todoList', todoItem.id], {...todoItem, title:newTask})
      }

      // Return a context object with the snapshotted value
      return { previousTodo, todoItem };
    },

    onError: (err, todoItem, context) => {
      queryClient.setQueryData(["todoList",todoItem.id], context?.previousTodo);
    },
    // Always refetch after error or success:
    onSettled: (todoItem) => {
      queryClient.invalidateQueries({ queryKey: ['todoList', todoItem.id]});
    },
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTask(e.target.value);
  };

  const editHandler = () => {
    if (newTask === "") {
      setIsEditing(false);
    } else {
      editTodoItem.mutate({ title: newTask, id, progress });
      setIsEditing(false);
    }
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    editHandler();
  };

  return (
    <section className="cardLayout">
      {isEditing ? (
        <section className="editFormContainer">
          <form className="editForm" onSubmit={submitHandler}>
            <input
              type="text"
              className="editForm__input"
              onChange={changeHandler}
            />
            <button className="iconButton" type="submit">
              <SaveIcon />
            </button>
          </form>
        </section>
      ) : (
        <>
          <button className="iconButton" onClick={() => setIsEditing(true)}>
            <CheckBoxBlank />
          </button>
          <p className="todoTitle">{title}</p>
          <div className="iconContainer">
            <button className="iconButton" onClick={() => setIsEditing(true)}>
              <EditIcon />
            </button>
            <button
              className="iconButton"
              onClick={() => deleteTodoItem.mutate(id)}
            >
              <DeleteIcon />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default TodoCard;
