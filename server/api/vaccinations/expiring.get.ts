import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const days = query.days ? Number(query.days) : 30
  const db = useDb()

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const records = await db.query.vaccinations.findMany({
    where: sql`expiry_date <= ${targetDate}`,
    with: {
      pet: {
        with: {
          owner: true
        }
      }
    },
    orderBy: [sql`expiry_date ASC`]
  })

  const enriched = records.map((v) => {
    const exp = new Date(v.expiryDate)
    const diffTime = exp.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let status = 'valid'
    if (diffDays < 0) {
      status = 'expired'
    } else if (diffDays <= 7) {
      status = 'urgent'
    } else if (diffDays <= 30) {
      status = 'warning'
    }

    // Generate WhatsApp reminder link
    const owner = v.pet?.owner
    let waUrl = ''
    if (owner?.phone) {
      // Normalize Indonesian phone number (08... -> 628...)
      let phone = owner.phone.replace(/[^0-9]/g, '')
      if (phone.startsWith('0')) phone = '62' + phone.slice(1)

      const text = `Halo Kak ${owner.name}, salam dari PetKasih! 🐾 Kami mengingatkan bahwa jadwal vaksin *${v.vaccineName}* untuk anabul kesayangan *${v.pet?.name}* ${
        diffDays < 0 ? `telah kadaluarsa pada tanggal ${v.expiryDate}` : `akan jatuh tempo pada ${v.expiryDate}`
      }. Yuk segera booking jadwal booster/vaksinasi agar anabul tetap sehat dan terlindungi! Hubungi kami untuk reservasi. Terima kasih!`

      waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    }

    return {
      ...v,
      diffDays,
      status,
      waUrl
    }
  })

  return { vaccinations: enriched }
})
