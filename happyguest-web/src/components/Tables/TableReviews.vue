<script setup>
import { computed, ref, watch, onMounted, watchEffect } from "vue";
import {
    mdiEye,
    mdiClose,
    mdiCheck,
    mdiTrashCan,
    mdiCheckCircle,
    mdiStar,
    mdiStarOutline,
    mdiMonitorShare,
} from "@mdi/js";
import BaseLevel from "@/components/Bases/BaseLevel.vue";
import BaseButtons from "@/components/Bases/BaseButtons.vue";
import BaseButton from "@/components/Bases/BaseButton.vue";
import PillTag from "@/components/PillTags/PillTag.vue";
//import CardBoxReview from "@/components/CardBoxsCustom/CardBoxReview.vue";
import NotificationBar from "@/components/Others/NotificationBar.vue";
import CardBoxModal from "@/components/CardBoxs/CardBoxModal.vue";
import BaseIcon from "@/components/Bases/BaseIcon.vue";
import { useReviewStore } from "@/stores/review";

const reviewStore = useReviewStore();

const reviews = ref([]);

const currentPage = ref(0);
const numPages = computed(() => reviewStore.lastPage);
const currentPageHuman = computed(() => currentPage.value + 1);

const isModalActive = ref(false);
const isModalDeleteActive = ref(false);
const isSuccessNotifActive = ref(false);
const isErrorNotifActive = ref(false);

const notifText = ref("");
const resErrors = ref([]);
const selected = ref(null);

watch(currentPageHuman, async () => {
    reviews.value = await reviewStore.getReviews(currentPage.value + 1);
});

watch(
    () => isModalDeleteActive.value,
    (value) => {
        if (value) {
            resErrors.value = [];
        }
    }
);

watchEffect(async () => {
    if (reviewStore.updateTable) {
        reviewStore.clearStore();
        reviews.value = await reviewStore.getReviews(1);
    }
});

onMounted(async () => {
    reviews.value = await reviewStore.getReviews(1);
});

const pagesList = computed(() => {
    const pagesList = [];
    let num = [];
    let k = 0;
    for (let i = 0; i < numPages.value; i++) {
        if (k < 10) {
            num.push(i);
            k++;
        }
        if (k == 10 || i == numPages.value - 1) {
            pagesList.push(num);
            num = [];
            k = 0;
        }
    }
    return pagesList[parseInt(currentPage.value / 10)];
});

const submitDelete = (password) => {
    reviewStore
        .deleteReview(selected.value, password)
        .then((response) => {
            notifText.value = response.data.message;
            if (response.status === 200) {
                isModalDeleteActive.value = false;
                reviews.value = reviews.value.filter(
                    (review) => review.id != selected.value
                );
                isSuccessNotifActive.value = true;
                setTimeout(function () {
                    isSuccessNotifActive.value = false;
                }, 5000);
            } else {
                resErrors.value = response.data.errors;
            }
        })
        .catch(() => {
            notifText.value = "Ocorreu um erro ao remover a avaliação.";
            isErrorNotifActive.value = true;
            setTimeout(function () {
                isErrorNotifActive.value = false;
            }, 5000);
        });
};
</script>

<template>
    <NotificationBar
        v-if="isSuccessNotifActive"
        color="success"
        :icon="mdiCheckCircle"
        table
    >
        <b>{{ notifText }}</b>
    </NotificationBar>
    <NotificationBar
        v-if="isErrorNotifActive"
        color="danger"
        :icon="mdiAlertCircle"
        table
    >
        <b>{{ notifText }}</b>
    </NotificationBar>
    <CardBoxModal
        v-model="isModalDeleteActive"
        :errors="resErrors"
        title="Remover Avaliação"
        button="danger"
        :icon-title="mdiTrashCan"
        has-cancel
        has-close
        has-password
        @confirm="submitDelete"
    >
        <p>Tem a certeza que <b>deseja remover</b> a avaliação?</p>
    </CardBoxModal>
    <!--     <CardBoxReview
        :selected="selected"
        :active="isModalActive"
        only-view
        @update:active="isModalActive = $event"
    /> -->
    <table class="w-full">
        <thead>
            <tr>
                <th>ID:</th>
                <th>ID Cliente:</th>
                <th>Estrelas:</th>
                <th>Partilhada:</th>
                <th>Autorização:</th>
                <th>Criada Em:</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="review in reviews" :key="review.id">
                <td data-label="ID" class="text-center">
                    {{ review.id }}
                </td>
                <td data-label="Cliente" class="font-semibold">
                    {{
                        review.user
                            ? review.user.length > 20
                                ? review.user.substring(0, 20) + "..."
                                : review.user
                            : "Anónimo"
                    }}
                </td>
                <td data-label="Estrelas">
                    <BaseIcon
                        v-for="i in 5"
                        :key="i"
                        :path="i <= review.stars ? mdiStar : mdiStarOutline"
                        h="h-4"
                        w="w-4"
                        class="dark:text-yellow-400 text-yellow-500 mt-1"
                    />
                </td>
                <td data-label="Partilhada" class="text-center">
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
                </td>
                <td data-label="Autorização" class="text-center">
                    <PillTag
                        v-if="review.autorize == '1'"
                        class="justify-center ml-4"
                        label="Autorizada"
                        color="contrast"
                        :icon="mdiCheck"
                        outline
                    />
                    <PillTag
                        v-else
                        class="justify-center ml-4"
                        label="Inválida"
                        color="warning"
                        :icon="mdiClose"
                        outline
                    />
                </td>
                <td
                    data-label="Criada Em"
                    class="text-center text-gray-500 dark:text-slate-400"
                >
                    {{ review.created_at }}
                </td>
                <td
                    class="before:hidden lg:w-1 whitespace-nowrap place-content-center"
                >
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            title="Ver Avaliação"
                            :icon="mdiEye"
                            small
                            @click="
                                isModalActive = true;
                                selected = review.id;
                            "
                        />
                        <BaseButton
                            color="success"
                            title="Partilhar"
                            :icon="mdiMonitorShare"
                            small
                            :disabled="
                                review.shared == '1' || review.autorize == '0'
                            "
                            @click="selected = review.id"
                        />
                        <BaseButton
                            color="danger"
                            title="Remover"
                            :icon="mdiTrashCan"
                            small
                            @click="
                                isModalDeleteActive = true;
                                selected = review.id;
                            "
                        />
                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
            <BaseButtons>
                <BaseButton
                    v-if="currentPage > 0"
                    :label="'➤'"
                    class="font-bold rotate-180"
                    small
                    @click="currentPage = 0"
                />
                <BaseButton
                    v-if="currentPage > 0"
                    :label="'➜'"
                    class="font-bold rotate-180"
                    small
                    @click="currentPage--"
                />
                <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                    small
                    @click="currentPage = page"
                />

                <BaseButton
                    v-if="currentPage < numPages - 1"
                    :label="'➜'"
                    class="font-bold"
                    small
                    @click="currentPage++"
                />
                <BaseButton
                    v-if="currentPage < numPages - 1"
                    :label="'➤'"
                    class="font-bold"
                    small
                    @click="currentPage = numPages - 1"
                />
            </BaseButtons>
            <small>Página {{ currentPageHuman }} de {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>