import { QuestionOutlined } from "@ant-design/icons"
import { Button, Form, Input } from "antd"
import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { Question } from "../../client"
// import { fetchQuestion, updateQuestion } from '../api/questions';

const EditQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [question, setQuestion] = useState<Question | null>(null)
  const [newQuestionText, setNewQuestionText] = useState("")

  useEffect(() => {
    fetchQuestion(id)
      .then((response) => setQuestion(response.data))
      .catch((error) => console.error(error))
  }, [id])

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestionText(e.target.value)
  }

  const handleSubmit = () => {
    if (question && newQuestionText !== question.text) {
      updateQuestion(id, { text: newQuestionText })
        .then(() => {
          setQuestion((prevQuestion) => ({
            ...prevQuestion,
            text: newQuestionText,
          }))
        })
        .catch((error) => console.error(error))
    }
  }

  if (!question) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>Edit Question</h2>
      <Form layout="vertical">
        <Form.Item label="Question">
          <Input
            value={newQuestionText}
            onChange={handleQuestionChange}
            prefix={<QuestionOutlined />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!question.responses.length}
          >
            Update Question
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditQuestion
