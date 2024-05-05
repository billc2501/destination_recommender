from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine 
import models
from fastapi.middleware.cors import CORSMiddleware
import anthropic
import requests
import os

from dotenv import load_dotenv


load_dotenv()

app = FastAPI()

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

origins = [
    os.environ.get("CORS_ORIGIN")
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
    climate: str
    activities: str
    relative_location: str

class DestinationModel(DestinationBase):
    id: int
    location_details: str
    x_coordinate: float
    y_coordinate: float
    class Config:
        from_attributes=True

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

@app.get("/locations/")
async def get_nearby_locations(x_coordinate: float, y_coordinate: float):
    url = "https://trueway-places.p.rapidapi.com/FindPlacesNearby"

    querystring = {"location": "{},{}".format(y_coordinate, x_coordinate), "radius":"1000","type": "tourist_attraction", "language":"en"}

    headers = {
        "X-RapidAPI-Key": os.environ.get("PLACES_API"),
        "X-RapidAPI-Host": "trueway-places.p.rapidapi.com"
    }
    response = requests.get(url, headers=headers, params=querystring)
    items = response.json()['results'][:10]
    return items

@app.post("/destinations/", response_model=DestinationModel)
async def create_destination(destination: DestinationBase, db: db_dependency):
    message = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1000,
        temperature=0.0,
        system=
        '''
            1. Act as a tourist guide
            2. Recommend a place to go.
            3. Provide the coordinates in decimal degree notation and format the coordinates in
            'Longitude: ' and 'Latitude: '
        ''',
        messages=[
            {"role": "user", "content": 
             '''
             I want go to a place that has a {} temperature and a climate of {} and some activities I want to do there
             are {}. This place should also be in or close to {}
             '''.format(
                destination.temperature, destination.climate, destination.activities, destination.relative_location)}
        ]
    )
    messageText = message.content[0].text
    db_destination = models.Destination(**destination.model_dump())
    latitude, longitude = get_coordinates(messageText)
    db_destination.y_coordinate = latitude
    db_destination.x_coordinate = longitude
    db_destination.location_details = messageText
    db.add(db_destination)
    db.commit()
    db.refresh(db_destination)
    return db_destination

@app.get("/destinations/", response_model=List[DestinationModel])
async def get_destinations(db: db_dependency):
    destinations = db.query(models.Destination).order_by(models.Destination.id.desc()).limit(5).all()
    return destinations

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)