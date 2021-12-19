export interface LanguageState
{
    lang: Language,
    setLang: (l: Language) => void,
}

/** Returns the dictionary function that takes a key and returns that Lemma in the current language 
 * ```jsx
 * const dict = useDictionary();
 * ...
 * <p>
 *     {dict("Hello")} // --> Hola
 * </p>
 * ```
*/
export const useDictionary = () =>
{
    const { lang } = useContext(DictionaryContext);

    return (key: Lemma) => _dict(key, lang);
}

/** Returns the current language.
 * ```jsx
 * const lang = useLanguage();
 * ```
 */
export const useLanguage = () =>
{
    const { lang, setLang } = useContext(DictionaryContext);
    return { lang, setLang };
}

/** A component that renders the `lemma` prop in the current language
 * ```jsx
 * <Dictionary lemma="Hello"/> // --> <>Hola</>
 * ```
 */
export const Dictionary = ({ lemma }: { lemma: Lemma }) =>
{
    const { lang } = useContext(DictionaryContext);

    return <>{_dict(lemma, lang)}</>
}

/** Returns the current locale.
 * ```jsx
 * const locale = useLocale();
 * ```
 */
export const useLocale = () =>
{
    const { lang } = useContext(DictionaryContext);
    return locale(lang);
}