<script setup>
import { mdiLogout, mdiClose } from "@mdi/js";
import { computed } from "vue";
import { useStyleStore } from "@/stores/style.js";
import AsideMenuList from "@/components/Asides/AsideMenuList.vue";
import AsideMenuItem from "@/components/Asides/AsideMenuItem.vue";
import BaseIcon from "@/components/Bases/BaseIcon.vue";

defineProps({
    menu: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(["menu-click", "aside-lg-close-click"]);

const styleStore = useStyleStore();

const logoutItem = computed(() => ({
    label: "Sair",
    icon: mdiLogout,
    color: "info",
    isLogout: true,
}));

const menuClick = (event, item) => {
    emit("menu-click", event, item);
};

const asideLgCloseClick = (event) => {
    emit("aside-lg-close-click", event);
};
</script>

<template>
    <aside
        id="aside"
        class="lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden"
    >
        <div
            :class="styleStore.asideStyle"
            class="lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900"
        >
            <div
                :class="styleStore.asideBrandStyle"
                class="flex flex-row h-16 lg:h-14 items-center justify-between shadow-md"
            >
                <div class="flex justify-center flex-1">
                    <img
                        class="h-12 lg:h-10 lg:ml-6 xl:-ml-3 -ml-3"
                        src="/logo.png"
                        alt="Logo"
                        title="Logo"
                    />
                    <b class="font-black ml-2 my-auto">HappyGuest</b>
                </div>
                <button
                    class="hidden lg:inline-block xl:hidden p-3"
                    @click.prevent="asideLgCloseClick"
                >
                    <BaseIcon :path="mdiClose" />
                </button>
            </div>
            <div
                :class="
                    styleStore.darkMode
                        ? 'aside-scrollbars-[slate]'
                        : styleStore.asideScrollbarsStyle
                "
                class="flex-1 overflow-y-auto overflow-x-hidden"
            >
                <AsideMenuList :menu="menu" @menu-click="menuClick" />
            </div>

            <ul>
                <AsideMenuItem :item="logoutItem" @menu-click="menuClick" />
            </ul>
        </div>
    </aside>
</template>
