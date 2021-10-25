const { get } = require("http");
var snmp = require ("net-snmp");
var mysql = require('mysql');

var options = {
    port: 161,
    retries: 1,
    timeout: 5000,
    backoff: 1.0,
    transport: "udp4",
    trapPort: 162,
    version: snmp.Version2c,
    backwardsGetNexts: true,
    idBitsSize: 32
};

var oid_ap = "1.3.6.1.4.1.14179.2.2.1.1.3"; // AP name
var oid_ch = "1.3.6.1.4.1.14179.2.2.2.1.4"; // Wireless channel
var oid_pw = "1.3.6.1.4.1.14179.2.2.2.1.6"; // power lvl

var apn_oid = [];
var wch_oid = [];
var pwl_oid = [];

var ap_cn = [];

function doneCb (error) {
    if (error)
        console.error (error.toString ());
}

function feedCb_apn (varbinds) {
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i]))
            console.error (snmp.varbindError (varbinds[i]));
        else{
            //console.log (varbinds[i].oid + "|" + varbinds[i].value);
            var x = [];
            var z = varbinds[i].oid;
            z = z.replace('1.3.6.1.4.1.14179.2.2.1.1.3.','');
            var y;
            x.push(z);
            y = "|" + varbinds[i].value;
            y = y.substring(1);
            x.push(y);
            apn_oid.push(x);
        }
    }
}

function feedCb_wch (varbinds) {
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i]))
            console.error (snmp.varbindError (varbinds[i]));
        else{
            //console.log (varbinds[i].oid + "|" + varbinds[i].value);
            var x = [];
            var z = varbinds[i].oid;
            z = z.replace('1.3.6.1.4.1.14179.2.2.2.1.4.','');
            var y;
            x.push(z);
            y = "|" + varbinds[i].value;
            y = y.substring(1);
            x.push(y);
            wch_oid.push(x);
        }
    }
}

function feedCb_pwl (varbinds) {
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i]))
            console.error (snmp.varbindError (varbinds[i]));
        else{
            //console.log (varbinds[i].oid + "|" + varbinds[i].value);
            var x = [];
            var z = varbinds[i].oid;
            z = z.replace('1.3.6.1.4.1.14179.2.2.2.1.6.','');
            var y;
            x.push(z);
            y = "|" + varbinds[i].value;
            y = y.substring(1);
            x.push(y);
            pwl_oid.push(x);
        }
    }
}

var maxRepetitions = 20;

// The maxRepetitions argument is optional, and will be ignored unless using
// SNMP verison 2c
var Controler = [
    "10.71.0.3",
    "10.71.0.7",
    "10.71.0.8"
]

async function first(){
    for(var i=0;i<Controler.length;i++){
        var session = snmp.createSession (Controler[i], "cmumrtg",options);
        session.subtree (oid_ap, maxRepetitions, feedCb_apn, doneCb);
        session.subtree (oid_ch, maxRepetitions, feedCb_wch, doneCb);
        session.subtree (oid_pw, maxRepetitions, feedCb_pwl, doneCb);
    }
    
}



async function second(){
    if(wch_oid.length!=0){
    //console.log(apn_oid.length);
    for(var i=0;i<wch_oid.length;i++){
        var x = wch_oid[i][0];
        x = x.slice(0,-2)
        for(var j=0;j<apn_oid.length;j++){
            if(x==apn_oid[j][0]){
                var y = [];
                y.push(guid());
                y.push(thistime());
                y.push(x);
                y.push(apn_oid[j][1]);
                y.push(wch_oid[i][1]);
                y.push(pwl_oid[i][1]);
                if(x==wch_oid[i+1][0].slice(0,-2)){
                    y.push(wch_oid[i+1][1]);
                    y.push(pwl_oid[i+1][1]);
                    i++;
                }
                ap_cn.push(y);
                break;
            }
        }
    }}
}

//generates random id;
let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaaaaaa'-'aaaaaaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + s4() + '-' + s4() + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

//get time
let thistime = () => {
    var d = new Date()
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDay();
    var ho = d.getHours();
    var minit = d.getMinutes();
    var sec = d.getSeconds();
    return year + "-" + month + "-" + day + " " + ho + ":" + minit + ":" + sec; 
}

async function third(){
    if(ap_cn.length!=0){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "765",
        database: "ap_channal"
    });
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO ap_channal_data (id, time, oid, name,  channel24, power24, channel5, power5) VALUES ?";
        var values = ap_cn;
        ap_cn = [];
        apn_oid = [];
        wch_oid = [];
        pwl_oid = [];
        con.query(sql,[values], function (err, result) {
        if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        }); 
        con.end();
    });
    
    console.log(ap_cn.length)
    }
}

setInterval(() => {
    first().then(()=>{
        setTimeout(function(){
            second().then(()=>{
                third();
            })
        },30000)
    })
}, 1000*60*5);

