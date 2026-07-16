import React, { useState } from "react";
import Navbar from "../component/Navbar";
import SearchBar from "../component/SearchBar";


const Home = () => {
  const [city, setCity] = useState("");

  return (
    <div>
      <Navbar />

      <SearchBar
        city={city}
        setCity={setCity}
      />
      {console.log(city)}
    </div>
  );
};

export default Home;