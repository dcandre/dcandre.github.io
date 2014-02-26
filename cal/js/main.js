var dcandre = {};

$(function(){
    
    //Models Namespace
    dcandre.Models = {};

    //Answer Model
    dcandre.Models.Answer = Backbone.Model.extend({
        constructor: function() 
        {
            Backbone.Model.apply(this, arguments);

            var id = this.get("id");

            if("undefined" == typeof id || null == id || id <= 0)
            {
                alert("An id attribute, that is great than 0, is required.");
            }

            var text = this.get("text");

            if("undefined" == typeof text || null == text)
            {
                alert("An answer needs text.");
            }
        },
        defaults: {
            isCorrectAnswer: false
        }
    });

    //Answer Collection Model
    dcandre.Models.Answers = Backbone.Collection.extend({
        model: dcandre.Models.Answer
    });
    
    //Question Model
    dcandre.Models.Question = Backbone.Model.extend({
        constructor: function() 
        {
            Backbone.Model.apply(this, arguments);

            var id = this.get("id");
            
            if("undefined" == typeof id || null == id || id <= 0)
            {
                alert("An id attribute, that is great than 0, is required.");
            }

            var text = this.get("text");

            if("undefined" == typeof text || null == text)
            {
                alert("A question needs text.");
            }            
        },
        defaults: {
            "answers": new dcandre.Models.Answers(),
            "correctAnswerIDs" : new Array()
        }
    });

    //Question Collection Model
    dcandre.Models.Questions = Backbone.Collection.extend({
        model: dcandre.Models.Question
    });

    //Test Model
    dcandre.Models.Test = Backbone.Model.extend({
        constructor: function() 
        {
            Backbone.Model.apply(this, arguments);
        },
        defaults: {
            "questions": new dcandre.Models.Questions()
        }
    });

    dcandre.test = new dcandre.Models.Test();
    var questions = dcandre.test.get("questions");

    var question1 = new dcandre.Models.Question({ id: 1, text: "Question 1"});
    var questionAnswer1 = new dcandre.Models.Answer({ id: 1, text: "Answer 1"});
    var questionAnswer2 = new dcandre.Models.Answer({ id: 2, text: "Answer 2", isCorrectAnswer: true});
    var questionAnswer3 = new dcandre.Models.Answer({ id: 3, text: "Answer 3"});
    var questionAnswer4 = new dcandre.Models.Answer({ id: 4, text: "Answer 4"});
    
    question1.get("answers").add([questionAnswer1, questionAnswer2, questionAnswer3, questionAnswer4]);

    questions.add([question1]);
    
});