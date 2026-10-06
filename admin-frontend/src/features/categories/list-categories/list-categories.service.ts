import { axiosInterceptorInstanceClient } from '@/config/axios';
import { Category } from '@/domain/entities/category.entity';
import { ListCategoriesResponse } from './list-categories.interface';

export const INITIAL_MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-respiratory',
    name: 'Respiratory Care',
    slug: 'respiratory-care',
    description: 'Hospital-grade CPAP, BiPAP, 5L/10L oxygen concentrators & portable nebulizers.',
    icon: 'Wind',
    image: '/images/oxygen_concentrator.png',
    productCount: 18,
  },
  {
    id: 'cat-icu-beds',
    name: 'Hospital Beds & ICU',
    slug: 'hospital-beds-icu',
    description: 'Motorized 3/5-function ICU beds, ripple air mattresses, and patient transfer lifts.',
    icon: 'Bed',
    image: '/images/hospital_bed.png',
    productCount: 12,
  },
  {
    id: 'cat-mobility',
    name: 'Mobility & Ortho',
    slug: 'mobility-ortho',
    description: 'Ultralight folding transit wheelchairs, rollators, orthopedic walkers & commodes.',
    icon: 'Accessibility',
    image: '/images/hospital_bed.png',
    productCount: 24,
  },
  {
    id: 'cat-monitors',
    name: 'Patient Monitoring',
    slug: 'patient-monitoring',
    description: 'Clinical 5-para vital monitors, pulse oximeters, ECG machines & digital BP units.',
    icon: 'Activity',
    image: '/images/oxygen_concentrator.png',
    productCount: 15,
  },
  {
    id: 'cat-geriatric',
    name: 'Geriatric Home Recovery',
    slug: 'geriatric-care',
    description: 'Elderly fall-prevention equipment, suction machines, and daily care essentials.',
    icon: 'HeartPulse',
    image: '/images/elderly_couple.png',
    productCount: 20,
  },
];

export const listCategoriesService = async (): Promise<ListCategoriesResponse> => {
  try {
    const response = await axiosInterceptorInstanceClient.get('/categories');
    if (response.data && Array.isArray(response.data.data)) {
      return response.data;
    }
  } catch (err) {
    // Graceful fallback
  }

  return {
    success: true,
    data: INITIAL_MOCK_CATEGORIES,
  };
};
