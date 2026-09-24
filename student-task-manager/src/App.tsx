import { useEffect, useState } from "react";
import "./App.css";

const DEMO_EMAIL = "student@example.com";
const DEMO_PASSWORD = "123456";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("studentTaskManagerTasks");

    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [message, setMessage] = useState("");

  const [task, setTask] = useState({
    id: null,
    subject: "",
    title: "",
    date: "",
    time: "",
    priority: "Medium",
    completed: false,
  });

  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(
      "studentTaskManagerTasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  /* =========================
     LOGIN
  ========================= */

  const login = (e) => {
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

  const register = (e) => {
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

  const forgotPassword = (e) => {
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

  const verifyCode = (e) => {
    e.preventDefault();

    const code = e.target.code.value;

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

  const resetPassword = (e) => {
    e.preventDefault();

    const newPassword =
      e.target.newPassword.value;

    const confirmPassword =
      e.target.confirmPassword.value;

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
    setPage("login");
  };

  /* =========================
     TASK CHANGE
  ========================= */

  const handleTaskChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     SAVE TASK
  ========================= */

  const saveTask = (e) => {
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

    if (editing) {
      setTasks(
        tasks.map((item) =>
          item.id === task.id
            ? {
                ...task,
              }
            : item
        )
      );
    } else {
      setTasks([
        ...tasks,
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

  const editTask = (item) => {
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

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks(
        tasks.filter(
          (item) => item.id !== id
        )
      );
    }
  };

  /* =========================
     COMPLETE TASK
  ========================= */

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((item) =>
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

  const filteredTasks = tasks.filter(
    (item) => {
      if (filter === "Completed") {
        return item.completed;
      }

      if (filter === "Pending") {
        return !item.completed;
      }

      return true;
    }
  );

  /* =========================
     STATISTICS
  ========================= */

  const completedCount =
    tasks.filter(
      (item) => item.completed
    ).length;

  const pendingCount =
    tasks.filter(
      (item) => !item.completed
    ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedCount /
            tasks.length) *
            100
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
                setPassword(
                  e.target.value
                )
              }
            />

            <button className="primary-button">
              Login
            </button>

          </form>

          <button
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
                setPassword(
                  e.target.value
                )
              }
            />

            <button className="primary-button">
              Create Account
            </button>

          </form>

          <button
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

            <button className="primary-button">
              Send Verification Code
            </button>

          </form>

          <button
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

            <button className="primary-button">
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

            <button className="primary-button">
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

                <button className="primary-button">
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
                  setFilter(e.target.value)
                }
              >

                <option>
                  All
                </option>

                <option>
                  Pending
                </option>

                <option>
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
                          &nbsp; 🕐{" "}
                          {item.time}
                        </p>

                      </div>

                      <div className="task-actions">

                        <button
                          onClick={() =>
                            editTask(item)
                          }
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() =>
                            deleteTask(
                              item.id
                            )
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