<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  let subdomain = '';
  let isChecking = false;
  let isAvailable = null;
  let showRegistrationForm = false;
  let mounted = false;
  
  // Data registrasi
  let registrationData = {
    name: '',
    email: '',
    whatsapp: ''
  };
  
  let isSubmitting = false;
  let submitSuccess = false;
  let errorMessage = '';
  let successData = null;
  
  onMount(() => {
    mounted = true;
  });
  
  function validateSubdomain(value) {
    const regex = /^[a-z0-9-]+$/;
    return regex.test(value) && value.length >= 3 && value.length <= 30;
  }
  
  async function checkAvailability(event) {
    // Prevent form default behavior
    if (event) {
      event.preventDefault();
    }
    
    if (!subdomain || subdomain.length < 3) {
      errorMessage = 'Subdomain minimal 3 karakter';
      isAvailable = null;
      showRegistrationForm = false;
      return;
    }
    
    if (!validateSubdomain(subdomain)) {
      errorMessage = 'Subdomain hanya boleh huruf kecil, angka, dan strip (-)';
      isAvailable = null;
      showRegistrationForm = false;
      return;
    }
    
    isChecking = true;
    errorMessage = '';
    showRegistrationForm = false;
    
    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subdomain: subdomain.toLowerCase() })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        errorMessage = data.error || 'Terjadi kesalahan';
        isAvailable = null;
        return;
      }
      
      isAvailable = data.available;
      
      if (data.available) {
        showRegistrationForm = true;
      } else {
        errorMessage = data.message || 'Subdomain sudah digunakan';
      }
      
    } catch (error) {
      console.error('Error checking domain:', error);
      errorMessage = 'Gagal mengecek ketersediaan. Silakan coba lagi.';
      isAvailable = null;
    } finally {
      isChecking = false;
    }
  }
  
  function handleSubdomainInput(e) {
    subdomain = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    isAvailable = null;
    showRegistrationForm = false;
    errorMessage = '';
  }
  
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  function validateWhatsapp(wa) {
    const regex = /^[0-9]{10,15}$/;
    return regex.test(wa.replace(/\D/g, ''));
  }
  
  async function handleSubmit(event) {
    // Prevent form default behavior jika dipanggil dari form submit
    if (event) {
      event.preventDefault();
    }
    
    // Validasi frontend
    if (!registrationData.name || registrationData.name.length < 3) {
      errorMessage = 'Nama minimal 3 karakter';
      return;
    }
    
    if (!validateEmail(registrationData.email)) {
      errorMessage = 'Email tidak valid';
      return;
    }
    
    if (!validateWhatsapp(registrationData.whatsapp)) {
      errorMessage = 'Nomor WhatsApp tidak valid (10-15 digit)';
      return;
    }
    
    isSubmitting = true;
    errorMessage = '';
    
    try {
      const response = await fetch('/api/domains/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subdomain: subdomain.toLowerCase(),
          name: registrationData.name,
          email: registrationData.email,
          whatsapp: registrationData.whatsapp
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        errorMessage = data.error || 'Terjadi kesalahan saat registrasi';
        isSubmitting = false;
        return;
      }
      
      // Success!
      successData = data.data;
      submitSuccess = true;
      isSubmitting = false;
      
      // TIDAK auto-reset, biarkan user yang kontrol
      // User bisa klik "Buat Lagi" atau "Kembali ke Beranda"
      
    } catch (error) {
      console.error('Error registering domain:', error);
      errorMessage = 'Gagal mendaftar. Silakan coba lagi.';
      isSubmitting = false;
    }
  }
  
  function handleWhatsAppInput(e) {
    registrationData.whatsapp = e.target.value.replace(/\D/g, '');
  }
</script>

<svelte:head>
  <title>Buat Web | KotaUkir.ID</title>
</svelte:head>

