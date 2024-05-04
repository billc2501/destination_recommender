import DetailsModal from '../components/DetailsModal';
import api from '../api'
import React, {useState, useEffect} from 'react';

const Results = () => {
    const [destinations, setDestinations] = useState([]);
    const fetchDestinations = async () => {
        const response = await api.get('/destinations/');
        setDestinations(response.data);
    };

    useEffect(() => {
        fetchDestinations();
    }, []);
    return (
    <>
        <h5 class="text-center">Prior Results</h5>
        <table className='table table-striped table-bordered table-hover mt-1 mx-5 mb-5'>

            <thead>
                <th>Temp</th>
                <th>Weather</th>
                <th>Activities</th>
                <th>Relative Location</th>
                <th>Details</th>
            </thead>
            <tbody>
                {destinations.map((destination) => (
                    <tr key={destination.id}>
                    <td>{destination.temperature}</td>
                    <td>{destination.weather}</td>
                    <td>{destination.activities}</td>
                    <td>{destination.relative_location}</td>
                    <DetailsModal location_details={destination.location_details}></DetailsModal>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
    )
}

export default Results;