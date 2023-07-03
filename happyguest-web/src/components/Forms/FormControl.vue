<script setup>
import { computed, ref, onMounted } from "vue";
import FormControlIcon from "@/components/Forms/FormControlIcon.vue";

const props = defineProps({
    name: {
        type: String,
        default: null,
    },
    id: {
        type: String,
        default: null,
    },
    autocomplete: {
        type: String,
        default: null,
    },
    maxlength: {
        type: String,
        default: null,
    },
    placeholder: {
        type: String,
        default: null,
    },
    inputmode: {
        type: String,
        default: null,
    },
    icon: {
        type: String,
        default: null,
    },
    options: {
        type: Array,
        default: null,
    },
    type: {
        type: String,
        default: "text",
    },
    modelValue: {
        type: [String, Number, Boolean, Array, Object],
        default: "",
    },
    accept: {
        type: String,
        default: null,
    },
    required: Boolean,
    borderless: Boolean,
    transparent: Boolean,
    ctrlKFocus: Boolean,
    disabled: Boolean,
    uppercase: Boolean,
    multiple: Boolean,
});

const emit = defineEmits(["update:modelValue", "setRef"]);

const computedValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit("update:modelValue", value);
    },
});

const inputElClass = computed(() => {
    const base = [
        "px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full",
        "dark:placeholder-gray-400",
        computedType.value === "textarea" ? "h-24" : "h-12",
        props.borderless ? "border-0" : "border",
        props.transparent ? "bg-transparent" : "bg-white dark:bg-slate-800",
    ];

    if (props.icon) {
        base.push("pl-10");
    }

    if (props.disabled) {
        base.push("cursor-not-allowed opacity-70");
    }

    if (props.uppercase) {
        base.push("uppercase");
    }

    return base;
});

const computedType = computed(() => (props.options ? "select" : props.type));

const controlIconH = computed(() =>
    props.type === "textarea" ? "h-full" : "h-12"
);

const selectEl = ref(null);

const textareaEl = ref(null);

const inputEl = ref(null);

onMounted(() => {
    if (selectEl.value) {
        emit("setRef", selectEl.value);
    } else if (textareaEl.value) {
        emit("setRef", textareaEl.value);
    } else {
        emit("setRef", inputEl.value);
    }
});
</script>

<template>
    <div class="relative">
        <select
            v-if="computedType === 'select'"
            :id="id"
            v-model="computedValue"
            :name="name"
            :class="inputElClass"
            :disabled="disabled"
        >
            <option
                v-for="option in options"
                :key="option.id ?? option"
                :value="option"
            >
                {{ option.label ?? option }}
            </option>
        </select>
        <textarea
            v-else-if="computedType === 'textarea'"
            :id="id"
            v-model="computedValue"
            :class="inputElClass"
            :name="name"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
        />
        <input
            v-else-if="computedType === 'file'"
            :id="id"
            ref="inputEl"
            v-model="computedValue"
            :name="name"
            :inputmode="inputmode"
            :autocomplete="autocomplete"
            :required="required"
            :placeholder="placeholder"
            :type="computedType"
            :class="inputElClass"
            :disabled="disabled"
            :accept="accept"
            :multiple="multiple"
        />
        <input
            v-else
            :id="id"
            ref="inputEl"
            v-model="computedValue"
            :name="name"
            :maxlength="maxlength"
            :inputmode="inputmode"
            :autocomplete="autocomplete"
            :required="required"
            :placeholder="placeholder"
            :type="computedType"
            :class="inputElClass"
            :disabled="disabled"
            :step="computedType === 'number' ? '0.01' : null"
        />
        <FormControlIcon v-if="icon" :icon="icon" :h="controlIconH" />
    </div>
</template>
