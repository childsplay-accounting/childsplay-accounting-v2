"""API routes for the BusinessDetails master file.

Only one record exists in the business_details table.
- GET  /business-details  → retrieve the single record
- PUT  /business-details  → update the single record (for future admin housekeeping)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.business_details import BusinessDetails
from app.schemas.business_details import BusinessDetailsResponse, BusinessDetailsUpdate

router = APIRouter(prefix="/business-details", tags=["Business Details"])


@router.get("/", response_model=BusinessDetailsResponse)
def get_business_details(db: Session = Depends(get_db)):
    """Retrieve the single business details master record.

    This is the sole record describing the Childsplay Accounting business.
    The response includes a dynamically computed `copyright` field with
    the current year.
    """
    record = db.query(BusinessDetails).first()
    if not record:
        raise HTTPException(
            status_code=404,
            detail="Business details record not found. Run the seed script.",
        )
    return record


@router.put("/", response_model=BusinessDetailsResponse)
def update_business_details(
    payload: BusinessDetailsUpdate,
    db: Session = Depends(get_db),
):
    """Update the business details master record.

    Only fields provided in the request body will be updated.
    This endpoint is intended for future administrative housekeeping.
    """
    record = db.query(BusinessDetails).first()
    if not record:
        raise HTTPException(
            status_code=404,
            detail="Business details record not found. Run the seed script.",
        )

    # Apply only the fields that were explicitly provided (not None)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record
