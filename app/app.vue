<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - PetKasih Care & Shop` : 'PetKasih - Sistem Grooming & Pet Care Terpadu'
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Sistem manajemen pet care, booking grooming, rekam medis vaksinasi, dan POS kasir toko hewan.' }
  ],
  htmlAttrs: {
    lang: 'id'
  }
})

const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: 'Antrean Grooming', icon: 'i-lucide-scissors', to: '/appointments' },
  { label: 'Data Anabul', icon: 'i-lucide-dog', to: '/pets' },
  { label: 'Data Pemilik', icon: 'i-lucide-users', to: '/owners' },
  { label: 'Monitor Vaksin', icon: 'i-lucide-shield-alert', to: '/vaccinations' },
  { label: 'Kasir POS', icon: 'i-lucide-shopping-cart', to: '/pos' },
  { label: 'Inventaris Produk', icon: 'i-lucide-package', to: '/inventory' },
  { label: 'Laporan', icon: 'i-lucide-bar-chart-3', to: '/reports' }
]

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 flex flex-col md:flex-row">
      <!-- Desktop & Mobile Sidebar -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <!-- Logo & Brand -->
        <div class="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2.5 font-bold text-lg text-emerald-600 dark:text-emerald-400">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <UIcon name="i-lucide-paw-print" class="w-6 h-6" />
            </div>
            <div>
              <span class="tracking-tight text-slate-900 dark:text-white">PetKasih</span>
              <span class="text-xs font-medium block text-emerald-600 dark:text-emerald-400 -mt-1">Care & Shop</span>
            </div>
          </NuxtLink>

          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="md:hidden"
            @click="mobileMenuOpen = false"
          />
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
          <NuxtLink
            v-for="item in navLinks"
            :key="item.to"
            :to="item.to"
            :class="[
              'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
              route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to))
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'
            ]"
          >
            <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Current Store / User Info Footer -->
        <div class="p-3 border-t border-slate-200 dark:border-zinc-800">
          <div class="p-3 rounded-xl bg-slate-100/80 dark:bg-zinc-800/60 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              PK
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold truncate text-slate-900 dark:text-white">PetKasih Store #01</p>
              <p class="text-[11px] text-slate-500 dark:text-zinc-400 truncate">Jakarta Selatan</p>
            </div>
            <UColorModeButton size="sm" />
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile drawer -->
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        @click="mobileMenuOpen = false"
      />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Topbar Header -->
        <header class="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <UButton
              icon="i-lucide-menu"
              color="neutral"
              variant="ghost"
              class="md:hidden"
              @click="mobileMenuOpen = true"
            />
            <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Operasional Aktif</span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center gap-2.5">
            <UButton
              to="/pos"
              icon="i-lucide-shopping-cart"
              color="primary"
              variant="soft"
              size="sm"
            >
              Kasir Cepat
            </UButton>

            <UButton
              to="/appointments"
              icon="i-lucide-calendar-plus"
              color="primary"
              size="sm"
            >
              + Booking Baru
            </UButton>
          </div>
        </header>

        <!-- Main Page View -->
        <main class="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <NuxtPage />
        </main>
      </div>
    </div>
  </UApp>
</template>
