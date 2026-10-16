<script setup lang="ts">
const { data: petData, refresh, status } = await useFetch('/api/pets')
const { data: ownerData } = await useFetch('/api/owners')

const pets = computed(() => petData.value?.pets || [])
const owners = computed(() => ownerData.value?.owners || [])

const searchQuery = ref('')
const selectedSpecies = ref('All')
const isAddModalOpen = ref(false)

const form = reactive({
  ownerId: null as number | null,
  name: '',
  species: 'Dog',
  breedNotes: '',
  gender: 'Male',
  dateOfBirth: '',
  weight: 4.5,
  color: '',
  temperament: 'Friendly',
  allergies: '',
  medicalNotes: '',
  isNeutered: false
})

const filteredPets = computed(() => {
  return pets.value.filter((p: any) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.owner?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.breedNotes?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchSpecies = selectedSpecies.value === 'All' || p.species === selectedSpecies.value
    return matchSearch && matchSpecies
  })
})

const addPet = async () => {
  if (!form.ownerId || !form.name) {
    alert('Harap isi pemilik dan nama anabul.')
    return
  }

  try {
    await $fetch('/api/pets', {
      method: 'POST',
      body: {
        ...form,
        weight: Number(form.weight)
      }
    })
    isAddModalOpen.value = false
    await refresh()
    // Reset form
    form.name = ''
    form.breedNotes = ''
    form.color = ''
    form.allergies = ''
    form.medicalNotes = ''
  } catch (err: any) {
    alert(err.data?.message || 'Gagal menambahkan data anabul')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Data Rekam Medis Anabul</span>
          <UIcon name="i-lucide-dog" class="text-emerald-500 w-6 h-6" />
        </h1>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Daftar anabul teregistrasi, riwayat grooming, alergi, dan rekam vaksinasi berkala.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-plus"
          color="primary"
          size="sm"
          @click="isAddModalOpen = true"
        >
          Daftarkan Anabul
        </UButton>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama anabul, pemilik, atau ras..."
          class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-emerald-500"
        >
      </div>

      <div class="flex gap-2">
        <button
          v-for="sp in ['All', 'Dog', 'Cat']"
          :key="sp"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition',
            selectedSpecies === sp
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
          ]"
          @click="selectedSpecies = sp"
        >
          {{ sp === 'All' ? 'Semua Spesies' : sp === 'Dog' ? 'Anjing 🐶' : 'Kucing 🐱' }}
        </button>
      </div>
    </div>

    <!-- Pet Grid -->
    <div v-if="!filteredPets.length" class="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
      <UIcon name="i-lucide-paw-print" class="w-12 h-12 mx-auto text-slate-400 mb-3" />
      <h3 class="text-base font-semibold text-slate-900 dark:text-white">Tidak ada data anabul</h3>
      <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1">Gunakan kata kunci lain atau daftarkan anabul baru.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="pet in filteredPets"
        :key="pet.id"
        class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-md transition gap-4"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <UIcon :name="pet.species === 'Cat' ? 'i-lucide-cat' : 'i-lucide-dog'" class="w-7 h-7" />
              </div>
              <div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">{{ pet.name }}</h3>
                <p class="text-xs text-slate-500 dark:text-zinc-400">{{ pet.species }} • {{ pet.breedNotes || 'Mixed Breed' }}</p>
              </div>
            </div>

            <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-medium">
              {{ pet.gender === 'Male' ? 'Jantan ♂' : 'Betina ♀' }}
            </span>
          </div>

          <!-- Pet Info Snippet -->
          <div class="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-zinc-300 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
            <div>
              <span class="text-slate-400 block text-[10px]">Berat Badan:</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ pet.weight || '?' }} kg</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Temperamen:</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ pet.temperament || 'Tenang' }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-slate-400 block text-[10px]">Pemilik:</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ pet.owner?.name }} ({{ pet.owner?.phone }})</span>
            </div>
          </div>

          <!-- Allergies / Warnings -->
          <div v-if="pet.allergies" class="p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0 text-rose-500" />
            <span class="truncate">Alergi: {{ pet.allergies }}</span>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span class="text-xs text-slate-400">
            {{ pet.vaccinations?.length || 0 }} Riwayat Vaksin
          </span>

          <UButton
            :to="`/pets/${pet.id}`"
            size="xs"
            color="primary"
            variant="soft"
            icon="i-lucide-file-text"
          >
            Buka Rekam Medis
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modal Tambah Anabul Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Registrasi Anabul Baru</h2>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="isAddModalOpen = false" />
        </div>

        <div class="space-y-3.5">
          <!-- Pilih Pemilik -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Pemilik Anabul *</label>
            <select
              v-model="form.ownerId"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-emerald-500"
            >
              <option :value="null">-- Pilih Pemilik Terdaftar --</option>
              <option v-for="o in owners" :key="o.id" :value="o.id">
                {{ o.name }} ({{ o.phone }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Nama Anabul *</label>
              <input
                v-model="form.name"
                placeholder="Contoh: Milo, Luna"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Spesies</label>
              <select
                v-model="form.species"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
                <option value="Dog">Anjing (Dog)</option>
                <option value="Cat">Kucing (Cat)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Ras / Breed</label>
              <input
                v-model="form.breedNotes"
                placeholder="Contoh: Golden Retriever, Persia"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Jenis Kelamin</label>
              <select
                v-model="form.gender"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
                <option value="Male">Jantan (Male)</option>
                <option value="Female">Betina (Female)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Berat Badan (Kg)</label>
              <input
                v-model="form.weight"
                type="number"
                step="0.1"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Warna / Corak Bulu</label>
              <input
                v-model="form.color"
                placeholder="Contoh: Putih abu-abu"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Riwayat Alergi (Jika Ada)</label>
            <input
              v-model="form.allergies"
              placeholder="Contoh: Alergi protein ayam, sensitif sampo sulfur"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Catatan Medis & Khusus</label>
            <textarea
              v-model="form.medicalNotes"
              rows="2"
              placeholder="Contoh: Kaki belakang kanan pasca operasi 2024..."
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <UButton color="neutral" variant="ghost" size="sm" @click="isAddModalOpen = false">
            Batal
          </UButton>
          <UButton color="primary" size="sm" @click="addPet">
            Simpan Anabul
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
