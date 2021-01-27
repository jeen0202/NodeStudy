var db = require('./db');
var template = require('./template');

exports.home = function(request,response){
    db.query (`select * from topic`,function(error,topics){ 
        db.query (`select * from author`,function(error2,authors){            
            var title = 'Author';          
            var list = template.list(topics);
            var html = template.HTML(title,list
            ,`
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>`
            ,`<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html); 
        });        

        });
}