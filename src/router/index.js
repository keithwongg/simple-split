import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CalculatorView from "../views/Calculator/CalculatorView.vue";
import SummaryView from "@/views/SummaryView.vue";
import TestView from "@/views/TestStates/TestView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/calculate",
      name: "calculate",
      component: CalculatorView,
    },
    {
      path: "/summary",
      name: "summary",
      component: SummaryView,
    },
    {
      path: "/how",
      name: "how",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/HowView.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: TestView
    }
  ],
});

export default router;
