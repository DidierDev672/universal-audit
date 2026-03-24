import { createMemoryHistory, createRouter } from "vue-router";

import DashBoardResearch from "../pages/Research/DashBoardResearch.vue";
import TinnitusDashboard from "../pages/questionnaire/TinnitusDashboard.vue";
import HearingDashboard from "../pages/Hearing/ScreeningDashboard.vue";
import Tinnitusquestionnairebuilder from "../pages/questionnaire/Tinnitusquestionnairebuilder.vue";
import Tinnitusquestionnaire from "../pages/questionnaire/Tinnitusquestionnaire.vue";
import DetailQuestionnaire from "../pages/questionnaire/DetailQuestionnaire.vue";
import Researchform from "../pages/Research/Researchform.vue";
import Research from "../pages/Research/Research.vue";
import DetailtResearch from "../pages/Research/DetailtResearch.vue";
import HearingScreeningForm from "../pages/Hearing/HearingScreeningForm.vue";
import PatientRegistrationForm from "../pages/Patient/PatientRegistrationForm.vue";

import AddSoundForm from "../pages/sound/AddSoundForm.vue";
import AudioLibraryPage from "../pages/sound/AudioLibraryPage.vue";

import CreateScreeningPage from "../presentation/pages/screening/CreateScreeningPage.vue";
import ResourceNoteBookPage from "../pages/notebook/ResourceNoteBookPage.vue";

import ClinicalPicturesListPage from "../pages/clinical/ClinicalPicturesListPage.vue";
import ClinicalPictureDetailPage from "../pages/clinical/ClinicalPictureDetailPage.vue";

const routes = [
  { path: '/', redirect: '/research' },
  {  path: "/research", name: "home", component: DashBoardResearch },
  { path: "/questionnaire", name: "questionnaire", component: TinnitusDashboard },
  { path: "/hearing", name: "hearing", component: HearingDashboard },
  
  // ? Tinnitus Questionnaire
  { path: "/tinnitus-questionnaire", name: "tinnitus-questionnaire", component: Tinnitusquestionnairebuilder },
  { path: "/list-tinnitus-questionnaire", name: "list-tinnitus-questionnaire", component: Tinnitusquestionnaire },
  { path: "/detail-tinnitus-questionnaire/:id", name: "detail-tinnitus-questionnaire", component: DetailQuestionnaire },
  

  // ? Research Form
  { path: "/research-form", name: "research-form", component: Researchform },
  { path: "/research-list", name: "research list", component: Research },
  { path: "/research-detail/:id", name: "research-detail", component: DetailtResearch },
  

  // ? Hearing Screening Form
  { path: "/hearing-screening-form", name: "hearing-screening-form", component: HearingScreeningForm },
  // ? Patient Registration Form
  { path: "/patient-registration-form", name: "patient-registration-form", component: PatientRegistrationForm },

  // ? Sound Management
  { path: "/add-sound", name: "add-sound", component: AddSoundForm },
  { path: "/audio-library", name: "audio-library", component: AudioLibraryPage },

  // ? Screening Management
  { path: "/create-screening", name: "create-screening", component: CreateScreeningPage },
  { path: "/notebook", name: "note book", component: ResourceNoteBookPage },

  // ? Clinical Pictures Management
  { path: "/clinical-pictures", name: "clinical-pictures", component: ClinicalPicturesListPage },
  { path: "/clinical-picture/:id", name: "clinical-picture-detail", component: ClinicalPictureDetailPage }
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});