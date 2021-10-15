var mysql = require('mysql');

var test = [];


let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
async function t(){
    for(var i=0;i<2000;i++){
    var x = [];
    x.push(guid());
    x.push('1')
    x.push('2')
    x.push('3')
    x.push('4')
    x.push('5')
    test.push(x);
}
console.log(test.length);
}

async function third(){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "765",
        database: "ap_channal"
    });
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
            var sql = "INSERT INTO ap_channal_data (id, time, oid, type, name, channal) VALUES ?";
            var values = test;
            test = [];
            con.query(sql,[values], function (err, result) {
            if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            }); 
        
    });
}

setInterval(() => {
    t().then(()=>{
        setTimeout(() => {
            third();
            
        }, 1000)
        
    })
}, 3000);
