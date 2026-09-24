import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import "./App.css";

const DEMO_EMAIL = "student@example.com";
const DEMO_PASSWORD = "123456";

type Page =
  | "login"
  | "register"
  | "forgot"
  | "verify"
  | "reset"
  | "dashboard";

type Priority = "Low" | "Medium" | "High";

type User = {
  name: string;
  email: string;
};

type Task = {
  id: number | null;
  subject: string;
  title: string;
  date: string;
  time: string;
  priority: Priority;
  completed: boolean;
};

function App() {
  const [page, setPage] = useState<Page>("login");
  const [user, setUser] = useState<User | null>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(
      "studentTaskManagerTasks"
    );

    if (!saved) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed as Task[];
      }

      return [];
    } catch {
      return [];
    }
  });

  const [message, setMessage] = useState<string>("");

  const [task, setTask] = useState<Task>({
    id: null,
    subject: "",
    title: "",
    date: "",
    time: "",
    priority: "Medium",
    completed: false,
  });

  const [editing, setEditing] = useState<boolean>(false);
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Completed"
  >("All");

  useEffect(() => {
    localStorage.setItem(
      "studentTaskManagerTasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  /* =========================
     LOGIN
  ========================= */

  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      email === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      setUser({
        name: "Student",
        email,
      });

      setPage("dashboard");
      setMessage("");
    } else {
      setMessage(
        "Invalid login. Demo account: student@example.com / 123456"
      );
    }
  };

  /* =========================
     REGISTER
  ========================= */

  const register = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("Please complete all fields.");
      return;
    }

    setMessage(
      "Account created successfully. You can now log in."
    );

    setPage("login");
    setName("");
    setPassword("");
  };

  /* =========================
     FORGOT PASSWORD
  ========================= */

  const forgotPassword = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setMessage("Demo verification code: 123456");
    setPage("verify");
  };

  /* =========================
     VERIFY CODE
  ========================= */

  const verifyCode = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const code = String(formData.get("code") || "");

    if (code === "123456") {
      setMessage("");
      setPage("reset");
    } else {
      setMessage("Incorrect verification code.");
    }
  };

  /* =========================
     RESET PASSWORD
  ========================= */

  const resetPassword = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const newPassword = String(
      formData.get("newPassword") || ""
    );

    const confirmPassword = String(
      formData.get("confirmPassword") || ""
    );

    if (!newPassword || !confirmPassword) {
      setMessage("Please complete both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage(
      "Password reset successfully. You can now log in."
    );

    setPage("login");
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setMessage("");
    setPage("login");
  };

  /* =========================
     TASK CHANGE
  ========================= */

  const handleTaskChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setTask((currentTask) => ({
      ...currentTask,
      [name]:
        name === "priority"
          ? (value as Priority)
          : value,
    }));
  };

  /* =========================
     SAVE TASK
  ========================= */

  const saveTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !task.subject ||
      !task.title ||
      !task.date ||
      !task.time
    ) {
      alert("Please complete all task fields.");
      return;
    }

    if (editing && task.id !== null) {
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id
            ? {
                ...task,
              }
            : item
        )
      );
    } else {
      setTasks((currentTasks) => [
        ...currentTasks,
        {
          ...task,
          id: Date.now(),
          completed: false,
        },
      ]);
    }

    resetTaskForm();
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetTaskForm = () => {
    setTask({
      id: null,
      subject: "",
      title: "",
      date: "",
      time: "",
      priority: "Medium",
      completed: false,
    });

    setEditing(false);
  };

  /* =========================
     EDIT TASK
  ========================= */

  const editTask = (item: Task) => {
    setTask(item);
    setEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     DELETE TASK
  ========================= */

  const deleteTask = (id: number | null) => {
    if (id === null) {
      return;
    }

    if (window.confirm("Delete this task?")) {
      setTasks((currentTasks) =>
        currentTasks.filter(
          (item) => item.id !== id
        )
      );
    }
  };

  /* =========================
     COMPLETE TASK
  ========================= */

  const toggleComplete = (id: number | null) => {
    if (id === null) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      )
    );
  };

  /* =========================
     FILTER
  ========================= */

  const filteredTasks = tasks.filter((item) => {
    if (filter === "Completed") {
      return item.completed;
    }

    if (filter === "Pending") {
      return !item.completed;
    }

    return true;
  });

  /* =========================
     STATISTICS
  ========================= */

  const completedCount = tasks.filter(
    (item) => item.completed
  ).length;

  const pendingCount = tasks.filter(
    (item) => !item.completed
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedCount / tasks.length) * 100
        );

  /* =========================
     LOGIN PAGE
  ========================= */

  if (page === "login") {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="logo">
            📚
          </div>

          <h1>
            Student Task Manager
          </h1>

          <p className="subtitle">
            Organize your school tasks.
            Achieve your goals.
          </p>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={login}>

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="submit"
              className="primary-button"
            >
              Login
            </button>

          </form>

          <button
            type="button"
            className="text-button"
            onClick={() => {
              setMessage("");
              setPage("forgot");
            }}
          >
            Forgot Password?
          </button>

          <p className="account-text">
            Don't have an account?

            <button
              type="button"
              className="link-button"
              onClick={() => {
                setMessage("");
                setPage("register");
              }}
            >
              Create Account
            </button>
          </p>

          <div className="demo-box">
            <strong>
              Demo Account
            </strong>

            <br />

            Email: student@example.com

            <br />

            Password: 123456
          </div>

        </div>
      </div>
    );
  }

  /* =========================
     REGISTER PAGE
  ========================= */

  if (page === "register") {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="logo">
            📝
          </div>

          <h1>
            Create Account
          </h1>

          <p className="subtitle">
            Start managing your
            school tasks.
          </p>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={register}>

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="submit"
              className="primary-button"
            >
              Create Account
            </button>

          </form>

          <button
            type="button"
            className="text-button"
            onClick={() => {
              setMessage("");
              setPage("login");
            }}
          >
            ← Back to Login
          </button>

        </div>
      </div>
    );
  }

  /* =========================
     FORGOT PASSWORD PAGE
  ========================= */

  if (page === "forgot") {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="logo">
            🔐
          </div>

          <h1>
            Forgot Password?
          </h1>

          <p className="subtitle">
            Enter your email to receive
            a verification code.
          </p>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={forgotPassword}>

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <button
              type="submit"
              className="primary-button"
            >
              Send Verification Code
            </button>

          </form>

          <button
            type="button"
            className="text-button"
            onClick={() => {
              setMessage("");
              setPage("login");
            }}
          >
            ← Back to Login
          </button>

        </div>
      </div>
    );
  }

  /* =========================
     VERIFY PAGE
  ========================= */

  if (page === "verify") {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="logo">
            🔑
          </div>

          <h1>
            Verify Account
          </h1>

          <p className="subtitle">
            Enter the verification code
            sent to your email.
          </p>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={verifyCode}>

            <label>
              Verification Code
            </label>

            <input
              name="code"
              type="text"
              placeholder="Enter 123456"
            />

            <button
              type="submit"
              className="primary-button"
            >
              Verify
            </button>

          </form>

        </div>
      </div>
    );
  }

  /* =========================
     RESET PASSWORD PAGE
  ========================= */

  if (page === "reset") {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="logo">
            🔒
          </div>

          <h1>
            Reset Password
          </h1>

          <p className="subtitle">
            Create your new password.
          </p>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <form onSubmit={resetPassword}>

            <label>
              New Password
            </label>

            <input
              name="newPassword"
              type="password"
              placeholder="New password"
            />

            <label>
              Confirm Password
            </label>

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
            />

            <button
              type="submit"
              className="primary-button"
            >
              Reset Password
            </button>

          </form>

        </div>
      </div>
    );
  }

  /* =========================
     DASHBOARD
  ========================= */

  return (
    <div className="app">

      <header className="topbar">

        <div>

          <h1>
            📚 Student Task Manager
          </h1>

          <p>
            Welcome back, {user?.name}!
          </p>

        </div>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <main className="container">

        {/* STATISTICS */}

        <section className="stats">

          <div className="stat-card">

            <span>
              📋
            </span>

            <div>

              <strong>
                {tasks.length}
              </strong>

              <small>
                Total Tasks
              </small>

            </div>

          </div>

          <div className="stat-card">

            <span>
              ⏳
            </span>

            <div>

              <strong>
                {pendingCount}
              </strong>

              <small>
                Pending
              </small>

            </div>

          </div>

          <div className="stat-card">

            <span>
              ✅
            </span>

            <div>

              <strong>
                {completedCount}
              </strong>

              <small>
                Completed
              </small>

            </div>

          </div>

          <div className="stat-card">

            <span>
              📈
            </span>

            <div>

              <strong>
                {progress}%
              </strong>

              <small>
                Progress
              </small>

            </div>

          </div>

        </section>

        {/* PROGRESS */}

        <section className="progress-section">

          <div className="section-heading">

            <h2>
              Task Progress
            </h2>

            <strong>
              {progress}%
            </strong>

          </div>

          <div className="progress-bar">

            <div
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>

        {/* TASK AREA */}

        <section className="planner-grid">

          {/* FORM */}

          <div className="form-card">

            <h2>
              {editing
                ? "Edit Student Task"
                : "Add Student Task"}
            </h2>

            <form onSubmit={saveTask}>

              <label>
                Subject
              </label>

              <input
                name="subject"
                value={task.subject}
                onChange={handleTaskChange}
                placeholder="e.g. System Architecture"
              />

              <label>
                Task
              </label>

              <input
                name="title"
                value={task.title}
                onChange={handleTaskChange}
                placeholder="e.g. Review Chapter 3"
              />

              <div className="two-columns">

                <div>

                  <label>
                    Date
                  </label>

                  <input
                    name="date"
                    type="date"
                    value={task.date}
                    onChange={handleTaskChange}
                  />

                </div>

                <div>

                  <label>
                    Time
                  </label>

                  <input
                    name="time"
                    type="time"
                    value={task.time}
                    onChange={handleTaskChange}
                  />

                </div>

              </div>

              <label>
                Priority
              </label>

              <select
                name="priority"
                value={task.priority}
                onChange={handleTaskChange}
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

              <div className="form-buttons">

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editing
                    ? "Update Task"
                    : "Add Task"}
                </button>

                {editing && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={resetTaskForm}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

          </div>

          {/* TASK LIST */}

          <div className="tasks-card">

            <div className="tasks-header">

              <div>

                <h2>
                  My Student Tasks
                </h2>

                <p>
                  Manage your upcoming
                  school activities.
                </p>

              </div>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value as
                      | "All"
                      | "Pending"
                      | "Completed"
                  )
                }
              >

                <option value="All">
                  All
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>

            {filteredTasks.length === 0 ? (

              <div className="empty-state">

                <div>
                  📚
                </div>

                <h3>
                  No student tasks yet
                </h3>

                <p>
                  Add your first task
                  using the form.
                </p>

              </div>

            ) : (

              <div className="task-list">

                {filteredTasks.map(
                  (item) => (

                    <div
                      className={`task-item ${
                        item.completed
                          ? "completed"
                          : ""
                      }`}
                      key={item.id}
                    >

                      <button
                        type="button"
                        className="check-button"
                        onClick={() =>
                          toggleComplete(
                            item.id
                          )
                        }
                      >
                        {item.completed
                          ? "✓"
                          : ""}
                      </button>

                      <div className="task-info">

                        <div className="task-top">

                          <span className="subject">
                            {item.subject}
                          </span>

                          <span
                            className={`priority ${item.priority.toLowerCase()}`}
                          >
                            {item.priority}
                          </span>

                        </div>

                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          📅 {item.date}
                          &nbsp; 🕐 {item.time}
                        </p>

                      </div>

                      <div className="task-actions">

                        <button
                          type="button"
                          onClick={() =>
                            editTask(item)
                          }
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteTask(item.id)
                          }
                        >
                          🗑️
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;