import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShowPage = () => {
  const { nasaId } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  }

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        // Fetching media asset's manifest
        const assetResponse = await axios.get(`https://images-api.nasa.gov/asset/${nasaId}`);
        if (assetResponse.data && assetResponse.data.collection && assetResponse.data.collection.items) {
          setItemDetails(assetResponse.data.collection.items);
        }

        // Fetching media asset's metadata
        const metadataResponse = await axios.get(`https://images-api.nasa.gov/metadata/${nasaId}`);

        if (metadataResponse.data && metadataResponse.data.location) {
          const metadataUrl = metadataResponse.data.location;
          const metadataDataResponse = await axios.get(metadataUrl);
          setMetadata(metadataDataResponse.data);
        }
      } catch (error) {
        console.error('Error fetching details: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [nasaId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!itemDetails) {
    return <div>Item details not found.</div>;
  }

  // Finding the first image in the asset manifest
  const imageItem = itemDetails.find(item => item.href.includes('~orig') || item.href.includes('~large'));

  return (
    <div className="show-container show-page">
      <button className="back-button" onClick={handleBackClick}>Back to Results</button>
      {imageItem && (
        <img src={imageItem.href} alt={metadata.title || 'NASA Media'} />
      )}
      <h1>{metadata["AVAIL:Title"] || 'Title Not Available'}</h1>
      <div className="metadata">
        <p>
          <span className="metadata-label">Description:</span>
          <span className="metadata-content">{metadata["AVAIL:Description"] || 'No description available.'}</span>
        </p>
        <p>
          <span className="metadata-label">Location:</span>
          <span className="metadata-content">{metadata["AVAIL:Location"] || 'N/A'}</span>
        </p>
        <p>
          <span className="metadata-label">Photographer:</span>
          <span className="metadata-content">{metadata["AVAIL:Photographer"] || 'N/A'}</span>
        </p>
        <p>
          <span className="metadata-label">Date Created:</span>
          <span className="metadata-content">{metadata["AVAIL:DateCreated"] || 'Unknown'}</span>
        </p>
        <p>
          <span className="metadata-label">Keywords:</span>
          <span className="metadata-content">{metadata["AVAIL:Keywords"] ? metadata["AVAIL:Keywords"].join(', ') : 'None'}</span>
        </p>
      </div>
    </div>
  );
};

export default ShowPage;