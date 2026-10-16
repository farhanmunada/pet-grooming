<script setup lang="ts">
const { data: reportsData, refresh, status } = await useFetch('/api/reports')
const { data: transactionsData } = await useFetch('/api/transactions')

const reports = computed(() => reportsData.value)
const transactions = computed(() => transactionsData.value?.transactions || [])

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Laporan Keuangan & Penjualan</span>
          <UIcon name="i-lucide-bar-chart-3" class="text-emerald-500 w-6 h-6" />
        </h1>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Rekapitulasi omset harian, produk terlaris, dan histori buku kasir toko.
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
          Perbarui Laporan
        </UButton>
      </div>
    </div>

    <!-- Summary Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <span class="text-xs font-semibold text-slate-400 block">Total Omset Penjualan</span>
        <p class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
          {{ formatRupiah(reports?.overview?.totalRevenue || 0) }}
        </p>
        <span class="text-[11px] text-slate-400 mt-0.5 block">Dari {{ reports?.overview?.totalTransactions || 0 }} transaksi berhasil</span>
      </div>

      <div class="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <span class="text-xs font-semibold text-slate-400 block">Rata-rata Nilai Transaksi (Basket Size)</span>
        <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {{ formatRupiah(reports?.overview?.totalTransactions ? (reports.overview.totalRevenue / reports.overview.totalTransactions) : 0) }}
        </p>
        <span class="text-[11px] text-slate-400 mt-0.5 block">Per struk kasir</span>
      </div>

      <div class="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <span class="text-xs font-semibold text-slate-400 block">Status Buku Kas</span>
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
          <span>Seimbang</span>
          <UIcon name="i-lucide-check-circle" class="w-6 h-6" />
        </p>
        <span class="text-[11px] text-slate-400 mt-0.5 block">Selesai rekonsiliasi</span>
      </div>
    </div>

    <!-- Top Selling Products & Transactions Log -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Products (1 col) -->
      <div class="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-award" class="text-amber-500 w-5 h-5" />
          <span>Produk Terlaris</span>
        </h3>

        <div v-if="!reports?.topItems?.length" class="text-xs text-slate-400 py-6 text-center">
          Belum ada data penjualan tercatat.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(prod, idx) in reports.topItems"
            :key="idx"
            class="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 flex items-center justify-between text-xs"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-xs">
                {{ idx + 1 }}
              </span>
              <div>
                <p class="font-semibold text-slate-900 dark:text-white">{{ prod.name }}</p>
                <p class="text-slate-400 text-[11px]">{{ prod.quantity }} unit terjual</p>
              </div>
            </div>

            <span class="font-bold text-emerald-600 dark:text-emerald-400">
              {{ formatRupiah(prod.total) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Table (2 cols) -->
      <div class="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="i-lucide-history" class="text-emerald-500 w-5 h-5" />
          <span>Histori Transaksi Kasir Terkini</span>
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 dark:bg-zinc-800/60 text-slate-500 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th class="p-3 font-semibold">No. Invoice</th>
                <th class="p-3 font-semibold">Pelanggan</th>
                <th class="p-3 font-semibold">Metode</th>
                <th class="p-3 font-semibold">Total Nilai</th>
                <th class="p-3 font-semibold">Waktu</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-zinc-800/80">
              <tr v-if="!transactions?.length">
                <td colspan="5" class="p-6 text-center text-slate-400">
                  Belum ada transaksi di buku kas.
                </td>
              </tr>

              <tr v-for="t in transactions" :key="t.id" class="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
                <td class="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {{ t.invoiceNumber }}
                </td>
                <td class="p-3 font-medium text-slate-900 dark:text-white">
                  {{ t.owner?.name || 'Pelanggan Umum' }}
                </td>
                <td class="p-3">
                  <UBadge color="neutral" variant="subtle" size="xs">{{ t.paymentMethod }}</UBadge>
                </td>
                <td class="p-3 font-bold text-slate-900 dark:text-white">
                  {{ formatRupiah(t.total) }}
                </td>
                <td class="p-3 text-slate-400">
                  {{ t.createdAt?.replace('T', ' ').slice(0, 16) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
