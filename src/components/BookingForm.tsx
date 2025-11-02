import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookAppliance } from "../api/appliancesApi";

const BookingForm: React.FC = () => {
  const { id } = useParams();
  const [days, setDays] = useState<number>(1);
  const navigate = useNavigate();

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id)
      await bookAppliance({ applianceId: id, days });
    navigate("/");
  };

  return (
    <form onSubmit={submitBooking}>
      <label htmlFor="days">Days:</label>
      <input type="number" id="days" value={days} min={1} onChange={e => setDays(Number(e.target.value))} required />
      <button type="submit">Confirm Booking</button>
    </form>
  );
};

export default BookingForm;
