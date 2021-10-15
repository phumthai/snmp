const { get } = require("http");
var snmp = require ("net-snmp");

var session = snmp.createSession ("10.71.0.3", "cmumrtg");

var oid_ap = "1.3.6.1.4.1.14179.2.2.1.1.3"; // AP name
var oid_ch = "1.3.6.1.4.1.14179.2.2.2.1.4"; // Wireless channal

var apn_oid = [];
var wch_oid = [];

var ap_cn = [];

function doneCb (error) {
    if (error)
        console.error (error.toString ());
}

function feedCb_apn (varbinds) {
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i]))
            console.error (snmp.varbindError (varbinds[i]));
        else
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

function feedCb_wch (varbinds) {
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i]))
            console.error (snmp.varbindError (varbinds[i]));
        else
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

var maxRepetitions = 20;

// The maxRepetitions argument is optional, and will be ignored unless using
// SNMP verison 2c

async function first(){
    session.subtree (oid_ap, maxRepetitions, feedCb_apn, doneCb);
    session.subtree (oid_ch, maxRepetitions, feedCb_wch, doneCb);
}

async function second(){
    //console.log(apn_oid.length);
    for(var i=0;i<wch_oid.length;i++){
        var x = wch_oid[i][0];
        var type = x.slice(-1);
        x = x.slice(0,-2)
        for(var j=0;j<apn_oid.length;j++){
            if(x==apn_oid[j][0]){
                var y = [];
                y.push(x);
                y.push(type);
                y.push(wch_oid[i][1])
                y.push(apn_oid[j][1]);
                ap_cn.push(y);
                break;
            }
        }
    }
    console.log(ap_cn);
}

async function main(){
    await first();
    await second();
}
first().then(()=>{
    setTimeout(function(){
        second();
    },2000)
})
// setTimeout(function(){
    
// },2000);



