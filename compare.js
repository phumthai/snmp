var mysql = require('mysql');

var data = [];
var change = [];

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "765",
    database: "ap_channal"
});

async function first(){
    con.connect(function(err) {
    if (err) throw err;
        con.query("SELECT * FROM ap_channal_data", function (err, result, fields) {
        if (err) throw err;
            Object.keys(result).forEach(function(key){
                var row = result[key];
                var x = [];
                x.push(row.time);
                x.push(row.name);
                x.push(row.channel24);
                x.push(row.channel5);
                data.push(x);
            })
        });
    });
}

async function second(){
    var first = data[0][1];
    var one;
    var two;
    for(var i=0;i<data.length;i++){
        one = data[i][1];
        for(var j=i;j<data.length;j++){
            two = data[j][1];
            if(one==two){
                if(data[i][2]!=data[j][2]||data[i][3]!=data[j][3]){
                    change.push(data[i]);
                    change.push(data[j]);
                }
                one = two;
            }
        }
        if(i+1<data.length){
            one = data[i+1][1];
            if(one==first){
                break;
            }
        }  
    }
    console.log(change);
}

first().then(()=>{
    setTimeout(function(){
        second();
    },5000)
})

