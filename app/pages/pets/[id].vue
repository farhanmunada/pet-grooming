<script setup lang="ts">
const route = useRoute()
const petId = route.params.id

const { data: petData, refresh, error } = await useFetch(`/api/pets/${petId}`)
const pet = computed(() => petData.value?.pet)

const isVaccineModalOpen = ref(false)
const vaccineForm = reactive({
  vaccineName: '',
  vaccineType: 'Core',
  dateAdministered: new Date().toISOString().split('T')[0],
  expiryDate: '',
  administeredBy: 'Drh. Ratna Lestari',
  batchNumber: '',
  notes: ''
})

const activeTab = ref<'grooming' | 'vaccines'>('grooming')

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

const addVaccine = async () => {
  if (!vaccineForm.vaccineName || !vaccineForm.dateAdministered || !vaccineForm.expiryDate) {
    alert('Harap isi nama vaksin, tanggal pemberian, dan tanggal kadaluwarsa/booster.')
    return
  }

  try {
    await $fetch('/api/vaccinations', {
      method: 'POST',
      body: {
        petId: Number(petId),
        ...vaccineForm
      }
    })
    isVaccineModalOpen.value = false
    await refresh()
    // Reset form
    vaccineForm.vaccineName = ''
    vaccineForm.expiryDate = ''
    vaccineForm.batchNumber = ''
    vaccineForm.notes = ''
  } catch (err: any) {
    alert(err.data?.message || 'Gagal menambahkan rekam vaksinasi')
  }
}
</script>

