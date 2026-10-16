<script setup lang="ts">
const { data: appointmentData, refresh, status } = await useFetch('/api/appointments')
const { data: ownerData } = await useFetch('/api/owners')
const { data: groomerData } = await useFetch('/api/groomers')
const { data: serviceData } = await useFetch('/api/services')

const appointments = computed(() => appointmentData.value?.appointments || [])
const owners = computed(() => ownerData.value?.owners || [])
const groomers = computed(() => groomerData.value?.groomers || [])
const services = computed(() => serviceData.value?.services || [])

const isNewModalOpen = ref(false)
const isNoteModalOpen = ref(false)
const selectedAppForNote = ref<any>(null)

// Form state for new appointment
const form = reactive({
  ownerId: null as number | null,
  petId: null as number | null,
  groomerId: null as number | null,
  scheduledDate: new Date().toISOString().split('T')[0],
  scheduledTime: '10:00',
  notes: '',
  selectedServiceIds: [] as number[]
})

// Grooming note form
const noteForm = reactive({
  bladeSize: '',
  shampooUsed: '',
  styleNotes: '',
  behaviorNotes: '',
  skinCondition: ''
})

// Filter pets based on selected owner
const ownerPets = computed(() => {
  if (!form.ownerId || !owners.value) return []
  const owner = owners.value.find((o: any) => o.id === form.ownerId)
  return owner?.pets || []
})

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

const statusBadgeColor = (stat: string) => {
  switch (stat) {
    case 'Confirmed': return 'neutral'
    case 'InProgress': return 'warning'
    case 'Completed': return 'success'
    case 'Cancelled': return 'error'
    default: return 'neutral'
  }
}

const statusLabel = (stat: string) => {
  switch (stat) {
    case 'Confirmed': return 'Terjadwal'
    case 'InProgress': return 'Sedang Grooming'
    case 'Completed': return 'Selesai'
    case 'Cancelled': return 'Batal'
    default: return stat
  }
}

const createAppointment = async () => {
  if (!form.ownerId || !form.petId || !form.groomerId) {
    alert('Harap pilih Pemilik, Anabul, dan Groomer.')
    return
  }

  try {
    const scheduledAt = `${form.scheduledDate}T${form.scheduledTime}:00`
    await $fetch('/api/appointments', {
      method: 'POST',
      body: {
        ownerId: form.ownerId,
        petId: form.petId,
        groomerId: form.groomerId,
        scheduledAt,
        notes: form.notes,
        serviceIds: form.selectedServiceIds.length ? form.selectedServiceIds : [services.value?.[0]?.id || 1]
      }
    })
    isNewModalOpen.value = false
    await refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Gagal membuat janji temu')
  }
}

const updateStatus = async (id: number, newStatus: string) => {
  try {
    await $fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    })
    await refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Gagal update status')
  }
}

const openGroomingNoteModal = (app: any) => {
  selectedAppForNote.value = app
  noteForm.bladeSize = app.groomingNotes?.[0]?.bladeSize || ''
  noteForm.shampooUsed = app.groomingNotes?.[0]?.shampooUsed || ''
  noteForm.styleNotes = app.groomingNotes?.[0]?.styleNotes || ''
  noteForm.behaviorNotes = app.groomingNotes?.[0]?.behaviorNotes || ''
  noteForm.skinCondition = app.groomingNotes?.[0]?.skinCondition || ''
  isNoteModalOpen.value = true
}

