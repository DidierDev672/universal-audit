import { createMemoryHistory, createRouter } from "vue-router";

import LoginForm from "../core/login/presentation/components/LoginForm.vue";
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
import AudioMixerPage from "../pages/AudioMixer/AudioMixerPage.vue";

import CreateScreeningPage from "../presentation/pages/screening/CreateScreeningPage.vue";
import ResourceNoteBookPage from "../pages/notebook/ResourceNoteBookPage.vue";
import ScreeningResponsesListPage from "../pages/screening/ScreeningResponsesListPage.vue";

import ClinicalPicturesListPage from "../pages/clinical/ClinicalPicturesListPage.vue";
import ClinicalPictureDetailPage from "../pages/clinical/ClinicalPictureDetailPage.vue";
import PatientScreeningAssignmentPage from "../pages/patientScreening/PatientScreeningAssignmentPage.vue";
import UserRegistrationPage from "../pages/User/UserRegistrationPage.vue";

import TinnitusQuestionnaireAssignmentPage from "../pages/screening/TinnitusQuestionnaireAssignmentPage.vue";
import TinnitusResponsesListPage from "../pages/screening/TinnitusResponsesListPage.vue";

import Layout from "../core/shared/layout/Layout.vue";

const routes = [
  { path: '/', name: 'root-login', component: LoginForm },
  { path: '/login', name: 'login', component: LoginForm },
  {
    path: '/home',
    name: 'layout',
    component: Layout,
    redirect: '/research',
    children: [
      { path: "/research", name: "home", component: DashBoardResearch },
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
      { path: "/clinical-picture/:id", name: "clinical-picture-detail", component: ClinicalPictureDetailPage },

      // ? Patient Screening Assignment
      { path: "/patient-screening-assignment", name: "patient-screening-assignment", component: PatientScreeningAssignmentPage },

      // ? Audio Mixer
      { path: "/audio-mixer", name: "audio-mixer", component: AudioMixerPage },

      // ? User Registration
      { path: "/user-registration", name: "user-registration", component: UserRegistrationPage },

      // ? Screening Responses List
      { path: "/screening-responses", name: "screening-responses", component: ScreeningResponsesListPage },
      { path: '/tinnitus-assignment', name: "asignar cuestionario", component: TinnitusQuestionnaireAssignmentPage },
      { path: '/tinnitus-responses', name: "respuestas tinnitus", component: TinnitusResponsesListPage }
    ]
  }
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});