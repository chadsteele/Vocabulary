/* 
    Vocabulary

    See Readme.md  at https://github.com/chadsteele/Vocabulary
    
MIT License

Copyright (c) 2019 ChadSteele.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


*/

class Vocabulary {
    constructor(text) {
        this.count = {};      //dictionary of the frequency of each word 
        this.max = 0;         //maximum word frequency
        this.maxLength = 0;   //maximum length of word
        this.add(text);
    }

    //add words to my vocabulary
    add(text) {
        if (!text) return this;
        if (text instanceof Vocabulary) return this.addVocabulary(text);

        //create a hash table of words and their frequency
        text.toString().match(/\w+/g).forEach(word => {
            this.addString(word.toLowerCase());
        });
        return this;
    }

    //add one word or phrase without parsing and update max and maxLength
    addString(word, count) {   // count defaults to 1, unless you want to "seed" a word with a high count
        if (!word) return this;
        if (typeof word !== 'string') return this;

        this.count[word] = (this.count[word] || 0) + (count || 1);
        this.max = this.max < this.count[word] ? this.count[word] : this.max;
        this.maxLength = this.maxLength < word.length ? word.length : this.maxLength;

        return this;
    }

    //combine two vocabularies and adjust max and maxLength
    addVocabulary(that) {
        if (!that) return this;
        if (!that instanceof Vocabulary) return this.add(that.toString());

        Object.keys(that.count).forEach(word => {
            word = word.toLowerCase();
            this.addString(word, that.count[word]);
        });
        return this;
    }


    //calculate the rank of a word being used in the vocabulary
    //e.g. a top ranked word's count will equal the max count, longer words are considered more interesting
    rank(word) {
        if (!word) return 0;
        if (!word.length) return 0;
        if (!this.max) return 0;
        if (!this.maxLength) return 0;
        if (!this.count[word]) return 0;

        word = word.toString().toLowerCase();

        //normalize word length weighting
        let weight = word.length / this.maxLength;

        return weight * (this.count[word] / this.max);
    }

    //given a list of words, sort them in order of rank 
    order(words) {
        if (!words) return [];
        //ensure we have a list of individual words, not phrases, no punctuation, etc.
        let list = words.toString().match(/\w+/g);
        if (list.length == 0) return [];

        return list.sort((a, b) => {
            return this.rank(a) <= this.rank(b) ? 1 : -1;
        });
    }

    //calculate how relevant "that" vocabulary is to me
    relevance(that) {
        let total = 0;
        let words = Object.keys(this.count);
        words.forEach(w => {
            total += this.rank(w) * that.rank(w);
        });

        //return the average rank of my words in the other vocabulary
        return total / words.length;
    }
}

module.exports = Vocabulary;