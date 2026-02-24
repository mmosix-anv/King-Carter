import {createClient} from '@sanity/client'
import {servicesData} from '../frontend/src/data/services.js'
import dotenv from 'dotenv'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({path: join(__dirname, '.env.local')})

const client = createClient({
  projectId: 'lyujqeed',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
})

async function migrateServices() {
  console.log('Starting migration...')

  for (const [key, service] of Object.entries(servicesData)) {
    const doc = {
      _type: 'service',
      id: {_type: 'slug', current: service.id},
      heroTitle: service.heroTitle,
      heroTagline: service.heroTagline,
      heroImage: service.heroImage,
      description: service.description,
      highlights: service.highlights,
      images: service.images,
      cta: service.cta,
    }

    try {
      const result = await client.create(doc)
      console.log(`✓ Migrated: ${service.heroTitle}`)
    } catch (error) {
      console.error(`✗ Failed to migrate ${service.heroTitle}:`, error.message)
    }
  }

  console.log('Migration complete!')
}

migrateServices()
