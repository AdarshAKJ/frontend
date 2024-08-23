import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './GifDetail.css';

function GifDetail() {
    const { id } = useParams(); // Get GIF ID from URL parameters
    const [gif, setGif] = useState(null);

    // Function to fetch GIF details by ID
    const fetchGif = async () => {
        try {
            const response = await axios.get(`https://backend-six-theta-85.vercel.app/api/gif/${id}`);
            setGif(response.data.gif);
        } catch (error) {
            console.error('Error fetching GIF details:', error);
        }
    };

    useEffect(() => {
        fetchGif();
    }, [id]);

    if (!gif) return <div>Loading...</div>;

    return (
        <div id="gif-detail-container">
            <img src={gif.url} alt={gif.title} className="gif-detail" />
            <div className="gif-info">
                <h2>{gif.title}</h2>
                <p><strong>Tags:</strong> {gif.tags.join(', ')}</p>
                <p><strong>Rank:</strong> {gif.rank}</p>
            </div>
        </div>
    );
}

export default GifDetail;
