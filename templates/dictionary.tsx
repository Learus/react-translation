
export const DictionaryProvider = ({lang, children}: {lang: Language, children: ReactNode}) => {
    return (
        <DictionaryContext.Provider value={lang}>
            {children}
        </DictionaryContext.Provider>
    )
}

export const useDictionary = () => {
    const lang = useContext(DictionaryContext) as Language;

    return (key: Lemma) => dict(key, lang);
}

export const useLanguage = () => {
    const lang = useContext(DictionaryContext) as Language;
    return lang;
}

export const Dictionary = ({lemma}: {lemma: Lemma}) => {
    const lang = useContext(DictionaryContext) as Language;

    return <>{dict(lemma, lang)}</>
}