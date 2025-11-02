import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAppliances, type Appliance } from "../api/appliancesApi";

const ApplianceList: React.FC = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);

  useEffect(() => {
    fetchAppliances().then(setAppliances);
  }, []);

  return (
    <div>
      <h2>Available Appliances</h2>
      <div>
        {appliances.map(a => (
          <div key={a.id}>
            <Link to={`/appliance/${a.id}`}>
              <h3>{a.name}</h3>
              <img src={a.imageUrl} alt={a.name} width={150}/>
              <p>{a.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplianceList;
