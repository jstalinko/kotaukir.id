<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  
  let mounted = false;
  let activeFeature = 0;
  let scrollY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  const features = [
    {
      title: "Etalase produk rapi",
      description: "Tata koleksi berdasarkan kategori, ukuran, dan bahan sehingga pembeli menemukan produk dengan cepat.",
      icon: "🪑"
    },
    {
      title: "Integrasi promosi",
      description: "Bagikan promo terbaru, paket bundling, dan karya unggulan langsung dari dashboard.",
      icon: "📢"
    },
    {
      title: "Pesan & konsultasi",
      description: "Terhubung dengan pelanggan untuk konsultasi desain, estimasi harga, hingga jadwal pengiriman.",
      icon: "💬"
    }
  ];
  
  const testimonials = [
    { name: "Budi Santoso", role: "Pengrajin Mebel Jepara", text: "Website saya jadi terlihat profesional!" },
    { name: "Siti Aminah", role: "Toko Furniture Minimalis", text: "Pesanan meningkat 300% dalam 2 bulan!" },
    { name: "Ahmad Rizki", role: "Ukir Kayu Tradisional", text: "Mudah digunakan, hasilnya luar biasa!" }
  ];
  
  let currentTestimonial = 0;
  
  onMount(() => {
    mounted = true;
    
    const featureInterval = setInterval(() => {
      activeFeature = (activeFeature + 1) % features.length;
    }, 3000);
    
    const testimonialInterval = setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }, 5000);
    
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    
    const handleMouseMove = (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(featureInterval);
      clearInterval(testimonialInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });
  
  let hoveredButton = null;
</script>

<svelte:head>
  <title>KotaUkir.ID | Pembuat Website Furniture Gratis</title>
