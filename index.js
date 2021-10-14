var snmp = require ("net-snmp");

var session = snmp.createSession ("10.71.0.3", "cmumrtg");

// var oids = "1.3.6.1.4.1.14179.2.2.1.1.3"; // AP name
var oids = "1.3.6.1.4.1.14179.2.2.2.1.4"; // Wireless channal

// session.get (oids, function (error, varbinds) {
//     if (error) {
//         console.error (error);
//     } else {
//         for (var i = 0; i < varbinds.length; i++) {
//             if (snmp.isVarbindError (varbinds[i])) {
//                 console.error (snmp.varbindError (varbinds[i]));
//             } else {
//                 console.log (varbinds[i].oid + " = " + varbinds[i].value);
//             }
//         }
//     }
//     session.close ();
// });

// session.trap (snmp.TrapType.LinkDown, function (error) {
//     if (error) {
//         console.error (error);
//     }
// });
// var store = snmp.createModuleStore ();
// store.loadFromFile ("mib/bsnwras.my");
// var providers = store.getProvidersForModule ("SNMPv2-MIB");
// agent.getMib ().registerProviders (providers);

function doneCb (error) {
    if (error)
        console.error (error.toString ());
}

function feedCb (varbinds) {
    for (var i = 0; i < varbinds.length; i++) {
        if (snmp.isVarbindError (varbinds[i]))
            console.error (snmp.varbindError (varbinds[i]));
        else
            console.log (varbinds[i].oid + "|" + varbinds[i].value);
    }
}

var maxRepetitions = 20;

// The maxRepetitions argument is optional, and will be ignored unless using
// SNMP verison 2c
session.subtree (oids, maxRepetitions, feedCb, doneCb);