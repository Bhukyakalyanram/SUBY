import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const AddFirm = () => {
  const [firmName, setFirmName] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setRegion((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleImageUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginToken = localStorage.getItem('loginToken');
      if (!loginToken) {
        return alert('User not authenticated');
      }

      const formData = new FormData();
      formData.append('firmName', firmName);
      formData.append('area', area);
      formData.append('offer', offer);
      if (file) formData.append('image', file);
      category.forEach((c) => formData.append('category', c));
      region.forEach((r) => formData.append('region', r));

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginToken}`, // Correct header format
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Add Firm response:', response.status, data);

      if (response.ok) {
        setFirmName('');
        setArea('');
        setCategory([]);
        setRegion([]);
        setOffer('');
        setFile(null);
        alert('Firm added Successfully');
        localStorage.setItem('firmId', data.firmId || '');
        window.location.reload();
      } else {
        alert(data.message || 'Failed to add Firm');
      }
    } catch (error) {
      console.error('Failed to add Firm', error);
      alert('Failed to add Firm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firmSection">
      {loading && (
        <div className="loaderSection">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
          />
        </div>
      )}

      {!loading && (
        <form className="tableForm" onSubmit={handleFirmSubmit}>
          <h3>Add Firm</h3>

          <label>Firm Name</label>
          <input
            type="text"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
          />

          <label>Area</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <div>
            <label>Category</label>
            <label>
              <input
                type="checkbox"
                value="veg"
                checked={category.includes('veg')}
                onChange={handleCategoryChange}
              />{' '}
              Veg
            </label>
            <label>
              <input
                type="checkbox"
                value="non-veg"
                checked={category.includes('non-veg')}
                onChange={handleCategoryChange}
              />{' '}
              Non-Veg
            </label>
          </div>

          <label>Offer</label>
          <input
            type="text"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
          />

          <div>
            <label>Region</label>
            {['south-indian', 'north-indian', 'chinese', 'bakery'].map((r) => (
              <label key={r}>
                <input
                  type="checkbox"
                  value={r}
                  checked={region.includes(r)}
                  onChange={handleRegionChange}
                />{' '}
                {r}
              </label>
            ))}
          </div>

          <label>Firm Image</label>
          <input type="file" onChange={handleImageUpload} />

          <div className="btnSubmit">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddFirm;
