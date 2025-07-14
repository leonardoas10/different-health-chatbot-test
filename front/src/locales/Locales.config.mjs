export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "es"];

export const TRANSLATIONS_CONFIG = [
  {
    pageRef: "overview",
    translations: {
      en: "overview",
      es: "general",
    },
  },
  {
    pageRef: "results",
    translations: {
      en: "results",
      es: "resultados",
    },
    children: [
      {
        pageRef: "vo2-max",
        translations: {
          en: "vo2-max",
          es: "vo2-max",
        },
      },
      {
        pageRef: "dexa-scan",
        translations: {
          en: "dexa-scan",
          es: "escaner-dexa",
        },
      },
      {
        pageRef: "tasa-metabolismo-basal",
        translations: {
          en: "tasa-metabolismo-basal",
          es: "tasa-de-metabolismo-basal",
        },
      },
      {
        pageRef: "blood-analysis",
        translations: {
          en: "blood-analysis",
          es: "ansalisis-de-sangre",
        },
      },
      {
        pageRef: "force-plate-test",
        translations: {
          en: "force-plate-test",
          es: "placa-de-fuerza",
        },
      },
    ],
  },
  {
    pageRef: "plan",
    translations: {
      en: "plan",
      es: "plan",
    },
  },
  {
    pageRef: "notes",
    translations: {
      en: "notes",
      es: "notes",
    },
  },
];
