<script setup>
import { ref, watchEffect } from "vue";
import { mdiEmail, mdiSend } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useReviewStore } from "@/stores/review";

const reviewStore = useReviewStore();

const isModalActive = ref(false);

const resMessage = ref("");
const resErrors = ref([]);

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

watchEffect(() => {
    isModalActive.value = props.active;
});

const form = ref({
    email: "",
});

const emit = defineEmits(["update:active", "updated"]);

const shareReview = async () => {
    reviewStore
        .shareReview(props.selected, {
            email: form.value.email,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 200) {
                isModalActive.value = false;
                reviewStore.updateTable = true;
                emit("update:active", false);
                emit("updated");
                clear();
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao partilhar a avaliação.";
        });
};

const clear = () => {
    form.value.email = "";
    resErrors.value = [];
};
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Partilhar Avaliação ➯ ' + props.selected"
        button-label="Partilhar"
        :icon="mdiSend"
        :icon-title="mdiEmail"
        button="success"
        has-errors
        has-cancel
        has-close
        :errors="resErrors"
        @cancel="emit('update:active', false), clear()"
        @confirm="shareReview()"
    >
        <FormField>
            <FormField
                label="Email Destinatário"
                help="Email do destinatário da partilha. Obrigatório."
                label-for="shareReviewEmail"
            >
                <FormControl
                    id="shareReviewEmail"
                    v-model="form.email"
                    :icon="mdiEmail"
                    name="shareReviewEmail"
                    type="text"
                    required
                />
            </FormField>
        </FormField>
    </CardBoxModal>
</template>
