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
                x.push(row.id);
                x.push(row.time);
                x.push(row.oid);
                x.push(row.name);
                x.push(row.channel24);
                x.push(row.channel5);
                x.push(row.power24);
                x.push(row.power5);
                data.push(x);
            })
        });
    });
    con.destroy
}

async function second(){
    var first = data[0];
    var one;
    var two;
    for(var i=0;i<data.length;i++){
        one = data[i];
        for(var j=i;j<data.length;j++){
            two = data[j];
            if(one[2]==two[2]){
                if(one[4]!=two[4]||one[5]!=two[5]){
                    change.push(one);
                    change.push(two);
                }
                one = two;
            }
        }
        if(i+1<data.length){
            one = data[i+1];
            if(one[2]==first[2]){
                break;
            }
        }  
    }
    console.log(change);
}

async function third(){
    if(change.length!=0){
        var sql = "INSERT INTO ap_channal_change (id, time, oid, name,  channel24, channel5, power24, power5) VALUES ?";
        var values = change;
        change = [];
        data = [];
        con.query(sql,[values]);
    }
}

first().then(()=>{
    setTimeout(function(){
        second().then(()=>{
            third();
        })
    },10000)
})

