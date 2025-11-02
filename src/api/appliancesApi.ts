export interface Appliance {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  rentalPrice: number;
}
const api_url="http://localhost:9090/v1/hars";
export const fetchAppliances = async (): Promise<any> => {
  const res = await fetch(api_url + '/rental/items/all');
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};


export const fetchAppliance = async (id: string): Promise<Appliance> => {
  const res = await fetch(api_url+`/appliances/${id}`);
  return res.json();
};

export const bookAppliance = async (data: {applianceId: string, days: number}) => {
  const res = await fetch('http://localhost:8080/api/bookings', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
  return res.json();
};
