import { useState, useEffect } from 'react';

export default function Todo() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(()=>{
   getAllTodos()
  },[])
  const getAllTodos =async () => {
    try {
      const response = await fetch('http://localhost:9000/todo/');
      const data = await response.json();
      setTasks(data?.data);
      
    } catch (error) {
      console.error("line no 24",error)
    }

  }

console.log(tasks);
  const addTask = () => {
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const deleteTask = async (id) => {
    const responce = await fetch(`http://localhost:9000/todo/${id}`)
    const data = await responce.json()
     setTasks(data?.data)
    setTasks(tasks.filter((task) => task._id !== id));
  };
console.log(tasks)
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };
  console.log(tasks)

  return (
    <div style={styles.container}>
      <h2>📝 Task Manager</h2>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addButton}>Add</button>
      </div>

      <ul style={styles.taskList}>
        {tasks.map((task,index) => (
          <li key={index} style={styles.taskItem}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span
              style={{
                ...styles.taskText,
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task._id)} style={styles.deleteButton}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    fontSize: '16px',
  },
  addButton: {
    marginLeft: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  taskText: {
    marginLeft: '10px',
    flexGrow: 1,
  },
  deleteButton: {
    marginLeft: '10px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '16px',
  },
};

