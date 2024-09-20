from sqlalchemy.orm import Session

from app.models import Question, QuestionUpdate  # Replace with your own models


def update_question(
    db: Session, question: Question, question_update: QuestionUpdate
) -> Question:
    question.text = question_update.text
    db.commit()
    db.refresh(question)
    return question
