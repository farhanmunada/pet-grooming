<script setup lang="ts">
const { data: expiringData, refresh: refreshExpiring } = await useFetch('/api/vaccinations/expiring')
const { data: allVaccinationsData, refresh: refreshAll } = await useFetch('/api/vaccinations')

const expiringList = computed(() => expiringData.value?.vaccinations || [])
const allVaccinations = computed(() => allVaccinationsData.value?.vaccinations || [])

const activeFilter = ref<'expiring' | 'all'>('expiring')

const refresh = async () => {
  await Promise.all([refreshExpiring(), refreshAll()])
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Monitor & Notifikasi Vaksinasi</span>
          <UIcon name="i-lucide-shield-alert" class="text-amber-500 w-6 h-6" />
        </h1>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Pantau jadwal booster berkala dan kirim pesan pengingat langsung ke WhatsApp pemilik.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          size="sm"
          @click="refresh"
        >
          Perbarui Status
        </UButton>
      </div>
    </div>

    <!-- Filter Toggle -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
      <button
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2',
          activeFilter === 'expiring'
            ? 'bg-amber-500 text-white shadow-xs'
            : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
        ]"
        @click="activeFilter = 'expiring'"
      >
        <UIcon name="i-lucide-bell-ring" class="w-4 h-4" />
        <span>Jatuh Tempo & Perlu Booster ({{ expiringList.length }})</span>
      </button>

      <button
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2',
          activeFilter === 'all'
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
        ]"
        @click="activeFilter = 'all'"
      >
        <UIcon name="i-lucide-list" class="w-4 h-4" />
        <span>Semua Riwayat Vaksin ({{ allVaccinations.length }})</span>
      </button>
    </div>

    <!-- View: Expiring Vaccines (WhatsApp Action First) -->
    <div v-if="activeFilter === 'expiring'" class="space-y-4">
      <div v-if="!expiringList.length" class="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <UIcon name="i-lucide-check-circle-2" class="w-12 h-12 mx-auto text-emerald-500 mb-3" />
        <h3 class="text-base font-semibold text-slate-900 dark:text-white">Semua Vaksin Up-to-Date!</h3>
        <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1">Tidak ada jadwal booster yang jatuh tempo dalam 30 hari ke depan.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="v in expiringList"
          :key="v.id"
          class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-200/80 dark:border-amber-900/40 shadow-xs flex flex-col justify-between gap-4"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <UIcon :name="v.pet?.species === 'Cat' ? 'i-lucide-cat' : 'i-lucide-dog'" class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-bold text-base text-slate-900 dark:text-white">{{ v.pet?.name }}</h3>
                  <p class="text-xs text-slate-500">{{ v.pet?.species }} • Pemilik: {{ v.pet?.owner?.name }}</p>
                </div>
              </div>

              <span class="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                <UIcon name="i-lucide-alert-circle" class="w-3.5 h-3.5" />
                <span>Exp: {{ v.expiryDate }}</span>
              </span>
            </div>

            <div class="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 text-xs space-y-1">
              <p>💉 Jenis Vaksin: <strong>{{ v.vaccineName }} ({{ v.vaccineType }})</strong></p>
              <p>📅 Terakhir Diberikan: {{ v.dateAdministered }}</p>
              <p>📞 No. WA Pemilik: <strong>{{ v.pet?.owner?.phone }}</strong></p>
            </div>
          </div>

          <!-- WhatsApp Reminder Action -->
          <div class="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <UButton
              :to="`/pets/${v.petId}`"
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-folder-open"
            >
              Lihat Profil
            </UButton>

            <UButton
              size="sm"
              color="success"
              icon="i-lucide-send"
              :to="v.waUrl || '#'"
              target="_blank"
            >
              Kirim Notifikasi WA
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- View: All Vaccines History -->
    <div v-if="activeFilter === 'all'" class="space-y-4">
      <div v-if="!allVaccinations?.length" class="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <p class="text-xs text-slate-500">Belum ada riwayat rekam vaksinasi di sistem.</p>
      </div>

      <div v-else class="overflow-x-auto bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 dark:bg-zinc-800/60 text-slate-500 border-b border-slate-200 dark:border-zinc-800">
            <tr>
              <th class="p-3 font-semibold">Anabul & Pemilik</th>
              <th class="p-3 font-semibold">Nama Vaksin</th>
              <th class="p-3 font-semibold">Tgl Pemberian</th>
              <th class="p-3 font-semibold">Jatuh Tempo</th>
              <th class="p-3 font-semibold">Petugas / No. Batch</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-zinc-800/80">
            <tr v-for="v in allVaccinations" :key="v.id" class="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
              <td class="p-3 font-medium text-slate-900 dark:text-white">
                <NuxtLink :to="`/pets/${v.petId}`" class="text-emerald-600 dark:text-emerald-400 hover:underline">
                  {{ v.pet?.name }}
                </NuxtLink>
                <span class="text-slate-400 block text-[11px]">{{ v.pet?.owner?.name }}</span>
              </td>
              <td class="p-3 font-semibold">{{ v.vaccineName }} ({{ v.vaccineType }})</td>
              <td class="p-3">{{ v.dateAdministered }}</td>
              <td class="p-3 text-amber-600 dark:text-amber-400 font-medium">{{ v.expiryDate }}</td>
              <td class="p-3 text-slate-500">{{ v.administeredBy || '-' }} • {{ v.batchNumber || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
