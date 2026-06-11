export type Profile = {
  id: string;
  full_name?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  loyalty_tier?: string | null;
  reward_points?: number | null;
  member_since?: string | null;
  total_orders?: number | null;
  total_spend?: number | null;
  avatar_url?: string | null;
};

export type Address = {
  id: string;
  user_id: string;
  label: 'Home' | 'Office' | 'Other' | string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
};

