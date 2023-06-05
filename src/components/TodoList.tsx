import React from "react";
import "./TodoList.css";

const TodoList = () => {
  return (
    <div className="layout">
      <header>
        <h1 className="todoList-form__title">Todo List</h1>
      </header>
      <main>
        <section className="todoList-filter">
          <div className="todoList-filter__selector">
            <p className="todoList-filter__selector--title">todo</p>
          </div>
          <div className="todoList-filter__selector">
            <p className="todoList-filter__selector--title">doing</p>
          </div>
          <div className="todoList-filter__selector">
            <p className="todoList-filter__selector--title">done</p>
          </div>
        </section>
        <section className="todoList">
         </section>
      </main>
      <footer>
        <section className="todoList-form">
          <input type="text" className="todoList-form__input" />
          <div className="todoList-form__button"></div>
        </section>
      </footer>
    </div>
  );
};

export default TodoList;
