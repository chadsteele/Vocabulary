# Vocabulary
Everybody and everything has a vocabulary.  Users, actions, websites, ads, memes, etc.  This tool can help you track and assess relevance between vocabularies and ensure your content will be interesting for your users.

Most humans and therefore most documents and websites have limited vocabularies, usually around 20,000 words and no more than 35,000 words and rarely more than 50,000 words.  Vocabularies are typically much smaller than the documents they represent.  A Vocabulary() is simply a hash table of all the words you've given it and how many times it's seen the same word.  In this way, every word is ranked by the frequency and size of the word.  Like any json object, you can store a vocabulary anyway you like.  Given their small size, I cache them locally in window.localStorage and can store them permanently in a NoSql db if desired.  You really only need to store a user's vocabulary as they click around your site, return, etc.  A page's vocabulary should be created dynamically by the client and independently of the CMS, etc.

Vocabulary() can run on the server (Node) or the client (Javascript).  It does not depend on jQuery or any other libraries, but is compatible of course.

# Usage
It's just a tiny amount of javascript, so you can include it in the browser.  
```html
<html>
<head>...</head>
<body>
...
<script src="Vocabulary.js"></script>
</body>
</html>
```
or on the server
```javascript
const Vocabulary = require('Vocabulary.js');
```
# npm - node package manager
https://www.npmjs.com/package/vocabulary-js
```bash
npm install vocabulary-js
```

# User Stories
As a user, I want to be "heard" and "known" as I click around your site(s), so that when your sight suggests other products, stories or opportunities they will be relevant to me and my demonstrated interests.
```javascript
let userVocabulary = new Vocabulary();
userVocabulary.add("all the words on the page");
button.click(() => userVocabulary.add("some words associated with this button"));
```

As a programmer, I want to maintain a user's vocabulary and then present the user with relevant options in the dynamic components on the site.
```javascript
let preferences = usersVocabulary.order("shoes hats underwear");
switch(preferences[0]) {
  case "shoes":
    displayShoes();
    break;
  case "hats":
    displayHats();
    break;
  case "underwear":
    displayUnderwear();
    break;
}
```

# Class Definition
```javascript
class Vocabulary {
    constructor(text){} // add initial words to my vocabulary
    add(text){} // add more words to my vocabulary, parse, etc.
    addString(word, count){} // add one word or phrase without parsing
    // count defaults to 1, unless you want to "seed" a word with a high count
    addVocabulary(that){} // combine two vocabularies
    rank(word){} // calculate the rank of a word being used in the vocabulary
    order(words){} // given a list of words, sort them in order of rank 
    relevance(that){} // calculate how relevant "that" vocabulary is to me
}
```

# Tests
Run `node tests`

You'll need to install npm, node, and mocha to run these tests in a terminal
https://www.npmjs.com/package/mocha

# Contributing
Pull requests welcome! Please add unit tests to tests.js for any new functions.

## To do's
* I'd love some help creating demos on actual websites.  If you've used this tool on your site and want me to list it here, please reach out.
* Create a wordpress plugin
* Create a chrome plugin so that savvy users can share their global vocabulary with sites that can leverage it
* what else?

# Dependencies
None.  Let's keep it that way please.

# ISC License

Copyright (c) 2019 ChadSteele.com

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

# Author
Hire me!  [ChadSteele.com](http://chadsteele.com "Say Hi!")