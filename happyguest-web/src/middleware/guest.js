export default function guest({ next, router }) {
    if (localStorage.getItem("token")) {
        router.push({ name: "dashboard" });
    }
    return next();
}
