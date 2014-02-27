var dcandre = {};

$(function(){
    
    //For the purpose of this demo I will override Backbone.sync to simulate connecting to a web server
    Backbone.sync = function(method, model, options) 
    {
        var url = model.url();
        
        if(method == "read")
        {
            if(_.isArray(url.match(/\/test\/\d+\//i)))
            {
                //This is a Test Model
                model.parse({id: 1, title: "Test Title", description: "Thank you for taking my test.  Please click the 'Start' button.", numberOfQuestions: 1});
            }
            else if(_.isArray(url.match(/\/test\/\d+\/\/question\/\d+\//i)))
            {
                //This is a Question Model
                model.parse({id: 1, text: "This is question 1", testID: 1, index: 0, answers: []});
            }
        }

        options.success(model);
    };
    
    //Models Namespace
    dcandre.Models = {};

    //Router Model
    dcandre.Models.Router = Backbone.Router.extend({
        routes: {
            "test/:id/": "getTestByID",
            "test/:id/question/:index/": "getQuestionByIndex",
            "*actions": "default"
        }
    });

    //Abstract Answer Model
    dcandre.Models.Answer = Backbone.Model.extend({
        defaults: {
            "id": 0
        }
    });

    //Answer Collection Model
    dcandre.Models.Answers = Backbone.Collection.extend({
        model: dcandre.Models.Answer
    });
    
    //Abstract Question Model
    dcandre.Models.Question = Backbone.Model.extend({});

    //Multiple Choice Question Model
    dcandre.Models.MultipleChoiceQuestion = dcandre.Models.Question.extend({
        url: function()
        {
             return "/test/" + this.get("testID") + "/question/index/" + this.get("index");    
        },
        defaults: {
            "id": 0,
            "index": -1,
            "testID": 0,
            "text": "",
            "answers": new dcandre.Models.Answers
        },
        parse: function(response, options)
        {

        }
    });

    //Test Model
    dcandre.Models.Test = Backbone.Model.extend({
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
            if(_.has(response, "id"))
            {
                this.set("id", response.id);
            }

            if(_.has(response, "title"))
            {
                this.set("title", response.title);
            }

            if(_.has(response, "description"))
            {
                this.set("description", response.description);
            }

            if(_.has(response, "numberOfQuestions"))
            {
                this.set("numberOfQuestions", response.numberOfQuestions);
            }

            return this;
        }
    });


    //Main Namespace
    dcandre.Main = {};

    //Main Router
    dcandre.Main.Router = new dcandre.Models.Router();
    
    //Main Test
    dcandre.Main.Test = new dcandre.Models.Test();
    
    //Main Question
    dcandre.Main.Question = new dcandre.Models.MultipleChoiceQuestion();
    
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
        if(null != testID && testID > 0 && null != index && index > 0)
        {
            
        }
    });

    //The default route event which will catch everyting else
    dcandre.Main.Router.on("route:default", function(actions)
    {
        this.navigate("test/1/");
    });

    Backbone.history.start();
});