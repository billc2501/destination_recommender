from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float

class Destination(Base):
    __tablename__ = 'destination'
    id = Column(Integer, primary_key=True, index=True)
    temperature = Column(String)
    climate = Column(String)
    activities = Column(String)
    relative_location = Column(String)
    location_details = Column(String)
    x_coordinate = Column(Float, default=0.0)
    y_coordinate = Column(Float, default=0.0)