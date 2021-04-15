# react-translation

A simple translation system for the react ecosystem.

## Installation

```sh
git clone https://github.com/learus/react-translation.git
cd react-translation

# Edit rt_config.json if you need to
python3 rt_install.py
```

If you want to uninstall the package just run:

```sh
python3 rt_install.py -r
```

This deletes all generated files (lang jsons, js/ts utils and scripts).
Then, you can delete the git repository folder.

### Note

All paths in the rt_config.json are used **in relation to** to it specifically. For example, if the `dictionaryDirectory` field is set to `../src/data/lang/`, it means that the initial `src` folder is **above** the config file. Specifically:

```sh
src/
    ...
    data/
        lang/
            ENGLISH.json
            FRENCH.json
react-translation/
    rt_install.py
    rt_config.json
    templates/
        ...
    ...
```

## Usage

### 1. An Example

A very simple example showing how the hook should work. Notice that setting the `lang` state variable will cause a re-render and the string in the `<MultilingualComponent/>` will change to the set language (this is written in Typescript).

```tsx
import { DictionaryProvider, useDictionary, Language, ENGLISH, FRENCH } from '../util/dictionary'
// You don't have to import the Language type if you're working in JavaScript

const App = () => {
    // App Login
    const [lang, setLang] = useState<Language>(ENGLISH);

    return (
        <DictionaryProvider lang={lang}>
            <MultilingualComponent/>

            <button onClick={() => setLang(FRENCH)}>
                Switch to French
            </button>
        </DictionaryProvider>
    )
}

const MultilingualComponent = () => {
    const dict = useDictionary();

    // Provided that there is a lemma called "HelloWorld" the dict call will return the translated string in the currently selected language.
    return (
        <p>
            {dict("HelloWorld")} 
        </p>
    )
}
```

The `languages` field in the `rt_config.json` for this example looks like this:

```json
"languages": [
    {
        "label": "ENGLISH",
        "code": "en",
        "locale": "en-US"
    },
    {
        "label": "FRENCH",
        "code": "fr",
        "locale": "fr-FR"
    }
]

```

### 2. The `<DictionaryProvider>` component

As shown in the basic example, you should wrap the component you want to have translation in, with a `<DictionaryProvider>` and supply it with a language prop (of type [Language](#6-the-language-type)). If the `<DictionaryProvider>` does not exist any react hooks or components this package provides will not work.

### 3. The `useDictionary` hook

Using React context, and custom use of hooks, this hook returns a function that takes a lemma and returns a string in the currently active language. Again, that language is chosen in the [`<DictionaryProvider>`](#2-the-dictionaryprovider-component) component.  
The returned function's type signature is:

```ts
return (key: Lemma) => string
```

### 4. The lemma insertion script `lemma.py`

Using this script, you can create new Lemmas for the languages you have chosen (specified in the `rt_config.json`). Run `python3 lemma.py` provide your Lemma and a translation for each of your chosen languages as prompted.

### 5. The `Lemma` type

Any string-key the dictionary has is a lemma. The `Lemma` type is simply all those strings separated with OR (|), a.k.a.

```ts
export type Lemma = "lemma1" | "lemma2" | "lemma3"
```

This forces the user to provide the dictionary function with only valid lemmas, hence decreasing the amount of mistakes. It is created on installation and modified automatically on any lemma isnertion using the insertion script `lemma.py`.

### 6. The `Language` type

The `Language` type again is an OR separated string type that keeps all available languages, as specified in the config file. It is created on installation.

### 7. The `useLanguage` hook

As the name suggests, using the same context as the [`useDictionary`](#3-the-usedictionary-hook), this hook returns the currently active language.

### 7. The `<Dictionary>` component

Similarly to the [`useDictionary`](#2-the-usedictionary-hook) hook, this uses context to figure out the currently selected language, and returns the translated text given a lemma.

```tsx
import { DictionaryProvider, Language, ENGLISH, FRENCH } from '../util/dictionary'

const App = () => {
    // App Login
    const [lang, setLang] = useState<Language>(ENGLISH);

    return (
        <DictionaryProvider lang={lang}>
            <MultilingualComponent/>

            <button onClick={() => setLang(FRENCH)}>
                Switch to French
            </button>
        </DictionaryProvider>
    )
}

const MultilingualComponent = () => {
    return (
        <p>
            <Dictionary lemma="HelloWorld"/>
        </p>
    )
}
```

## Translation data structure

Each language's data-dictionary is saved in a JSON file in the folder spcified by the `dictionaryDirectory` in the `rt_config.json` file. They are created on installation, and are updated automatically when using the lemma insertion script. The files' format is simple. Here's an example:

```json
// ENGLISH.json
{
    "HelloWorld": "Hello World!",
    ...
}

// FRENCH.json
{
    "HelloWorld": "Bonjour le monde!"
    ...
}
```

## Configuration

