# react-translation

A simple translation system for the react ecosystem.

## Installation

```sh
git clone https://github.com/learus/react-translation.git
cd react-translation

# Edit config.json if you need to
python3 install.py
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

The `languages` field in the `config.json` for this example looks like this:

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

### 2. The lemma insertion script `lemma.py`

Using this script, you can create new Lemmas for the languages you have chosen (specified in the `config.json`). Run `python3 lemma.py` provide your Lemma and a translation for each of your chosen languages as prompted.

### 3. The `Lemma` type

Any string-key the dictionary has is a lemma. The `Lemma` type is simply all those strings separated with OR (|), a.k.a.

```ts
export type Lemma = "lemma1" | "lemma2" | "lemma3"
```

This forces the user to provide the dictionary function with only valid lemmas, hence decreasing the amount of mistakes. It is created on installation and modified automatically on any lemma isnertion using the insertion script `lemma.py`.

### 4. The `Language` type

The `Language` type again is an OR separated string type that keeps all available languages, as specified in the config file. It is created on installation.

### 5. The `<Dictionary>` component

Similarly to the `useDictionary` hook, this uses context to figure out the currently selected language, and returns the translated text given a lemma.

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

Each language's data-dictionary is saved in a JSON file in the folder spcified by the `dictionaryDirectory` in the `config.json` file. They are created on installation, and are updated automatically when using the lemma insertion script. The files' format is simple. Here's an example:

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
