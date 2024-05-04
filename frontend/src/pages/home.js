import React, {useState, useEffect} from 'react';
import api from '../api'
import {Card} from 'react-bootstrap';



const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    temperature: '',
    weather: '',
    activities: '',
    relative_location: '',
  });
  const fetchDestinations = async () => {
    const response = await api.get('/destinations/');
    setDestinations(response.data);
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

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
      weather: '',
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
              <input type='text' className='form-control' id='temperature' name='temperature' onChange={handleInputChange} value={formData.temperature}/>
            </div>
            <div className='mb-3'>
              <label htmlFor='weather' className='form-label'>
                Weather
              </label>
              <input type='text' className='form-control' id='weather' name='weather' onChange={handleInputChange} value={formData.weather}/>
            </div>
            <div className='mb-3'>
              <label htmlFor='activities' className='form-label'>
                Activities
              </label>
              <input type='text' className='form-control' id='activities' name='activities' onChange={handleInputChange} value={formData.activities}/>
            </div>
            <div className='mb-3'>
              <label htmlFor='relative_location' className='form-label'>
                Relative Location
              </label>
              <input type='text' className='form-control' id='relative_location' name='relative_location' onChange={handleInputChange} value={formData.relative_location}/>
            </div>
            <button type="submit" className='btn btn-primary' disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </form>
          <div>Your Place of Choice:</div>
          <Card className="border border-primary">
            <Card.Body>{!destinations.length ? 'Not available' : destinations[0].location_details}</Card.Body>
          </Card>
        </div>
    </div>
  )
}

export default Home;
