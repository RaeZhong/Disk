import { createRouter, createWebHistory } from "vue-router";
import VueCookies from "vue-cookies";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/",
      name: "Framework",
      component: () => import("@/views/Framework.vue"),
      meta:{
        needLogin:true,
      },
    }
  ],
});

router.beforeEach((to, from, next) => {
  const userInfo = VueCookies.get("userInfo");
  if (
    to.meta.needLogin != null &&
    to.meta.needLogin &&
    userInfo == null
  ) {
    router.push("/login");
  }
  next();
});

export default router;
