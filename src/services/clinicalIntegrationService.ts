/**
 * Servicio para integrar Tamizajes y Cuestionarios de Tinnitus al Cuaderno Clínico
 * Permite listar, vincular y gestionar screenings/questionnaires como recursos
 */

// @ts-ignore - Supabase JS module
import { supabaseClientVue } from '../supabase';
import axios from 'axios';
import type {
  Screening,
  CreateScreeningRequest
} from '../core/screening/entities/screening';

// Re-exportar tipo Screening
export type { Screening };

export interface LinkedScreening {
  id: string;
  type: 'screening' | 'questionnaire';
  title: string;
  description: string;
  sourceUrl?: string;
  createdAt: Date;
  data: Screening | Questionnaire;
}

export interface Questionnaire {
  id: string | number;
  title: string;
  description: string;
  questions?: QuestionnaireQuestion[];
  createdAt?: Date;
}

export interface QuestionnaireQuestion {
  id: string | number;
  text: string;
  type: 'single' | 'multiple' | 'text' | 'scale';
  options?: string[];
  answer?: string | string[];
}

const SCREENING_API_URL = 'http://localhost:3000/api/v1/screenings';
const QUESTIONNAIRE_API_URL = 'http://localhost:3000/api/v1/questionnaires';

/**
 * Obtener todos los tamizajes disponibles
 */
export const getAllScreenings = async (): Promise<Screening[]> => {
  try {
    const response = await axios.get(SCREENING_API_URL);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching screenings:', error);
    return [];
  }
};

/**
 * Obtener un tamizaje por ID
 */
export const getScreeningById = async (id: string): Promise<Screening | null> => {
  try {
    const response = await axios.get(`${SCREENING_API_URL}/${id}`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching screening by id:', error);
    return null;
  }
};

/**
 * Obtener todos los cuestionarios de tinnitus
 * Por ahora usa datos estáticos, pero puede conectarse a API
 */
export const getAllQuestionnaires = async (): Promise<Questionnaire[]> => {
  // Datos estáticos para pruebas - esto puede venir de una API
  return [
    {
      id: 'tss-001',
      title: 'Evaluación de Severidad de Tinnitus (TSS)',
      description: 'Cuestionario estandarizado para medir la intensidad y el impacto del tinnitus en la vida diaria del paciente.',
      questions: [
        { id: 1, text: '¿Qué tan fuerte es su tinnitus en este momento?', type: 'scale', options: ['0 - Sin tinnitus', '1-3 - Leve', '4-6 - Moderado', '7-10 - Severo'] },
        { id: 2, text: '¿El tinnitus le dificulta concentrarse?', type: 'scale', options: ['Nunca', 'Rara vez', 'A veces', 'Frecuentemente', 'Siempre'] }
      ]
    },
    {
      id: 'tie-002',
      title: 'Cuestionario de Impacto Emocional del Tinnitus',
      description: 'Evaluación del efecto emocional y psicológico del tinnitus, incluyendo ansiedad, depresión y calidad del sueño.',
      questions: [
        { id: 1, text: '¿El tinnitus le causa ansiedad?', type: 'scale', options: ['Nunca', 'Ocasionalmente', 'Frecuentemente', 'Siempre'] },
        { id: 2, text: '¿El tinnitus le dificulta dormir?', type: 'scale', options: ['Nunca', 'Rara vez', 'A veces', 'Frecuentemente', 'Siempre'] }
      ]
    },
    {
      id: 'tfc-003',
      title: 'Frecuencia y Características del Tinnitus',
      description: 'Registro detallado de la frecuencia, tipo de sonido, volumen percibido y momentos del día en que se presenta el tinnitus.',
      questions: [
        { id: 1, text: '¿Cómo describiría el sonido de su tinnitus?', type: 'multiple', options: ['Zumbido', 'Silbido', 'Pitido', 'Pulsación', 'Otros'] },
        { id: 2, text: '¿En qué momento del día es más notorio?', type: 'single', options: ['Mañana', 'Tarde', 'Noche', 'Todo el día', 'Variable'] }
      ]
    }
  ];
};

/**
 * Obtener un cuestionario por ID
 */
export const getQuestionnaireById = async (id: string): Promise<Questionnaire | null> => {
  const questionnaires = await getAllQuestionnaires();
  return questionnaires.find(q => String(q.id) === id) || null;
};

/**
 * Buscar tamizajes y cuestionarios por término de búsqueda
 */
export const searchScreeningsAndQuestionnaires = async (
  searchTerm: string
): Promise<{ screenings: Screening[]; questionnaires: Questionnaire[] }> => {
  const [screenings, questionnaires] = await Promise.all([
    getAllScreenings(),
    getAllQuestionnaires()
  ]);

  const term = searchTerm.toLowerCase();

  const filteredScreenings = screenings.filter(s =>
    s.title.toLowerCase().includes(term) ||
    s.description?.toLowerCase().includes(term)
  );

  const filteredQuestionnaires = questionnaires.filter(q =>
    q.title.toLowerCase().includes(term) ||
    q.description.toLowerCase().includes(term)
  );

  return {
    screenings: filteredScreenings,
    questionnaires: filteredQuestionnaires
  };
};

/**
 * Generar transcripción de un tamizaje/cuestionario
 * Crea un resumen estructurado del contenido
 */
export const generateTranscription = async (
  type: 'screening' | 'questionnaire',
  id: string
): Promise<string> => {
  if (type === 'screening') {
    const screening = await getScreeningById(id);
    if (!screening) return '';

    // Generar transcripción estructurada del tamizaje
    const transcription = [
      `=== TAMIZAJE AUDITIVO: ${screening.title} ===`,
      '',
      `Descripción: ${screening.description || 'Sin descripción'}`,
      `Sonido utilizado: ${screening.soundTitle || 'No especificado'}`,
      '',
      'OPCIONES DE RESPUESTA:',
      ...(screening.options || []).map((opt, idx) =>
        `${idx + 1}. ${opt.text} ${opt.isCorrect ? '(Respuesta correcta)' : ''}`
      ),
      '',
      `Fecha de creación: ${new Date(screening.createdAt).toLocaleString()}`,
      ''
    ].join('\n');

    return transcription;
  } else {
    const questionnaire = await getQuestionnaireById(id);
    if (!questionnaire) return '';

    // Generar transcripción estructurada del cuestionario
    const transcription = [
      `=== CUESTIONARIO DE TINNITUS: ${questionnaire.title} ===`,
      '',
      `Descripción: ${questionnaire.description}`,
      '',
      'PREGUNTAS:',
      ...(questionnaire.questions || []).map((q, idx) => {
        let questionText = `${idx + 1}. ${q.text} (${q.type})`;
        if (q.options) {
          questionText += '\n   Opciones: ' + q.options.join(', ');
        }
        return questionText;
      }),
      '',
      `Total de preguntas: ${questionnaire.questions?.length || 0}`,
      ''
    ].join('\n');

    return transcription;
  }
};

/**
 * Formatear datos del tamizaje/cuestionario como recurso estructurado
 */
export const formatAsResource = (
  item: Screening | Questionnaire,
  type: 'screening' | 'questionnaire'
) => {
  return {
    id: typeof item.id === 'number' ? item.id : Date.now(),
    externalId: String(item.id),
    type: type as 'pdf' | 'audio' | 'video' | 'url' | 'youtube',
    name: item.title,
    description: item.description,
    url: type === 'screening'
      ? `/hearing-screening-form/${item.id}`
      : `/detail-tinnitus-questionnaire/${item.id}`,
    isExternalResource: true,
    resourceType: type,
    createdAt: new Date()
  };
};
