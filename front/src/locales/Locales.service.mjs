import {
  TRANSLATIONS_CONFIG,
  LOCALES,
  DEFAULT_LOCALE,
} from "./Locales.config.mjs";

const getTranslationIter = (elements, target, locale) => {
  for (let i = 0; i < elements.length; i++) {
    for (const [_, value] of Object.entries(elements[i].translations)) {
      if (value === target) {
        return elements[i].translations[locale];
      }
    }

    if (elements[i].children) {
      const result = getTranslationIter(elements[i].children, target, locale);

      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const LocalesService = {
  getTranslation: (target, locale) => {
    return getTranslationIter(TRANSLATIONS_CONFIG, target, locale);
  },
  getRewrites: () => {
    const total = [];

    const iter = (
      element,
      destinationString,
      originString,
      partialResult,
      locale
    ) => {
      if (element.children) {
        partialResult.push({
          source: `/${originString}`,
          destination: `/${destinationString}`,
        });

        return element.children.forEach((child) => {
          iter(
            child,
            `${destinationString}/${child.translations[DEFAULT_LOCALE]}`,
            `${originString}/${child.translations[locale]}`,
            partialResult,
            locale
          );
        });
      }

      partialResult.push({
        source: `/${originString}${element.isDynamic ? "/:path*" : ""}`,
        destination: `/${destinationString}${
          element.isDynamic ? "/:path*" : ""
        }`,
      });
    };

    TRANSLATIONS_CONFIG.forEach((element) => {
      LOCALES.forEach((locale) => {
        if (locale !== DEFAULT_LOCALE) {
          const result = [];

          iter(
            element,
            element.translations[DEFAULT_LOCALE],
            element.translations[locale],
            result,
            locale
          );

          total.push(...result);
        }
      });
    });

    return total;
  },
};
