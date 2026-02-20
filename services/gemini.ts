
import { GoogleGenAI, Type } from "@google/genai";
import { Budget, Expense } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAudit = async (budget: Budget, expenses: Expense[]) => {
  const prompt = `
    Analiza este presupuesto y gastos. Proporciona 3 consejos prácticos en español.
    Presupuesto mensual: ${budget.totalIncome} ${budget.currency}
    Gastos fijos: ${JSON.stringify(budget.fixedCosts)}
    Ahorro objetivo: ${budget.savingsTarget}
    Gastos reales registrados: ${JSON.stringify(expenses)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              message: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['success', 'warning', 'info'] }
            },
            required: ['title', 'message', 'type']
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { title: "Error de IA", message: "No pudimos generar insights en este momento.", type: "warning" }
    ];
  }
};

export const getInvestmentCommitteeVeredict = async (project: any) => {
  const prompt = `
    ACTÚA COMO: Un algoritmo de inversión imparcial, frío y extremadamente estricto. Tu trabajo es proteger el capital de Claro Colombia.
    
    TU OBJETIVO: Evaluar técnicamente la iniciativa CAPEX ingresada. No seas amable, sé analítico y escéptico.
    
    PROYECTO: "${project.proyecto}"
    MONTO: $${Number(project.presupuestoCop).toLocaleString()} COP
    DESCRIPCIÓN: ${project.descripcionBreve}
    KPI ASOCIADO: ${project.businessCase?.contribucionKPIs}

    CALIFICA DE 1 A 5 (1=Pésimo/Capricho, 5=Vital/Insuperable):
    1. Estrategia: ¿Cura un dolor real o es solo cosmético?
    2. Finanzas: ¿ROI tangible o eficiencias imposibles de medir?
    3. Riesgo: ¿Qué tan probable es que esto falle catastróficamente?
    4. Ejecución: ¿El equipo está realmente preparado para esto?
    5. Urgencia: ¿Qué pasa si NO lo hacemos mañana?

    LÓGICA MATEMÁTICA DE DECISIÓN (ZONA DE LA VERDAD):
    - Suma 0-15 -> RECHAZADO
    - Suma 16-20 -> CONDICIONADO
    - Suma 21-25 -> APROBADO

    FORMATO JSON OBLIGATORIO:
    {
      "puntuaciones": { "estrategia": number, "finanzas": number, "riesgo": number, "ejecucion": number, "urgencia": number },
      "estado": "APROBADO" | "RECHAZADO" | "CONDICIONADO",
      "pregunta_de_cierre": "string (la pregunta más difícil que un CEO le haría al líder de este proyecto)",
      "justificaciones": { "estrategia": "string", "finanzas": "string", "riesgo": "string", "ejecucion": "string", "urgencia": "string" }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            puntuaciones: {
              type: Type.OBJECT,
              properties: {
                estrategia: { type: Type.INTEGER },
                finanzas: { type: Type.INTEGER },
                riesgo: { type: Type.INTEGER },
                ejecucion: { type: Type.INTEGER },
                urgencia: { type: Type.INTEGER }
              },
              required: ['estrategia', 'finanzas', 'riesgo', 'ejecucion', 'urgencia']
            },
            estado: { type: Type.STRING, enum: ['APROBADO', 'RECHAZADO', 'CONDICIONADO'] },
            pregunta_de_cierre: { type: Type.STRING },
            justificaciones: {
              type: Type.OBJECT,
              properties: {
                estrategia: { type: Type.STRING },
                finanzas: { type: Type.STRING },
                riesgo: { type: Type.STRING },
                ejecucion: { type: Type.STRING },
                urgencia: { type: Type.STRING }
              },
              required: ['estrategia', 'finanzas', 'riesgo', 'ejecucion', 'urgencia']
            }
          },
          required: ['puntuaciones', 'estado', 'pregunta_de_cierre', 'justificaciones']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Veredict Error:", error);
    throw error;
  }
};
