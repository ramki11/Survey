from typing import Optional

from backend.app.api.deps import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.models import Question, QuestionUpdate  # Waiting for actual models
from app.services import questions_service

router = APIRouter()


@router.put("/{question_id}", response_model=Question)
async def update_question(
    question_id: int, question_update: QuestionUpdate, db: Session = Depends(get_db)
):
    existing_question = questions_service.get_question_by_id(db, question_id)

    if not existing_question:
        raise HTTPException(status_code=404, detail="Question not found")

    if existing_question.responses:
        raise HTTPException(
            status_code=400, detail="Cannot edit question with responses"
        )

    updated_question = questions_service.update_question(
        db, existing_question, question_update
    )
    return updated_question
