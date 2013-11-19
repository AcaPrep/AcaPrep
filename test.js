(function(w, d) {
    w.TestCtrl = function($scope, $location, $routeParams, $indexedDB, $sce) {
        var testStore = $indexedDB.objectStore('tests');
        testStore.find($routeParams.test).then(function(test) {
            $scope.test = test;
        });
        var questionStore = $indexedDB.objectStore('questions');
w.$scope = $scope;
        $scope.problems = [];
        $scope.answers = [];
        questionStore.each({
            useIndex: "test_idx",
            keyRange: w.IDBKeyRange.only($routeParams.test),
            direction: "next"
        }, function(cursor) {
            if (cursor) {
                $scope.problems.push(cursor.value);
                cursor.continue();
            }
            else {
                $scope.question(0);
            }
        });
        var html = function(object, props) {
            props.forEach(function(prop) {
                object[prop] = $sce.trustAsHtml(object[prop]);
            });
        };
        $scope.calcScore = function() {
            var correct=0,num=0;
            $scope.problems.map(function(p) {
               correct+=!!p.correct;
               num+=p.hasOwnProperty('correct');
            });
            $scope.correct=correct;
            $scope.completed=num;
        };
        $scope.close = function() {
            $location.path('/');
        };
        $scope.statusClass = function(index,correct,answered) {
            if(index!=answered) return "";
            return correct ? "green" : "red";
        };
        $scope.answered = function(num,answer,correct) {
            $scope.problems[num-1].correct=correct;
            $scope.problems[num-1].answered=answer;
            $scope.grading = true;
            $scope.calcScore();
        };
        $scope.next = function() {
            $scope.grading=false;
            $scope.question($scope.currentProblem.number);
        };
        var randomSort = function() {
            return 0.5 - Math.random();
        };
        var grade = function() {
            $scope.scoreing = true;
            w.$('.ui.bar').width('100%');
        };
        $scope.question = function(n) {
            console.log(n);
            if (n==$scope.problems.length) return grade();
            w.$('.ui.bar').width(((n+1)/$scope.problems.length)*100+'%');
            
            html($scope.problems[n], ['question','guide']);
            for(var i=0;i<5;++i) {
                $scope.problems[n].answers[i].text=$sce.trustAsHtml($scope.problems[n].answers[i].text);
            }
            $scope.problems[n].answers.sort(randomSort);
            $scope.currentProblem = $scope.problems[n];
        };
    };
})(window, document);