import { useState, useEffect } from "react";
import "./App.css";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

function loadTasks(): Task[] {
  const savedTasks = localStorage.getItem("studentTasks");
  if (!savedTasks) {
    return [];
  }

  try {
    const parsed = JSON.parse(savedTasks);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      name: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app">
      <div className="container">

        <h1>Student Task Manager</h1>
        <p className="subtitle">
          Manage your school tasks easily
        </p>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />

          <button onClick={addTask}>
            Add Task
          </button>
        </div>

        <div className="stats">
          <div>
            <strong>{totalTasks}</strong>
            <span>Total</span>
          </div>

          <div>
            <strong>{completedTasks}</strong>
            <span>Completed</span>
          </div>

          <div>
            <strong>{pendingTasks}</strong>
            <span>Pending</span>
          </div>
        </div>

        <div className="task-list">

          {tasks.length === 0 ? (
            <p className="empty">
              No tasks yet. Add your first task!
            </p>
          ) : (
            tasks.map((item) => (
              <div
                className={`task ${
                  item.completed ? "completed" : ""
                }`}
                key={item.id}
              >

                <span
                  onClick={() => toggleTask(item.id)}
                >
                  {item.name}
                </span>

                <div className="actions">

                  <button
                    className="complete-btn"
                    onClick={() => toggleTask(item.id)}
                  >
                    {item.completed ? "Undo" : "Done"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(item.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default App;