<style>
  @keyframes pulse-border {
    0%, 100% { border-color: rgba(251, 191, 36, 0.3); }
    50% { border-color: rgba(251, 191, 36, 0.6); }
  }
  
  @keyframes success-pop {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .pulse-border {
    animation: pulse-border 2s ease-in-out infinite;
  }
  
  .success-pop {
    animation: success-pop 0.5s ease-out;
  }
  
  .loading-spinner {
    border: 3px solid rgba(251, 191, 36, 0.2);
    border-top-color: #fbbf24;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>

<div class="min-h-screen bg-slate-950 text-white">
  <section class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-20">
    {#if mounted}
      <a 
        class="text-sm font-semibold text-amber-200 hover:text-amber-300 transition inline-flex items-center gap-2 w-fit" 
        href="/"
        in:fly="{{ x: -20, duration: 500 }}"
      >
        ← Kembali ke beranda
      </a>
      
      <div class="space-y-3" in:fly="{{ y: 20, duration: 600, delay: 100 }}">
        <h1 class="text-4xl font-bold">🌐 Buat Web</h1>
        <p class="text-lg text-slate-300">
          Masukkan nama subdomain untuk website furniture Anda, lalu klik tombol cek ketersediaan.
        </p>
      </div>

      <!-- Form Cek Subdomain -->
      <div 
        class="rounded-3xl border border-white/10 bg-slate-900/70 p-8"
        in:scale="{{ duration: 600, delay: 200 }}"
      >
        <label class="mb-3 block text-sm font-semibold text-slate-200" for="subdomain">
          Nama subdomain
        </label>
        
        <div class="flex flex-col gap-4 md:flex-row">
          <div class="flex flex-1 items-center rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-300 focus-within:border-amber-400/50 transition">
            <input
              id="subdomain"
              name="subdomain"
              type="text"
              bind:value={subdomain}
              on:input={handleSubdomainInput}
              on:keypress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  checkAvailability();
                }
              }}
              placeholder="contoh: furniturcantik"
              class="flex-1 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
              disabled={isChecking || isSubmitting}
            />
            <span class="ml-2 text-sm text-slate-400">.kotaukir.id</span>
          </div>
          
          <button
            type="button"
            on:click={(e) => {
              e.preventDefault();
              checkAvailability();
            }}
            disabled={!subdomain || subdomain.length < 3 || isChecking || isSubmitting}
            class="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-400/30 transition hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {#if isChecking}
              <div class="loading-spinner"></div>
              Mengecek...
            {:else}
              🔍 Cek Ketersediaan
            {/if}
          </button>
        </div>
        
        <p class="mt-4 text-sm text-slate-400">
          💡 Contoh hasil: <span class="text-amber-300 font-semibold">{subdomain || 'furniturcantik'}.kotaukir.id</span>
        </p>
        
        <!-- Status Message -->
        {#if errorMessage}
          <div 
            class="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300"
            in:fly="{{ y: -10, duration: 300 }}"
          >
            ❌ {errorMessage}
          </div>
        {/if}
        
        {#if isAvailable === true && !errorMessage}
          <div 
            class="mt-4 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-300"
            in:fly="{{ y: -10, duration: 300 }}"
          >
            ✅ Selamat! Subdomain <strong>{subdomain}.kotaukir.id</strong> tersedia!
          </div>
        {/if}
      </div>

      <!-- Form Registrasi -->
      {#if showRegistrationForm && !submitSuccess}
        <div 
          class="rounded-3xl border pulse-border bg-slate-900/70 p-8 space-y-6"
          in:fly="{{ y: 20, duration: 600 }}"
        >
          <div class="space-y-2">
            <h2 class="text-2xl font-bold text-amber-400">📝 Lengkapi Data Anda</h2>
            <p class="text-sm text-slate-300">Isi informasi berikut untuk melanjutkan pembuatan website</p>
          </div>
          
          <div class="space-y-5">
            <!-- Nama -->
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-200" for="name">
                Nama Lengkap <span class="text-red-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                bind:value={registrationData.name}
                placeholder="Masukkan nama lengkap Anda"
                class="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition"
                disabled={isSubmitting}
              />
            </div>
            
            <!-- Email -->
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-200" for="email">
                Email <span class="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                bind:value={registrationData.email}
                placeholder="contoh@email.com"
                class="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition"
                disabled={isSubmitting}
              />
            </div>
            
            <!-- WhatsApp -->
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-200" for="whatsapp">
                Nomor WhatsApp <span class="text-red-400">*</span>
              </label>
              <div class="flex items-center rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 focus-within:border-amber-400/50 transition">
                <span class="text-slate-400 mr-2">+62</span>
                <input
                  id="whatsapp"
                  type="tel"
                  bind:value={registrationData.whatsapp}
                  on:input={handleWhatsAppInput}
                  placeholder="81234567890"
                  class="flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                  disabled={isSubmitting}
                />
              </div>
              <p class="mt-2 text-xs text-slate-400">Format: 81234567890 (tanpa 0 di depan)</p>
            </div>
          </div>
          
          <button
            type="button"
            on:click={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={isSubmitting}
            class="w-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 text-base font-bold text-slate-900 shadow-lg shadow-amber-400/30 transition hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {#if isSubmitting}
              <div class="loading-spinner border-slate-900/20 border-t-slate-900"></div>
              Memproses...
            {:else}
              🚀 Buat Website Sekarang!
            {/if}
          </button>
        </div>
      {/if}

      <!-- Success Message -->
      {#if submitSuccess && successData}
        <div 
          class="success-pop rounded-3xl border border-green-500/50 bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-8 text-center space-y-4"
          in:scale="{{ duration: 500, easing: quintOut }}"
        >
          <div class="text-6xl">🎉</div>
          <h2 class="text-3xl font-bold text-green-400">Berhasil!</h2>
          <p class="text-lg text-slate-200">
            Website Anda <strong class="text-amber-400">{successData.fullDomain}</strong> telah masuk dalam antrian!
            
            <br>  Kami akan segera menghubungi anda jika website anda siap!
            
          </p>
          <div class="bg-slate-900/50 rounded-lg p-4 text-left space-y-2">
            <p class="text-sm text-slate-300">
              <strong>ID Registrasi:</strong> <span class="text-amber-300">{successData.id}</span>
            </p>
            <p class="text-sm text-slate-300">
              <strong>Domain:</strong> <span class="text-amber-300">{successData.fullDomain}</span>
            </p>
          </div>
          <p class="text-sm text-slate-300">
            Kami akan mengirimkan informasi lebih lanjut ke email Anda.
          </p>
          <div class="pt-4 flex gap-3 justify-center">
            <a 
              href="/"
              class="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Kembali ke Beranda
            </a>
            <button
              on:click={() => {
                submitSuccess = false;
                subdomain = '';
                registrationData = { name: '', email: '', whatsapp: '' };
                showRegistrationForm = false;
                isAvailable = null;
                successData = null;
              }}
              class="inline-block rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Buat Lagi
            </button>
          </div>
        </div>
      {/if}

      <!-- Info Box -->
      <div 
        class="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6"
        in:fade="{{ duration: 600, delay: 400 }}"
      >
        <h3 class="text-lg font-semibold text-amber-400 mb-3">📌 Ketentuan Subdomain:</h3>
        <ul class="space-y-2 text-sm text-slate-300">
          <li class="flex items-start gap-2">
            <span class="text-amber-400">•</span>
            <span>Minimal 3 karakter, maksimal 30 karakter</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-400">•</span>
            <span>Hanya huruf kecil (a-z), angka (0-9), dan strip (-)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-400">•</span>
            <span>Tidak boleh diawali atau diakhiri dengan strip (-)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-400">•</span>
            <span>Pilih nama yang mudah diingat dan mencerminkan brand Anda</span>
          </li>
        </ul>
      </div>
    {/if}
  </section>
</div>