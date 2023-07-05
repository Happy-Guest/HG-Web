<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiContentSaveCheck,
    mdiTextBox,
    mdiFilePlus,
    mdiAccount,
    mdiAccountMultiple,
    mdiAccountCircle,
    mdiStar,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import FormCheckRadio from "@/components/Forms/FormCheckRadio.vue";
import { useReviewStore } from "@/stores/review";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const reviewStore = useReviewStore();

const isModalActive = ref(false);

const resMessage = ref("");
const resErrors = ref([]);

const anonymous = ref(false);

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
    user: [
        {
            id: null,
            name: "",
        },
    ],
    stars: "",
    comment: null,
    authorize: false,
});

const emit = defineEmits(["update:active", "updated"]);

const clear = () => {
    form.value.user.id = null;
    form.value.user.name = "";
    form.value.stars = "";
    form.value.comment = null;
    form.value.authorize = false;
    resErrors.value = "";
    anonymous.value = false;
};

const registerReview = () => {
    reviewStore
        .registerReview({
            user_id: anonymous.value ? null : form.value.user.id,
            stars: form.value.stars,
            comment: form.value.comment,
            authorize: form.value.authorize,
        })
        .then((response) => {
            resMessage.value = response.data.message;
            if (response.status == 201) {
                isModalActive.value = false;
                reviewStore.updateTable = true;
                emit("update:active", false);
                emit("updated", true);
                clear();
            } else if (response.status == 400 || response.status == 429) {
                resErrors.value = response.data.message;
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            resMessage.value = "Ocorreu um erro ao registar uma avaliação.";
        });
};

watch(
    () => form.value.user.id,
    (value) => {
        if (value && !anonymous.value) {
            userStore.loadUserById(value).then((response) => {
                if (response.role && response.role != "C")
                    form.value.user.name = "Utilizador não é cliente!";
                else if (response.id) form.value.user.name = response.name;
                else form.value.user.name = "Utilizador não encontrado!";
            });
        }
    }
);
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        title="Registar Avaliação"
        button-label="Registar"
        :icon="mdiContentSaveCheck"
        :icon-title="mdiFilePlus"
        button="success"
        has-errors
        has-cancel
        has-close
        :errors="resErrors"
        @cancel="emit('update:active', false), clear()"
        @confirm="registerReview()"
    >
        <div class="text-end">
            <FormCheckRadio
                v-model="anonymous"
                class="font-semibold"
                name="anon-switch"
                type="switch"
                label="Anónima"
                input-value="anonymous"
            />
        </div>
        <FormField flex>
            <FormField
                label="ID Cliente"
                help="O ID do cliente. Opcional"
                class="w-full md:w-1/3 mb-4 sm:mb-0"
                label-for="client"
                flex
                no-margin
            >
                <FormControl
                    id="client"
                    v-model="form.user.id"
                    :icon="mdiAccount"
                    name="Client"
                    type="number"
                    :placeholder="anonymous ? 'Sem ID' : ''"
                    :disabled="anonymous"
                    :required="anonymous ? false : true"
                    :class="!anonymous ? 'w-10/12 flex flex-initial' : 'w-full'"
                />
                <BaseButtons v-if="!anonymous">
                    <BaseButton
                        color="info"
                        class="w-10 h-10 my-auto flex-initial mb-4"
                        :icon="mdiAccountMultiple"
                        small
                        outline
                        rounded-full
                        title="Ver Clientes"
                        @click="
                            (router.push({ name: 'users' }),
                            (userStore.updateTable = true)),
                                (userStore.filterTable = 'C')
                        "
                    />
                </BaseButtons>
            </FormField>
            <FormField
                label="Nome Cliente"
                help="O nome do cliente selecionado. Automático."
                class="w-full md:w-2/3"
                label-for="clientName"
            >
                <FormControl
                    id="clientName"
                    v-model="form.user.name"
                    :icon="mdiAccountCircle"
                    :placeholder="anonymous ? 'Anónimo' : ''"
                    name="Client"
                    disabled
                />
            </FormField>
        </FormField>
        <FormField
            label="Avaliação"
            help="Avaliação de 1 a 5. Obrigatório."
            label-for="stars"
        >
            <FormControl
                id="stars"
                v-model="form.stars"
                :icon="mdiStar"
                name="stars"
                type="number"
            />
        </FormField>
        <FormField
            label="Comentário"
            help="Registe/Edite o comentário. Obrigatório."
            label-for="comment"
        >
            <FormControl
                id="comment"
                v-model="form.comment"
                :icon="mdiTextBox"
                name="comment"
                type="textarea"
            />
        </FormField>
        <FormCheckRadio
            v-model="form.authorize"
            class="font-semibold mt-5"
            name="autorize-switch"
            type="checkbox"
            label="Autorizar Partilha da Avaliação"
            input-value="autorize"
        />
    </CardBoxModal>
</template>
