<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const router = useRouter();

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true;
  return password.value === confirmPassword.value;
});

function register() {
  if (!passwordsMatch.value || !acceptTerms.value) return;
  router.push('/dashboard');
}

function registerWithGoogle() {
  // TODO: brancher l'authentification Google (OAuth)
  router.push('/dashboard');
}
</script>

<template>
  <main class="grid min-h-screen bg-slate-50 lg:grid-cols-2">
    <!-- Panneau gauche -->
    <section class="relative hidden overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <!-- Décorations -->
      <div class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-teal-300/10 blur-3xl"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:24px_24px]"></div>

      <div class="relative flex items-center gap-3">
        <span class="grid h-11 w-11 place-items-center rounded-xl bg-white font-black text-emerald-700 shadow-lg shadow-emerald-900/30">E</span>
        <span class="text-2xl font-bold tracking-tight">Eco-Stock</span>
      </div>

      <div class="relative">
        <h1 class="max-w-xl text-4xl font-bold leading-tight">
          Rejoignez la logistique intelligente et durable.
        </h1>
        <p class="mt-4 max-w-lg text-emerald-50/90">
          Créez votre compte et centralisez vos entrepôts, produits et audits dans une seule interface.
        </p>

        <ul class="mt-8 space-y-4">
          <li class="flex items-center gap-3">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur-sm">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
            <span class="text-sm text-emerald-50/90">Suivi en temps réel de vos stocks</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur-sm">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
            <span class="text-sm text-emerald-50/90">Audits automatisés et rapports clairs</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur-sm">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
            <span class="text-sm text-emerald-50/90">Multi-entrepôts, une seule plateforme</span>
          </li>
        </ul>
      </div>

      <p class="relative text-xs text-emerald-100/60">© 2026 Eco-Stock. Tous droits réservés.</p>
    </section>

    <!-- Panneau droit -->
    <section class="flex items-center justify-center px-4 py-10">
      <form
        class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60"
        @submit.prevent="register"
      >
        <span class="grid h-11 w-11 place-items-center rounded-lg bg-emerald-700 font-black text-white lg:hidden">E</span>

        <h2 class="mt-4 text-3xl font-bold text-slate-950">Créer un compte !</h2>
        <p class="mt-2 text-slate-500">Remplissez le formulaire pour rejoindre Eco-Stock.</p>

        <!-- Bouton Google -->
        <button
          type="button"
          class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
          @click="registerWithGoogle"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 010-4.19V7.07H2.18a11 11 0 000 9.86l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          S'inscrire avec Google
        </button>

        <!-- Séparateur -->
        <div class="mt-6 flex items-center gap-3">
          <div class="h-px flex-1 bg-slate-200"></div>
          <span class="text-xs font-medium text-slate-400">ou avec votre email</span>
          <div class="h-px flex-1 bg-slate-200"></div>
        </div>

        <!-- Nom complet -->
        <label class="mt-5 block text-sm font-bold text-slate-700">
          Nom complet
          <div class="relative mt-1.5">
            <svg class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
            <input
              v-model="fullName"
              type="text"
              placeholder="Alex Manager"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-normal text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </label>

        <!-- Email -->
        <label class="mt-4 block text-sm font-bold text-slate-700">
          Email
          <div class="relative mt-1.5">
            <svg class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0-.414.336-.75.75-.75h18a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-18a.75.75 0 01-.75-.75V6.75z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75l9.75 6.75 9.75-6.75"/>
            </svg>
            <input
              v-model="email"
              type="email"
              placeholder="alex@eco-stock.com"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-normal text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </label>

        <!-- Mot de passe -->
        <label class="mt-4 block text-sm font-bold text-slate-700">
          Mot de passe
          <div class="relative mt-1.5">
            <svg class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 9.75h10.5a1.5 1.5 0 001.5-1.5v-6.75a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v6.75a1.5 1.5 0 001.5 1.5z"/>
            </svg>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Minimum 8 caractères"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-normal text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
            </button>
          </div>
        </label>

        <!-- Confirmation mot de passe -->
        <label class="mt-4 block text-sm font-bold text-slate-700">
          Confirmer le mot de passe
          <div class="relative mt-1.5">
            <svg class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 9.75h10.5a1.5 1.5 0 001.5-1.5v-6.75a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v6.75a1.5 1.5 0 001.5 1.5z"/>
            </svg>
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Retapez votre mot de passe"
              class="w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-normal text-slate-900 outline-none transition focus:bg-white focus:ring-4"
              :class="passwordsMatch
                ? 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                : 'border-red-300 focus:border-red-400 focus:ring-red-100'"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg v-if="!showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
            </button>
          </div>
          <p v-if="!passwordsMatch" class="mt-1.5 text-xs font-semibold text-red-500">
            Les mots de passe ne correspondent pas.
          </p>
        </label>

        <!-- Conditions -->
        <label class="mt-4 flex items-start gap-2.5 text-xs text-slate-500">
          <input
            v-model="acceptTerms"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>
            J'accepte les
            <a href="#" class="font-semibold text-emerald-700 hover:underline">conditions d'utilisation</a>
            et la
            <a href="#" class="font-semibold text-emerald-700 hover:underline">politique de confidentialité</a>.
          </span>
        </label>

        <button
          class="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          :disabled="!acceptTerms || !passwordsMatch"
        >
          Créer mon compte
        </button>

        <p class="mt-6 text-center text-sm text-slate-500">
          Vous avez déjà un compte ?
          <RouterLink to="/login" class="font-semibold text-emerald-700 hover:underline">
            Se connecter
          </RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>