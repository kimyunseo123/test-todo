import express, { Request, Response } from 'express';
import mongoose from 'mongoose'; // MongoDB 연결을 위함
import cors from 'cors'; // 다른 도메인에서 API 요청을 위함

const app = express();
const port = 5000; // 서버 포트

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/test') // MongoDB 로컬 서버 연결 // mongodb://localhost:27017/"데이터베이스이름"
  .then(() => {
    console.log('Connected to MongoDB'); // 성공
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err); // 실패
  });

// TODO 스키마 정의
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

// TODO 생성 - MongoDB와 연결
const Todo = mongoose.model('Todo', todoSchema);

// API
// GET 요청: 모든 할 일 목록을 가져오는 API
app.get('/todos', async (req: Request, res: Response) => {
  const todos = await Todo.find();
  res.json(todos);
});
// POST 요청: 새로운 할 일을 추가하는 API
app.post('/todos', async (req: Request, res: Response) => {
  const { task } = req.body;
  const newTodo = new Todo({
    task,
    completed: false
  });
  await newTodo.save();
  res.json(newTodo);
});
// DELETE 요청: 특정 할 일을 삭제하는 API
app.delete('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.sendStatus(204);
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});