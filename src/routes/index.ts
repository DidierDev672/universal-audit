import { createMemoryHistory, createRouter } from "vue-router";

import LoginForm from "../core/login/presentation/components/LoginForm.vue";
import TinnitusDashboard from "../pages/questionnaire/TinnitusDashboard.vue";
import HearingDashboard from "../pages/Hearing/ScreeningDashboard.vue";
import Tinnitusquestionnairebuilder from "../pages/questionnaire/Tinnitusquestionnairebuilder.vue";
import Tinnitusquestionnaire from "../pages/questionnaire/Tinnitusquestionnaire.vue";
import DetailQuestionnaire from "../pages/questionnaire/DetailQuestionnaire.vue";
import HearingScreeningForm from "../pages/Hearing/HearingScreeningForm.vue";
import PatientRegistrationForm from "../pages/Patient/PatientRegistrationForm.vue";
import PatientProfilePage from "../pages/Patient/PatientProfilePage.vue";
import CalendarPage from "../pages/Calendar/CalendarPage.vue";
import CalendarAIRepositoryPage from "../pages/Calendar/CalendarAIRepositoryPage.vue";

import AddSoundForm from "../pages/sound/AddSoundForm.vue";
import AudioLibraryPage from "../pages/sound/AudioLibraryPage.vue";

import CreateScreeningPage from "../presentation/pages/screening/CreateScreeningPage.vue";
import ScreeningResponsesListPage from "../pages/screening/ScreeningResponsesListPage.vue";

import PatientScreeningAssignmentPage from "../pages/patientScreening/PatientScreeningAssignmentPage.vue";
import UserRegistrationPage from "../pages/User/UserRegistrationPage.vue";

import TinnitusQuestionnaireAssignmentPage from "../pages/screening/TinnitusQuestionnaireAssignmentPage.vue";
import TinnitusResponsesListPage from "../pages/screening/TinnitusResponsesListPage.vue";

import Layout from "../core/shared/layout/Layout.vue";
import N8nSendText from "../components/n8n/N8nSendText.vue";
import AiDocumentUploader from "../components/AI/AiDocumentUploader.vue";
import AiImageBatchAnalyzer from "../components/AI/AiImageBatchAnalyzer.vue";
import AiImageAnalysesViewer from "../components/AI/AiImageAnalysesViewer.vue";
import AiDocumentList from "../components/AI/AiDocumentList.vue";
import AiDocumentAnalysisList from "../components/AI/AiDocumentAnalysisList.vue";
import GenerativeModelConfigPage from "../pages/AI/GenerativeModelConfigPage.vue";
import NotePackageComposer from "../components/notes/NotePackageComposer.vue";
import NotePackagesViewer from "../components/notes/NotePackagesViewer.vue";
import NotePackageDetailPage from "../pages/notes/NotePackageDetailPage.vue";

const routes = [
  { path: "/", name: "root-login", component: LoginForm },
  { path: "/login", name: "login", component: LoginForm },
  {
    path: "/home",
    name: "layout",
    component: Layout,
    redirect: "/calendar",
    children: [
      {
        path: "/questionnaire",
        name: "questionnaire",
        component: TinnitusDashboard,
      },
      { path: "/hearing", name: "hearing", component: HearingDashboard },

      // ? Tinnitus Questionnaire
      {
        path: "/tinnitus-questionnaire",
        name: "tinnitus-questionnaire",
        component: Tinnitusquestionnairebuilder,
      },
      {
        path: "/list-tinnitus-questionnaire",
        name: "list-tinnitus-questionnaire",
        component: Tinnitusquestionnaire,
      },
      {
        path: "/detail-tinnitus-questionnaire/:id",
        name: "detail-tinnitus-questionnaire",
        component: DetailQuestionnaire,
      },

      // ? Hearing Screening Form
      {
        path: "/hearing-screening-form",
        name: "hearing-screening-form",
        component: HearingScreeningForm,
      },
      // ? Patient Registration Form
      {
        path: "/patient-registration-form",
        name: "patient-registration-form",
        component: PatientRegistrationForm,
      },

      // ? Sound Management
      { path: "/add-sound", name: "add-sound", component: AddSoundForm },
      {
        path: "/audio-library",
        name: "audio-library",
        component: AudioLibraryPage,
      },

      // ? Screening Management
      {
        path: "/create-screening",
        name: "create-screening",
        component: CreateScreeningPage,
      },

      // ? Patient Screening Assignment
      {
        path: "/patient-screening-assignment",
        name: "patient-screening-assignment",
        component: PatientScreeningAssignmentPage,
      },

      // ? User Registration
      {
        path: "/user-registration",
        name: "user-registration",
        component: UserRegistrationPage,
      },

      // ? Screening Responses List
      {
        path: "/screening-responses",
        name: "screening-responses",
        component: ScreeningResponsesListPage,
      },
      {
        path: "/tinnitus-assignment",
        name: "asignar cuestionario",
        component: TinnitusQuestionnaireAssignmentPage,
      },
      {
        path: "/tinnitus-responses",
        name: "respuestas tinnitus",
        component: TinnitusResponsesListPage,
      },

      // ? Patient Profile
      {
        path: "/patient-profile",
        name: "patient-profile",
        component: PatientProfilePage,
      },

      // ? Calendar
      { path: "/calendar", name: "calendar", component: CalendarPage },
      {
        path: "/calendar-ai-repository",
        name: "calendar-ai-repository",
        component: CalendarAIRepositoryPage,
      },
      { path: "/n8n-send-text", name: "n8n-send-text", component: N8nSendText },
      {
        path: "/ai-document-uploader",
        name: "ai-document-uploader",
        component: AiDocumentUploader,
      },
      {
        path: "/ai-image-analyzer",
        name: "ai-image-analyzer",
        component: AiImageBatchAnalyzer,
      },
      {
        path: "/ai-image-analyses",
        name: "ai-image-analyses",
        component: AiImageAnalysesViewer,
      },
      {
        path: "/ai-documentos",
        name: "ai-documentos",
        component: AiDocumentList,
      },
      {
        path: "/ai-analisis",
        name: "ai-analisis",
        component: AiDocumentAnalysisList,
      },
      {
        path: "/ai-model-config",
        name: "ai-model-config",
        component: GenerativeModelConfigPage,
      },
      {
        path: "/note-packages",
        name: "note-packages",
        component: NotePackagesViewer,
      },
      {
        path: "/note-packages/compose",
        name: "note-packages-compose",
        component: NotePackageComposer,
      },
      {
        path: "/note-packages/:id",
        name: "note-package-detail",
        component: NotePackageDetailPage,
      },
    ],
  },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
