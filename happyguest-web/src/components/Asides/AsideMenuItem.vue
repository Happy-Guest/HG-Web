<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { useStyleStore } from "@/stores/style.js";
import { useAuthStore } from "@/stores/auth.js";
import { mdiMinus, mdiPlus } from "@mdi/js";
import { getButtonColor } from "@/colors.js";
import BaseIcon from "@/components/Bases/BaseIcon.vue";
import AsideMenuList from "@/components/Asides/AsideMenuList.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    isDropdownList: Boolean,
});

const emit = defineEmits(["menu-click"]);

const styleStore = useStyleStore();

const hasColor = computed(() => props.item && props.item.color);

const isDropdownActive = ref(false);

const componentClass = computed(() => [
    props.isDropdownList ? "py-3 ml-3 text-sm" : "py-3",
    hasColor.value
        ? getButtonColor(props.item.color, false, true)
        : `${styleStore.asideMenuItemStyle} dark:text-slate-300 dark:hover:text-white`,
    props.item.isDivider ? "cursor-default" : "cursor-pointer",
]);

const hasDropdown = computed(() => !!props.item.menu);

const menuClick = (event) => {
    emit("menu-click", event, props.item);
    if (hasDropdown.value) {
        isDropdownActive.value = !isDropdownActive.value;
    }
};

const asideMenuItemActiveStyle = computed(() =>
    hasColor.value ? "" : styleStore.asideMenuItemActiveStyle
);
</script>

<template>
    <li
        v-if="
            !item.middleware ||
            item.middleware.includes(useAuthStore().user?.role)
        "
    >
        <component
            :is="item.to ? RouterLink : 'a'"
            v-slot="vSlot"
            :to="item.to ?? null"
            :href="item.href ?? null"
            :target="item.target ?? null"
            class="flex"
            :class="componentClass"
            @click="menuClick"
        >
            <BaseIcon
                v-if="item.icon"
                :path="item.icon"
                class="flex-none"
                :class="[
                    vSlot && vSlot.isExactActive
                        ? asideMenuItemActiveStyle
                        : '',
                ]"
                w="w-16"
                :size="18"
            />
            <span
                class="grow text-ellipsis line-clamp-1"
                :class="[
                    { 'pr-12': !hasDropdown },
                    vSlot && vSlot.isExactActive
                        ? asideMenuItemActiveStyle
                        : '',
                ]"
                >{{ item.label }}</span
            >
            <BaseIcon
                v-if="hasDropdown"
                :path="isDropdownActive ? mdiMinus : mdiPlus"
                class="flex-none"
                :class="[
                    vSlot && vSlot.isExactActive
                        ? asideMenuItemActiveStyle
                        : '',
                ]"
                w="w-12"
            />
        </component>
        <AsideMenuList
            v-if="hasDropdown"
            :menu="item.menu"
            :class="[
                styleStore.asideMenuDropdownStyle,
                isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden',
            ]"
            is-dropdown-list
        />
    </li>
</template>
