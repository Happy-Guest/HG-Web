<script setup>
import { computed } from "vue";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const props = defineProps({
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    api: {
        type: String,
        default: "initials",
    },
    isTable: {
        type: Boolean,
        default: false,
    },
});

const avatar = computed(() =>
    props.avatar
        ? `${serverUrl}/storage/user_photos/${props.avatar}`
        : `https://avatars.dicebear.com/api/${
              props.api
          }/${props.username.replace(/[^a-z0-9]+/i, "-")}.svg`
);

const username = computed(() => props.username);
</script>

<template>
    <div>
        <img
            :src="avatar"
            :alt="username"
            class="rounded-full block h-auto w-full max-w-md max-h-64 bg-gray-100 dark:bg-slate-800 object-cover"
            :class="{
                'max-h-24 lg:max-h-6': isTable,
            }"
        />
        <slot />
    </div>
</template>
