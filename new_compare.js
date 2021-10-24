var mysql = require('mysql');

var isIn = [];
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
    //con.destroy
}


async function second(){
    for(var i=0;i<data.length;i++){
        if(isIn.includes(data[i][2])){
            isIn.push(data[i][2]);
        }
    }

    for(var i=0;i<isIn.length;i++){
        var store = [];
        for(var j=0;j<data.length;j++){
            if(isIn[i]==data[j][2]){
                store.push(data[j]);
                data.splice(j,1);
            }
        }
        if(store.length>1){
            for(var j=0;j<store.length-1;j++){
                if(store[j][4]!=store[j+1][4]||store[j][5]!=store[j+1][5]){
                    change.push(store[j]);
                    change.push(store[j+1]);
                }
            }
        }
    }
}

async function third(){
    if(change.length!=0){
        var sql = "INSERT INTO ap_channal_change (id, time, oid, name,  channel24, channel5, power24, power5) VALUES ?";
        var values = change;
        con.query(sql,[values]);
        console.log(change);
        change = [];
        data = [];
        con.destroy();
    }
}

first().then(()=>{
    setTimeout(function(){
        second().then(()=>{
            third();
        })
    },10000)
})

