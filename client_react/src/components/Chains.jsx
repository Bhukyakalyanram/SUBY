/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from 'react-icons/fa';
import { MagnifyingGlass } from 'react-loader-spinner';

const Chains = () => {
  const [vendorData, setVendorData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch vendors
  const vendorFirmHandler = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/all-vendors`);
      const newData = await response.json();
      setVendorData(newData);
      setLoading(false);
    } catch (error) {
      toast.error('failed to fetch data');
      console.error('failed to fetch data', error);
      setLoading(true);
    }
  };

  useEffect(() => {
    vendorFirmHandler();
  }, []);

  // Scroll handler
  const handleScroll = (direction) => {
    const gallery = document.getElementById('chainGallery');
    const scrollAmount = 500;
    if (direction === 'left') {
      gallery.scrollTo({
        left: gallery.scrollLeft - scrollAmount,
        behavior: 'smooth',
      });
    } else if (direction === 'right') {
      gallery.scrollTo({
        left: gallery.scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mediaChainSection">
      <div className="loaderSection">
        {loading && (
          <>
            <div className="loader">Your 🥣 is Loading...</div>
            <MagnifyingGlass
              visible={true}
              height="80"
              width="80"
              ariaLabel="magnifying-glass-loading"
              glassColor="#c0efff"
              color="#e15b64"
            />
          </>
        )}
      </div>

      <div className="btnSection">
        <button onClick={() => handleScroll('left')}>
          <FaRegArrowAltCircleLeft className="btnIcons" />
        </button>
        <button onClick={() => handleScroll('right')}>
          <FaRegArrowAltCircleRight className="btnIcons" />
        </button>
      </div>

      <h3>Top restaurant chains in Hyderabad</h3>

      <section
        className="chainSection"
        id="chainGallery"
        onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
      >
        {vendorData.vendors &&
          vendorData.vendors.map((vendor) => (
            <div className="vendorBox" key={vendor._id || vendor.id}>
              {vendor.firm.map((item) => (
                <div className="firmBox" key={item._id || item.firmName}>
                  <div>{item.firmName}</div>
                  <div className="firmImage">
                    <img
                      src={`${API_URL}/uploads/${item.image}`}
                      alt={item.firmName}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
      </section>
    </div>
  );
};

export default Chains;
