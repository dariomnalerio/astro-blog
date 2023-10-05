import {ui, defaultLang} from "./ui"

// This function extracts the language code from a URL and returns it as a keyof typeof ui type.
// If the language code is not found in the ui object, it returns the defaultLang value.
export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split("/")
    if (lang in ui) {
        return lang as keyof typeof ui;
    }
    return defaultLang
}

// This function returns a translation function for a given language code.
// The translation function takes a key of typeof ui[typeof defaultLang] type and returns the corresponding translation.
// If the translation is not found for the given language code, it falls back to the defaultLang translation.
export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]){
        return ui[lang][key] || ui[defaultLang][key]
    }
}