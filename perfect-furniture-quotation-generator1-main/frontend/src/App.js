import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Bed, 
  Armchair, 
  DoorOpen, 
  ChefHat, 
  Paintbrush, 
  Lightbulb, 
  Droplet, 
  CloudRain,
  FileDown,
  Check,
  Sofa,
  Lamp,
  BookOpen,
  Tv,
  UtensilsCrossed,
  ShieldCheck
} from 'lucide-react';
import { generatePDF } from './utils/generatePDF';
import './App.css';

// Major Indian Cities
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Chandigarh'
].sort();

function App() {
  // Client Details
  const [clientName, setClientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [city, setCity] = useState('');
  const [carpetArea, setCarpetArea] = useState('');

  // BHK Selection
  const [bhkType, setBhkType] = useState(1);

  // Bedrooms
  const [bedrooms, setBedrooms] = useState([
    { id: 1, items: { bed: false, sideTable: false, dressingTable: false, wardrobe: false }, area: '', rate: '' }
  ]);
  const [activeBedroom, setActiveBedroom] = useState(0);

  // Living Room
  const [livingRoom, setLivingRoom] = useState({
    items: { tvUnit: false, sofaSet: false, diningTable: false, safetyDoor: false, falseCeiling: false },
    area: '',
    rate: ''
  });

  // Kitchen
  const [kitchen, setKitchen] = useState({ area: '', rate: '' });

  // Painting
  const [painting, setPainting] = useState({ area: '', rate: '' });

  // False Ceiling
  const [falseCeiling, setFalseCeiling] = useState({ area: '', rate: '' });

  // Electrical
  const [electrical, setElectrical] = useState({ units: '', rate: '' });

  // Plumbing
  const [plumbing, setPlumbing] = useState({ units: '', rate: '' });

  // Total Cost
  const [totalCost, setTotalCost] = useState(0);

  // Update bedrooms when BHK changes
  useEffect(() => {
    const newBedrooms = [];
    for (let i = 0; i < bhkType; i++) {
      newBedrooms.push(
        bedrooms[i] || { 
          id: i + 1, 
          items: { bed: false, sideTable: false, dressingTable: false, wardrobe: false }, 
          area: '', 
          rate: '' 
        }
      );
    }
    setBedrooms(newBedrooms);
    if (activeBedroom >= bhkType) {
      setActiveBedroom(bhkType - 1);
    }
  }, [bhkType]);

  // Calculate Total Cost
  useEffect(() => {
    let total = 0;

    // Bedrooms
    bedrooms.forEach(bedroom => {
      const area = parseFloat(bedroom.area) || 0;
      const rate = parseFloat(bedroom.rate) || 0;
      total += area * rate;
    });

    // Living Room
    const livingArea = parseFloat(livingRoom.area) || 0;
    const livingRate = parseFloat(livingRoom.rate) || 0;
    total += livingArea * livingRate;

    // Kitchen
    const kitchenArea = parseFloat(kitchen.area) || 0;
    const kitchenRate = parseFloat(kitchen.rate) || 0;
    total += kitchenArea * kitchenRate;

    // Painting
    const paintingArea = parseFloat(painting.area) || 0;
    const paintingRate = parseFloat(painting.rate) || 0;
    total += paintingArea * paintingRate;

    // False Ceiling
    const falseCeilingArea = parseFloat(falseCeiling.area) || 0;
    const falseCeilingRate = parseFloat(falseCeiling.rate) || 0;
    total += falseCeilingArea * falseCeilingRate;

    // Electrical
    const electricalUnits = parseFloat(electrical.units) || 0;
    const electricalRate = parseFloat(electrical.rate) || 0;
    total += electricalUnits * electricalRate;

    // Plumbing
    const plumbingUnits = parseFloat(plumbing.units) || 0;
    const plumbingRate = parseFloat(plumbing.rate) || 0;
    total += plumbingUnits * plumbingRate;

    setTotalCost(total);
  }, [bedrooms, livingRoom, kitchen, painting, falseCeiling, electrical, plumbing]);

  // Toggle Bedroom Item
  const toggleBedroomItem = (bedroomIndex, itemName) => {
    const newBedrooms = [...bedrooms];
    newBedrooms[bedroomIndex].items[itemName] = !newBedrooms[bedroomIndex].items[itemName];
    setBedrooms(newBedrooms);
  };

  // Update Bedroom Field
  const updateBedroomField = (bedroomIndex, field, value) => {
    const newBedrooms = [...bedrooms];
    newBedrooms[bedroomIndex][field] = value;
    setBedrooms(newBedrooms);
  };

  // Toggle Living Room Item
  const toggleLivingRoomItem = (itemName) => {
    setLivingRoom({
      ...livingRoom,
      items: { ...livingRoom.items, [itemName]: !livingRoom.items[itemName] }
    });
  };

  // Handle PDF Generation
  const handleGeneratePDF = async () => {
    const quotationData = {
      clientName,
      contactNumber,
      city,
      carpetArea,
      bedrooms,
      livingRoom,
      kitchen,
      painting,
      falseCeiling,
      electrical,
      plumbing,
      totalCost
    };

    await generatePDF(quotationData);
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="logo-container">
            <div className="logo-icon">
              <Armchair size={32} color="#6366F1" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>
              Perfect Furniture
            </h1>
          </div>
          <p style={{ fontSize: '1.1rem', opacity: 0.95, maxWidth: '600px', margin: '0 auto' }}>
            Professional Interior Quotation Generator
          </p>
        </div>
      </div>

      <div className="container">
        {/* Client Details */}
        <div className="section-card">
          <div className="section-header">
            <Home size={32} color="#6366F1" />
            <h2 className="section-title">Client Details</h2>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                data-testid="client-name-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                data-testid="contact-number-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <select
                className="form-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                data-testid="city-select"
              >
                <option value="">Select City</option>
                {INDIAN_CITIES.map(cityName => (
                  <option key={cityName} value={cityName}>{cityName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Total Carpet Area (sqft)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter carpet area"
                value={carpetArea}
                onChange={(e) => setCarpetArea(e.target.value)}
                data-testid="carpet-area-input"
              />
            </div>
          </div>
        </div>

        {/* BHK Selection */}
        <div className="section-card">
          <div className="section-header bedroom">
            <Bed size={32} color="#6366F1" />
            <h2 className="section-title">Select BHK Type</h2>
          </div>
          <div className="bhk-selector">
            {[1, 2, 3].map(num => (
              <div
                key={num}
                className={`bhk-option ${bhkType === num ? 'selected' : ''}`}
                onClick={() => setBhkType(num)}
                data-testid={`bhk-${num}-option`}
              >
                {num} BHK
              </div>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        {bhkType > 0 && (
          <div className="section-card">
            <div className="section-header bedroom">
              <Bed size={32} color="#6366F1" />
              <h2 className="section-title">Bedroom Details</h2>
            </div>

            {/* Bedroom Tabs */}
            {bhkType > 1 && (
              <div className="bedroom-tabs">
                {bedrooms.map((bedroom, index) => (
                  <div
                    key={bedroom.id}
                    className={`bedroom-tab ${activeBedroom === index ? 'active' : ''}`}
                    onClick={() => setActiveBedroom(index)}
                    data-testid={`bedroom-tab-${index + 1}`}
                  >
                    Bedroom {bedroom.id}
                  </div>
                ))}
              </div>
            )}

            {/* Active Bedroom Content */}
            {bedrooms[activeBedroom] && (
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#475569' }}>
                  {bhkType === 1 ? 'Select Furniture Items' : `Bedroom ${activeBedroom + 1} - Select Items`}
                </h3>
                <div className="selection-cards">
                  <div
                    className={`selection-card ${bedrooms[activeBedroom].items.bed ? 'selected' : ''}`}
                    onClick={() => toggleBedroomItem(activeBedroom, 'bed')}
                    data-testid={`bedroom-${activeBedroom + 1}-bed-card`}
                  >
                    <Bed className="selection-card-icon" />
                    <span className="selection-card-label">Bed</span>
                    <div className="checkmark">
                      <Check size={16} color="white" />
                    </div>
                  </div>
                  <div
                    className={`selection-card ${bedrooms[activeBedroom].items.sideTable ? 'selected' : ''}`}
                    onClick={() => toggleBedroomItem(activeBedroom, 'sideTable')}
                    data-testid={`bedroom-${activeBedroom + 1}-sidetable-card`}
                  >
                    <Lamp className="selection-card-icon" />
                    <span className="selection-card-label">Side Table</span>
                    <div className="checkmark">
                      <Check size={16} color="white" />
                    </div>
                  </div>
                  <div
                    className={`selection-card ${bedrooms[activeBedroom].items.dressingTable ? 'selected' : ''}`}
                    onClick={() => toggleBedroomItem(activeBedroom, 'dressingTable')}
                    data-testid={`bedroom-${activeBedroom + 1}-dressing-card`}
                  >
                    <BookOpen className="selection-card-icon" />
                    <span className="selection-card-label">Dressing Table</span>
                    <div className="checkmark">
                      <Check size={16} color="white" />
                    </div>
                  </div>
                  <div
                    className={`selection-card ${bedrooms[activeBedroom].items.wardrobe ? 'selected' : ''}`}
                    onClick={() => toggleBedroomItem(activeBedroom, 'wardrobe')}
                    data-testid={`bedroom-${activeBedroom + 1}-wardrobe-card`}
                  >
                    <DoorOpen className="selection-card-icon" />
                    <span className="selection-card-label">Wardrobe</span>
                    <div className="checkmark">
                      <Check size={16} color="white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Bedroom Area (sqft)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter area"
                      value={bedrooms[activeBedroom].area}
                      onChange={(e) => updateBedroomField(activeBedroom, 'area', e.target.value)}
                      data-testid={`bedroom-${activeBedroom + 1}-area-input`}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rate per sqft (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter rate"
                      value={bedrooms[activeBedroom].rate}
                      onChange={(e) => updateBedroomField(activeBedroom, 'rate', e.target.value)}
                      data-testid={`bedroom-${activeBedroom + 1}-rate-input`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Living Room */}
        <div className="section-card">
          <div className="section-header living">
            <Sofa size={32} color="#EC4899" />
            <h2 className="section-title">Living Room</h2>
          </div>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#475569' }}>
            Select Items
          </h3>
          <div className="selection-cards">
            <div
              className={`selection-card ${livingRoom.items.tvUnit ? 'selected' : ''}`}
              onClick={() => toggleLivingRoomItem('tvUnit')}
              data-testid="living-tvunit-card"
            >
              <Tv className="selection-card-icon" />
              <span className="selection-card-label">TV Unit</span>
              <div className="checkmark">
                <Check size={16} color="white" />
              </div>
            </div>
            <div
              className={`selection-card ${livingRoom.items.sofaSet ? 'selected' : ''}`}
              onClick={() => toggleLivingRoomItem('sofaSet')}
              data-testid="living-sofa-card"
            >
              <Sofa className="selection-card-icon" />
              <span className="selection-card-label">Sofa Set</span>
              <div className="checkmark">
                <Check size={16} color="white" />
              </div>
            </div>
            <div
              className={`selection-card ${livingRoom.items.diningTable ? 'selected' : ''}`}
              onClick={() => toggleLivingRoomItem('diningTable')}
              data-testid="living-dining-card"
            >
              <UtensilsCrossed className="selection-card-icon" />
              <span className="selection-card-label">Dining Table</span>
              <div className="checkmark">
                <Check size={16} color="white" />
              </div>
            </div>
            <div
              className={`selection-card ${livingRoom.items.safetyDoor ? 'selected' : ''}`}
              onClick={() => toggleLivingRoomItem('safetyDoor')}
              data-testid="living-safetydoor-card"
            >
              <ShieldCheck className="selection-card-icon" />
              <span className="selection-card-label">Safety Door</span>
              <div className="checkmark">
                <Check size={16} color="white" />
              </div>
            </div>
            <div
              className={`selection-card ${livingRoom.items.falseCeiling ? 'selected' : ''}`}
              onClick={() => toggleLivingRoomItem('falseCeiling')}
              data-testid="living-falseceiling-card"
            >
              <CloudRain className="selection-card-icon" />
              <span className="selection-card-label">False Ceiling</span>
              <div className="checkmark">
                <Check size={16} color="white" />
              </div>
            </div>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Living Room Area (sqft)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter area"
                value={livingRoom.area}
                onChange={(e) => setLivingRoom({ ...livingRoom, area: e.target.value })}
                data-testid="living-area-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rate per sqft (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter rate"
                value={livingRoom.rate}
                onChange={(e) => setLivingRoom({ ...livingRoom, rate: e.target.value })}
                data-testid="living-rate-input"
              />
            </div>
          </div>
        </div>

        {/* Kitchen */}
        <div className="section-card">
          <div className="section-header kitchen">
            <ChefHat size={32} color="#14B8A6" />
            <h2 className="section-title">Kitchen</h2>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Kitchen Area (sqft)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter area"
                value={kitchen.area}
                onChange={(e) => setKitchen({ ...kitchen, area: e.target.value })}
                data-testid="kitchen-area-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rate per sqft (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter rate"
                value={kitchen.rate}
                onChange={(e) => setKitchen({ ...kitchen, rate: e.target.value })}
                data-testid="kitchen-rate-input"
              />
            </div>
          </div>
        </div>

        {/* Painting Work */}
        <div className="section-card">
          <div className="section-header utilities">
            <Paintbrush size={32} color="#F59E0B" />
            <h2 className="section-title">Painting Work</h2>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Painting Area (sqft)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter area"
                value={painting.area}
                onChange={(e) => setPainting({ ...painting, area: e.target.value })}
                data-testid="painting-area-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rate per sqft (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter rate"
                value={painting.rate}
                onChange={(e) => setPainting({ ...painting, rate: e.target.value })}
                data-testid="painting-rate-input"
              />
            </div>
          </div>
        </div>

        {/* False Ceiling */}
        <div className="section-card">
          <div className="section-header utilities">
            <CloudRain size={32} color="#F59E0B" />
            <h2 className="section-title">False Ceiling</h2>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">False Ceiling Area (sqft)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter area"
                value={falseCeiling.area}
                onChange={(e) => setFalseCeiling({ ...falseCeiling, area: e.target.value })}
                data-testid="falseceiling-area-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rate per sqft (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter rate"
                value={falseCeiling.rate}
                onChange={(e) => setFalseCeiling({ ...falseCeiling, rate: e.target.value })}
                data-testid="falseceiling-rate-input"
              />
            </div>
          </div>
        </div>

        {/* Electrical Work */}
        <div className="section-card">
          <div className="section-header utilities">
            <Lightbulb size={32} color="#F59E0B" />
            <h2 className="section-title">Electrical Work</h2>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Number of Electrical Points</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter units"
                value={electrical.units}
                onChange={(e) => setElectrical({ ...electrical, units: e.target.value })}
                data-testid="electrical-units-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rate per Point (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter rate"
                value={electrical.rate}
                onChange={(e) => setElectrical({ ...electrical, rate: e.target.value })}
                data-testid="electrical-rate-input"
              />
            </div>
          </div>
        </div>

        {/* Plumbing Work */}
        <div className="section-card">
          <div className="section-header utilities">
            <Droplet size={32} color="#F59E0B" />
            <h2 className="section-title">Plumbing Work</h2>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Number of Plumbing Points</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter units"
                value={plumbing.units}
                onChange={(e) => setPlumbing({ ...plumbing, units: e.target.value })}
                data-testid="plumbing-units-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rate per Point (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter rate"
                value={plumbing.rate}
                onChange={(e) => setPlumbing({ ...plumbing, rate: e.target.value })}
                data-testid="plumbing-rate-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky-footer">
        <div className="total-cost">
          <div className="total-label">Total Project Cost</div>
          <div className="total-amount" data-testid="total-cost-display">₹{totalCost.toLocaleString('en-IN')}</div>
        </div>
        <button 
          className="generate-pdf-btn" 
          onClick={handleGeneratePDF}
          disabled={!clientName || !contactNumber || totalCost === 0}
          data-testid="generate-pdf-button"
        >
          <FileDown size={24} />
          Generate Quotation PDF
        </button>
      </div>
    </div>
  );
}

export default App;