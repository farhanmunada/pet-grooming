<script setup lang="ts">
const { data: ownerData, refresh, status } = await useFetch('/api/owners')
const owners = computed(() => ownerData.value?.owners || [])

const searchQuery = ref('')
const isAddModalOpen = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  communicationPref: 'WhatsApp',
  notes: ''
})

const filteredOwners = computed(() => {
  return owners.value.filter((o: any) =>
    o.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    o.phone.includes(searchQuery.value) ||
    (o.email && o.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

const getWaLink = (phone?: string) => {
  if (!phone) return '#'
  return `https://wa.me/${phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`
}

const addOwner = async () => {
  if (!form.name || !form.phone) {
    alert('Harap isi nama dan nomor telepon.')
    return
  }

  try {
    await $fetch('/api/owners', {
      method: 'POST',
      body: { ...form }
    })
    isAddModalOpen.value = false
    await refresh()
    form.name = ''
    form.phone = ''
    form.email = ''
    form.address = ''
    form.notes = ''
  } catch (err: any) {
    alert(err.data?.message || 'Gagal menambahkan pemilik')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Data Pelanggan & Pemilik</span>
          <UIcon name="i-lucide-users" class="text-emerald-500 w-6 h-6" />
        </h1>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Daftar pemilik anabul terdaftar, kontak WhatsApp, dan riwayat anabul peliharaan.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-plus"
          color="primary"
          size="sm"
          @click="isAddModalOpen = true"
        >
          Tambah Pelanggan
        </UButton>
      </div>
    </div>

    <!-- Search Input -->
    <div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari berdasarkan nama, nomor telepon (WhatsApp), atau email..."
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-emerald-500"
      >
    </div>

    <!-- Owners List -->
    <div v-if="!filteredOwners.length" class="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
      <UIcon name="i-lucide-user-x" class="w-12 h-12 mx-auto text-slate-400 mb-3" />
      <h3 class="text-base font-semibold text-slate-900 dark:text-white">Tidak ada data pemilik</h3>
      <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1">Tambahkan data pelanggan baru untuk mulai booking.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="owner in filteredOwners"
        :key="owner.id"
        class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between hover:shadow-md transition gap-4"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">{{ owner.name }}</h3>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <UIcon name="i-lucide-phone" class="w-3.5 h-3.5" />
                <span>{{ owner.phone }}</span>
              </p>
            </div>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
              {{ owner.communicationPref }}
            </span>
          </div>

          <p v-if="owner.address" class="text-xs text-slate-500 dark:text-zinc-400">
            📍 {{ owner.address }}
          </p>

          <!-- List of Owned Pets -->
          <div class="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
            <span class="text-[11px] text-slate-400 block mb-1.5 font-medium">Anabul Peliharaan ({{ owner.pets?.length || 0 }}):</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="pet in owner.pets"
                :key="pet.id"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
              >
                <UIcon :name="pet.species === 'Cat' ? 'i-lucide-cat' : 'i-lucide-dog'" class="w-3.5 h-3.5" />
                <span>{{ pet.name }}</span>
              </span>
              <span v-if="!owner.pets?.length" class="text-xs text-slate-400 italic">Belum ada anabul terdaftar</span>
            </div>
          </div>
        </div>

        <!-- WhatsApp Quick Chat Button -->
        <div class="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">
            Terdaftar: {{ owner.createdAt?.slice(0, 10) }}
          </span>

          <UButton
            size="xs"
            color="success"
            variant="soft"
            icon="i-lucide-message-circle"
            :to="getWaLink(owner.phone)"
            target="_blank"
          >
            Chat WhatsApp
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modal Tambah Pemilik Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Tambah Pelanggan Baru</h2>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="isAddModalOpen = false" />
        </div>

        <div class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Nama Lengkap *</label>
            <input
              v-model="form.name"
              placeholder="Contoh: Budi Santoso"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            >
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">No. WhatsApp / Telepon *</label>
              <input
                v-model="form.phone"
                placeholder="081234567890"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="budi@example.com"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Alamat Rumah</label>
            <textarea
              v-model="form.address"
              rows="2"
              placeholder="Contoh: Jl. Kemang Raya No. 12, Jakarta Selatan"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Preferensi Kontak</label>
            <select
              v-model="form.communicationPref"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Phone">Panggilan Telepon Langsung</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <UButton color="neutral" variant="ghost" size="sm" @click="isAddModalOpen = false">
            Batal
          </UButton>
          <UButton color="primary" size="sm" @click="addOwner">
            Simpan Pelanggan
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
