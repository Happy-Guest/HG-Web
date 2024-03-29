<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu } from "@mdi/js";
import { ref } from "vue";
import { useRouter } from "vue-router";
import menuAside from "@/menus/menuAside.js";
import menuNavBar from "@/menus/menuNavBar.js";
import { useStyleStore } from "@/stores/style.js";
import BaseIcon from "@/components/Bases/BaseIcon.vue";
import NavBar from "@/components/NavBars/NavBar.vue";
import NavBarItemPlain from "@/components/NavBars/NavBarItemPlain.vue";
import AsideMenu from "@/components/Asides/AsideMenu.vue";
import FooterBar from "@/components/Others/FooterBar.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const styleStore = useStyleStore();

const layoutAsidePadding = "xl:pl-60";

const router = useRouter();

const isAsideMobileExpanded = ref(false);
const isAsideLgActive = ref(false);

router.beforeEach(() => {
    isAsideMobileExpanded.value = false;
    isAsideLgActive.value = false;
});

async function submitLogout() {
    if (await authStore.logout()) {
        router.push({ name: "login" });
    }
}

const menuClick = (event, item) => {
    if (item.isToggleLightDark) {
        styleStore.setDarkMode();
    }

    if (item.isLogout) {
        submitLogout();
    }
};
</script>

<template>
    <div
        :class="{
            dark: styleStore.darkMode,
            'overflow-hidden lg:overflow-visible': isAsideMobileExpanded,
        }"
    >
        <div
            :class="[
                layoutAsidePadding,
                { 'ml-60 lg:ml-0': isAsideMobileExpanded },
            ]"
            class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
        >
            <NavBar
                :menu="menuNavBar"
                :class="[
                    layoutAsidePadding,
                    { 'ml-60 lg:ml-0': isAsideMobileExpanded },
                ]"
                @menu-click="menuClick"
            >
                <NavBarItemPlain
                    display="flex lg:hidden"
                    @click.prevent="
                        isAsideMobileExpanded = !isAsideMobileExpanded
                    "
                >
                    <BaseIcon
                        :path="
                            isAsideMobileExpanded
                                ? mdiBackburger
                                : mdiForwardburger
                        "
                        size="24"
                    />
                </NavBarItemPlain>
                <NavBarItemPlain
                    display="hidden lg:flex xl:hidden"
                    @click.prevent="isAsideLgActive = true"
                >
                    <BaseIcon :path="mdiMenu" size="24" />
                </NavBarItemPlain>
            </NavBar>
            <AsideMenu
                :is-aside-mobile-expanded="isAsideMobileExpanded"
                :is-aside-lg-active="isAsideLgActive"
                :menu="menuAside"
                @menu-click="menuClick"
                @aside-lg-close-click="isAsideLgActive = false"
            />
            <slot />
            <FooterBar> IPL ESTG</FooterBar>
        </div>
    </div>
</template>
