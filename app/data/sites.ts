export interface MethaneSite {
  id: string;
  name: string;
  province: string;
  region: string;
  lat: number;
  lon: number;
  emission_rate_kg_day: number;
  co2e_tons_year: number;
  source_type: 'pipeline' | 'wellhead' | 'landfill' | 'industrial';
  status: 'active' | 'inactive' | 'captured' | 'unknown';
  data_quality: 'demo' | 'satellite' | 'field_verified' | 'regulatory';
  distance_to_grid_km: number;
  internet_type: 'fiber' | 'cable' | 'starlink' | 'lte' | 'none';
  complexity_score: 'easy' | 'moderate' | 'hard';
  recommended_approach: string;
  funding_btc?: number;
  confidence: 'high' | 'medium' | 'low';
}

// Import sites from JSON - 2,611 real ECCC verified sites
// Updated: March 11, 2026
import sitesData from './sites.json';
export const demoSites: MethaneSite[] = sitesData as MethaneSite[];
