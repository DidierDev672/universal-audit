import { createMemoryHistory, createRouter } from "vue-router";

import DashBoardResearch from "../pages/Research/DashBoardResearch.vue";
import TinnitusDashboard from "../pages/questionnaire/TinnitusDashboard.vue";
import HearingDashboard from "../pages/Hearing/ScreeningDashboard.vue";

const routes = [
  {  path: "/research", name: "home", component: DashBoardResearch },
  { path: "/questionnaire", name: "questionnaire", component: TinnitusDashboard },
  { path: "/hearing", name: "hearing", component: HearingDashboard },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});