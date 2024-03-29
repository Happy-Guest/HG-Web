<script setup>
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import { RouterLink } from "vue-router";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useStyleStore } from "@/stores/style.js";
import { useAuthStore } from "@/stores/auth";
import { useMainStore } from "@/stores/main";
import BaseIcon from "@/components/Bases/BaseIcon.vue";
import UserAvatarCurrentUser from "@/components/Users/UserAvatarCurrentUser.vue";
import NavBarMenuList from "@/components/NavBars/NavBarMenuList.vue";
import BaseDivider from "@/components/Bases/BaseDivider.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["menu-click"]);

const is = computed(() => {
    if (props.item.href) {
        return "a";
    }
    if (props.item.to) {
        return RouterLink;
    }
    return "div";
});

const authStore = useAuthStore();
const mainStore = useMainStore();
const styleStore = useStyleStore();

const componentClass = computed(() => {
    const base = [
        isDropdownActive.value
            ? `${styleStore.navBarItemLabelActiveColorStyle} dark:text-slate-400`
            : `${styleStore.navBarItemLabelStyle} dark:text-white dark:hover:text-slate-400 ${styleStore.navBarItemLabelHoverStyle}`,
        props.item.menu ? "lg:py-2 lg:px-3" : "py-2 px-3",
    ];

    if (props.item.isDesktopNoLabel) {
        base.push("lg:w-16", "lg:justify-center");
    }

    return base;
});

const itemLabel = computed(() =>
    props.item.isCurrentUser ? authStore.user?.name : props.item.label
);

const isDropdownActive = ref(false);

const menuClick = (event) => {
    emit("menu-click", event, props.item);

    if (props.item.menu) {
        isDropdownActive.value = !isDropdownActive.value;
    }

    if (props.item.isNotif) {
        notifClick();
    }
};

const notifClick = () => {
    mainStore.setNotifs(!mainStore.showNotifs, true);
};

const menuClickDropdown = (event, item) => {
    emit("menu-click", event, item);
};

const root = ref(null);

const forceClose = (event) => {
    if (root.value && !root.value.contains(event.target)) {
        isDropdownActive.value = false;
    }
};

onMounted(() => {
    if (props.item.menu) {
        window.addEventListener("click", forceClose);
    }
});

onBeforeUnmount(() => {
    if (props.item.menu) {
        window.removeEventListener("click", forceClose);
    }
});
</script>

<template>
    <BaseDivider v-if="item.isDivider" nav-bar />
    <component
        :is="is"
        v-else-if="
            !item.middleware || item.middleware.includes(authStore.user?.role)
        "
        ref="root"
        class="block lg:flex items-center relative cursor-pointer"
        :class="componentClass"
        :href="item.href ?? null"
        :to="item.to ?? null"
        :target="item.target ?? null"
        @click="menuClick"
    >
        <div
            class="flex items-center"
            :class="{
                'bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0':
                    item.menu,
            }"
        >
            <UserAvatarCurrentUser
                v-if="item.isCurrentUser"
                :user-name="authStore.user?.name ?? ''"
                :user-avatar="authStore.user?.photo_url ?? null"
                class="w-6 h-6 mr-3 inline-flex"
            />
            <BaseIcon
                v-if="item.icon"
                :path="item.icon"
                class="transition-colors"
            />
            <span
                v-if="item.isNotif"
                class="px-2 transition-colors"
                :class="{ 'lg:hidden': item.isDesktopNoLabel && item.icon }"
            >
                {{ itemLabel }}
                <span
                    :style="{ color: mainStore.showNotifs ? 'green' : 'red' }"
                >
                    <b>{{ mainStore.showNotifs ? "ON" : "OFF" }}</b>
                </span>
            </span>
            <span
                v-else
                class="px-2 transition-colors"
                :class="{ 'lg:hidden': item.isDesktopNoLabel && item.icon }"
                >{{ itemLabel }}</span
            >
            <BaseIcon
                v-if="item.menu"
                :path="isDropdownActive ? mdiChevronUp : mdiChevronDown"
                class="hidden lg:inline-flex transition-colors"
            />
        </div>
        <div
            v-if="item.menu"
            class="text-sm border-b border-gray-100 lg:border lg:bg-white lg:absolute lg:top-full lg:left-0 lg:min-w-full lg:z-20 lg:rounded-lg lg:shadow-lg lg:dark:bg-slate-800 dark:border-slate-700"
            :class="{ 'lg:hidden': !isDropdownActive }"
        >
            <NavBarMenuList :menu="item.menu" @menu-click="menuClickDropdown" />
        </div>
    </component>
</template>
