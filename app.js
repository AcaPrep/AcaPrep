angular.module('DemiQuiz', ['ngRoute', 'xc.indexedDB'])
  .config(function($routeProvider,$indexedDBProvider) {
    $routeProvider
      .when('/', {controller:ListCtrl, templateUrl:'list.html'})
//      .when('/import', {controller:AddCtrl, templateUrl:'import.html'})
      .when('/test/:test', {controller:TestCtrl, templateUrl:'test.html'})
      .otherwise({redirectTo:'/'});
    $indexedDBProvider
      .connection('DemiQuiz')
        .upgradeDatabase(0, function(event, db, tx){
            var subjectStore = db.createObjectStore('subjects', {keyPath: 'id'});
            var testStore = db.createObjectStore('tests',{keyPath:'id'});
            testStore.createIndex('set_idx', 'set', {unique: false});
            var testQuestionsStore = db.createObjectStore('testQuestions', {keyPath: 'id'});
            var testSetStore = db.createObjectStore('testSets', {keyPath: 'id'});
            testSetStore.createIndex('subject_idx', 'subject', {unique: false});
            var outlineStore = db.createObjectStore('outlines', {keyPath: 'id'});
            var questionStore = db.createObjectStore('questions', {keyPath: 'id'});
            questionStore.createIndex('test_idx', 'test', {unique: false});
            var cardTypeStore = db.createObjectStore('cardTypes', {keyPath: 'id'});
            var resourceTypeStore = db.createObjectStore('resourceTypes', {keyPath: 'id'});

      });
  });