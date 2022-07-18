let body = document.body;
let cr = document.createElement("input");
cr.setAttribute("type", "text");
cr.setAttribute("value", "Contact Required");
cr.classList.add("message");
body.appendChild(cr);
let iTime = document.createElement("input");
iTime.setAttribute("type", "text");
iTime.setAttribute("value", "Invalid Time");
iTime.classList.add("message");
body.appendChild(iTime);
let o_iTime = document.createElement("input");
o_iTime.setAttribute("type", "text");
o_iTime.setAttribute("value", "Invalid Time");
o_iTime.classList.add("message");
body.appendChild(o_iTime);
let ibrg = document.createElement("input");
ibrg.setAttribute("type", "text");
ibrg.setAttribute("value", "Invalid Brg");
ibrg.classList.add("message");
body.appendChild(ibrg);
let irng = document.createElement("input");
irng.setAttribute("type", "text");
irng.setAttribute("value", "Invalid Rng");
irng.classList.add("message");
body.appendChild(irng);
let icrs = document.createElement("input");
icrs.setAttribute("type", "text");
icrs.setAttribute("value", "Invalid Crs");
icrs.classList.add("message");
body.appendChild(icrs);
let o_icrs = document.createElement("input");
o_icrs.setAttribute("type", "text");
o_icrs.setAttribute("value", "Invalid Crs");
o_icrs.classList.add("message");
body.appendChild(o_icrs);
let ispd = document.createElement("input");
ispd.setAttribute("type", "text");
ispd.setAttribute("value", "Invalid Spd");
ispd.classList.add("message");
body.appendChild(ispd);
let o_ispd = document.createElement("input");
o_ispd.setAttribute("type", "text");
o_ispd.setAttribute("value", "Invalid Spd");
o_ispd.classList.add("message");
body.appendChild(o_ispd);
let brgRng = document.createElement("input");
brgRng.setAttribute("type", "text");
brgRng.setAttribute("value", "Brg and Rng Required");
brgRng.classList.add("message");
body.appendChild(brgRng);
let iOsLeg = document.createElement("input");
iOsLeg.setAttribute("type", "text");
iOsLeg.setAttribute("value", "OS Leg Required");
iOsLeg.classList.add("message");
body.appendChild(iOsLeg);
let timeBeforeOs = document.createElement("input");
timeBeforeOs.setAttribute("type", "text");
timeBeforeOs.setAttribute("value", "Cannot be before first OS leg");
timeBeforeOs.classList.add("message");
body.appendChild(timeBeforeOs);

//contact required
function contactRequired() {
    let pos = ctcSelect.getBoundingClientRect();
    style(cr)
    cr.style.left = pos.left + scrollX + "px";
    cr.style.top = pos.top + 30 + scrollY + "px";
}

//Invalid Time
function tgtInvalidTime() {
    let pos = tgtLegTime.getBoundingClientRect();
    style(iTime)
    iTime.style.left = pos.left + scrollX + "px";
    iTime.style.top = pos.top + 30 + scrollY + "px";
}

function osInvalidTime() {
    let pos = osLegTime.getBoundingClientRect();
    style(o_iTime)
    o_iTime.style.left = pos.left + scrollX + "px";
    o_iTime.style.top = pos.top + 30 + scrollY + "px";
}

//Invalid Brg
function tgtInvalidBrg() {
    let pos = tgtLegBrg.getBoundingClientRect();
    style(ibrg)
    ibrg.style.left = pos.left + scrollX + "px";
    ibrg.style.top = pos.top + 30 + scrollY + "px";
}

//Invalid Rng
function tgtInvalidRng() {
    let pos = tgtLegRng.getBoundingClientRect();
    style(irng)
    irng.style.left = pos.left + scrollX + "px";
    irng.style.top = pos.top + 30 + scrollY + "px";
}

//Invalid Crs
function tgtInvalidCrs() {
    let pos = tgtLegCrs.getBoundingClientRect();
    style(icrs)
    icrs.style.left = pos.left + scrollX + "px";
    icrs.style.top = pos.top + 30 + scrollY + "px";
}

function osinvalidCrs() {
    let pos = osLegCrs.getBoundingClientRect();
    style(o_icrs)
    o_icrs.style.left = pos.left + scrollX + "px";
    o_icrs.style.top = pos.top + 30 + scrollY + "px";
}

//Invalid Spd
function tgtInvalidSpd() {
    let pos = tgtLegSpd.getBoundingClientRect();
    style(ispd)
    ispd.style.left = pos.left + scrollX + "px";
    ispd.style.top = pos.top + 30 + scrollY + "px";
}

function osinvalidSpd() {
    let pos = osLegSpd.getBoundingClientRect();
    style(o_ispd)
    o_ispd.style.left = pos.left + scrollX + "px";
    o_ispd.style.top = pos.top + 30 + scrollY + "px";
}

function timeBeforeOSLeg() {
    let pos = addTgtLeg.getBoundingClientRect();
    style(timeBeforeOs)
    timeBeforeOs.style.left = pos.left + scrollX + "px";
    timeBeforeOs.style.top = pos.top + 30 + scrollY + "px";
}

//No tgt legs exist so you must overide and add brg/rng
function brgRngReq() {
    let pos = tgtLegBrg.getBoundingClientRect();
    style(brgRng);
    brgRng.style.left = pos.left - 8 + scrollX + "px";
    brgRng.style.top = pos.top - 35 + scrollY + "px";
}

function osLegReq() {
    let pos = addOsLeg.getBoundingClientRect();
    style(iOsLeg);
    iOsLeg.style.left = pos.left + scrollX + "px";
    iOsLeg.style.top = pos.top + 15 + scrollY + "px";
}

function style(el) {
    el.style.display = 'block';
    el.style.position = "absolute";
    el.style.border = "2px solid red";
    el.style.borderRadius = "5px";
    el.style.backgroundColor = "#2b2a2b";
    el.style.color = "white";
    el.style.textAlign = 'center';
    el.setAttribute('size', el.value.length)
}

function callTimer(err) {
    setTimeout( () => {
        err.style.display = "none";
    }, 3000, err)
}

