export interface PublicDealer {
  id: string;
  company_name: string | null;
  city: string | null;
  region: string | null;
  tax_office?: string | null;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
}
