<script setup>
import { computed } from "vue";
import {
    mdiChevronUp,
    mdiChevronDown,
    mdiAlertCircleOutline,
    mdiEqual,
    mdiOrderNumericAscending,
} from "@mdi/js";
import PillTag from "@/components/PillTags/PillTag.vue";

const props = defineProps({
    trend: {
        type: String,
        required: true,
    },
    trendType: {
        type: String,
        default: null,
    },
    small: Boolean,
});

const trendStyle = computed(() => {
    if (props.trendType === "up") {
        return {
            icon: mdiChevronUp,
            style: "success",
        };
    }

    if (props.trendType === "down") {
        return {
            icon: mdiChevronDown,
            style: "danger",
        };
    }

    if (props.trendType === "alert") {
        return {
            icon: mdiAlertCircleOutline,
            style: "warning",
        };
    }

    if (props.trendType === "zero") {
        return {
            icon: mdiEqual,
            style: "info",
        };
    }

    if (props.trendType === "code") {
        return {
            icon: mdiOrderNumericAscending,
            style: "info",
        };
    }

    return {
        style: "info",
    };
});
</script>

<template>
    <PillTag
        :label="trend"
        :color="trendStyle.style"
        :icon="trendStyle.icon"
        :small="small"
    />
</template>
