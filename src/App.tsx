import { useState, useEffect } from "react";
import "./App.css";

type Task = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "student-task-manager-tasks";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // localStorage may be unavailable (private browsing, quota) — fail silently
    }
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: task.trim(),
      done: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Student Task Manager</h1>
        <p className="subtitle">Organize your school tasks easily</p>

        <div className="input-area">
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

          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet.</p>
          ) : (
            tasks.map((item) => (
              <div className={`task ${item.done ? "done" : ""}`} key={item.id}>
                <span className={item.done ? "task-text done-text" : "task-text"}>
                  {item.text}
                </span>
                <div className="task-actions">
                  <button onClick={() => toggleTask(item.id)}>
                    {item.done ? "Undo" : "Mark as Done"}
                  </button>
                  <button onClick={() => deleteTask(item.id)}>Delete</button>
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