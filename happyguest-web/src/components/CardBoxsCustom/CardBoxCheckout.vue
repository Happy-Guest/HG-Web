<script setup>
import { watch, ref, watchEffect } from "vue";
import { mdiDoorSliding, mdiAccount, mdiClose, mdiCheck } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import { useCheckoutStore } from "@/stores/checkout";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import PillTag from "../PillTags/PillTag.vue";
import BaseDivider from "../Bases/BaseDivider.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const checkoutStore = useCheckoutStore();
const checkout = ref([]);

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
const emit = defineEmits(["update:active", "updated"]);
const resErrors = ref([]);

watchEffect(() => {
    isModalActive.value = props.active;
});

watch(
    () => props.selected,
    (value) => {
        resErrors.value = [];
        checkoutStore.getCheckout(value).then((response) => {
            checkout.value = response;
        });
    }
);
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Check-out ➯ ' + checkout?.id"
        :icon-title="mdiDoorSliding"
        button-cancel-label="Fechar"
        button-cancel="info"
        has-close
        has-cancel
        only-view
        @cancel="emit('update:active', false)"
    >
        <div class="mt-4">
            <div>
                <div>
                    <div class="flex justify-between mb-0 md:flex-row flex-col">
                        <div>
                            <div class="flex">
                                <b>Efetudado em: </b>
                                <p
                                    class="ml-2 mb-3 text-gray-500 dark:text-slate-400"
                                >
                                    {{ checkout.date }}
                                </p>
                            </div>
                            <div class="flex">
                                <p class="mt-2">
                                    <b>Cliente: </b>{{ checkout.user?.name }}
                                </p>
                                <BaseButtons class="-mb-6">
                                    <BaseButton
                                        color="info"
                                        class="w-10 h-10 flex-initial ml-4"
                                        :icon="mdiAccount"
                                        small
                                        outline
                                        rounded-full
                                        :title="'Ver Cliente'"
                                        @click="
                                            router.push({
                                                name: 'profileUser',
                                                params: {
                                                    id: checkout.user.id,
                                                },
                                            })
                                        "
                                    />
                                </BaseButtons>
                            </div>
                        </div>

                        <div class="flex md:justify-end mt-7 md:mt-0">
                            <b>Validado: </b>
                            <div class="ml-3">
                                <PillTag
                                    v-if="checkout.validated == '1'"
                                    class="justify-center"
                                    label="Sim"
                                    color="success"
                                    :icon="mdiCheck"
                                />
                                <PillTag
                                    v-else
                                    class="justify-center"
                                    label="Não"
                                    color="danger"
                                    :icon="mdiClose"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <BaseDivider />
                <div>
                    <div class="flex justify-center mb-3">
                        <h1 class="text-2xl">⟸Estadia⟹</h1>
                    </div>
                    <div class="flex mb-3">
                        <b>Código: </b>
                        <div class="ml-3">
                            {{ checkout.code?.code }}
                        </div>
                    </div>
                    <div class="flex mb-3">
                        <b>Quarto: </b>
                        <div class="ml-3">
                            <PillTag
                                v-for="room in checkout.code?.rooms"
                                :key="room"
                                class="justify-center ml-2 font-semibold"
                                :label="room"
                                color="info"
                                small
                            />
                        </div>
                    </div>
                    <div class="flex">
                        <b>Data de entrada:</b>
                        <div class="ml-3">
                            <p class="mb-3 text-gray-500 dark:text-slate-400">
                                {{ checkout.code?.entry_date }}
                            </p>
                        </div>
                    </div>
                    <div class="flex">
                        <b>Data de saída:</b>
                        <div class="ml-3">
                            <p class="mb-3 text-gray-500 dark:text-slate-400">
                                {{ checkout.code?.exit_date }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </CardBoxModal>
</template>
