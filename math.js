function calcAngleOfLine(pt1, pt2, v) {
    let dx = pt1.x - pt2.x;
    let dy = pt1.y - pt2.y;
    let theta;
    if (v !== undefined && v.vNum === 1) {
        theta = Math.atan2(-dy, -dx);
    } else {
        theta = Math.atan2(dy, dx);
    }
    theta -= Math.PI / 2;
    theta *= 180 / Math.PI;
    if (theta < 0) theta += 360;
    return theta;
}

function calcVectorAngle(v1, v2, v) {
    let theta = calcAngleOfLine(v1, v2, v);
    return degreesToRadians(theta);
}

function calcGhostVec(crs, spd) {
    let l = spd * 10;
    let a = degreesToRadians(crs);
    let aOffset = degreesToRadians(90);
    let x = vector.pt1.x + l * Math.cos(a - aOffset);
    let y = vector.pt1.y + l * Math.sin(a - aOffset);
    return {x: x, y: y}
}

function calcSra() {
    if (determineLeadLag(target[vectorSelect].brg, vector, target[vectorSelect])) {
        return Math.abs(Math.abs(vector.sa) - Math.abs(tgtVector[vectorSelect].sa));
    }
    return Math.abs(Math.abs(vector.sa) + Math.abs(tgtVector[vectorSelect].sa));
}

function calcSri() {
    return vector.si + tgtVector[vectorSelect].si;
}

