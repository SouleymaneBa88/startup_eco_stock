<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();

const form = reactive({
  nom: "",
  password: "",
});

const erreur = reactive({
  message: "",
});

const showPassword = ref(false);
const loading = ref(false);

const nomError = ref("");
const passwordError = ref("");

async function login() {

  erreur.message = "";

  if (!form.nom || !form.password) {
    erreur.message = "Veuillez remplir tous les champs";
    return;
  }

  loading.value = true;

  try {

    const response = await api.post("token/", {
      username: form.nom,
      password: form.password,
    });


    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    router.push("/dashboard");

  } catch(error) {

    erreur.message = "Email ou mot de passe incorrect.";

  } finally {

    loading.value = false;

  }
}


function loginWithGoogle() {
  router.push("/");
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
          Une logistique durable pour un monde meilleur.
        </h1>
        <p class="mt-4 max-w-lg text-emerald-50/90">
          Centralisez vos entrepôts, produits et audits dans une seule interface.
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
      <!-- novalidate désactive la validation native pour utiliser nos messages custom. -->
      <form
        class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60"
        novalidate
        @submit.prevent="login"
      >
        <span class="grid h-11 w-11 place-items-center rounded-lg bg-emerald-700 font-black text-white lg:hidden">E</span>

        <h2 class="mt-4 text-3xl font-bold text-slate-950">Bienvenue à Eco-Stock</h2>
        <p class="mt-2 text-slate-500">Entrez vos identifiants pour accéder au tableau de bord.</p>

        <!-- Bouton Google -->
        <!-- <button
          type="button"
          class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
          @click="loginWithGoogle"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 010-4.19V7.07H2.18a11 11 0 000 9.86l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Se connecter avec Google
        </button> -->

        <!-- Séparateur -->
        <!-- <div class="mt-6 flex items-center gap-3">
          <div class="h-px flex-1 bg-slate-200"></div>
          <span class="text-xs font-medium text-slate-400">ou avec votre email</span>
          <div class="h-px flex-1 bg-slate-200"></div>
        </div> -->

        <!-- Email -->
        <label class="mt-5 block text-sm font-bold text-slate-700">
          Nom
          <div class="relative mt-1.5">
            <svg class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0-.414.336-.75.75-.75h18a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-18a.75.75 0 01-.75-.75V6.75z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75l9.75 6.75 9.75-6.75"/>
            </svg>
            <input
              v-model="form.nom"
              type="name"
              class="w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-normal text-slate-900 outline-none transition focus:bg-white focus:ring-4"
              :class="emailError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'"
              @input="emailError = ''"
            />
          </div>
          <p v-if="emailError" class="mt-1.5 text-xs font-semibold text-red-500">{{ emailError }}</p>
        </label>

        <!-- Mot de passe -->
        <label class="mt-4 block text-sm font-bold text-slate-700">
          Mot de passe
          <div class="relative mt-1.5">
            <svg class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 9.75h10.5a1.5 1.5 0 001.5-1.5v-6.75a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v6.75a1.5 1.5 0 001.5 1.5z"/>
            </svg>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Votre mot de passe"
              class="w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-normal text-slate-900 outline-none transition focus:bg-white focus:ring-4"
              :class="passwordError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'"
              @input="passwordError = ''"
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
          <p v-if="passwordError" class="mt-1.5 text-xs font-semibold text-red-500">{{ passwordError }}</p>
        </label>

        <div class="mt-3 flex justify-end">
          <a href="#" class="text-xs font-semibold text-emerald-700 hover:underline">Mot de passe oublié ?</a>
        </div>

        <button
          class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-600/30 active:scale-[0.98] disabled:opacity-70"
          type="submit"
          :disabled="loading"
        >
          <svg v-if="loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ loading ? 'Connexion...' : 'Connecte-toi' }}
        </button>

        <p class="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte  ?
          <RouterLink to="/signup" class="font-semibold text-emerald-700 hover:underline">
            S'inscrire
          </RouterLink>
        </p>
      </form>
    </section>
  </main>
</template>
