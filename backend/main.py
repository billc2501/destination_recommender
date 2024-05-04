from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine 
import models
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import anthropic
import os

from dotenv import load_dotenv


load_dotenv()

app = FastAPI()

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

class DestinationBase(BaseModel):
    temperature: str
    weather: str
    activities: str
    relative_location: str

class DestinationModel(DestinationBase):
    id: int
    location_details: str
    x_coordinate: float
    y_coordinate: float
    class Config:
        orm_mode=True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
models.Base.metadata.create_all(bind=engine)

def get_coordinates(content):
    latitude, longitude = 0.0, 0.0
    pattern = "Latitude: "
    match_index = content.find(pattern)
    if match_index != -1:
        newline_index = content.find('\n', match_index)
        following_string = content[match_index + len(pattern):newline_index]
        latitude = float(following_string.split('°')[0])
        if 'S' in following_string:
            latitude *= -1
    pattern = "Longitude: "
    match_index = content.find(pattern)
    if match_index != -1:
        newline_index = content.find('\n', match_index)
        following_string = content[match_index + len(pattern):newline_index]
        longitude = float(following_string.split('°')[0])
        if 'W' in following_string:
            longitude *= -1
    return latitude, longitude
    


@app.post("/destinations/", response_model=DestinationModel)
async def create_destination(destination: DestinationBase, db: db_dependency):
    message = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1000,
        temperature=0.0,
        system=
        '''
            Act as a tourist guide and recommend a place to go along with the coordinates in decimal degree notation.
        ''',
        messages=[
            {"role": "user", "content": 
             '''
             I want go to a place that has a {} temperature and a climate of {} and I want to do a lot of
             {} there. This place should be in the {}
             '''.format(
                destination.temperature, destination.weather, destination.activities, destination.relative_location)}
        ]
    )
    print(message.content[0].text)
    messageText = message.content[0].text
    db_destination = models.Destination(**destination.model_dump())
    latitude, longitude = get_coordinates(messageText)
    lines = messageText.splitlines()
    location_details = '\n'.join(lines[:4])
    db_destination.y_coordinate = latitude
    db_destination.x_coordinate = longitude
    db_destination.location_details = location_details
    db.add(db_destination)
    db.commit()
    db.refresh(db_destination)
    return db_destination

@app.get("/destinations/", response_model=List[DestinationModel])
async def get_destinations(db: db_dependency):
    destinations = db.query(models.Destination).order_by(models.Destination.id.desc()).limit(5).all()
    return destinations