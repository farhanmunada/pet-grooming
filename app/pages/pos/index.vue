<script setup lang="ts">
const { data: productData } = await useFetch('/api/products')
const { data: ownerData } = await useFetch('/api/owners')
const { data: serviceData } = await useFetch('/api/services')

const products = computed(() => productData.value?.products || [])
const owners = computed(() => ownerData.value?.owners || [])
const services = computed(() => serviceData.value?.services || [])

interface CartItem {
  type: 'Service' | 'Product'
  id: number
  name: string
  price: number
  quantity: number
  serviceId?: number
  productId?: number
}

const cart = ref<CartItem[]>([])
const selectedOwnerId = ref<number | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('All')
const paymentMethod = ref<'Cash' | 'QRIS' | 'BankTransfer' | 'DebitCard'>('Cash')
const amountPaid = ref<number>(0)
const discount = ref<number>(0)

// Modal Struk / Invoice Sukses
const isSuccessModalOpen = ref(false)
const lastTransaction = ref<any>(null)

const categories = computed(() => {
  if (!products.value) return ['All']
  const cats = new Set(products.value.map((p: any) => p.category))
  return ['All', ...Array.from(cats)]
})

const filteredProducts = computed(() => {
  if (!products.value) return []
  return products.value.filter((p: any) => {
    const matchCat = selectedCategory.value === 'All' || p.category === selectedCategory.value
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery.value))
    return matchCat && matchSearch
  })
})

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

const addToCart = (product: any) => {
  const existing = cart.value.find(item => item.type === 'Product' && item.productId === product.id)
  if (existing) {
    if (existing.quantity >= product.stockQuantity) {
      alert(`Stok produk "${product.name}" tersisa ${product.stockQuantity}`)
      return
    }
    existing.quantity++
  } else {
    cart.value.push({
      type: 'Product',
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.unitPrice,
      quantity: 1
    })
  }
}

const addServiceToCart = (service: any) => {
  const existing = cart.value.find(item => item.type === 'Service' && item.serviceId === service.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      type: 'Service',
      id: service.id,
      serviceId: service.id,
      name: service.name,
      price: service.basePrice,
      quantity: 1
    })
  }
}

const updateQty = (index: number, delta: number) => {
  const item = cart.value[index]
  if (!item) return
  item.quantity += delta
  if (item.quantity <= 0) {
    cart.value.splice(index, 1)
  }
}

const subtotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.price * item.quantity), 0)
})

const grandTotal = computed(() => {
  const total = subtotal.value - Number(discount.value || 0)
  return total > 0 ? total : 0
})

const changeAmount = computed(() => {
  if (paymentMethod.value !== 'Cash') return 0
  const change = Number(amountPaid.value || 0) - grandTotal.value
  return change > 0 ? change : 0
})

// Auto set exact cash on click shortcut
const setExactAmount = () => {
  amountPaid.value = grandTotal.value
}

const submitTransaction = async () => {
  if (!cart.value.length) {
    alert('Keranjang belanja masih kosong!')
    return
  }

  if (paymentMethod.value === 'Cash' && Number(amountPaid.value || 0) < grandTotal.value) {
    alert('Uang pembayaran tunai kurang dari total belanja!')
    return
  }

  try {
    const payload = {
      ownerId: selectedOwnerId.value || undefined,
      subtotal: subtotal.value,
      discount: Number(discount.value || 0),
      total: grandTotal.value,
      paymentMethod: paymentMethod.value,
      amountPaid: paymentMethod.value === 'Cash' ? Number(amountPaid.value) : grandTotal.value,
      changeAmount: changeAmount.value,
      items: cart.value.map(item => ({
        itemType: item.type,
        serviceId: item.serviceId,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        discount: 0,
        total: item.price * item.quantity
      }))
    }

    const res: any = await $fetch('/api/transactions', {
      method: 'POST',
      body: payload
    })

    lastTransaction.value = {
      ...payload,
      invoiceNumber: res.transaction.invoiceNumber,
      createdAt: res.transaction.createdAt
    }

    isSuccessModalOpen.value = true
    // Clear cart
    cart.value = []
    amountPaid.value = 0
    discount.value = 0
    selectedOwnerId.value = null
  } catch (err: any) {
    alert(err.data?.message || 'Gagal memproses transaksi kasir')
  }
}

