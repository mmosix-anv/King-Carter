import {client} from '../config/sanity'

export async function fetchServices() {
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
}

export async function fetchServiceById(serviceId) {
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
}
