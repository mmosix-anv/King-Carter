import axios from 'axios'
import {servicesData as localServicesData} from './services'

const STRAPI_URL = 'http://localhost:1337'

export async function fetchServices() {
  try {
    const {data} = await axios.get(`${STRAPI_URL}/api/services`)
    const servicesMap = {}
    data.data.forEach(item => {
      const service = item.attributes
      servicesMap[service.serviceId] = {
        id: service.serviceId,
        heroTitle: service.heroTitle,
        heroTagline: service.heroTagline,
        heroImage: service.heroImage,
        description: service.description,
        highlights: service.highlights,
        images: service.images,
        cta: service.cta,
      }
    })
    return servicesMap
  } catch (error) {
    console.warn('Failed to fetch from Strapi, using local data:', error)
    return localServicesData
  }
}

export async function fetchServiceById(serviceId) {
  try {
    const {data} = await axios.get(`${STRAPI_URL}/api/services?filters[serviceId][$eq]=${serviceId}`)
    if (data.data.length === 0) return null
    const service = data.data[0].attributes
    return {
      id: service.serviceId,
      heroTitle: service.heroTitle,
      heroTagline: service.heroTagline,
      heroImage: service.heroImage,
      description: service.description,
      highlights: service.highlights,
      images: service.images,
      cta: service.cta,
    }
  } catch (error) {
    console.warn('Failed to fetch from Strapi, using local data:', error)
    return localServicesData[serviceId] || null
  }
}
