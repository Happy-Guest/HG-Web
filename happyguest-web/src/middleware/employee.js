import { useAuthStore } from "@/stores/auth";
export default function employee({ router }) {
    const authStore = useAuthStore();
    if (
        authStore.user?.role != "E" &&
        authStore.user?.role != "M" &&
        authStore.user?.role != "A"
    )
        router.push({ name: "dashboard" });
}
