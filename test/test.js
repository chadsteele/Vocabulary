/* 
        The following mocha unit tests are intended to validate the code with 100% code coverage
        and demonstrate the "relevance" of one vocabulary to another

        You'll need to install nmp, node, and mocha to run these tests in a terminal
        https://www.npmjs.com/package/mocha
*/

var assert = require('assert');
const Vocabulary = require('../Vocabulary.js');

describe('Vocabulary', function () {
    describe('#constructor()', function () {
        let v = new Vocabulary();
        it('count should be empty', function () {
            assert.equal(0, Object.keys(v.count).length);
        });
        it('max should be zero', function () {
            assert.equal(0, v.max, v.max);
        });
    });

    describe('#constructor("")', function () {
        let v = new Vocabulary("");
        it('count should be empty', function () {
            assert.equal(0, Object.keys(v.count).length);
        });
        it('max should be zero', function () {
            assert.equal(0, v.max, v.max);
        });
    });

    describe('#constructor("dog")', function () {
        let pets = new Vocabulary("dog");
        it('count should have one word', function () {
            assert.equal(1, Object.keys(pets.count).length);
        });
        it('max should be 1', function () {
            assert.equal(1, pets.max);
        });
        it('rank of dog should be 1', function () {
            assert.equal(1, pets.rank("dog"));
        });
        it('rank of cat should be 0', function () {
            assert.equal(0, pets.rank("cat"));
        });

    });

    describe('#constructor("dog cat")', function () {
        let pets = new Vocabulary("dog cat");
        it('count should have 2 words', function () {
            assert.equal(2, Object.keys(pets.count).length);
        });
        it('max should be 1', function () {
            assert.equal(1, pets.max);
        });

        it('rank of dog should be 1', function () {
            assert.equal(1, pets.rank("dog"));
        });
        it('rank of cat should be 1', function () {
            assert.equal(1, pets.rank("cat"));
        });
        it('rank of fish should be 0', function () {
            assert.equal(0, pets.rank("fish"));
        });
    });

    describe('#constructor("dog").add("cat")', function () {
        let pets = new Vocabulary().add("dog cat");
        it('count should have 2 words', function () {
            assert.equal(2, Object.keys(pets.count).length);
        });
        it('max should be 1', function () {
            assert.equal(1, pets.max);
        });

        it('rank of dog should be 1', function () {
            assert.equal(1, pets.rank("dog"));
        });
        it('rank of cat should be 1', function () {
            assert.equal(1, pets.rank("cat"));
        });
        it('rank of fish should be 0', function () {
            assert.equal(0, pets.rank("fish"));
        });
    });

    describe('#order()', function () {
        // It takes 7 small x's to out rank 2 dogs
        let pets = new Vocabulary().add("x dog x cat x fish x dog x elephant x eel x");

        it('expect an empty array', function () {
            assert.equal(0, pets.order("").length);
        });
        it('expect x, dog, fish, then cat', function () {
            assert.equal("x,dog,fish,cat", pets.order("cat x dog fish").toString());
        });
        it('expect elephant, x, dog, fish, then cat', function () {
            assert.equal("elephant,x,dog,fish,cat", pets.order("cat x dog fish elephant").toString());
        });
        it('expect no change in order', function () {
            assert.equal("dog,fish,cat,bird", pets.order("dog fish cat bird").toString());
        });
    });

    describe('#relevance()', function () {
        let pets = new Vocabulary().add("dog cat"),
            dog = new Vocabulary("dog"),
            cat = new Vocabulary("cat"),
            fish = new Vocabulary("fish");

        it('expect 100% relevance when compared with self', function () {
            assert.equal(1, pets.relevance(pets));
        });
        it('expect 0% relevance when no words match', function () {
            assert.equal(0, pets.relevance(fish));
        });
        it('expect 100% relevance when 1 word is found in larger vocabulary', function () {
            assert.equal(1, cat.relevance(pets));
            // 100% cat is found in pets
        });
        it('expect 50% relevance when 1 of 2 words match with a smaller vocabulary', function () {
            assert.equal(.50, pets.relevance(cat));
            // cat is 50% of pets
        });

        const more = new Vocabulary('dog dog cat fish');

        it('expect 16% relevance when 2 dogs + cat + fish vs fish', function () {
            assert.equal(1 / 2 * 1 / 3, more.relevance(fish));
        });
        it('expect 25% relevance when 2 of 4 words match with a smaller vocabulary', function () {
            assert.equal(.25, more.relevance(dog));
        });

        const birds = new Vocabulary('hawk eagle owl F15'),
            f15 = new Vocabulary('f15'),
            eagle = new Vocabulary('eagle'),
            owl = new Vocabulary('owl');

        it('expect 60% relevance birds of prey', function () {
            assert.equal(.6, f15.relevance(birds));
        });
        it('expect 15% relevance birds of prey', function () {
            assert.equal(.15, birds.relevance(f15));
        });

        it('expect a long word to be more relevant than a short word', function () {
            assert.equal(true, eagle.relevance(birds) > owl.relevance(birds));
        });

        it('expect different but equal words to have equal relevance', function () {
            assert.equal(birds.relevance(owl), birds.relevance(f15));
        });


        const lorem = new Vocabulary("What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."),
            ipsum = new Vocabulary("Why do we use it? It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more - or - less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.Various versions have evolved over the years, sometimes by accident, sometimes on purpose(injected humour and the like).");

        it('expect lorem to have 67 unique words', function () {
            assert.equal(67, Object.keys(lorem.count).length);
        });

        it('expect lorem ipsum to be different', function () {
            assert.notEqual(lorem.relevance(ipsum), ipsum.relevance(lorem));
        });

        it('expect 1 dog to be equal to a pack of dogs', function () {
            let txt = "dog ";
            for (let i = 0; i < 10; i++) {
                txt += txt;
            }
            const dogs = new Vocabulary(txt);
            assert.equal(dogs.relevance(dog), dog.relevance(dogs));
        });

    });

    describe('#addVocabulary(that)', function () {

        it('expect 1 dog and 1 cat', function () {
            let pets = new Vocabulary().add("dog cat"),
                dogs = new Vocabulary("dog dog"),
                cat = new Vocabulary("cat");

            assert.equal(1, pets.count['dog']);
            assert.equal(1, pets.count['cat']);
        });

        it('expect 3 dogs and 2 cats', function () {
            let pets = new Vocabulary().add("dog cat"),
                dogs = new Vocabulary("dog dog"),
                cat = new Vocabulary("cat");

            assert.equal(3, pets.addVocabulary(dogs).count['dog']);
            assert.equal(2, pets.addVocabulary(cat).count['cat']);
        });


    });

});