function ListCtrl($scope, $indexedDB, $location,$route) {
    var subjectStore = $indexedDB.objectStore('subjects');
    var setStore = $indexedDB.objectStore('testSets');
    subjectStore.getAll().then(function(results) {
        $scope.subjects = results;
    });
    var testStore = $indexedDB.objectStore('tests');
    testStore.getAll().then(function(results) {
        $scope.tests = results;
    });

    $scope.take = function(id) {
        console.log('/test/'+id);
        $location.path('/test/' + id);
        
    };
    
    $scope.setSubject = function(subject, $event) {
        var active = $event.target.classList.contains('active');
        var all = $event.target.parentNode.children;
        var len = all.length;
        for (var i = 0; i < len; ++i) {
            all[i].classList.remove('active');
        }
        if (active) {
            $event.target.classList.remove('active');
            delete $scope.currentSubject;
        }
        else {
            $event.target.classList.add('active');
            setStore.find("subject_idx", subject).then(function(result) {
                $scope.subjectFilter = {
                    set: result.id
                };
            });
        }
    };
    $scope.sets = {};
    setStore.getAll().then(function(sets) {
        sets.forEach(function(set) {
            subjectStore.find(set.subject).then(function(subject) {
                $scope.sets[set.id] = subject.name;
            });
        });
    });
    $scope.subjectFromSet = function(setID) {
        return $scope.sets[setID] || "";
    };
}