import React, { useState } from "react";
import AddIcon from "./SvgIcons/AddIcon";
import CheckBox from "./SvgIcons/CheckBox";
import CheckBoxBlank from "./SvgIcons/CheckBoxBlank";
import MenuIcon from "./SvgIcons/MenuIcon";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    id: "",
    progress: "todo",
  });

  const { data: todoList } = useQuery<Array<ITodoListItem>>({
    queryKey: ["todoList"],
    queryFn: getTodoList,
  });

  const queryClient = useQueryClient();

  const listMutation = useMutation({
    mutationFn: (newTodo: ITodoListItem) => {
      return addTodo(newTodo);
    },

    onMutate: async (newTodo: ITodoListItem) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todoList"] });

      // Snapshot the previous value
      const previousTodoList = queryClient.getQueryData<Array<ITodoListItem>>([
        "todoList" 
      ]);

      // Optimistically update to the new value
      if (previousTodoList) {
        const newList = [...previousTodoList, newTodo]
        queryClient.setQueryData(['todoList'], newList )
      }

      // Return a context object with the snapshotted value
      return { previousTodoList };
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(["todoList" ], context?.previousTodoList);
    },
    // Always refetch after error or success:
    onSettled: ( ) => {
      queryClient.invalidateQueries({ queryKey: ['todoList']});
    },
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewTodo({ ...newTodo, title: e.target.value, id:crypto.randomUUID() });
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
            <button className="iconButton">
              <MenuIcon />
            </button>
            <p className="todoList-filter__selector--title">todo</p>
          </div>
          <div className="todoList-filter__selector">
            <button className="iconButton">
              <CheckBoxBlank />
            </button>
            <p className="todoList-filter__selector--title">doing</p>
          </div>
          <div className="todoList-filter__selector">
            <button className="iconButton">
              <CheckBox />
            </button>
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
            <button className="iconButton" type="submit">
              <AddIcon />
            </button>
          </form>
        </section>
      </footer>
    </div>
  );
};

export default TodoList;
