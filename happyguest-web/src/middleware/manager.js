import { useAuthStore } from "@/stores/auth";
export default function manager({ router }) {
    const authStore = useAuthStore();
    if (authStore.user.role != "M" && authStore.user.role != "A")
        router.push({ name: "dashboard" });
}
