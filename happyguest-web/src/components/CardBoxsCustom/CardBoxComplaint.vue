<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiCursorText,
    mdiEye,
    mdiCommentTextOutline,
    mdiEmailFastOutline,
    mdiAccountCircle,
    mdiBed,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useComplaintStore } from "@/stores/complaint";

const complaintStore = useComplaintStore();
const complaint = ref([]);

const isModalActive = ref(false);

const props = defineProps({
    selected: {
        type: Number,
        default: null,
    },
    active: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["update:active"]);
watchEffect(() => {
    isModalActive.value = props.active;
});

watch(
    () => props.selected,
    async (value) => {
        await complaintStore.getComplaint(value).then((response) => {
            complaint.value = response;
        });
    }
);
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Reclamação ➯ ' + complaint?.id"
        :icon-title="mdiEye"
        has-close
        @cancel="emit('update:active', false)"
    >
        <FormField label="Título" no-margin>
            <FormControl
                v-model="complaint.title"
                :icon="mdiCursorText"
                name="title"
                disabled
            />
        </FormField>
        <FormField label="Comentário">
            <FormControl
                v-model="complaint.comment"
                :icon="mdiCommentTextOutline"
                name="comment"
                type="textarea"
                disabled
            />
        </FormField>
        <FormField>
            <FormField label="Quarto" no-margin>
                <FormControl
                    v-model="complaint.room"
                    :icon="mdiBed"
                    name="room"
                    disabled
                />
            </FormField>
            <FormField label="Cliente" no-margin>
                <FormControl
                    :model-value="complaint.user?.name"
                    :icon="mdiAccountCircle"
                    name="Client"
                    disabled
                />
            </FormField>
        </FormField>
        <FormField label="Resposta">
            <FormControl
                v-model="complaint.response"
                :icon="mdiEmailFastOutline"
                name="response"
                type="textarea"
                disabled
            />
        </FormField>
    </CardBoxModal>
</template>
