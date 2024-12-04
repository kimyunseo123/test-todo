import React, { useState, useEffect } from 'react'; // React 관련 모듈
import './App.css';

// Todo 타입 정의
interface Todo {
  _id: string;        // MongoDB의 _id
  task: string;       // 내용
  completed: boolean; // 완료 여부 
}

// 기존 항목과 새로운 항목 저장
const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // todos: Todo 객체 배열
  const [newTask, setNewTask] = useState('');     // 새로운 항목 텍스트 저장

  // 처음 렌더링될 때 기존 항목을 가져옴
  useEffect(() => {
    fetch('http://localhost:5000/todos') // MongoDB에서 기존항목 가져옴
      .then(res => res.json())           // 응답을 JSON으로 변환
      .then(data => setTodos(data));     // 데이터를 목록에 저장
  }, []);

  // 새로운 항목 추가 함수
  const addTodo = () => {
    fetch('http://localhost:5000/todos', {
      method: 'POST', // POST 요청
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: newTask }), // 새로운 항목을 JSON 형식으로 전송
    })
      .then(res => res.json()) // 응답을 JSON으로 변환
      .then(newTodo => setTodos([...todos, newTodo]));  // 새로운 항목을 목록에 추가
    setNewTask(''); // 입력칸 초기화
  };

  // 항목 삭제 함수
  const deleteTodo = (id: string) => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'DELETE', // DELETE 요청
    }).then(() => setTodos(todos.filter(todo => todo._id !== id))); // 삭제된 항목을 목록에서 제거
  };

  return (
    // 화면 출력
    <div className="App">
      <h1>Todo App</h1>
      <input
        type="text"
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="New task"/> {/* 입력칸 기본값 */}

      <button onClick={addTodo}>Add</button> {/* Add 버튼을 클릭하면 addTodo 함수 실행 */}

      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            {todo.task} {/* 할 일 내용 출력 */}
            <button onClick={() => deleteTodo(todo._id)}>Delete</button> {/* Delete 버튼을 클릭하면 deleteTodo 함수 실행 */}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default App;