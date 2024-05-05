import React, {useState, useEffect} from 'react';
import api from '../api'
import {Card} from 'react-bootstrap';


const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    temperature: '',
    climate: '',
    activities: '',
    relative_location: '',
  });
  const fetchDestinations = async () => {
    const response = await api.get('/destinations/');
    setDestinations(response.data);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (destinations.length){
        const locations = await api.post('/locations/', {x_coordinate: destinations[0].x_coordinate, y_coordinate: destinations[0].y_coordinate});
        console.log(locations.data);
        setLocations(locations.data);
      }
    }
    fetchLocation()
    .catch(console.error);
  }, [destinations]);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData({
      ...formData,
      [event.target.name]: value
    })
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    await api.post('/destinations/', formData);
    fetchDestinations();
    setFormData({
      temperature: '',
      climate: '',
      activities: '',
      relative_location: '',
    });
    setIsLoading(false);
  }

  return (
    <div class>
      <div className='container'>
          <form className="border border-primary rounded p-4 m-3" onSubmit={handleFormSubmit}>
            <div className='mb-3 mt-3s'>
              <label htmlFor='temperature' className='form-label'>
                  Temperature
              </label>
              <select className='form-select' id='temperature' name='temperature' onChange={handleInputChange} value={formData.temperature}>
                  <option value=''>Select Temperature</option>
                  <option value='hot'>Hot</option>
                  <option value='warm'>Warm</option>
                  <option value='moderate'>Moderate</option>
                  <option value='cool'>Cool</option>
                  <option value='cold'>Cold</option>
              </select>
            </div>
            <div class='mb-3'>
              <label htmlFor='climate-type' className='form-label'>
                  Climate
              </label>
              <select class='form-select' id='climate' name='climate' onChange={handleInputChange} value={formData.climate}>
                  <option value=''>Select Climate</option>
                  <option value='tropical'>Tropical</option>
                  <option value='temperate'>Temperate</option>
                  <option value='arid'>Arid</option>
                  <option value='polar'>Polar</option>
                  <option value='mountainous'>Mountainous</option>
              </select>
            </div>
            <div className='mb-3'>
              <label htmlFor='activities' className='form-label'>
                Activities To Do
              </label>
              <input type='text' placeholder='i.e. Surfing, Hiking' className='form-control' id='activities' name='activities' onChange={handleInputChange} value={formData.activities}/>
            </div>
            <div className='mb-3'>
              <label htmlFor='relative_location' className='form-label'>
                Geographical Area/Proximity
              </label>
              <input type='text' placeholder='i.e. South America, US East Coast, Africa'  className='form-control' id='relative_location' name='relative_location' onChange={handleInputChange} value={formData.relative_location}/>
            </div>
            <button type="submit" className='btn btn-primary' disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </form>
          <div className='border border-primary'>
            <div className='text-center fw-bold pt-3'>Our Recommendation</div>
              <Card className="bg-light">
                <Card.Body>{!destinations.length ? 'Not available' : destinations[0].location_details}</Card.Body>
              </Card>
              <div className='text-center fw-bold pt-3'>Tourist Attractions</div>
              <Card className="bg-light">
                {locations.length ? locations.map((location) => (
                  <div key={location.id}>
                    <div className='fw-bold text-center pt-2'>
                      {location.name}
                    </div>
                    <div className='text-center'>
                      {location.address}
                    </div>
                    <div className='text-center'>
                      {location.website}
                    </div>
                  </div>
                )) : <div className='text-center'>N/A</div>}
              </Card>
            </div>
          </div>
    </div>
  )
}

export default Home;