</svelte:head>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
    50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6); }
  }
  
  @keyframes slide-progress {
    0% { width: 0%; }
    100% { width: 50%; }
  }
  
  @keyframes woodgrain {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .wood-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .wood-pulse {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .hero-woodline {
    background: linear-gradient(90deg, #f59e0b, #d97706, #b45309);
    animation: slide-progress 2s ease-out forwards;
    background-size: 200% 100%;
  }
  
  .fancy-border {
    border: 2px solid rgba(251, 191, 36, 0.3);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  }
  
  .fancy-border::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
    animation: shimmer 3s infinite;
  }
  
  .fancy-border-sm {
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .fancy-border-sm:hover {
    border-color: rgba(251, 191, 36, 0.5);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(251, 191, 36, 0.2);
  }
  
  .parallax-bg {
    transform: translateY(calc(var(--scroll) * 0.5px));
  }
  
  .feature-card {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .feature-card.active {
    transform: scale(1.05);
    border-color: rgba(251, 191, 36, 0.8);
  }
  
  .step-indicator {
    transition: all 0.4s ease;
  }
  
  .step-indicator:hover {
    transform: scale(1.2) rotate(5deg);
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
  }
  
  .cta-button {
    position: relative;
    overflow: hidden;
  }
  
  .cta-button::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  .cta-button:hover::after {
    width: 300px;
    height: 300px;
  }
  
  .floating-element {
    animation: float 4s ease-in-out infinite;
  }
  
  .testimonial-card {
    transition: all 0.5s ease;
  }
  
  @keyframes rotate-glow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  .rotating-glow {
    animation: rotate-glow 10s linear infinite;
  }
</style>

<div class="min-h-screen bg-slate-950 text-white overflow-hidden">
  <!-- Floating particles -->
  <div class="fixed inset-0 pointer-events-none" style="--scroll: {scrollY}">
    {#each Array(15) as _, i}
      <div 
        class="absolute w-2 h-2 bg-amber-400/20 rounded-full floating-element"
        style="
          left: {Math.random() * 100}%; 
          top: {Math.random() * 100}%; 
          animation-delay: {i * 0.3}s;
          animation-duration: {3 + Math.random() * 2}s;
        "
      ></div>
    {/each}
  </div>

  <!-- Hero Section -->
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-slate-950 to-slate-950 parallax-bg" style="--scroll: {scrollY}"></div>
    
    <!-- Animated wood grain overlay -->
    <div class="absolute inset-0 opacity-5" style="
      background: linear-gradient(45deg, #8b4513 25%, transparent 25%, transparent 75%, #8b4513 75%, #8b4513),
      linear-gradient(45deg, #8b4513 25%, transparent 25%, transparent 75%, #8b4513 75%, #8b4513);
      background-size: 60px 60px;
      background-position: 0 0, 30px 30px;
      animation: woodgrain 20s linear infinite;
    "></div>
    
    <div class="relative mx-auto flex max-w-6xl flex-col items-start gap-10 px-6 py-20">
      {#if mounted}
        <!-- Navigation -->
        <nav class="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" 
             in:fly="{{ y: -50, duration: 800, easing: quintOut }}">
          <span
            class="wood-float inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200"
          >
            🪵 KotaUkir.ID
          </span>
          <div class="flex flex-wrap gap-4 text-sm font-semibold text-slate-200">
            <a class="transition hover:text-amber-200 hover:scale-110 inline-block" href="/tentang-kami">Tentang Kami</a>
            <a class="transition hover:text-amber-200 hover:scale-110 inline-block" href="/visi-misi">Visi & Misi</a>
            <a class="transition hover:text-amber-200 hover:scale-110 inline-block" href="/buat-web">Buat Web</a>
          </div>
        </nav>

        <!-- Hero Content -->
        <div class="space-y-6" in:fly="{{ y: 50, duration: 1000, delay: 200, easing: quintOut }}">
          <h1 class="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Platform <span class="text-amber-400 rotating-glow">GRATIS</span> untuk membuat website furniture dan menjual produk Anda.
          </h1>
          <p class="max-w-2xl text-lg text-slate-200">
            Bangun etalase digital yang menampilkan karya terbaik, mengelola pesanan, dan menjangkau pelanggan baru.
            KotaUkir.ID membuat pembuatan website furniture jadi cepat dan mudah.
          </p>
          <div class="relative h-2 w-40 overflow-hidden rounded-full bg-slate-800/80 sm:w-56">
            <span class="hero-woodline absolute inset-y-0 left-0 rounded-full"></span>
          </div>
          <p class="text-base font-semibold text-amber-200">
            ✨ Membantu anda mengembangkan usaha furniture!
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4" in:scale="{{ duration: 600, delay: 400, easing: elasticOut }}">
          <a href="/buat-web" 
            class="cta-button rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-400/30 transition hover:bg-amber-300 hover:shadow-amber-400/50 hover:scale-105"
            on:mouseenter={() => hoveredButton = 'start'}
            on:mouseleave={() => hoveredButton = null}
          >
            🚀 Mulai gratis sekarang
          </a>
          <a href="/buat-web" class="cta-button rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5 hover:scale-105">
            👀 Lihat contoh toko
          </a>
        </div>

        <!-- Info Cards -->
        <div class="fancy-border wood-pulse grid w-full gap-6 bg-slate-900/70 p-8 backdrop-blur sm:grid-cols-2"
             in:fly="{{ y: 100, duration: 1000, delay: 600 }}">
          <div class="space-y-4 transform transition hover:scale-105">
            <div class="text-4xl">🎨</div>
            <h2 class="text-2xl font-semibold">Buat website furniture Anda</h2>
            <p class="text-slate-300">
              Pilih template, atur katalog, dan tampilkan material, ukuran, serta finishing yang membuat produk Anda berbeda.
            </p>
          </div>
          <div class="space-y-4 transform transition hover:scale-105">
            <div class="text-4xl">💰</div>
            <h2 class="text-2xl font-semibold">Mulai jualan seketika</h2>
            <p class="text-slate-300">
              Terima pesanan, kelola pertanyaan, dan terhubung dengan pelanggan yang siap mengisi rumah impian mereka.
            </p>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <!-- Steps Section -->
  <section class="mx-auto max-w-6xl px-6 pb-20">
    {#if mounted}
      <div class="fancy-border grid gap-10 bg-slate-900/60 p-10 md:grid-cols-[1.2fr_1fr]"
           in:fly="{{ y: 100, duration: 800, delay: 200 }}">
        <div class="space-y-6">
          <h2 class="text-3xl font-semibold">⚡ Hanya 3 langkah</h2>
          <p class="text-slate-300">
            Bangun website furniture profesional tanpa ribet. Ikuti panduan singkat dan langsung tayang hari ini.
          </p>
          <ul class="space-y-4 text-slate-200">
            {#each [
              { num: 1, title: "Masukkan nama website", desc: "Pilih nama toko dan domain yang sesuai dengan brand furniture Anda." },
              { num: 2, title: "Verifikasi data", desc: "Konfirmasi informasi bisnis agar pembeli lebih percaya." },
              { num: 3, title: "Selesai", desc: "Website furniture Anda aktif dan siap menerima pesanan." }
            ] as step, i}
              <li class="flex items-start gap-3" in:fly="{{ x: -50, duration: 600, delay: i * 150 }}">
                <span class="step-indicator mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-900">
                  {step.num}
                </span>
                <div>
                  <p class="text-base font-semibold">{step.title}</p>
                  <p class="text-sm text-slate-400">{step.desc}</p>
                </div>
              </li>
            {/each}
          </ul>
        </div>
        
        <div class="fancy-border-sm flex flex-col justify-between gap-6 bg-slate-950/70 p-6">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Dipercaya pengrajin</p>
            <p class="mt-3 text-2xl font-semibold">Tampilkan meja, sofa, dan kabinet kustom.</p>
          </div>
          <div class="space-y-4">
            {#each [
              { icon: "📋", title: "Template katalog", desc: "Sorot variasi produk, material, dan waktu pengerjaan." },
              { icon: "🎯", title: "Kumpulkan lead", desc: "Terima permintaan custom dan tindak lanjuti lebih cepat." },
              { icon: "📱", title: "Siap mobile", desc: "Tampilan responsif untuk ponsel dan tablet." }
            ] as item, i}
              <div class="fancy-border-sm bg-slate-900 p-4" in:scale="{{ duration: 400, delay: i * 100 }}">
                <p class="text-sm font-semibold text-amber-200">{item.icon} {item.title}</p>
                <p class="text-sm text-slate-400">{item.desc}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </section>

  <!-- Features Section -->
  <section class="mx-auto max-w-6xl px-6 pb-20">
    {#if mounted}
      <div class="space-y-8" in:fade="{{ duration: 1000 }}">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Fitur utama</p>
            <h2 class="text-3xl font-semibold">🌟 Semua kebutuhan bisnis furniture dalam satu tempat.</h2>
          </div>
          <p class="max-w-xl text-slate-300">
            Kelola katalog, promosi, dan komunikasi pelanggan dengan mudah. Fokuskan waktu Anda untuk produksi dan kualitas.
          </p>
        </div>
        
        <div class="grid gap-6 md:grid-cols-3">
          {#each features as feature, i}
            <div 
              class="feature-card fancy-border-sm bg-slate-900/60 p-6 cursor-pointer {activeFeature === i ? 'active' : ''}"
              in:fly="{{ y: 50, duration: 600, delay: i * 150 }}"
            >
              <div class="text-4xl mb-4">{feature.icon}</div>
              <h3 class="text-xl font-semibold">{feature.title}</h3>
              <p class="mt-2 text-sm text-slate-400">{feature.description}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </section>

  <!-- Testimonials Section -->
  {#if mounted}
    <section class="mx-auto max-w-6xl px-6 pb-20">
      <div class="fancy-border bg-slate-900/60 p-10 text-center">
        <h2 class="text-3xl font-semibold mb-8">💬 Kata Mereka</h2>
        <div class="max-w-2xl mx-auto">
          {#key currentTestimonial}
            <div class="testimonial-card" in:fly="{{ y: 30, duration: 500 }}" out:fly="{{ y: -30, duration: 500 }}">
              <p class="text-xl italic text-slate-200 mb-4">"{testimonials[currentTestimonial].text}"</p>
              <p class="font-semibold text-amber-400">{testimonials[currentTestimonial].name}</p>
              <p class="text-sm text-slate-400">{testimonials[currentTestimonial].role}</p>
            </div>
          {/key}
        </div>
        <div class="flex justify-center gap-2 mt-6">
          {#each testimonials as _, i}
            <button 
              class="w-2 h-2 rounded-full transition {currentTestimonial === i ? 'bg-amber-400 w-8' : 'bg-slate-600'}"
              on:click={() => currentTestimonial = i}
            ></button>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- CTA Section -->
  <section class="border-t border-white/10 bg-slate-950/90">
    {#if mounted}
      <div class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center"
           in:fly="{{ y: 50, duration: 800 }}">
        <div>
          <h3 class="text-2xl font-semibold">🚀 Siap mengembangkan usaha furniture Anda?</h3>
          <p class="text-slate-400">Buat website KotaUkir.ID hari ini dan jangkau pembeli di mana saja.</p>
        </div>
        <a href="/buat-web" class="cta-button rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 hover:scale-110 shadow-lg hover:shadow-2xl">
          ⭐ Mulai bangun sekarang
        </a>
      </div>
    {/if}
  </section>

  <!-- Footer -->
  <footer class="border-t border-white/10 bg-slate-950">
    {#if mounted}
      <div class="mx-auto max-w-6xl px-6 py-8" in:fade="{{ duration: 600, delay: 200 }}">
        <div class="flex flex-col items-center justify-center gap-4 text-center">
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <span>&copy; {new Date().getFullYear()}</span>
            <a 
              href="https://javara.digital" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-amber-400 hover:text-amber-300 transition hover:underline font-semibold"
            >
              JavaraDigital
            </a>
          </div>
          <div class="flex items-center gap-3 text-xs text-slate-500">
            <a href="/kebijakan-privasi" class="hover:text-amber-400 transition">Kebijakan Privasi</a>
            <span>•</span>
            <a href="/syarat-ketentuan" class="hover:text-amber-400 transition">Syarat & Ketentuan</a>
            <span>•</span>
            <a href="/kontak" class="hover:text-amber-400 transition">Kontak</a>
          </div>
        </div>
      </div>
    {/if}
  </footer>
</div>