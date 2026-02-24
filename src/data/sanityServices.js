import {client} from '../config/sanity'
import {servicesData as localServicesData} from './services'

export async function fetchServices() {
  try {
    const services = await client.fetch(`*[_type == "service"]{
      "id": id.current,
      heroTitle,
      heroTagline,
      heroImage,
      description,
      highlights,
      images,
      cta
    }`)
    
    const servicesMap = {}
    services.forEach(service => {
      servicesMap[service.id] = service
    })
    
    return servicesMap
  } catch (error) {
    console.warn('Failed to fetch from Sanity, using local data:', error)
    return localServicesData
  }
}

export async function fetchServiceById(serviceId) {
  try {
    const service = await client.fetch(
      `*[_type == "service" && id.current == $serviceId][0]{
        "id": id.current,
        heroTitle,
        heroTagline,
        heroImage,
        description,
        highlights,
        images,
        cta
      }`,
      {serviceId}
    )
    
    return service || null
  } catch (error) {
    console.warn('Failed to fetch from Sanity, using local data:', error)
    return localServicesData[serviceId] || null
  }
}
