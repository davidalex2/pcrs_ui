import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAppliance, type Appliance } from "../api/appliancesApi";

const ApplianceDetail: React.FC = () => {
  const { id } = useParams();
  const [appliance, setAppliance] = useState<Appliance | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchAppliance(id).then(setAppliance);
  }, [id]);

  return (
    <div>
      {appliance && (
        <>
          <h2>{appliance.name}</h2>
          <img src={appliance.imageUrl} alt={appliance.name} width={250}/>
          <p>{appliance.description}</p>
          <p>Rental Price: ₹{appliance.rentalPrice}/day</p>
          <button onClick={() => navigate(`/booking/${appliance.id}`)}>
            Book Now
          </button>
        </>
      )}
    </div>
  );
};

export default ApplianceDetail;
