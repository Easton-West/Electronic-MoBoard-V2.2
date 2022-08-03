let ctcInput = document.getElementById('ctcInput');
let ctcSelect = document.getElementById('ctcSelect');
let removeButton = document.getElementById('removeButton');
let losReadout = document.getElementById('los');
let tboReadout = document.getElementById('tbo');
let osCrsReadout = document.getElementById('CRSo');
let spdoReadout = document.getElementById('SPDo');
let soiReadout = document.getElementById('soi');
let soaReadout = document.getElementById('soa');
let llaReadout = document.getElementById('lla');
let aobReadout = document.getElementById('aob');
let tgtCrsReadout = document.getElementById('CRSt');
let spdtReadout = document.getElementById('SPDt');
let stiReadout = document.getElementById('sti');
let staReadout = document.getElementById('sta');
let sriReadout = document.getElementById('sri');
let sraReadout = document.getElementById('sra');
let ssReadout = document.getElementById('ss');
let frqoReadout = document.getElementById('FRQo');
let frqrReadout = document.getElementById('FRQr');
let frqcReadout = document.getElementById('FRQc');
let tgtLegBrg = document.getElementById('tgtLegBrg');
let tgtLegRng = document.getElementById('tgtLegRng');
let tgtLegCrs = document.getElementById('tgtLegCrs');
let tgtLegSpd = document.getElementById('tgtLegSpd');
let cpaReadout = document.getElementById('cpaBrg');
let rngAtCpaReadout = document.getElementById('cpaRng');
let timeUntilCpaReadout = document.getElementById('cpaTime');
let exBrgReadout = document.getElementById('exbrg');
let expRngReadout0 = document.getElementById('rng1');
let expRngReadout1 = document.getElementById('rng2');
let expRngReadout2 = document.getElementById('rng3');
let expBrgRateReadout = [document.getElementById('brgRate1'), document.getElementById('brgRate2'), document.getElementById('brgRate3')];
let expBrgXingReadout = [document.getElementById('brgXing1'), document.getElementById('brgXing2'), document.getElementById('brgXing3')];
let tgtLegTime = document.getElementById('tgtLegTime');
let ctcOptionWrap = document.getElementById("ctcSelectWrapper")
let options = ctcOptionWrap.getElementsByTagName('option');
let legOptionWrap = document.getElementById("tgtLegWrapper")
let legOptions = legOptionWrap.getElementsByTagName('option');
let colors = ['red', 'orange', 'yellow', 'green', 'lightblue', 'lightgreen'];
let tgtLegReadout = document.getElementById("tgtlegReadout");
let addTgtLeg = document.getElementById("tgtaButton");
let overide = document.getElementById("overide");
let deleteTgtLeg = document.getElementById("tgtdButton");
let oslegOptionWrap = document.getElementById("oslegWrapper")
let oslegOptions = oslegOptionWrap.getElementsByTagName('option');
let osLegReadout = document.getElementById('oslegReadout')
let osLegTime = document.getElementById('osLegTime')
let osLegCrs = document.getElementById('osLegCrs');
let osLegSpd = document.getElementById('osLegSpd');
let addOsLeg = document.getElementById("osaButton");
let deleteOsLeg = document.getElementById("osdButton");
overide.checked = false;

//Event Listeners
ctcInput.addEventListener("keydown", e => {
    if (isNaN(ctcInput.value) || ctcInput.value.length != 4) return
    if (e.code == 'Enter' || e.code === 'Tab') {
        addCtc(Number(ctcInput.value));
    }
})

removeButton.addEventListener('click', () => {
    if (ctcSelect.length === 0) return;
    let i = ctcSelect.selectedIndex;
    let o = ctcSelect.options[i];
    o.remove();
    target.splice(i, 1);
    tgtVector.splice(i, 1);
    vectorSelect = 0;
    target.forEach((el, j) => el.num = j);
    updateReadout();
    drawMoBoard();
    updateReadout();
})

ctcSelect.addEventListener('change', e => {
    let i = ctcSelect.selectedIndex;
    let o = ctcSelect[i].value;
    vectorSelect = i;
    if (target[vectorSelect].legs.length === 0 && overide.checked) {
        overide.checked = false;
    } else {
        overide.checked = true;
    }
    setLegVisibility(o);
    target[vectorSelect].updateExpecteds();
    updateReadout()
    drawMoBoard();
    updateReadout()
})

