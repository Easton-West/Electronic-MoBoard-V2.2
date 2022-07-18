let t_losReadout = document.getElementById('tlos');
let t_tboReadout = document.getElementById('ttbo');
let t_osCrsReadout = document.getElementById('tCRSo');
let t_spdoReadout = document.getElementById('tSPDo');
let t_soiReadout = document.getElementById('tsoi');
let t_soaReadout = document.getElementById('tsoa');
let t_llaReadout = document.getElementById('tlla');
let t_aobReadout = document.getElementById('taob');
let t_tgtCrsReadout = document.getElementById('tCRSt');
let t_spdtReadout = document.getElementById('tSPDt');
let t_stiReadout = document.getElementById('tsti');
let t_staReadout = document.getElementById('tsta');
let t_sriReadout = document.getElementById('tsri');
let t_sraReadout = document.getElementById('tsra');
let t_FrqoReadout = document.getElementById('tFRQo');
let t_FrqrReadout = document.getElementById('tFRQr');
let t_FrqcReadout = document.getElementById('tFRQc');
let t_FrqoReadout2 = document.getElementById('tFRQo1');
let t_FrqrReadout2 = document.getElementById('tFRQr1');
let t_CrsReadout = document.getElementById('tCrs1');
let t_SsReadout = document.getElementById('tss');
let t_exBrgReadout = document.getElementById('texbrg');
let t_expRngReadout0 = document.getElementById('trng1');
let t_expRngReadout1 = document.getElementById('trng2');
let t_expRngReadout2 = document.getElementById('trng3');
let t_expBrgRateReadout = [document.getElementById('tbrgRate1'), document.getElementById('tbrgRate2'), document.getElementById('tbrgRate3')];
let t_expBrgXingReadout = [document.getElementById('tbrgXing1'), document.getElementById('tbrgXing2'), document.getElementById('tbrgXing3')];
let t_spdTiReadout = document.getElementById('spdti');
let t_crsSpdTiReadout = document.getElementById('crsSpdti');

class OwnShip {
    constructor() {
        this.crs = 0;
        this.spd = 5;
        this.lla = 0;
        this.sa = 0;
        this.si = 0;
        this.vPt = {
            x: 0,
            y: 0
        };
    }
    update() {
        let lla = Math.abs(tTarget.brg - this.crs);
        if (lla > 180) {
            let d = lla - 180
            lla = 180 - d
        };
        this.lla = lla;
        this.sa = Math.sin(degreesToRadians(tTarget.brg - this.crs)) * this.spd;
        this.si = Math.cos(degreesToRadians(tTarget.brg - this.crs)) * this.spd;
    }
}

class TrialTarget {
    constructor() {
        this.brg = 45;
        this.crs = 160;
        this.rng = 25;
        this.spd = 9;
        this.tbo = this.brg <= 180 ? this.brg - 180 : this.brg + 180;
        this.lla = 0;
        this.sa = 0;
        this.si = 0;
        this.exRng = [];
        this.exBrgR = [];
        this.exBrgX = [];
    }
    update() {
        this.tbo = this.brg >= 180 ? this.brg - 180 : this.brg + 180;
        let lla = Math.abs(this.tbo - this.crs);
        if (lla > 180) {
            let d = lla - 180
            lla = 180 - d
        };
        this.lla = lla;
        this.sa = Math.sin(degreesToRadians(this.tbo - this.crs)) * this.spd;
        this.si = Math.cos(degreesToRadians(this.tbo - this.crs)) * this.spd;
    }
}

let tOS = new OwnShip()
let tTarget = new TrialTarget()