const saveGroomingNote = async () => {
  if (!selectedAppForNote.value) return
  try {
    await $fetch(`/api/appointments/${selectedAppForNote.value.id}`, {
      method: 'PATCH',
      body: {
        status: 'Completed',
        groomingNotes: { ...noteForm }
      }
    })
    isNoteModalOpen.value = false
    await refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Gagal menyimpan catatan grooming')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Antrean & Booking Grooming</span>
          <UIcon name="i-lucide-scissors" class="text-emerald-500 w-6 h-6" />
        </h1>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Kelola jadwal perawatan salon, status pengerjaan groomer, dan instruksi khusus anabul.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          size="sm"
          :loading="status === 'pending'"
          @click="() => refresh()"
        >
          Refresh
        </UButton>
        <UButton
          icon="i-lucide-plus"
          color="primary"
          size="sm"
          @click="isNewModalOpen = true"
        >
          Booking Baru
        </UButton>
      </div>
    </div>

    <!-- Appointment List / Table -->
    <div v-if="!appointments?.length" class="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
      <UIcon name="i-lucide-calendar-x" class="w-12 h-12 mx-auto text-slate-400 mb-3" />
      <h3 class="text-base font-semibold text-slate-900 dark:text-white">Belum Ada Antrean</h3>
      <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1">Buat jadwal grooming baru untuk pelanggan Anda.</p>
      <UButton color="primary" size="sm" class="mt-4" @click="isNewModalOpen = true">
        + Buat Booking
      </UButton>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="app in appointments"
        :key="app.id"
        class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between hover:shadow-md transition gap-4"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <UIcon :name="app.pet?.species === 'Cat' ? 'i-lucide-cat' : 'i-lucide-dog'" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-white">{{ app.pet?.name }}</h3>
                <p class="text-xs text-slate-500 dark:text-zinc-400">{{ app.pet?.species }} • {{ app.pet?.breedNotes || 'Mixed' }}</p>
              </div>
            </div>

            <UBadge :color="statusBadgeColor(app.status)" variant="subtle" size="sm">
              {{ statusLabel(app.status) }}
            </UBadge>
          </div>

          <div class="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Pemilik:</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ app.owner?.name }} ({{ app.owner?.phone }})</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Groomer Staf:</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ app.groomer?.name || '-' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Waktu Jadwal:</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ app.scheduledAt.replace('T', ' ').slice(0, 16) }} WIB</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Estimasi Biaya:</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ formatRupiah(app.totalPrice) }}</span>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="app.notes" class="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 text-xs text-slate-600 dark:text-zinc-300">
            <strong class="text-slate-900 dark:text-white block mb-0.5">Catatan Booking:</strong>
            {{ app.notes }}
          </div>

          <!-- Completed grooming notes preview if any -->
          <div v-if="app.groomingNote" class="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
            <div class="font-semibold flex items-center gap-1">
              <UIcon name="i-lucide-check-check" class="w-3.5 h-3.5" />
              <span>Rekam Hasil Grooming:</span>
            </div>
            <p v-if="app.groomingNote.styleNotes">Style: {{ app.groomingNote.styleNotes }}</p>
            <p v-if="app.groomingNote.bladeSize">Pisau Cukur: #{{ app.groomingNote.bladeSize }}</p>
            <p v-if="app.groomingNote.shampooUsed">Shampoo: {{ app.groomingNote.shampooUsed }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <UButton
              v-if="app.status === 'Confirmed'"
              size="xs"
              color="warning"
              icon="i-lucide-play"
              @click="updateStatus(app.id, 'InProgress')"
            >
              Mulai Kerjakan
            </UButton>

            <UButton
              v-if="app.status === 'InProgress'"
              size="xs"
              color="success"
              icon="i-lucide-check-circle"
              @click="openGroomingNoteModal(app)"
            >
              Selesai & Catat
            </UButton>

            <UButton
              v-if="app.status === 'Confirmed'"
              size="xs"
              color="error"
              variant="ghost"
              @click="updateStatus(app.id, 'Cancelled')"
            >
              Batal
            </UButton>
          </div>

          <UButton
            :to="`/pets/${app.petId}`"
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-external-link"
          >
            Profil
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modal Booking Baru -->
    <div
      v-if="isNewModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Buat Jadwal Grooming Baru</h2>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="isNewModalOpen = false" />
        </div>

        <div class="space-y-4">
          <!-- Pilih Pemilik -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Pilih Pemilik Anabul</label>
            <select
              v-model="form.ownerId"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-emerald-500"
            >
              <option :value="null">-- Pilih Pelanggan --</option>
              <option v-for="o in owners" :key="o.id" :value="o.id">
                {{ o.name }} ({{ o.phone }})
              </option>
            </select>
          </div>

          <!-- Pilih Anabul (otomatis terfilter jika owner dipilih) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Pilih Anabul</label>
            <select
              v-model="form.petId"
              :disabled="!form.ownerId"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-emerald-500 disabled:opacity-50"
            >
              <option :value="null">-- {{ form.ownerId ? 'Pilih Anabul' : 'Pilih Pemilik Dulu' }} --</option>
              <option v-for="p in ownerPets" :key="p.id" :value="p.id">
                {{ p.name }} ({{ p.species }} - {{ p.breedNotes || 'Mixed' }})
              </option>
            </select>
          </div>

          <!-- Pilih Groomer -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Tugaskan Groomer</label>
            <select
              v-model="form.groomerId"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-emerald-500"
            >
              <option :value="null">-- Pilih Groomer Staf --</option>
              <option v-for="g in groomers" :key="g.id" :value="g.id">
                {{ g.name }} ({{ g.phone }})
              </option>
            </select>
          </div>

          <!-- Tanggal & Jam -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Tanggal</label>
              <input
                v-model="form.scheduledDate"
                type="date"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Jam Booking</label>
              <input
                v-model="form.scheduledTime"
                type="time"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <!-- Layanan Grooming -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Paket Layanan</label>
            <div class="space-y-1.5 max-h-36 overflow-y-auto p-2 border border-slate-200 dark:border-zinc-800 rounded-xl">
              <label
                v-for="s in services"
                :key="s.id"
                class="flex items-center gap-2 text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/60 cursor-pointer"
              >
                <input
                  v-model="form.selectedServiceIds"
                  type="checkbox"
                  :value="s.id"
                  class="rounded text-emerald-600 focus:ring-emerald-500"
                >
                <span class="flex-1 text-slate-800 dark:text-zinc-200">{{ s.name }}</span>
                <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ formatRupiah(s.basePrice) }}</span>
              </label>
            </div>
          </div>

          <!-- Catatan Khusus -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Instruksi Khusus / Keluhan Pemilik</label>
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="Contoh: Takut pengering rambut, bulu gimbal di area ekor..."
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-emerald-500"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <UButton color="neutral" variant="ghost" size="sm" @click="isNewModalOpen = false">
            Batal
          </UButton>
          <UButton color="primary" size="sm" @click="createAppointment">
            Simpan Jadwal
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modal Catatan Selesai Grooming -->
    <div
      v-if="isNoteModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Rekam Hasil Grooming</h2>
            <p class="text-xs text-slate-500">Anabul: {{ selectedAppForNote?.pet?.name }}</p>
          </div>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="isNoteModalOpen = false" />
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Ukuran Pisau Cukur</label>
              <input
                v-model="noteForm.bladeSize"
                placeholder="Contoh: #7F, #10, #4F"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Shampoo Digunakan</label>
              <input
                v-model="noteForm.shampooUsed"
                placeholder="Contoh: Medicated Ketoconazole"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Gaya Cukur & Potongan (Style Notes)</label>
            <input
              v-model="noteForm.styleNotes"
              placeholder="Contoh: Teddy bear cut, telinga bulat rapi"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Kondisi Kulit & Kutu</label>
            <input
              v-model="noteForm.skinCondition"
              placeholder="Contoh: Ada jamur ringan di daun telinga kiri"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Catatan Perilaku Selama Dikerjakan</label>
            <textarea
              v-model="noteForm.behaviorNotes"
              rows="2"
              placeholder="Contoh: Sangat kooperatif, sedikit gelisah saat potong kuku..."
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <UButton color="neutral" variant="ghost" size="sm" @click="isNoteModalOpen = false">
            Batal
          </UButton>
          <UButton color="success" size="sm" @click="saveGroomingNote">
            Selesaikan & Simpan Rekam Medis
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
