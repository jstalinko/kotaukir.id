<svelte:head>
  <title>Buat Web | KotaUkir.ID</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 text-white">
  <section class="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-20">
    <a class="text-sm font-semibold text-amber-200" href="/">← Kembali ke beranda</a>
    <div class="space-y-3">
      <h1 class="text-4xl font-bold">Buat Web</h1>
      <p class="text-lg text-slate-300">
        Masukkan nama subdomain untuk website furniture Anda, lalu klik tombol buat.
      </p>
    </div>

    <form class="rounded-3xl border border-white/10 bg-slate-900/70 p-8">
      <label class="mb-3 block text-sm font-semibold text-slate-200" for="subdomain">
        Nama subdomain
      </label>
      <div class="flex flex-col gap-4 md:flex-row">
        <div class="flex flex-1 items-center rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-300">
          <input
            id="subdomain"
            name="subdomain"
            type="text"
            placeholder="contoh: furniturcantik"
            class="flex-1 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
          />
          <span class="ml-2 text-sm text-slate-400">.kotaukir.id</span>
        </div>
        <button
          type="button"
          class="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-400/30 transition hover:bg-amber-300"
        >
          Buat!
        </button>
      </div>
      <p class="mt-4 text-sm text-slate-400">
        Contoh hasil: furniturcantik.kotaukir.id
      </p>
    </form>
  </section>
</div>
