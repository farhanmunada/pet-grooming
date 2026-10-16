<script setup lang="ts">
const { data, refresh, status } = await useFetch('/api/dashboard/stats')

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
    case 'Confirmed': return 'Menunggu / Terjadwal'
    case 'InProgress': return 'Sedang Dikerjakan'
    case 'Completed': return 'Selesai'
    case 'Cancelled': return 'Dibatalkan'
    default: return stat
  }
}

// Quick status updater for appointments
const updateAppointmentStatus = async (id: number, newStatus: string) => {
  try {
    await $fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    })
    await refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Gagal mengubah status antrean')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Greeting -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Operasional Hari Ini</span>
          <UIcon name="i-lucide-activity" class="text-emerald-500 w-6 h-6" />
        </h1>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Pantau antrean grooming, penjualan kasir, dan kesehatan berkala anabul.
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
          Refresh Data
        </UButton>
      </div>
    </div>

    <!-- Quick Stats Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Grooming Today -->
      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
          <span>Grooming Hari Ini</span>
          <UIcon name="i-lucide-scissors" class="w-4 h-4 text-emerald-500" />
        </div>
        <p class="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
          {{ data?.stats.todayAppointmentsCount || 0 }}
        </p>
        <span class="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">Jadwal salon aktif</span>
      </div>

      <!-- Today's Revenue -->
      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
          <span>Omset Hari Ini</span>
          <UIcon name="i-lucide-banknote" class="w-4 h-4 text-emerald-500" />
        </div>
        <p class="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
          {{ formatRupiah(data?.stats.todayRevenue || 0) }}
        </p>
        <span class="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">Kasir POS & Grooming</span>
      </div>

      <!-- Expiring Vaccines -->
      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
          <span>Peringatan Vaksin</span>
          <UIcon name="i-lucide-shield-alert" class="w-4 h-4 text-amber-500" />
        </div>
        <p class="text-2xl font-bold mt-2 text-amber-600 dark:text-amber-400">
          {{ data?.stats.expiringVaccinesCount || 0 }}
        </p>
        <span class="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">Perlu diingatkan via WA</span>
      </div>

      <!-- Low Stock Alert -->
      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
          <span>Stok Menipis</span>
          <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-rose-500" />
        </div>
        <p class="text-2xl font-bold mt-2 text-rose-600 dark:text-rose-400">
          {{ data?.stats.lowStockCount || 0 }}
        </p>
        <span class="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 block">Mencapai batas minimum</span>
      </div>
    </div>

    <!-- Main Grid: Grooming Queue & Alerts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Live Grooming Queue -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="text-emerald-500" />
            <span>Jadwal & Antrean Grooming Hari Ini</span>
          </h2>
          <NuxtLink to="/appointments" class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
            Lihat Semua Antrean →
          </NuxtLink>
        </div>

        <div v-if="!data?.todayAppointments?.length" class="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
          <UIcon name="i-lucide-calendar-x" class="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p class="text-sm font-medium text-slate-600 dark:text-zinc-300">Belum ada jadwal grooming untuk hari ini</p>
          <UButton to="/appointments" size="xs" color="primary" class="mt-3">
            + Tambah Jadwal Baru
          </UButton>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="app in data.todayAppointments"
            :key="app.id"
            class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-emerald-500/40"
          >
            <div class="flex items-start gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                <UIcon :name="app.pet?.species === 'Cat' ? 'i-lucide-cat' : 'i-lucide-dog'" class="w-6 h-6" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-slate-900 dark:text-white text-base">
                    {{ app.pet?.name }}
                  </h3>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                    {{ app.pet?.species }} • {{ app.pet?.breedNotes || 'Mixed' }}
                  </span>
                  <UBadge :color="statusBadgeColor(app.status)" variant="subtle" size="xs">
                    {{ statusLabel(app.status) }}
                  </UBadge>
                </div>

                <div class="text-xs text-slate-500 dark:text-zinc-400 mt-1 flex flex-wrap items-center gap-3">
                  <span>Pemilik: <strong>{{ app.owner?.name }}</strong> ({{ app.owner?.phone }})</span>
                  <span>•</span>
                  <span>Groomer: <strong>{{ app.groomer?.name }}</strong></span>
                  <span>•</span>
                  <span>Waktu: <strong>{{ app.scheduledAt.split('T')[1]?.slice(0, 5) || '10:00' }} WIB</strong></span>
                </div>

                <p v-if="app.notes" class="text-xs italic text-slate-500 dark:text-zinc-400 mt-1.5">
                  "{{ app.notes }}"
                </p>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
              <UButton
                v-if="app.status === 'Confirmed'"
                size="xs"
                color="warning"
                variant="soft"
                icon="i-lucide-play"
                @click="updateAppointmentStatus(app.id, 'InProgress')"
              >
                Mulai
              </UButton>

              <UButton
                v-if="app.status === 'InProgress'"
                size="xs"
                color="success"
                icon="i-lucide-check-circle"
                @click="updateAppointmentStatus(app.id, 'Completed')"
              >
                Selesai
              </UButton>

              <UButton
                :to="`/pets/${app.petId}`"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-lucide-folder-open"
              >
                Profil Pet
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Col: Vaccine Alerts & Stock Alerts -->
      <div class="space-y-6">
        <!-- Vaccine Reminder Widget -->
        <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-bell-ring" class="text-amber-500 w-4 h-4" />
              <span>Jatuh Tempo Vaksinasi</span>
            </h3>
            <NuxtLink to="/vaccinations" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
              Kelola →
            </NuxtLink>
          </div>

          <div v-if="!data?.expiringVaccines?.length" class="text-center py-4 text-xs text-slate-500 dark:text-zinc-400">
            Tidak ada vaksin jatuh tempo saat ini.
          </div>

          <div v-else class="space-y-2.5">
            <div
              v-for="v in data.expiringVaccines"
              :key="v.id"
              class="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs flex items-center justify-between gap-2"
            >
              <div>
                <p class="font-semibold text-slate-900 dark:text-white">
                  {{ v.pet?.name }} ({{ v.pet?.owner?.name }})
                </p>
                <p class="text-[11px] text-amber-700 dark:text-amber-300">
                  {{ v.vaccineName }} • Exp: {{ v.expiryDate }}
                </p>
              </div>

              <UButton
                v-if="v.pet?.owner?.phone"
                size="xs"
                color="success"
                variant="subtle"
                icon="i-lucide-send"
                :to="`https://wa.me/${v.pet.owner.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent('Halo Kak ' + v.pet.owner.name + ', salam dari PetKasih! Kami mengingatkan bahwa jadwal booster vaksin ' + v.vaccineName + ' untuk ' + v.pet.name + ' jatuh tempo pada ' + v.expiryDate + '. Segera booking jadwal ya!')}`"
                target="_blank"
              >
                WA
              </UButton>
            </div>
          </div>
        </div>

        <!-- Low Stock Alert Widget -->
        <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-package-x" class="text-rose-500 w-4 h-4" />
              <span>Peringatan Stok Menipis</span>
            </h3>
            <NuxtLink to="/inventory" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
              Stok →
            </NuxtLink>
          </div>

          <div v-if="!data?.lowStockProducts?.length" class="text-center py-4 text-xs text-slate-500 dark:text-zinc-400">
            Semua stok produk dalam batas aman.
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="p in data.lowStockProducts"
              :key="p.id"
              class="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs flex items-center justify-between"
            >
              <div>
                <p class="font-medium text-slate-900 dark:text-white">{{ p.name }}</p>
                <p class="text-[11px] text-slate-500 dark:text-zinc-400">{{ p.category }}</p>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs">
                Sisa: {{ p.stockQuantity }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
