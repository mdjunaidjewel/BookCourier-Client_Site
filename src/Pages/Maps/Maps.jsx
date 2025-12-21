import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const Maps = () => {
  const districts = [
    { name: "Dhaka", lat: 23.8103, lng: 90.4125 },
    { name: "Chittagong", lat: 22.3569, lng: 91.7832 },
    { name: "Khulna", lat: 22.8456, lng: 89.5403 },
    { name: "Rajshahi", lat: 24.3745, lng: 88.6042 },
    { name: "Sylhet", lat: 24.8949, lng: 91.8687 },
    { name: "Barishal", lat: 22.7010, lng: 90.3535 },
    { name: "Rangpur", lat: 25.7439, lng: 89.2752 },
    { name: "Mymensingh", lat: 24.7471, lng: 90.4203 },
    { name: "Comilla", lat: 23.4609, lng: 91.1809 },
    { name: "Jessore", lat: 23.1680, lng: 89.2180 },
    { name: "Cox's Bazar", lat: 21.4272, lng: 92.0058 },
    { name: "Pabna", lat: 24.0060, lng: 89.2330 },
    { name: "Bogra", lat: 24.8468, lng: 89.3717 },
    { name: "Narsingdi", lat: 23.9256, lng: 90.7170 },
    { name: "Tangail", lat: 24.2500, lng: 89.9167 },
    { name: "Feni", lat: 23.0150, lng: 91.4030 },
    { name: "Noakhali", lat: 22.8167, lng: 91.1000 },
    { name: "Dinajpur", lat: 25.6333, lng: 88.6333 },
    { name: "Thakurgaon", lat: 26.0333, lng: 88.4667 },
    { name: "Sirajganj", lat: 24.4500, lng: 89.7000 },
    { name: "Bhola", lat: 22.6858, lng: 90.6256 },
    { name: "Habiganj", lat: 24.3765, lng: 91.4167 },
    { name: "Kishoreganj", lat: 24.4333, lng: 90.7833 },
    { name: "Naogaon", lat: 24.8167, lng: 88.9667 },
    { name: "Patuakhali", lat: 22.3590, lng: 90.3290 },
  ];

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg mt-6">
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {districts.map((district, idx) => (
          <Marker key={idx} position={[district.lat, district.lng]}>
            <Popup>{district.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Maps;
