export interface Tour {
  id: string;
  title: string;
  description: string;
  date: string;
  departure_time: string;
  route: string;
  max_capacity: number;
  price_info: string;
  pickup_locations: string[];
  status: "active" | "closed";
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  tour_id: string;
  reservation_number: string;
  name: string;
  phone: string;
  email: string | null;
  adult_count: number;
  child_count: number;
  infant_count: number;
  pickup_location: string;
  memo: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_by: string | null;
  created_at: string;
  updated_at: string;
  tour?: Tour;
}

export interface Profile {
  id: string;
  role: "admin" | "customer";
  name: string;
  created_at: string;
}
