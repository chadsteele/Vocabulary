/* 
    Vocabulary

    Ever document or collection of documents has a "vocabulary" that defines that doc/collection.  
    For example, a snowboarding website would likely use a different set of words than
    a website about brain surgery.

    A user's vocabulary could be the aggregation of all the words they're interested in
    by maintaining a hash table of words and their frequency.  

    Vocabulary(words) - initialize this instance and consume and count initial words
    Vocabulary.add(words) -  consume and count more words - useful for consuming a stream of words
    Vocabulary.rank(word) -  the rank of that word in this vocabulary
    Vocabulary.relevance(another) -  the relevance of "another" vocabulary to this one

    Relevance is a complicated concept, but the easiest way for me to explain it is to imagine a 
    3 yo child with a very short child's vocabulary and a highly educated adult.  Most of what the adult 
    says will not seem relevant to the child, but most of what the child says will be "relevant" and
    understood by the adult.  If this class were used in a program, you could maintain a running vocabulary
    for every user that would remember pages they visit, scroll down, engage with, etc. and then use
    their vocabulary to determine what new content they're most likely to "buy".

    I'm certain there are far better algorithms, but this was a fun exercise and I'm proud to have
    a working class with very very little code.  KISS!

    Chad Steele
    970 471 6822
    exit
    
    www.ChadSteele.com


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