function calcCPA(check) {
    let a = calcAngleOfLine(vector.pt2, tgtVector[vectorSelect].pt2, tgtVector[vectorSelect])
    if (check === 0) {
        let val = (a - 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
    if (check === -1) {
        let val = (a - 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
    if (check === 1) {
        let val = (a + 90) % 360;
        if (val < 0) val += 360;
        cpaReadout.value = val.toFixed(1);
        return val;
    }
}

function calcSRM(os, tgt) {
    let theta;
    theta = calcAngleOfLine(os.pt2, tgt.pt2)
    return degreesToRadians(theta);
}

function CPA(speed1, course1, speed2, course2, range, bearing) {
    let DTR = Math.PI / 180;
    let x, y, xVel, yVel, dot, a, b, cpa;

    x = range * Math.cos(DTR * bearing);
    y = range * Math.sin(DTR * bearing);
    xVel = speed2 * Math.cos(DTR * course2) - speed1 * Math.cos(DTR * course1);
    yVel = speed2 * Math.sin(DTR * course2) - speed1 * Math.sin(DTR * course1);
    dot = x * xVel + y * yVel;
    if (dot >= 0.0) {
        rngAtCpaReadout.value = "PAST";
        timeUntilCpaReadout.value = "PAST";
        return
    }
    a = xVel * xVel + yVel * yVel;
    b = 2 * dot;
    cpa = range * range - ((b * b) / (4 * a));
    if (cpa <= 0.0) {
        rngAtCpaReadout.value = "PAST";
        timeUntilCpaReadout.value = "PAST";
        return
    }
    cpa = Math.sqrt(cpa);
    rngAtCpaReadout.value = cpa.toFixed(1);
    timeUntilCpaReadout.value = calcCPATime(60 * (-b / (2 * a)))
}

function CalcSC() {
    CPA(vector.spd, vector.crs, tgtVector[vectorSelect].spd, tgtVector[vectorSelect].crs, target[vectorSelect].currentRng, target[vectorSelect].currentBrg);
}

function calcCPATime(num) {
    let d1 = new Date();
    d1.getTimezoneOffset() * 60 * 1000 < 0 ? d1.setTime(d1.getTime() - (Math.abs(d1.getTimezoneOffset() * 60 * 1000))) : d1.setTime(d1.getTime() + (d1.getTimezoneOffset() * 60 * 1000));
    let newTime = new Date(d1.setMinutes(d1.getMinutes() + num));
    return newTime.getHours() + ":" + newTime.getMinutes() + "Z"
}

function exSa(brg, vec) {
    return Math.abs(Math.sin(degreesToRadians(brg - vec.crs)) * vec.spd);
}

function exSra(osVec, tgtVec, brg) {
    if (determineLeadLag(brg, osVec, tgtVec)) {
        return Math.abs(exSa(brg, osVec) - exSa(brg, tgtVec));
    }
    return Math.abs(exSa(brg, osVec) + exSa(brg, tgtVec));
}

function calcExpectedBrgRate(val, num, osVec, tgtVec, brg) {
    let sra = exSra(osVec, tgtVec, brg);
    let b = sra * (0.95 / val);
    tgtVec.exBrgR[num] = b;
    return b.toFixed(3);
}

function calcExpectedBrgXing(num, osVec, tgtVec, brg) {
    let ts = exSa(brg, tgtVec);
    let os = exSa(brg, osVec);
    if (ts >= os && determineLeadLag(brg, osVec, tgtVec)) {
        tgtVec.exBrgX[num] = 0;
        return tgtVec.exBrgX[num];
    } else {
        let x = Math.abs(vector.sa) * (0.95 / tgtVec.exBrgR[num]);
        tgtVec.exBrgX[num] = x;
        return tgtVec.exBrgX[num].toFixed(1);
    }
}

function calcFRQc(fr, ss, vec) {
    let osDopp = Math.abs(vec.si) * ss;
    if (vec.lla < 90) {
        return (fr - osDopp).toFixed(3)
    }
    return (fr + osDopp).toFixed(3)
}

function calcFRQo(fc, ss, vec) {
    let tgtDopp = Math.abs(vec.si) * ss;
    if (vec.lla < 90) {
        return (fc - tgtDopp).toFixed(3)
    }
    return (fc + tgtDopp).toFixed(3)
}

function calcCrsFromFo(fr, ss, fo) {
    let frqc = calcFRQc(fr, ss, tOS);
    let rad = Math.acos(((frqc - fo) / ss) / tTarget.spd);
    let crs1 = Math.abs(tTarget.tbo - radiansToDegrees(rad)) % 360;
    let crs2 = Math.abs(tTarget.tbo + radiansToDegrees(rad)) % 360;
    return crs1.toFixed(0) + "/" + crs2.toFixed(0)
}

function calcCrsFromSPDti(brg, spdti, spd) {
    let crs1 = (radiansToDegrees(Math.acos(spdti / spd)) - brg) % 360;
    let crs2 = (radiansToDegrees(Math.acos(spdti / spd)) + brg) % 360;
    return Math.abs(crs1.toFixed(0)) + '/' + Math.abs(crs2.toFixed(0))
}

function determineLeadLag(brg, os, tgt) {
    //sign((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let a1 = degreesToRadians(Number(os.crs));
    let a2 = degreesToRadians(Number(tgt.crs));
    let los = {
        x1: x + 100 * Math.cos(degreesToRadians(brg)),
        y1: y + 100 * Math.sin(degreesToRadians(brg))
    }
    let x1 = x + os.spd * Math.cos(a1);
    let y1 = y + os.spd * Math.sin(a1);
    let x2 = x + tgt.spd * Math.cos(a2);
    let y2 = y + tgt.spd * Math.sin(a2);
    let a = Math.sign((x - los.x1) * (y2 - los.y1) - (y - los.y1) * (x2 - los.x1))
    let b = Math.sign((x - los.x1) * (y1 - los.y1) - (y - los.y1) * (x1 - los.x1))
    return a === b
}

function timeDiff(t) {
    let tArr = t.split('')
    let hrs = tArr.slice(0, 2).join('')
    if (hrs < 0 || hrs > 23) {
        return
    }
    let min = tArr.slice(2, 4).join('')
    if (min < 0 || min > 59) {
        return
    }
    let d1 = new Date()
    let d2 = new Date()
    d1.getTimezoneOffset() * 60 * 1000 < 0 ? d1.setTime(d1.getTime() - (Math.abs(d1.getTimezoneOffset() * 60 * 1000))) : d1.setTime(d1.getTime() + (d1.getTimezoneOffset() * 60 * 1000))
    d2.getTimezoneOffset() * 60 * 1000 < 0 ? d2.setTime(d2.getTime() - (Math.abs(d2.getTimezoneOffset() * 60 * 1000))) : d2.setTime(d2.getTime() + (d2.getTimezoneOffset() * 60 * 1000))
    d2.setMinutes(min);
    d2.setHours(hrs);
    if (d2.getTime() > d1.getTime()) {
        d2.setDate(d1.getDate() - 1)
    }
    let mil = d1.getTime() - d2.getTime();
    let min1 = ((mil / 1000) / 60)
    return Math.round(min1)
}

function checkTime(t) {
    let tArr = t.split('')
    let hrs = tArr.slice(0, 2).join('')
    if (hrs < 0 || hrs > 23) {
        return
    }
    let min = tArr.slice(2, 4).join('')
    if (min < 0 || min > 59) {
        return
    }
    let d1 = new Date();
    let d2 = new Date();
    d1.getTimezoneOffset() * 60 * 1000 < 0 ? d1.setTime(d1.getTime() - (Math.abs(d1.getTimezoneOffset() * 60 * 1000))) : d1.setTime(d1.getTime() + (d1.getTimezoneOffset() * 60 * 1000))
    d2.getTimezoneOffset() * 60 * 1000 < 0 ? d2.setTime(d2.getTime() - (Math.abs(d2.getTimezoneOffset() * 60 * 1000))) : d2.setTime(d2.getTime() + (d2.getTimezoneOffset() * 60 * 1000))
    d2.setMinutes(min);
    d2.setHours(hrs);
    if (d2.getTime() > d1.getTime()) {
        d2.setDate(d1.getDate() - 1);
    }
    return d2
}

function timeBetweenLegs(l1, l2) {
    return Math.abs(Math.floor((l1 - l2) / 60000));
}

function sortOptions(options, readout) {
    let opts = Array.from(options)
    opts.sort(function (a, b) {
        let d1 = new Date(a.getAttribute("data-time"));
        let d2 = new Date(b.getAttribute("data-time"));
        return d1 - d2
    })
    opts.forEach(x => {
        readout.append(x);
    });
}

function sortCtcNum() {
    let opts = Array.from(ctcSelect);
    opts.sort((a, b) => a.value - b.value)
    opts.forEach(x => ctcSelect.append(x));
}

function calcDist(pt1, pt2) {
    dx = pt1.x - pt2.x;
    dy = pt1.y - pt2.y;
    return Math.hypot(dx, dy)
}