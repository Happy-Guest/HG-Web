import { useAuthStore } from "@/stores/auth";
export default function admin({ router }) {
    const authStore = useAuthStore();
    if (authStore.user?.role != "A") router.push({ name: "dashboard" });
}
