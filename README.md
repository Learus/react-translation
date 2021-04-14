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

```jsx
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

    // Provided that there is a lemma called "Hello World" the dict call will return the translated string in the currently selected language.
    return (
        <p>
            {dict("Hello World")} 
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

### 4. The `Language` type

### 5. The `<Dictionary>` component

## Translation data structure
