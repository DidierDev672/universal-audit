import { createMemoryHistory, createRouter } from "vue-router";

import DashBoardResearch from "../pages/Research/DashBoardResearch.vue";
import TinnitusDashboard from "../pages/questionnaire/TinnitusDashboard.vue";
import HearingDashboard from "../pages/Hearing/ScreeningDashboard.vue";
import Tinnitusquestionnairebuilder from "../pages/questionnaire/Tinnitusquestionnairebuilder.vue";
import Researchform from "../pages/Research/Researchform.vue";
import Research from "../pages/Research/Research.vue";
import DetailtResearch from "../pages/Research/DetailtResearch.vue";
import HearingScreeningForm from "../pages/Hearing/HearingScreeningForm.vue";
import PatientRegistrationForm from "../pages/Patient/PatientRegistrationForm.vue";


const routes = [
  {  path: "/research", name: "home", component: DashBoardResearch },
  { path: "/questionnaire", name: "questionnaire", component: TinnitusDashboard },
  { path: "/hearing", name: "hearing", component: HearingDashboard },
  
  // ? Tinnitus Questionnaire
  { path: "/tinnitus-questionnaire", name: "tinnitus-questionnaire", component: Tinnitusquestionnairebuilder },
  
  // ? Research Form
  { path: "/research-form", name: "research-form", component: Researchform },
  { path: "/research-list", name: "research list", component: Research },
  { path: "/research-detail/:id", name: "research-detail", component: DetailtResearch },
  

  // ? Hearing Screening Form
  { path: "/hearing-screening-form", name: "hearing-screening-form", component: HearingScreeningForm },
  // ? Patient Registration Form
  { path: "/patient-registration-form", name: "patient-registration-form", component: PatientRegistrationForm },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});