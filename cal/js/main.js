﻿var dcandre = {};

$(function(){
    
    //For the purpose of this demo I will override Backbone.sync to simulate connecting to a web server
    Backbone.sync = function(method, model, options) 
    {
        var url = model.url();
        
        if(method == "read")
        {
            if(_.isArray(url.match(/\/test\/\d+\/question\/index\/\d+\//i)))
            {               
                //This is a Question Model
                model.parse({ id: 1, text: "This is question 1", testID: 1, index: 0, answers: [{ id: 1, text: "This is answer 1", testID: 1, questionID: 1 }, { id: 2, text: "This is answer 2", testID: 1, questionID: 1 }, { id: 3, text: "This is answer 3", testID: 1, questionID: 1 }, { id: 4, text: "This is answer 4", testID: 1, questionID: 1 }] });
            }
            else if(_.isArray(url.match(/\/test\/\d+\/results\/\d+\//i)))
            {
                //This would be done on the server
                var numberOfCorrectAnswers = (dcandre.Main.UserAnswer.isCorrect) ? 1 : 0;

                //This is a TestResult Model
                model.parse({id: 1, testID: 1, userID: 1, numberOfCorrectAnswers: 0, numberofQuestions: 1});
            }
            else if(_.isArray(url.match(/\/test\/\d+\//i)))
            {              
                //This is a Test Model
                model.parse({id: 1, title: "Derek's Test", description: "Thank you for taking my test.  Please click the 'Start' button.", numberOfQuestions: 1});
            }            
        }
        else if(method == "update")
        {        
            if(_.isArray(url.match(/\/user\/\d+\/answer\//i)))
            {                
                //This would be done on the server
                var correctAnswerIDs = [1,3];
                var isAnswerCorrect = (_.difference(correctAnswerIDs, model.get("answerIDs")).length == 0) ? true : false;

                //This is a UserAnswer Model
                model.parse({id: 1, userID: 1, answerIDs: correctAnswerIDs, isCorrect: isAnswerCorrect});
            }
        } 
        
        options.success(model);
    };
    
    //Models Namespace
    dcandre.Models = {};

    //User Model
    dcandre.Models.User = Backbone.Model.extend({
        defaults:
        {
            "id": 0,
            "name": "",
            "isAuthenticated": false
        }
    });

    //Router Model
    dcandre.Models.Router = Backbone.Router.extend({
        routes: {
            "test/:id/": "getTestByID",
            "test/:id/question/index/:index/": "getQuestionByIndex",
            "test/:id/results/": "getTestResultsByTestID",
            "*actions": "default"
        }
    });

    //Abstract Answer Model
    dcandre.Models.Answer = Backbone.Model.extend({
        defaults: {
            "id": 0,
            "questionID": 0,
            "testID": 0,
            "text": ""
        }
    });

    dcandre.Models.MultipleChoiceAnswer = dcandre.Models.Answer.extend({
        url: function()
        {
            return "funk";
        },
        defaults: {
            "id": 0,
            "questionID": 0,
            "testID": 0,
            "text": ""
        },
        parse: function (response, options) 
        {
            _.each(response, function(value, key, list)
            {
                this.set(key, value);
            }, this);

            return this;
        }
    });

    //Answer Collection Model
    dcandre.Models.Answers = Backbone.Collection.extend({
        model: dcandre.Models.Answer
    });

    //Abstract UserAnswer Model
    dcandre.Models.UserAnswer = Backbone.Model.extend({
        defaults: {
            "id": 0,
            "userID": 0,
            "answerIDs": new Array(),
            "isCorrect": false
        },
    });

    //Multiple choice user answer
    dcandre.Models.MultipleChoiceUserAnswer = dcandre.Models.UserAnswer.extend({
        url: function()
        {
            return "/user/" + this.get("userID") + "/answer/";
        },
        defaults: {
            "id": 0,
            "userID": 0,
            "answerIDs": new Array(),
            "isCorrect": false
        },
        parse: function(response, options)
        {
            _.each(response, function(value, key, list)
            {
                if(key == "answerIDs")
                {
                    _.each(value, function(element, index, list)
                    {
                        this.get("answerIDs").push(element);                        
                    }, this);
                }
                else
                {
                    this.set(key, value);
                }
            }, this);
            
            return this;
        }
    });
    
    //Abstract Question Model
    dcandre.Models.Question = Backbone.Model.extend({
        defaults: {
            "id": 0,
            "index": -1,
            "testID": 0,
            "text": "",
            "answers": new dcandre.Models.Answers
        }
    });

    //Multiple Choice Question Model
    dcandre.Models.MultipleChoiceQuestion = dcandre.Models.Question.extend({
        url: function()
        {
             return "/test/" + this.get("testID") + "/question/index/" + this.get("index") + "/";
        },
        defaults: {
            "id": 0,
            "index": -1,
            "testID": 0,
            "text": "",
            "answers": new dcandre.Models.Answers()
        },
        parse: function(response, options)
        {
            _.each(response, function(value, key, list)
            {               
                if(key == "answers")
                {
                    _.each(value, function(element, index, list)
                    {
                        var answer = new dcandre.Models.MultipleChoiceAnswer();
                        answer.parse(element);
                        this.get("answers").push(answer); 
                       
                    }, this);
                }
                else
                {
                    this.set(key, value);
                }
            }, this);
                              
            return this;
        }
    });

    //Abstract Test Model
    dcandre.Models.Test = Backbone.Model.extend({        
        defaults: {
            "id": 0,
            "title": null,
            "description": null,
            "numberOfQuestions": 0
        }
    });

    dcandre.Models.MultipleChoiceTest = dcandre.Models.Test.extend({
        url: function()
        {
            return "/test/" + this.get("id") + "/";
        },        
        defaults: {
            "id": 0,
            "title": null,
            "description": null,
            "numberOfQuestions": 0
        },
        parse: function(response, options)
        {
            _.each(response, function(value, key, list)
            {
                this.set(key, value);
            }, this);
            
            return this;
        }
    });

    dcandre.Models.TestResult = Backbone.Model.extend({
        url: function()
        {
            return "/test/" + this.get("testID") + "/results/";
        },        
        defaults: {
            "id": 0,
            "testID": 0,
            "userID": 0,
            "numberOfCorrectAnswers": 0,
            "numberOfQuestions": 0
        },
        parse: function(response, options)
        {
            _.each(response, function(value, key, list)
            {
                this.set(key, value);
            }, this);
            
            return this;
        }
    });


    //View Namespace
    dcandre.Views = {};

    //Multiple Choice Test View
    dcandre.Views.MultipleChoiceTestView = Backbone.View.extend({
        initialize: function()
        {
            this.$el = $(this.el);

            this.model.on("sync", function()
            {
                this.render();
            }, this);
        },
        render: function()
        {
            var template = _.template( $("#MultipleChoiceTestViewTemplate").html(), {test_title: this.model.get("title"), test_description: this.model.get("description")});
            this.$el.html(template);
                        
            this.$el.removeClass().addClass("hide multipleChoiceTest").addClass("show", 500, function(){$(this).removeClass("hide")});
            
            $("#testArea input[type=submit]").button();
           
            this.delegateEvents({
                "click input[value=Start]": "onStartButtonClick"    
            });
        }, 
        onStartButtonClick: function(event)
        {
            self.trigger("start:test:request", {model: this.model});           
        }
    });

    //Multiple Choice Question View
    dcandre.Views.MultipleChoiceQuestionView = Backbone.View.extend({
        initialize: function()
        {
            this.$el = $(this.el);

            this.model.on("sync", function()
            {
                this.render();
            }, this);
        },
        render: function()
        {
            var variables = {question_text: this.model.get("text"), answers: "<ul>"};
            
            this.model.get("answers").forEach(function(answer, index, list)
            {
                var answerID = answer.get("id");
                var answerElementID = "answer" + answerID; 
                this.answers += "<li><input type='checkbox' id='"+answerElementID+"' data-answer-id='"+answerID+"'><label for='"+answerElementID+"'>" + (index + 1) + "</label>"+answer.get("text")+"</li>";

            }, variables);

            variables.answers += "</ul>";

            var template = _.template( $("#MultipleChoiceQuestionViewTemplate").html(), variables);
            this.$el.html(template);

            this.$el.removeClass().addClass("hide multipleChoiceQuestion").addClass("show", 500, function(){$(this).removeClass("hide")});

            $("#testArea input[type=checkbox]").button();            
            $("#testArea ul").buttonset();
            $("#testArea input[type=submit]").button();
            
            this.delegateEvents({
                "click input[type=submit]": "onSubmitButtonClick"
            });            
        },
        onSubmitButtonClick: function(event)
        {
            var checkedAnswers = $("input:checked");
            
            if(checkedAnswers.length > 0)
            {
                var selectedAnswerIDs = new Array();

                checkedAnswers.each(function(index, element) 
                {
                    var answerID = $(element).attr("data-answer-id");
                    selectedAnswerIDs.push(answerID);
                });

                self.trigger("answer:submitted:from:question", {model: this.model, selectedAnswerIDs: selectedAnswerIDs});
            }
            else
            {
                //The user needs to select an answer
            }
        }
    });



    //Main Namespace
    dcandre.Main = {};
    
    
    //Main Element ID
    dcandre.Main.DisplayAreaID = "testArea";

    //User, or the person who is taking the test
    dcandre.Main.User = new dcandre.Models.User({id: 1, name: "Derek Andre", isAuthenticated: true});
    
    //Main Router
    dcandre.Main.Router = new dcandre.Models.Router();
    
    //Main Test
    dcandre.Main.Test = new dcandre.Models.MultipleChoiceTest();
    
    //Main Question
    dcandre.Main.Question = new dcandre.Models.MultipleChoiceQuestion();
    
    //Main Answer from User
    dcandre.Main.UserAnswer = new dcandre.Models.MultipleChoiceUserAnswer();
    
    //Main Test Results
    dcandre.Main.TestResults = new dcandre.Models.TestResult();

    //Main Test View
    dcandre.Main.TestView = new dcandre.Views.MultipleChoiceTestView({model: dcandre.Main.Test, el: document.getElementById(dcandre.Main.DisplayAreaID)});

    //Main Question View
    dcandre.Main.QuestionView = new dcandre.Views.MultipleChoiceQuestionView({model: dcandre.Main.Question, el: document.getElementById(dcandre.Main.DisplayAreaID)});

    
    //Listen for a test that 

    //Get Test By ID route
    dcandre.Main.Router.on("route:getTestByID", function(id)
    {  
        if(null != id && id > 0)
        {
            dcandre.Main.Test.set("id", id);
            dcandre.Main.Test.fetch();
        }
    });

    //Get Question By Index
    dcandre.Main.Router.on("route:getQuestionByIndex", function(testID, index)
    {               
        if(index < dcandre.Main.Test.get("numberOfQuestions"))
        {
            if(null != testID && testID > 0 && null != index && index >= 0)
            {   
                dcandre.Main.Question.set("testID", testID);
                dcandre.Main.Question.set("index", index);
                dcandre.Main.Question.fetch();            
            }
        }
        else if(dcandre.Main.Test.get("id") <= 0)
        {
            this.navigate("test/"+testID+"/", {trigger: true});
        }                     
        else
        {
            this.navigate("test/"+testID+"/results/", {trigger: true});
        }
    });

    dcandre.Main.Router.on("route:getTestResultsByTestID", function(testID)
    {
        if(dcandre.Main.Test.get("id") >= 0)
        {
            if(null != testID && testID > 0)
            { 
                dcandre.Main.TestResults.set("testID", testID);
                dcandre.Main.TestResults.fetch();
            }
        }
        else
        {
            this.navigate("test/"+testID+"/", {trigger: true});
        }
    });

    //The default route event which will catch everyting else
    dcandre.Main.Router.on("route:default", function(actions)
    {
        this.navigate("test/1/", {trigger: true});
    });

    Backbone.history.start();
});