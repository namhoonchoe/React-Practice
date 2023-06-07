import React from "react";
import CheckBoxBlank from "./SvgIcons/CheckBoxBlank";
import "./TodoCard.css";

interface ITodoCardProps {
  id: string;
  title: string;
  progress: string;
}

const TodoCard: React.FC<ITodoCardProps> = ({ id, title, progress }) => {
  return (
    <section className="cardLayout">
      <div className="checkBox">
        <CheckBoxBlank/>
      </div>
      <p className="todoTitle">{title}</p>
      <div className="iconContainer"></div>
      <div className="iconContainer"></div>
    </section>
  );
};

export default TodoCard;
