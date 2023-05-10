<script setup>
import { watch, ref, watchEffect } from "vue";
import { mdiAccountSupervisor } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import CardBoxComponentEmpty from "@/components/CardBoxs/CardBoxComponentEmpty.vue";
import { useCodeStore } from "@/stores/code";

const codeStore = useCodeStore();
const users = ref([]);

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
        const userCodes = await codeStore.getUsersByCode(value);
        users.value = userCodes.map((userCode) => userCode.user);
    }
);
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Clientes ➯ Código ' + selected"
        :icon-title="mdiAccountSupervisor"
        button-cancel-label="Fechar"
        button-cancel="info"
        has-close
        has-cancel
        only-view
        @cancel="emit('update:active', false)"
    >
        <table v-if="users.length > 0" class="w-full">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td data-label="Nome">
                        {{ user.name }}
                    </td>
                    <td data-label="Email">
                        {{ user.email }}
                    </td>
                </tr>
            </tbody>
        </table>
        <CardBoxComponentEmpty
            v-else
            message="Sem clientes associados a este código..."
            padding="py-8"
        />
    </CardBoxModal>
</template>