addOsLeg.addEventListener('click', () => {
    if (!validateOs()) return;
    let t = checkTime(osLegTime.value);
    for (let i = 0; i < vector.legs.length; i++) {
        if (compareTimes(vector.legs[i][0], t)) {
            return
        }
    }
    vector.legs.push([t, Number(osLegCrs.value), Number(osLegSpd.value), 'os'])
    vector.sortLegs()
    target.forEach(t => t.setTimeline())
    let display = "\u00a0\u00a0\u00a0" + osLegTime.value + "Z\u00a0\u00a0 |\u00a0\u00a0 " + osLegCrs.value + "T\u00a0\u00a0 |\u00a0\u00a0" + osLegSpd.value;
    let option = new Option(display, t);
    osLegReadout.add(option, undefined);
    updateReadout();
    sortOptions(oslegOptions, osLegReadout);
    drawMoBoard();
})

deleteOsLeg.addEventListener('click', e => {
    if (oslegReadout.length <= 1) return;
    let i = oslegReadout.selectedIndex;
    let o = oslegReadout[i];
    o.remove();
    vector.legs.splice(i, 1);
    target.forEach(t => t.setTimeline())
    drawMoBoard();
    updateReadout();
})

addTgtLeg.addEventListener('click', e => {
    if (target.length === 0) {
        contactRequired();
        callTimer(cr);
        return
    }
    if (vector.legs.length === 0) {
        osLegReq();
        callTimer(iOsLeg);
        return
    }
    if (!validateTgt()) return
    if (target[vectorSelect].legs.length === 0 && overide.checked) {
        brgRngReq();
        callTimer(brgRng);
        return
    }
    let t = checkTime(tgtLegTime.value);
    if (compareToOsLegs(t)) return
    let overridden = overide.checked ? 0 : 1;
    overide.checked = true;
    for (let i = 0; i < target[vectorSelect].legs.length; i++) {
        if (compareTimes(target[vectorSelect].legs[i][0], t)) {
            return
        }
    }
    target[vectorSelect].legs.push([t, Number(tgtLegBrg.value), Number(tgtLegRng.value), Number(tgtLegCrs.value), Number(tgtLegSpd.value), overridden, 'tgt']);
    target[vectorSelect].sortLegs();
    console.log(target[vectorSelect].legs)
    target[vectorSelect].setTimeline();
    let display = overridden === 0 ?
        "\u00a0\u00a0\u00a0" + tgtLegTime.value + "Z\u00a0\u00a0 |\u00a0\u00a0 " + target[vectorSelect].brg + "T\u00a0\u00a0 |\u00a0\u00a0 " + target[vectorSelect].rng + "NM\u00a0\u00a0 |\u00a0\u00a0 " + tgtLegCrs.value + "T\u00a0\u00a0 |\u00a0\u00a0 " + tgtLegSpd.value + "KTS":
        "M\u00a0\u00a0\u00a0" + tgtLegTime.value + "Z\u00a0\u00a0 |\u00a0\u00a0 " + target[vectorSelect].brg + "T\u00a0\u00a0 |\u00a0\u00a0 " + target[vectorSelect].rng + "NM\u00a0\u00a0 |\u00a0\u00a0 " + tgtLegCrs.value + "T\u00a0\u00a0 |\u00a0\u00a0 " + tgtLegSpd.value + "KTS"
    let option = new Option(display, "visible");
    option.classList.add(ctcSelect.value);
    option.setAttribute("data-overide", overridden)
    option.setAttribute("data-time", t)
    tgtLegReadout.add(option, undefined);
    setLegVisibility(ctcSelect.value)
    updateReadout();
    sortOptions(legOptions, tgtLegReadout);
    drawMoBoard();
})

deleteTgtLeg.addEventListener('click', e => {
    if (target[vectorSelect].legs.length === 0) return;
    if (tgtLegReadout.selectedIndex === -1) return;
    let lastOveridden  = target[vectorSelect].legs.filter(l => l[5] == 1);
    let i = tgtLegReadout.selectedIndex;
    let o = tgtLegReadout[i];
    if (o.getAttribute("data-overide") == 1 && lastOveridden.length === 1) {
        deleteLastManual()
        callTimer(cantDeleteLastM)
        return
    }
    let vis = tgtLegReadout.getElementsByClassName(ctcSelect.value);
    let selectedOpts = Array.from(vis);
    let index = selectedOpts.findIndex(opts => opts.getAttribute("data-time") == o.getAttribute("data-time"))
    o.remove();
    target[vectorSelect].legs.splice(index, 1);
    console.log(target[vectorSelect].legs)
    target[vectorSelect].setTimeline();
    sortOptions(legOptions, tgtLegReadout);
    drawMoBoard();
    updateReadout();
})

