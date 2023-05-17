<script setup>
import { watch, ref, watchEffect } from "vue";
import {
    mdiStarShooting,
    mdiCheck,
    mdiClose,
    mdiStar,
    mdiStarOutline,
    mdiAccount,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import { useReviewStore } from "@/stores/review";
import PillTag from "../PillTags/PillTag.vue";
import BaseIcon from "@/components/Bases/BaseIcon.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseDivider from "../Bases/BaseDivider.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const reviewStore = useReviewStore();
const review = ref([]);

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
        reviewStore.getReview(value).then((response) => {
            review.value = response;
        });
    }
);
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        :title="'Avaliação ➯ ' + review?.id"
        :icon-title="mdiStarShooting"
        button-cancel-label="Fechar"
        button-cancel="info"
        has-close
        has-cancel
        only-view
        @cancel="emit('update:active', false)"
    >
        <div>
            <div class="flex justify-between mb-0">
                <div>
                    <div class="flex">
                        <b>Estrelas: </b>
                        <div class="ml-2">
                            <BaseIcon
                                v-for="i in 5"
                                :key="i"
                                :path="
                                    i <= review.stars ? mdiStar : mdiStarOutline
                                "
                                h="h-4"
                                w="w-6"
                                :size="24"
                                class="dark:text-yellow-400 text-yellow-500 mt-1"
                            />
                        </div>
                    </div>

                    <div class="flex mt-1">
                        <p class="mt-3">
                            <b>Cliente: </b>{{ review.user?.name }}
                        </p>
                        <BaseButtons class="-mb-8">
                            <BaseButton
                                color="info"
                                class="w-12 h-12 flex-initial ml-4"
                                :icon="mdiAccount"
                                small
                                outline
                                rounded-full
                                :title="'Ver Cliente'"
                                @click="
                                    router.push({
                                        name: 'profileUser',
                                        params: { id: review.user.id },
                                    })
                                "
                            />
                        </BaseButtons>
                    </div>
                </div>
                <div>
                    <div class="flex">
                        <b>Autorização: </b>
                        <div class="ml-3">
                            <PillTag
                                v-if="review.autorize == '1'"
                                class="justify-center"
                                label="Autorizada"
                                color="contrast"
                                :icon="mdiCheck"
                                outline
                            />
                            <PillTag
                                v-else
                                class="justify-center"
                                label="Inválida"
                                color="warning"
                                :icon="mdiClose"
                                outline
                            />
                        </div>
                    </div>
                    <div class="flex mt-4 justify-end">
                        <b>Partilha: </b>
                        <div class="ml-3">
                            <PillTag
                                v-if="review.shared == '1'"
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
            <p class="text-justify"><b>Comentário:</b> {{ review.comment }}</p>
        </div>
    </CardBoxModal>
</template>