<template>
  <div v-if="pet" class="space-y-6">
    <!-- Back Button & Breadcrumbs -->
    <div class="flex items-center gap-2">
      <UButton
        to="/pets"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        size="sm"
      >
        Kembali ke Data Anabul
      </UButton>
    </div>

    <!-- Pet Profile Hero Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          <UIcon :name="pet.species === 'Cat' ? 'i-lucide-cat' : 'i-lucide-dog'" class="w-10 h-10" />
        </div>
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ pet.name }}</h1>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold">
              {{ pet.species }} • {{ pet.gender === 'Male' ? 'Jantan ♂' : 'Betina ♀' }}
            </span>
          </div>
          <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Ras: <strong>{{ pet.breedNotes || 'Mixed' }}</strong> • Berat: <strong>{{ pet.weight || '?' }} kg</strong> • Warna: <strong>{{ pet.color || '-' }}</strong>
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2 w-full md:w-auto">
        <UButton
          icon="i-lucide-shield-plus"
          color="primary"
          variant="soft"
          size="sm"
          @click="isVaccineModalOpen = true"
        >
          + Rekam Vaksin
        </UButton>
        <UButton
          to="/appointments"
          icon="i-lucide-calendar-plus"
          color="primary"
          size="sm"
        >
          Booking Grooming
        </UButton>
      </div>
    </div>

    <!-- Owner & Critical Medical Warning Banner -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Owner Card -->
      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-2">
        <span class="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <UIcon name="i-lucide-user" class="w-4 h-4 text-emerald-500" />
          <span>Informasi Pemilik</span>
        </span>
        <p class="font-bold text-slate-900 dark:text-white">{{ pet.owner?.name }}</p>
        <div class="text-xs text-slate-500 space-y-1">
          <p>📞 {{ pet.owner?.phone }}</p>
          <p>📍 {{ pet.owner?.address || 'Alamat tidak tertera' }}</p>
        </div>
      </div>

      <!-- Allergies / Caution -->
      <div class="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-1.5">
        <span class="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <UIcon name="i-lucide-alert-triangle" class="w-4 h-4" />
          <span>Alergi & Peringatan Khusus</span>
        </span>
        <p class="text-xs text-rose-900 dark:text-rose-200 font-medium">
          {{ pet.allergies || 'Tidak ada catatan alergi terdaftar.' }}
        </p>
      </div>

      <!-- Medical Notes -->
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-1.5">
        <span class="text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
          <UIcon name="i-lucide-stethoscope" class="w-4 h-4" />
          <span>Catatan Kesehatan & Temperamen</span>
        </span>
        <p class="text-xs text-slate-700 dark:text-zinc-300">
          {{ pet.medicalNotes || pet.temperament || 'Kondisi anabul baik dan sehat.' }}
        </p>
      </div>
    </div>

    <!-- History Tabs (Grooming vs Vaccines) -->
    <div class="space-y-4">
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
        <button
          :class="[
            'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2',
            activeTab === 'grooming'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          ]"
          @click="activeTab = 'grooming'"
        >
          <UIcon name="i-lucide-scissors" class="w-4 h-4" />
          <span>Riwayat Grooming ({{ pet.appointments?.length || 0 }})</span>
        </button>

        <button
          :class="[
            'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2',
            activeTab === 'vaccines'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          ]"
          @click="activeTab = 'vaccines'"
        >
          <UIcon name="i-lucide-shield-check" class="w-4 h-4" />
          <span>Buku Vaksinasi ({{ pet.vaccinations?.length || 0 }})</span>
        </button>
      </div>

      <!-- Grooming Tab Content -->
      <div v-if="activeTab === 'grooming'">
        <div v-if="!pet.appointments?.length" class="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <p class="text-xs text-slate-500">Belum ada riwayat grooming untuk anabul ini.</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="app in pet.appointments"
            :key="app.id"
            class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold text-sm text-slate-900 dark:text-white">
                  Jadwal: {{ app.scheduledAt.replace('T', ' ').slice(0, 16) }} WIB
                </span>
                <span class="text-xs text-slate-400 ml-2">Groomer: {{ app.groomer?.name || '-' }}</span>
              </div>
              <UBadge :color="app.status === 'Completed' ? 'success' : 'neutral'" variant="subtle" size="xs">
                {{ app.status }}
              </UBadge>
            </div>

            <!-- Detailed Grooming Notes -->
            <div v-if="app.groomingNote" class="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 text-xs space-y-1.5">
              <p class="font-semibold text-slate-900 dark:text-white">Detail Penanganan Groomer:</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-zinc-300">
                <p>✂️ Pisau Cukur: <strong>{{ app.groomingNote.bladeSize || '-' }}</strong></p>
                <p>🧴 Shampoo: <strong>{{ app.groomingNote.shampooUsed || '-' }}</strong></p>
                <p class="sm:col-span-2">🎨 Model Potongan: <strong>{{ app.groomingNote.styleNotes || '-' }}</strong></p>
                <p class="sm:col-span-2">🐾 Catatan Perilaku: {{ app.groomingNote.behaviorNotes || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vaccines Tab Content -->
      <div v-if="activeTab === 'vaccines'">
        <div v-if="!pet.vaccinations?.length" class="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <p class="text-xs text-slate-500">Belum ada rekam vaksinasi terdaftar.</p>
          <UButton size="xs" color="primary" class="mt-2" @click="isVaccineModalOpen = true">
            + Catat Vaksin Pertama
          </UButton>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="vac in pet.vaccinations"
            :key="vac.id"
            class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">{{ vac.vaccineName }}</h4>
                <UBadge color="neutral" variant="subtle" size="xs">{{ vac.vaccineType }}</UBadge>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                Diberikan: {{ vac.dateAdministered }} • Oleh: {{ vac.administeredBy || 'Dokter Hewan' }} • Batch: {{ vac.batchNumber || '-' }}
              </p>
            </div>

            <div class="text-left sm:text-right">
              <span class="text-[11px] text-slate-400 block">Jadwal Booster / Kedaluwarsa:</span>
              <span class="text-xs font-bold text-amber-600 dark:text-amber-400">{{ vac.expiryDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Catat Vaksin Baru -->
    <div
      v-if="isVaccineModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Rekam Vaksin Baru: {{ pet.name }}</h2>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="isVaccineModalOpen = false" />
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Nama Vaksin *</label>
            <input
              v-model="vaccineForm.vaccineName"
              placeholder="Contoh: Rabies, DHPP, Felocell 4, FVRCP"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            >
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Tgl Pemberian *</label>
              <input
                v-model="vaccineForm.dateAdministered"
                type="date"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Jatuh Tempo Booster *</label>
              <input
                v-model="vaccineForm.expiryDate"
                type="date"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Dokter / Petugas</label>
              <input
                v-model="vaccineForm.administeredBy"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">No. Batch Vaksin</label>
              <input
                v-model="vaccineForm.batchNumber"
                placeholder="Contoh: BATCH-2025-01"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Catatan Tambahan</label>
            <input
              v-model="vaccineForm.notes"
              placeholder="Contoh: Booster tahunan, respon post-vaksin normal"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            >
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <UButton color="neutral" variant="ghost" size="sm" @click="isVaccineModalOpen = false">
            Batal
          </UButton>
          <UButton color="primary" size="sm" @click="addVaccine">
            Simpan Vaksin
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-12 text-center text-slate-500">
    Data anabul tidak ditemukan.
  </div>
</template>
