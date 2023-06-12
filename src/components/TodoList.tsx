import React, { useState } from "react";
import AddIcon from "./SvgIcons/AddIcon";
import CheckBox from "./SvgIcons/CheckBox";
import CheckBoxBlank from "./SvgIcons/CheckBoxBlank";
import MenuIcon from "./SvgIcons/MenuIcon";
import { useQuery, useMutation } from "@tanstack/react-query";
import TodoCard from "./TodoCard";
import { api } from "@components/api";
import "./TodoList.css";

const getTodoList = async () => {
  const { data } = await api.get("todoList");
  return data;
};

const addTodo = async (newTodo: ITodoListItem) => {
  const { data } = await api.post(`todoList `, newTodo);
  return data;
};

interface ITodoListItem {
  id: string;
  title: string;
  progress: string;
}

const TodoList: React.FC = () => {
  const [newTodo, setNewTodo] = useState<ITodoListItem>({
    title: "",
    id: crypto.randomUUID(),
    progress: "todo",
  });

  const { data: todoList } = useQuery<Array<ITodoListItem>>({
    queryKey: ["todoList"],
    queryFn: getTodoList,
  });

  const listMutation = useMutation({
    mutationFn: (newTodo: ITodoListItem) => {
      return addTodo(newTodo);
    },
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTodo({ ...newTodo, title: e.target.value });
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    listMutation.mutate(newTodo);
  };

  return (
    <div className="layout">
      <header>
        <h1 className="todoList-form__title">Todo List</h1>
      </header>
      <main>
        <section className="todoList-filter">
          <div className="todoList-filter__selector">
            <MenuIcon />
            <p className="todoList-filter__selector--title">todo</p>
          </div>
          <div className="todoList-filter__selector">
            <CheckBoxBlank />
            <p className="todoList-filter__selector--title">doing</p>
          </div>
          <div className="todoList-filter__selector">
            <CheckBox />
            <p className="todoList-filter__selector--title">Completed</p>
          </div>
        </section>
        <section className="todoList">
          {todoList &&
            todoList.map((todo: ITodoListItem) => {
              return (
                <TodoCard
                  title={todo.title}
                  id={todo.id}
                  progress={todo.progress}
                />
              );
            })}
        </section>
      </main>
      <footer>
        <section className="todoList-form__container">
          <form className="todoList-form" onSubmit={submitHandler}>
            <input
              type="text"
              className="todoList-form__input"
              value={newTodo.title}
              onChange={changeHandler}
            />
          </form>
          <div className="todoList-form__button">
            <AddIcon />
          </div>
        </section>
      </footer>
    </div>
  );
};

export default TodoList;