function updateTrialReadout() {
    tOS.update()
    tTarget.update()
    t_losReadout.value = tTarget.brg.toFixed(1);
    t_tboReadout.value = tTarget.tbo.toFixed(1);
    t_osCrsReadout.value = tOS.crs.toFixed(1);
    t_tgtCrsReadout.value = tTarget.crs.toFixed(1);
    t_spdoReadout.value = tOS.spd.toFixed(2);
    t_spdtReadout.value = tTarget.spd.toFixed(2);
    t_aobReadout.value = tTarget.lla.toFixed(1);
    t_llaReadout.value = tOS.lla.toFixed(1);
    t_soaReadout.value = Math.abs(tOS.sa).toFixed(3);
    t_soiReadout.value = tOS.si.toFixed(3);
    t_staReadout.value = Math.abs(tTarget.sa).toFixed(3);
    t_stiReadout.value = tTarget.si.toFixed(3);
    t_sraReadout.value = calcTrialSra().toFixed(3);
    t_sriReadout.value = calcTrialSri().toFixed(3);
}

function calcTrialSra() {
    if (determineLeadLag(tTarget.brg, tOS, tTarget)) {
        return Math.abs(Math.abs(tOS.sa) - Math.abs(tTarget.sa));
    }
    return Math.abs(Math.abs(tOS.sa) + Math.abs(tTarget.sa));
}

function calcTrialSri() {
    return tOS.si + tTarget.si;
}

t_losReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (t_losReadout.value > 359.9) {
            t_losReadout.value = 0;
        }
        tTarget.brg = Number(t_losReadout.value);
        updateTrialReadout();
    }
})

t_osCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        tOS.crs = Number(t_osCrsReadout.value);
        updateTrialReadout();
    }
})

t_spdoReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        tOS.spd = Number(t_spdoReadout.value);
        updateTrialReadout();
    }
})

t_spdtReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        tTarget.spd = Number(t_spdtReadout.value);
        updateTrialReadout();
    }
})

t_tgtCrsReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        tTarget.crs = Number(t_tgtCrsReadout.value);
        updateTrialReadout();
    }
})

t_FrqrReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        t_FrqcReadout.value = calcFRQc(Number(t_FrqrReadout.value), Number(t_SsReadout.value), tOS);
        t_FrqoReadout.value = calcFRQo(Number(t_FrqcReadout.value), Number(t_SsReadout.value), tTarget);
        updateReadout();
    }
})

t_FrqoReadout2.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (!t_FrqrReadout2.value) return
        t_CrsReadout.value = calcCrsFromFo(Number(t_FrqrReadout2.value), Number(t_SsReadout.value), Number(t_FrqoReadout2.value))
    }
})

t_FrqrReadout2.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        t_CrsReadout.value = calcCrsFromFo(Number(t_FrqrReadout2.value), Number(t_SsReadout.value), Number(t_FrqoReadout2.value))
    }
})

t_exBrgReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        if (t_exBrgReadout.value > 359.9) t_exBrgReadout.value = 0;
    }
})

t_expRngReadout0.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        tTarget.exRng[0] = Number(t_expRngReadout0.value);
        t_expBrgRateReadout[0].value = calcExpectedBrgRate(tTarget.exRng[0], 0, tOS, tTarget, Number(t_exBrgReadout.value));
        t_expBrgXingReadout[0].value = calcExpectedBrgXing(0, tOS, tTarget, Number(t_exBrgReadout.value))
    }
})

t_expRngReadout1.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        tTarget.exRng[1] = Number(t_expRngReadout1.value);
        t_expBrgRateReadout[1].value = calcExpectedBrgRate(tTarget.exRng[1], 1, tOS, tTarget, Number(t_exBrgReadout.value));
        t_expBrgXingReadout[1].value = calcExpectedBrgXing(1, tOS, tTarget, Number(t_exBrgReadout.value))
    }
})

t_expRngReadout2.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        tTarget.exRng[2] = Number(t_expRngReadout2.value);
        t_expBrgRateReadout[2].value = calcExpectedBrgRate(tTarget.exRng[2], 2, tOS, tTarget, Number(t_exBrgReadout.value));
        t_expBrgXingReadout[2].value = calcExpectedBrgXing(2, tOS, tTarget, Number(t_exBrgReadout.value))
    }
})

t_spdTiReadout.addEventListener('keydown', e => {
    if (e.code == 'Enter' || e.code === 'Tab') {
        t_crsSpdTiReadout.value = calcCrsFromSPDti(Number(t_tboReadout.value), Number(t_spdTiReadout.value), Number(t_spdtReadout.value))
    }
})