overide.addEventListener('change', e => {
    updateReadout();
})

ssReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (target.length === 0) {
            contactRequired();
            callTimer(cr);
            return
        }
        target[vectorSelect].ss = Number(ssReadout.value);
        updateReadout();
    }
})

frqrReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (target.length === 0) {
            contactRequired();
            callTimer(cr);
            return
        }
        target[vectorSelect].frqr = Number(frqrReadout.value);
        target[vectorSelect].frqc = calcFRQc(Number(target[vectorSelect].frqr), target[vectorSelect].ss, vector);
        target[vectorSelect].frqo = calcFRQo(Number(target[vectorSelect].frqc), target[vectorSelect].ss, tgtVector[vectorSelect]);
        updateReadout();
    }
})


exBrgReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (exBrgReadout.value > 359.9) exBrgReadout.value = 0;
    }
})

expRngReadout0.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (target.length === 0) {
            contactRequired();
            callTimer(cr);
            return
        }
        target[vectorSelect].exRng[0] = Number(expRngReadout0.value);
        expBrgRateReadout[0].value = calcExpectedBrgRate(target[vectorSelect].exRng[0], 0, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[0].value = calcExpectedBrgXing(0, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

expRngReadout1.addEventListener('keydown', e => {
    if (target.length === 0) {
        contactRequired();
        callTimer(cr);
        return
    }
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].exRng[1] = Number(expRngReadout1.value);
        expBrgRateReadout[1].value = calcExpectedBrgRate(target[vectorSelect].exRng[1], 1, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[1].value = calcExpectedBrgXing(1, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

expRngReadout2.addEventListener('keydown', e => {
    if (target.length === 0) {
        contactRequired();
        callTimer(cr);
        return
    }
    if (e.code == 'Enter' || e.code === 'Tab') {
        target[vectorSelect].exRng[2] = Number(expRngReadout2.value);
        expBrgRateReadout[2].value = calcExpectedBrgRate(target[vectorSelect].exRng[2], 2, vector, target[vectorSelect], Number(exBrgReadout.value));
        expBrgXingReadout[2].value = calcExpectedBrgXing(2, vector, target[vectorSelect], Number(exBrgReadout.value))
    }
})

//Sets the leg display box to only show legs for seleted tgt
function setLegVisibility(o) {
    let vis = tgtLegReadout.getElementsByClassName(o);
    let selectedOpts = Array.from(vis);
    let allOpts = Array.from(tgtLegReadout);
    allOpts.forEach(o => {
        o.style.display = "none";
        o.value = 'not_visible';
    })
    selectedOpts.forEach((o, i, a) => {
        o.style.display = "contents";
        a[a.length - 1].value = 'visible';
    })
}

function addCtc(ctcNum) {
    if (ctcSelect.length >= 6) return
    for (let i = 0; i < options.length; i++) {
        if (ctcNum == options[i].value) {
            return
        }
    }
    let num = options.length;
    let option = new Option(ctcNum + '', ctcNum);
    ctcSelect.add(option, undefined);
    let c = target.length === 0 ? [
        ['red']
    ] : colors.filter(c => target.every(t => c != t.c));
    tgtVector.push(new Vector(c[0], 0));
    target.push(new Target(0, c[0], num, ctcNum));
    target[num].setPosition();
    sortCtcNum()
    drawMoBoard();
    updateReadout();
}

function setReadout() {
    losReadout.value = 0;
    if (overide.checked) {
        tgtLegRng.setAttribute('readonly', 'readonly');
        tgtLegBrg.setAttribute('readonly', 'readonly');
        tgtLegRng.style.color = "#e0e0e0";
        tgtLegBrg.style.color = "#e0e0e0";
    }
    drawMoBoard();
    updateReadout()
}

function updateReadout() {
    osCrsReadout.value = vector.crs.toFixed(1);
    spdoReadout.value = vector.spd.toFixed(2);
    llaReadout.value = vector.lla.toFixed(1);
    soiReadout.value = vector.si.toFixed(3);
    soaReadout.value = Math.abs(vector.sa.toFixed(3));
    tgtLegReadout.value = 'visible';
    if (target.length > 0) {
        losReadout.value = target[vectorSelect].currentBrg;
        aobReadout.value = tgtVector[vectorSelect].lla.toFixed(1);
        tboReadout.value = Number(target[vectorSelect].tbo).toFixed(1);
        tgtCrsReadout.value = tgtVector[vectorSelect].crs.toFixed(1);
        tgtLegBrg.value = Number(target[vectorSelect].currentBrg).toFixed(1);
        tgtLegRng.value = Number(target[vectorSelect].currentRng).toFixed(2);
        spdtReadout.value = tgtVector[vectorSelect].spd.toFixed(2);
        stiReadout.value = tgtVector[vectorSelect].si.toFixed(3);
        staReadout.value = Math.abs(tgtVector[vectorSelect].sa.toFixed(3));
        sriReadout.value = calcSri().toFixed(2);
        sraReadout.value = calcSra().toFixed(2);
        ssReadout.value = target[vectorSelect].ss;
        frqrReadout.value = target[vectorSelect].frqr;
        frqcReadout.value = target[vectorSelect].frqc;
        frqoReadout.value = target[vectorSelect].frqo;
    }
    if (overide.checked) {
        tgtLegRng.setAttribute('readonly', 'readonly');
        tgtLegBrg.setAttribute('readonly', 'readonly');
        tgtLegRng.style.color = "black";
        tgtLegBrg.style.color = "black";
    } else {
        tgtLegRng.removeAttribute('readonly');
        tgtLegBrg.removeAttribute('readonly');
        tgtLegRng.style.color = "white";
        tgtLegBrg.style.color = "white";
    }
}

function validateOs() {
    //Time check
    let tArr = osLegTime.value.split('')
    if (tArr.length !== 4) {
        osInvalidTime()
        callTimer(o_iTime)
        return false
    }
    let hrs = tArr.slice(0, 2).join('')
    if (hrs < 0 || hrs > 23) {
        osInvalidTime()
        callTimer(o_iTime)
        return false
    }
    let min = tArr.slice(2, 4).join('')
    if (min < 0 || min > 59) {
        osInvalidTime()
        callTimer(o_iTime)
        return false
    }

    if (isNaN(osLegCrs.value)) {
        osinvalidCrs()
        callTimer(o_icrs)
        return false
    }
    osLegCrs.value %= 360;
    osLegCrs.value = Number(osLegCrs.value).toFixed(1);

    if (isNaN(osLegSpd.value)) {
        osinvalidSpd()
        callTimer(o_ispd)
        return false
    }
    osLegSpd.value = Number(osLegSpd.value).toFixed(1);

    return true
}

function validateTgt() {
    //Time check
    let tArr = tgtLegTime.value.split('')
    if (tArr.length !== 4) {
        tgtInvalidTime()
        callTimer(iTime)
        return false
    }
    let hrs = tArr.slice(0, 2).join('')
    if (hrs < 0 || hrs > 23) {
        tgtInvalidTime()
        callTimer(iTime)
        return false
    }
    let min = tArr.slice(2, 4).join('')
    if (min < 0 || min > 59) {
        tgtInvalidTime()
        callTimer(iTime)
        return false
    }
    //brg check
    if (isNaN(tgtLegBrg.value)) {
        tgtInvalidBrg()
        callTimer(ibrg)
        return false
    }
    tgtLegBrg.value %= 360;
    tgtLegBrg.value = Number(tgtLegBrg.value).toFixed(1);
    //rng check
    if (isNaN(tgtLegRng.value)) {
        tgtInvalidRng()
        callTimer(irng)
        return false
    }
    tgtLegRng.value = Number(tgtLegRng.value).toFixed(1);
    //crs check
    if (isNaN(tgtLegCrs.value)) {
        tgtInvalidCrs()
        callTimer(icrs)
        return false
    }
    tgtLegCrs.value = Number(tgtLegCrs.value).toFixed(1);
    //spd check
    if (isNaN(tgtLegSpd.value)) {
        tgtInvalidSpd()
        callTimer(ispd)
        return false
    }
    tgtLegSpd.value = Number(tgtLegSpd.value).toFixed(1);

    return true
}

function compareToOsLegs(tgtTime) {
    if (tgtTime <= vector.legs[0][0]) {
        timeBeforeOSLeg();
        callTimer(timeBeforeOs);
        return true
    }
    return false
}

function compareTimes(targetTime, t) {
    let day1 = targetTime.getDate();
    let hour1 = targetTime.getHours();
    let min1 = targetTime.getMinutes();
    let day2 = t.getDate();
    let hour2 = t.getHours();
    let min2 = t.getMinutes();
    if ((day1 === day2) && (hour1 === hour2) && (min1 === min2)) {
        return true
    }
    return false
}

window.onload = load()