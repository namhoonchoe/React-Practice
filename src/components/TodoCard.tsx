import React, { useState } from "react";
import CheckBoxBlank from "./SvgIcons/CheckBoxBlank";
import "./TodoCard.css";
import EditIcon from "./SvgIcons/EditIcon";
import SaveIcon from "./SvgIcons/SaveIcon";
import DeleteIcon from "./SvgIcons/DeleteIcon";
import { useMutation } from "@tanstack/react-query";
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

  const deleteTodoItem = useMutation({
    mutationFn: (id: string) => {
      return deleteTodo(id);
    },
  });

  const editTodoItem = useMutation({
    mutationFn: (todoList: ITodoListItem) => {
      return editTodo(todoList);
    },
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTask(e.target.value);
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    editTodoItem.mutate({ title: newTask, id, progress });
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
          </form>
          <div onClick={() => setIsEditing(false)}>
            <SaveIcon />
          </div>
        </section>
      ) : (
        <>
          <div className="checkBox">
            <CheckBoxBlank />
          </div>
          <p className="todoTitle">{title}</p>
          <div className="iconContainer">
            <div onClick={() => setIsEditing(true)}>
              <EditIcon />
            </div>
            <div onClick={() => deleteTodoItem.mutate(id)}>
              <DeleteIcon />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default TodoCard;
