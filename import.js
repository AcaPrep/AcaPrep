(function(w, d) {
    var IDB;
    var addSubjects = function(doc) {
        var subjectStore = IDB.objectStore('subjects');
        var subjects = doc.getElementsByTagName('Subjects');
        var len = subjects.length;
        var _ = [];
        for (var i = 0; i < len; ++i) {
            var _subject = subjects[i];
            var _id = _subject.getElementsByTagName('SubjectID')[0].textContent;
            var _abbr = _subject.getElementsByTagName('Subject')[0].textContent;
            var _name = _subject.getElementsByTagName('SubjectLong')[0].textContent;

            _.push({
                id: _id,
                abbr: _abbr,
                name: _name
            });
        }
        subjectStore.upsert(_).then(function() {});
    };

    var addTests = function(doc) {
        var testStore = IDB.objectStore('tests');
        var tests = doc.getElementsByTagName('Tests');
        var len = tests.length;
        var _ = [];
        for (var i = 0; i < len; ++i) {
            try {
                var _test = tests[i];
                var _id = _test.getElementsByTagName('TestID')[0].textContent;
                var _set = _test.getElementsByTagName('TestSetID')[0].textContent;
                var _name = _test.getElementsByTagName('TestName')[0].textContent;
                var _subtitle = _test.getElementsByTagName('Subtitle')[0].textContent;

                _.push({
                    id: _id,
                    set: _set,
                    name: _name,
                    subtitle: _subtitle

                });
            }
            catch (e) {
                w.e = e;
                w.test = _test;
            }
        }
        testStore.upsert(_).then(function() {
        });
    };

    var addSets = function(doc,$scope) {
        var setStore = IDB.objectStore('testSets');
        var sets = doc.getElementsByTagName('TestSets');
        var len = sets.length;
        var _ = [];
        for (var i = 0; i < len; ++i) {
            try {
                var _set = sets[i];
                var _id = _set.getElementsByTagName('TestSetID')[0].textContent;
                var _name = _set.getElementsByTagName('SetName')[0].textContent;
                var _year = _set.getElementsByTagName('Year')[0].textContent;
                var _subject = _set.getElementsByTagName('SubjectID')[0].textContent;
                var _type = _set.getElementsByTagName('ResourceTypeID')[0].textContent;
                var _typeName = _set.getElementsByTagName('ResourceType')[0].textContent;
                _.push({
                    id: _id,
                    name: _name,
                    year: _year,
                    subject: _subject,
                    type: _type,
                    typeName: _typeName
                });
            }
            catch (e) {
                w.e = e;
                w.set = _set;
            }
        }
        setStore.upsert(_).then(function() {
            $scope.$apply();
        });
    };

    var addQuestions = function(doc) {
        var questionStore = IDB.objectStore('questions');
        var questions = doc.getElementsByTagName('Questions');
        var len = questions.length;
        var _ = [];
        /*
<Questions>
<QuestionID>458966</QuestionID>
<Question>
All of the following artists have selected works in this year<chr8217>s curriculum EXCEPT
</Question>
<Answer1>Edward Hopper</Answer1>
<Answer2>Henri Matisse</Answer2>
<Answer3>Georgia O<chr8217>Keeffe</Answer3>
<Answer4>Ernst Ludwig Kirchner</Answer4>
<Answer5>Marcel Duchamp</Answer5>
<AnswerGuide>
Some selected artists are Henri Matisse, Walter Gropius, Ernst Ludwig Kirchner, Marcel Duchamp, Pablo Picasso, Wassily Kandinsky, James Montgomery Flagg, Alfred Stieglitz, Arthur Dove, and Georgia O<chr8217>Keeffe.
</AnswerGuide>
<TypeID>1</TypeID>
<Source>5,1,2</Source>
<Footnote/>
<CardTypeID>0</CardTypeID>
<Year>2013</Year>
<SubjectID>41</SubjectID>
<QuesNumber>2</QuesNumber>
<AuxNum>2</AuxNum>
<RandList>25341</RandList>
<ResourceTypeID>278</ResourceTypeID>
<TreeKey>01/01/</TreeKey>
<TestID>39560</TestID>
<DiffShort>N</DiffShort>
<CardType/>
</Questions>
        */
        var unesc = function(string) {
            var ret = string.split(/(<chr\d+>)/);
            var parseRe = /<chr(\d+)/;
            var len = ret.length;
            for (var i = 0; i < len; ++i) {
                var match;
                if ((match = parseRe.exec(ret[i]))) {
                    ret[i] = String.fromCharCode(match[1]);
                }
            }
            return ret.join('');
        };

        for (var i = 0; i < len; ++i) {
            try {
                var question = questions[i];
                var _id = question.getElementsByTagName('QuestionID')[0].textContent;
                var _question = question.getElementsByTagName('Question')[0].textContent;
                var _a = question.getElementsByTagName('Answer1')[0].textContent;
                var _b = question.getElementsByTagName('Answer2')[0].textContent;
                var _c = question.getElementsByTagName('Answer3')[0].textContent;
                var _d = question.getElementsByTagName('Answer4')[0].textContent;
                var _e = question.getElementsByTagName('Answer5')[0].textContent;
                var _test = question.getElementsByTagName('TestID')[0].textContent;
                var _number = Number(question.getElementsByTagName('QuesNumber')[0].textContent);
                var _guide = question.getElementsByTagName('AnswerGuide')[0].textContent;

                _.push({
                    id: _id,
                    question: unesc(_question),
                    answers: [{
                        correct: true,
                        text: unesc(_a)
                    }, {
                        correct: false,
                        text: unesc(_b)
                    }, {
                        correct: false,
                        text: unesc(_c)
                    }, {
                        correct: false,
                        text: unesc(_d)
                    }, {
                        correct: false,
                        text: unesc(_e)
                    }],
                    test: _test,
                    number: _number,
                    guide: _guide

                });
                w.question = question;
            }
            catch (e) {
                w.e = e;
                w.question = question;
            }
        }
        questionStore.upsert(_).then(function() {});
    };

    var parseAndAdd = function($scope) {
        var files = document.getElementById('f').files;
        var fr = new FileReader();
        fr.onload = function() {
            var dp = new DOMParser();
            var doc = dp.parseFromString(fr.result, 'application/xml');
            addSubjects(doc);
            addTests(doc);
            addSets(doc,$scope);
            addQuestions(doc);
        };
        fr.readAsText(files[0]);
    };

    w.ImportCtrl = function($scope, $indexedDB) {
        w.IDB = IDB = $indexedDB;
        $scope.parseAndAdd = parseAndAdd;
    };
})(window, document);