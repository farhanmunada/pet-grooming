<script setup lang="ts">
const { data: productData, refresh, status } = await useFetch('/api/products')
const products = computed(() => productData.value?.products || [])

const searchQuery = ref('')
const selectedCategory = ref('All')
const isAddModalOpen = ref(false)

const form = reactive({
  name: '',
  sku: '',
  barcode: '',
  category: 'Food',
  brand: '',
  description: '',
  unitPrice: 50000,
  costPrice: 35000,
  stockQuantity: 20,
  reorderLevel: 5,
  speciesTarget: 'All',
  isRestrictedMedicine: false
})

const categories = ['All', 'Food', 'Shampoo', 'Medicine', 'Accessory', 'Toy', 'Supplement']

const filteredProducts = computed(() => {
  return products.value.filter((p: any) => {
    const matchCat = selectedCategory.value === 'All' || p.category === selectedCategory.value
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery.value)) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchCat && matchSearch
  })
})

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

const addProduct = async () => {
  if (!form.name || !form.unitPrice) {
    alert('Harap isi nama produk dan harga jual.')
    return
  }

  try {
    await $fetch('/api/products', {
      method: 'POST',
      body: {
        ...form,
        unitPrice: Number(form.unitPrice),
        costPrice: Number(form.costPrice),
        stockQuantity: Number(form.stockQuantity),
        reorderLevel: Number(form.reorderLevel)
      }
    })
    isAddModalOpen.value = false
    await refresh()
    // Reset form
    form.name = ''
    form.sku = ''
    form.barcode = ''
    form.brand = ''
    form.description = ''
  } catch (err: any) {
    alert(err.data?.message || 'Gagal menambahkan produk')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Inventaris & Stok Pet Shop</span>
          <UIcon name="i-lucide-package" class="text-emerald-500 w-6 h-6" />
        </h1>
        <p class="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Katalog pakan, obat-obatan, perlengkapan salon, dan kontrol peringatan stok minimum.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-plus"
          color="primary"
          size="sm"
          @click="isAddModalOpen = true"
        >
          Tambah Produk
        </UButton>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="searchQuery"
        placeholder="Cari SKU, nama produk, atau barcode..."
        class="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-emerald-500"
      >

      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          v-for="c in categories"
          :key="c"
          :class="[
            'px-3 py-1.5 rounded-xl whitespace-nowrap transition font-medium',
            selectedCategory === c
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50'
          ]"
          @click="selectedCategory = c"
        >
          {{ c === 'All' ? 'Semua Kategori' : c }}
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="overflow-x-auto bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
      <table class="w-full text-xs text-left">
        <thead class="bg-slate-50 dark:bg-zinc-800/60 text-slate-500 border-b border-slate-200 dark:border-zinc-800">
          <tr>
            <th class="p-3.5 font-semibold">Nama Produk & Brand</th>
            <th class="p-3.5 font-semibold">Kategori</th>
            <th class="p-3.5 font-semibold">Harga Jual</th>
            <th class="p-3.5 font-semibold">Harga Modal</th>
            <th class="p-3.5 font-semibold">Sisa Stok</th>
            <th class="p-3.5 font-semibold">Status Stok</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-zinc-800/80">
          <tr v-if="!filteredProducts.length">
            <td colspan="6" class="p-8 text-center text-slate-400">
              Tidak ada data produk ditemukan.
            </td>
          </tr>

          <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40">
            <td class="p-3.5 font-medium text-slate-900 dark:text-white">
              <span class="font-bold text-sm block">{{ p.name }}</span>
              <span class="text-slate-400 text-[11px]">{{ p.brand || '-' }} • SKU: {{ p.sku || '-' }}</span>
            </td>
            <td class="p-3.5">
              <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-medium">
                {{ p.category }}
              </span>
            </td>
            <td class="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
              {{ formatRupiah(p.unitPrice) }}
            </td>
            <td class="p-3.5 text-slate-500">
              {{ formatRupiah(p.costPrice || 0) }}
            </td>
            <td class="p-3.5 font-bold text-sm">
              {{ p.stockQuantity }}
            </td>
            <td class="p-3.5">
              <UBadge
                v-if="p.stockQuantity <= (p.reorderLevel ?? 0)"
                color="error"
                variant="subtle"
                size="xs"
              >
                Stok Kritis (Min: {{ p.reorderLevel ?? 0 }})
              </UBadge>
              <UBadge
                v-else
                color="success"
                variant="subtle"
                size="xs"
              >
                Aman
              </UBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tambah Produk Baru -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-zinc-800 space-y-4 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Tambah Produk Baru</h2>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="isAddModalOpen = false" />
        </div>

        <div class="space-y-3.5">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Nama Produk *</label>
            <input
              v-model="form.name"
              placeholder="Contoh: Royal Canin Hair & Skin 2kg"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
            >
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Kategori</label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
                <option v-for="c in categories.filter(x => x !== 'All')" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Brand / Merek</label>
              <input
                v-model="form.brand"
                placeholder="Royal Canin, Whiskas, dll"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">SKU / Kode Barang</label>
              <input
                v-model="form.sku"
                placeholder="RC-HS-2KG"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Barcode Scanner</label>
              <input
                v-model="form.barcode"
                placeholder="8991234567890"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Harga Jual (Rp) *</label>
              <input
                v-model="form.unitPrice"
                type="number"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Harga Modal / Beli (Rp)</label>
              <input
                v-model="form.costPrice"
                type="number"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Jumlah Stok Awal</label>
              <input
                v-model="form.stockQuantity"
                type="number"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Batas Minimum Peringatan (Reorder)</label>
              <input
                v-model="form.reorderLevel"
                type="number"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm"
              >
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <UButton color="neutral" variant="ghost" size="sm" @click="isAddModalOpen = false">
            Batal
          </UButton>
          <UButton color="primary" size="sm" @click="addProduct">
            Simpan Produk
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
