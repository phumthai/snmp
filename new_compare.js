var mysql = require('mysql');


var data = [];
    // ["1","10.00","1","a","1","60","1","1"],
    // ["2","10.00","2","b","6","60","1","1"],
    // ["3","10.00","3","c","11","60","1","1"],
    // ["1","10.10","1","a","1","60","1","1"],
    // ["2","10.10","2","b","11","60","1","1"],
    // ["3","10.10","3","c","11","50","1","1"],
    // ["1","10.20","1","a","1","20","1","1"],
    // ["2","10.20","2","b","11","60","1","1"],
    // ["3","10.20","3","c","11","50","1","1"]

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
    //con.destroy
}


async function second(){
    for(var n=0;n<data.length;n+0){
        var x = data[n][2];
        var isIn = [];
        var store = [];
        for(var i=0;i<data.length;i++){
            if(x==data[i][2]){
                isIn.push(data[i][2]);
                store.push(data[i]);
                data.splice(i,1);
            }
            if(data.length==1||data.length==2){
                i=-1;
            }
        }
        for(var j=0;j<store.length-1;j++){
            if(store[j][4]!=store[j+1][4]||store[j][5]!=store[j+1][5]){
                change.push(store[j]);
                change.push(store[j+1]);
            }
        }
    }
    
}

async function third(){
    console.log(change)
    if(change.length!=0){
        var sql = "INSERT INTO ap_channal_change (id, time, oid, name,  channel24, channel5, power24, power5) VALUES ?";
        var values = change;
        con.query(sql,[values]);
        console.log(change);
        change = [];
        data = [];
    }
}

first().then(()=>{
    setTimeout(function(){
        second().then(()=>{
            third();
        })
    },10000)
})