const printReceipt = () => {
  window.print()
}
</script>

<template>
  <div class="h-full flex flex-col space-y-4">
    <!-- Top Bar -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Kasir POS & Penjualan Toko</span>
          <UIcon name="i-lucide-shopping-cart" class="text-emerald-500 w-6 h-6" />
        </h1>
        <p class="text-xs text-slate-500 dark:text-zinc-400">
          Transaksi grooming & retail pet shop, potongan otomatis stok barang.
        </p>
      </div>

      <!-- Owner selector -->
      <div class="w-72">
        <select
          v-model="selectedOwnerId"
          class="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-emerald-500"
        >
          <option :value="null">-- Pelanggan Umum (Guest) --</option>
          <option v-for="o in owners" :key="o.id" :value="o.id">
            {{ o.name }} ({{ o.phone }})
          </option>
        </select>
      </div>
    </div>

    <!-- Main POS Screen: 2 Columns (Catalog on left, Cart on right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
      <!-- Left Column: Catalog & Services (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Quick Services shortcuts -->
        <div class="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
          <span class="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
            <UIcon name="i-lucide-scissors" class="w-4 h-4 text-emerald-500" />
            <span>Layanan Salon Cepat</span>
          </span>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="s in services"
              :key="s.id"
              class="p-2.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition flex flex-col justify-between"
              @click="addServiceToCart(s)"
            >
              <span class="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">{{ s.name }}</span>
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ formatRupiah(s.basePrice) }}</span>
            </button>
          </div>
        </div>

        <!-- Product Search & Category Pills -->
        <div class="space-y-2.5">
          <input
            v-model="searchQuery"
            placeholder="Ketik nama produk atau scan barcode..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-emerald-500"
          >

          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              v-for="c in categories"
              :key="c"
              :class="[
                'px-3 py-1.5 rounded-xl whitespace-nowrap transition font-medium',
                selectedCategory === c
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 hover:bg-slate-50'
              ]"
              @click="selectedCategory = c"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
          <div
            v-for="p in filteredProducts"
            :key="p.id"
            :class="[
              'p-3 rounded-2xl bg-white dark:bg-zinc-900 border flex flex-col justify-between cursor-pointer transition',
              p.stockQuantity <= 0
                ? 'opacity-50 pointer-events-none border-slate-200'
                : 'border-slate-200 hover:border-emerald-500 hover:shadow-xs'
            ]"
            @click="addToCart(p)"
          >
            <div>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500">{{ p.category }}</span>
              <h4 class="font-semibold text-xs text-slate-900 dark:text-white mt-1.5 line-clamp-2">{{ p.name }}</h4>
            </div>

            <div class="mt-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">{{ formatRupiah(p.unitPrice) }}</span>
              <span :class="['text-[11px] font-medium', p.stockQuantity <= 5 ? 'text-rose-500 font-bold' : 'text-slate-400']">
                Stok: {{ p.stockQuantity }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Cart & Payment Checkout (5 cols) -->
      <div class="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs flex flex-col space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-receipt" class="w-5 h-5 text-emerald-500" />
            <h2 class="font-bold text-base text-slate-900 dark:text-white">Keranjang Tagihan</h2>
          </div>
          <button
            v-if="cart.length"
            class="text-xs text-rose-500 hover:underline"
            @click="cart = []"
          >
            Kosongkan
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
          <div v-if="!cart.length" class="text-center py-8 text-xs text-slate-400">
            Keranjang kasir masih kosong. Klik produk atau layanan di sebelah kiri.
          </div>

          <div
            v-for="(item, idx) in cart"
            :key="idx"
            class="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-between gap-2 text-xs"
          >
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-slate-900 dark:text-white truncate">{{ item.name }}</p>
              <p class="text-emerald-600 dark:text-emerald-400 font-medium">{{ formatRupiah(item.price) }}</p>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                class="w-6 h-6 rounded bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 flex items-center justify-center font-bold text-slate-600 dark:text-zinc-200 hover:bg-slate-100"
                @click="updateQty(idx, -1)"
              >
                -
              </button>
              <span class="w-6 text-center font-bold text-slate-900 dark:text-white">{{ item.quantity }}</span>
              <button
                class="w-6 h-6 rounded bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 flex items-center justify-center font-bold text-slate-600 dark:text-zinc-200 hover:bg-slate-100"
                @click="updateQty(idx, 1)"
              >
                +
              </button>
            </div>

            <div class="w-20 text-right font-bold text-slate-900 dark:text-white shrink-0">
              {{ formatRupiah(item.price * item.quantity) }}
            </div>
          </div>
        </div>

        <!-- Price Breakdown -->
        <div class="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
          <div class="flex items-center justify-between text-slate-500">
            <span>Subtotal:</span>
            <span class="font-medium text-slate-900 dark:text-white">{{ formatRupiah(subtotal) }}</span>
          </div>

          <div class="flex items-center justify-between text-slate-500">
            <span>Diskon (Rp):</span>
            <input
              v-model="discount"
              type="number"
              placeholder="0"
              class="w-28 text-right px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs"
            >
          </div>

          <div class="flex items-center justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-zinc-800">
            <span>Total Akhir:</span>
            <span class="text-emerald-600 dark:text-emerald-400 text-lg">{{ formatRupiah(grandTotal) }}</span>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
          <label class="block text-xs font-semibold text-slate-700 dark:text-zinc-300">Metode Bayar</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              v-for="method in ['Cash', 'QRIS', 'BankTransfer', 'DebitCard']"
              :key="method"
              :class="[
                'p-2 rounded-xl border text-center font-semibold transition',
                paymentMethod === method
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
              ]"
              @click="paymentMethod = (method as any)"
            >
              {{ method }}
            </button>
          </div>
        </div>

        <!-- Cash Payment Inputs -->
        <div v-if="paymentMethod === 'Cash'" class="space-y-2 p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-700 dark:text-zinc-300">Uang Diterima:</span>
            <button class="text-[11px] text-emerald-600 hover:underline" @click="setExactAmount">
              Uang Pas
            </button>
          </div>

          <input
            v-model="amountPaid"
            type="number"
            class="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm font-bold text-slate-900 dark:text-white"
          >

          <div class="flex items-center justify-between text-xs pt-1 font-semibold">
            <span class="text-slate-500">Kembalian:</span>
            <span class="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{{ formatRupiah(changeAmount) }}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <UButton
          size="lg"
          color="primary"
          block
          :disabled="!cart.length"
          @click="submitTransaction"
        >
          Proses Transaksi & Bayar
        </UButton>
      </div>
    </div>

    <!-- Modal Cetak Invoice / Struk -->
    <div
      v-if="isSuccessModalOpen && lastTransaction"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4 my-8 text-center">
        <div class="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <UIcon name="i-lucide-check-circle" class="w-7 h-7" />
        </div>

        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pembayaran Berhasil!</h3>
          <p class="text-xs text-slate-500">{{ lastTransaction.invoiceNumber }}</p>
        </div>

        <!-- Receipt Box (Print Friendly) -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 text-left text-xs space-y-2 border border-slate-100 dark:border-zinc-700">
          <div class="text-center pb-2 border-b border-dashed border-slate-300 dark:border-zinc-600">
            <p class="font-bold text-sm">PetKasih Care & Shop</p>
            <p class="text-[10px] text-slate-400">Jl. Raya Pet Lovers No. 88, Jakarta</p>
          </div>

          <div class="space-y-1 py-1">
            <div v-for="(item, idx) in lastTransaction.items" :key="idx" class="flex justify-between">
              <span class="text-slate-700 dark:text-zinc-300">{{ item.name }} x{{ item.quantity }}</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ formatRupiah(item.total) }}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-dashed border-slate-300 dark:border-zinc-600 space-y-1">
            <div class="flex justify-between">
              <span>Total:</span>
              <span class="font-bold">{{ formatRupiah(lastTransaction.total) }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Metode:</span>
              <span>{{ lastTransaction.paymentMethod }}</span>
            </div>
            <div v-if="lastTransaction.paymentMethod === 'Cash'" class="flex justify-between text-slate-500">
              <span>Bayar / Kembali:</span>
              <span>{{ formatRupiah(lastTransaction.amountPaid) }} / {{ formatRupiah(lastTransaction.changeAmount) }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            block
            @click="isSuccessModalOpen = false"
          >
            Tutup
          </UButton>
          <UButton
            color="primary"
            size="sm"
            block
            icon="i-lucide-printer"
            @click="printReceipt"
          >
            Cetak Struk
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
