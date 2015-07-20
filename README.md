# La boîte à quiz

Un script pour générer des [quiz](http://www.liberation.fr/cahier-ete-2015/2015/07/18/quiz-les-politiques-ont-ils-des-vacances-normales_1349263) à partir de feuilles de calcul.  
Testé sous `Python 2.7` et `Python 3.4`.

## Dépendances

* [Requests](https://github.com/kennethreitz/requests)
* [Pystache](https://github.com/defunkt/pystache)

## Usage

```bash
$> python generate-quiz.py
usage: generate-quiz.py [-h] [--dest DEST] [--src SRC] key
```

* *key* : clé de la feuille dans Google Spreadsheet
* *src* : dossier contenant les templates
* *dest* : dossier de destination

## To do

* Rendre dynamiques différents textes :
  * Dernier écran (selon le score)
  * Tweet
* Améliorer le bouton Twitter
* Minifier et copier automatiquement les `.js` et `.css` vers le dossier de destination
* Gérer d'autres formats d'entrée (`.tsv` / `.csv` local)

## Licence

> The MIT License (MIT)
>
> Copyright (c) 2015
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
