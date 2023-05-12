<script setup>
import { ref, onMounted } from "vue";
import {
    mdiCursorText,
    mdiFileEye,
    mdiCommentTextOutline,
    mdiEmailFastOutline,
    mdiAccountCircle,
    mdiMapMarker,
    mdiFilePlus,
    mdiContentSaveCheck,
    mdiLockReset,
    mdiAccount,
} from "@mdi/js";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/Sections/SectionMain.vue";
import CardBox from "@/components/CardBoxs/CardBox.vue";
import FormControl from "@/components/Forms/FormControl.vue";
import FormField from "@/components/Forms/FormField.vue";
import { useComplaintStore } from "@/stores/complaint";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseDivider from "@/components/Bases/BaseDivider.vue";
import SectionTitleLine from "@/components/Sections/SectionTitleLine.vue";
import FormCheckRadio from "@/components/Forms/FormCheckRadio.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selected = ref(null);

const complaintStore = useComplaintStore();
const complaint = ref([]);
const anonymous = ref(false);
const resErrors = ref([]);

onMounted(() => {
    if (router.currentRoute.value.params?.id) {
        resErrors.value = [];
        complaintStore
            .getComplaint(router.currentRoute.value.params?.id)
            .then((response) => {
                complaint.value = response;
                form.value.title = complaint.value?.title;
                form.value.comment = complaint.value?.comment;
                form.value.local = complaint.value?.local;
                form.value.user = complaint.value?.user
                    ? complaint.value?.user
                    : "Anónimo";
                form.value.response =
                    complaint.value?.response ?? "Sem resposta";
                form.value.status = complaint.value?.status;
                selected.value = router.currentRoute.value.params.id;
            });
    } else {
        selected.value = null;
    }
});

const form = ref({
    title: "",
    comment: "",
    local: "",
    user: [
        {
            id: "",
            name: "",
        },
    ],
    response: "",
    status: "P",
});

const createComplaint = () => {
    console.log(form.value);
};

const clearComplaintFields = () => {
    form.value.title = "";
    form.value.comment = "";
    form.value.local = "";
    form.value.user = "";
    form.value.response = "";
    form.value.status = "P";
};
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLine
                :title="
                    selected
                        ? 'Reclamação ➯ ' + complaint?.id
                        : 'Registar Reclamação'
                "
                :icon="selected ? mdiFileEye : mdiFilePlus"
                main
            >
                <FormCheckRadio
                    v-model="anonymous"
                    class="font-semibold mr-12 mt-2"
                    name="anon-switch"
                    type="switch"
                    label="Anónimo"
                    input-value="anonymous"
                    :disabled="selected ? true : false"
                    :class="selected ? 'cursor-not-allowed opacity-80' : ''"
                />
            </SectionTitleLine>
            <CardBox is-form class="my-auto" @submit.prevent="createComplaint">
                <FormField
                    label="Título"
                    help="O título da reclamação. Obrigatório."
                >
                    <FormControl
                        v-model="form.title"
                        :icon="mdiCursorText"
                        name="title"
                        :disabled="selected ? true : false"
                    />
                </FormField>
                <FormField
                    label="Local"
                    help="O local da reclamação. Opcional."
                >
                    <FormControl
                        v-model="form.local"
                        :icon="mdiMapMarker"
                        name="local"
                        :disabled="selected ? true : false"
                    />
                </FormField>
                <FormField
                    label="Comentário"
                    help="O comentário da reclamação. Obrigatório."
                >
                    <FormControl
                        v-model="form.comment"
                        :icon="mdiCommentTextOutline"
                        name="comment"
                        type="textarea"
                        :disabled="selected ? true : false"
                    />
                </FormField>

                <BaseDivider />

                <FormField flex>
                    <FormField
                        label="ID Cliente"
                        help="O id do cliente da reclamação. Opcional"
                        class="w-full md:w-1/3"
                    >
                        <FormControl
                            v-model="form.user.id"
                            :icon="mdiAccount"
                            name="Client"
                            :disabled="selected ? true : false || anonymous"
                            :required="anonymous ? false : true"
                        />
                    </FormField>
                    <FormField
                        label="Nome Cliente"
                        help="O nome do cliente selecionado. Opcional"
                        class="w-full md:w-2/3"
                    >
                        <FormControl
                            v-model="form.user.name"
                            :icon="mdiAccountCircle"
                            name="Client"
                            disabled
                        />
                    </FormField>
                </FormField>

                <BaseDivider />

                <FormField
                    label="Ficheiros"
                    help="A resposta da reclamação. Dada pelos gestores."
                >
                    <FormControl
                        v-model="form.file"
                        :icon="mdiEmailFastOutline"
                        name="response"
                        type="file"
                        :disabled="selected ? true : false"
                    />
                </FormField>

                <BaseDivider />

                <FormField
                    label="Resposta"
                    help="A resposta da reclamação. Dada pelos gestores."
                >
                    <FormControl
                        v-model="form.response"
                        :icon="mdiEmailFastOutline"
                        name="response"
                        :type="form.response ? 'textarea' : 'text'"
                        :disabled="selected ? true : false"
                    />
                </FormField>

                <template #footer>
                    <BaseButtons v-if="!selected">
                        <BaseButton
                            type="submit"
                            color="success"
                            label="Registar"
                            :icon="mdiContentSaveCheck"
                        />
                        <BaseButton
                            color="info"
                            label="Repor"
                            outline
                            :icon="mdiLockReset"
                            @click="clearComplaintFields"
                        />
                    </BaseButtons>
                </template>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
