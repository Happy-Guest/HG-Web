<script setup>
import { computed } from "vue";

const props = defineProps({
    username: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: null,
    },
    api: {
        type: String,
        default: "initials",
    },
    profile: Boolean,
    table: Boolean,
    minitable: Boolean,
});

const avatar = computed(() => {
    if (username.value == "") return;
    return (
        props.avatar ??
        `https://avatars.dicebear.com/api/${props.api}/${props.username.replace(
            /[^a-z0-9]+/i,
            "-"
        )}.svg`
    );
});

const username = computed(() => props.username);

</script>

<template>
    <div>
        <img
            :src="avatar"
            :alt="username"
            :class="{
                'mx-auto rounded-full block h-auto w-40 lg:w-60 object-cover bg-gray-100 dark:bg-slate-800':
                    !profile,
                'rounded-full w-24 h-24 mx-auto lg:w-48 lg:h-44 object-cover bg-gray-100 dark:bg-slate-800':
                    profile,
                'rounded-full w-24 h-24 mx-auto lg:w-48 lg:h-36 object-cover bg-gray-100 dark:bg-slate-800':
                    table,
                'rounded-full mx-auto lg:w-6 lg:h-6 object-cover bg-gray-100 dark:bg-slate-800':
                    minitable,
            }"
        />
        <slot />
    </div>
</template>
