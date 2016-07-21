/*
*
* mads - version 2.00.01
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var mads = function () {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* CT */
    if (typeof ct == 'undefined' && typeof rma != 'undefined') {
        this.ct = rma.ct;
    } else if (typeof ct != 'undefined') {
        this.ct = ct;
    } else {
        this.ct = [];
    }

    /* CTE */
    if (typeof cte == 'undefined' && typeof rma != 'undefined') {
        this.cte = rma.cte;
    } else if (typeof cte != 'undefined') {
        this.cte = cte;
    } else {
        this.cte = [];
    }

    /* tags */
    if (typeof tags == 'undefined' && typeof tags != 'undefined') {
        this.tags = this.tagsProcess(rma.tags);
    } else if (typeof tags != 'undefined') {
        this.tags = this.tagsProcess(tags);
    } else {
        this.tags = '';
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];
    /* each engagement type should be track for only once and also the first tracker only */
    this.trackedEngagementType = [];
    /* trackers which should not have engagement type */
    this.engagementTypeExlude = [];
    /* first engagement */
    this.firstEngagementTracked = false;

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';

    /* Solve {2} issues */
    for (var i = 0; i < this.custTracker.length; i++) {
        if (this.custTracker[i].indexOf('{2}') != -1) {
            this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
        }
    }
};

/* Generate unique ID */
mads.prototype.uniqId = function () {

    return new Date().getTime();
}

mads.prototype.tagsProcess = function (tags) {

    var tagsStr = '';

    for (var obj in tags) {
        if (tags.hasOwnProperty(obj)) {
            tagsStr += '&' + obj + '=' + tags[obj];
        }
    }

    return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {

    if (typeof url != "undefined" && url != "") {

        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        } else {
            window.open(url);
        }
    }
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {

    /*
    * name is used to make sure that particular tracker is tracked for only once
    * there might have the same type in different location, so it will need the name to differentiate them
    */
    name = name || type;

    if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');

            if (typeof value == 'undefined') {
                value = '';
            }

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{rmatype}}', type);
            src = src.replace('{{rmavalue}}', value);

            /* Insert TT's macro */
            if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
                src = src.replace('tt={{rmatt}}', '');
            } else {
                src = src.replace('{{rmatt}}', tt);
                this.trackedEngagementType.push(tt);
            }

            /* Append ty for first tracker only */
            if (!this.firstEngagementTracked && tt == 'E') {
                src = src + '&ty=E';
                this.firstEngagementTracked = true;
            }

            /* */
            img.src = src + this.tags + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}

var Ad = function () {
    var app = new mads();

    var alertSnack = function(text) {
        var x = app.contentTag.querySelector('#snackbar');

        x.className = 'show';

        x.innerText = text;

        setTimeout(function() {
            x.className = x.className.replace('show', '');
        }, 3000);
    }

    var tac = '<br/><br/><strong>One Nation Contest Rule</strong><br/><br/>· Contest ends July 28, 2016.<br/><br/>· Limit one entry per individual<br/><br/>· Complete the survey.<br/><br/>· No contribution is necessary.<br/><br/>See full terms & conditions below. NO PURCHASE, PAYMENT, OR FINANCIAL CONTRIBUTION OF ANY \KIND IS NECESSARY TO ENTER OR WIN THIS CONTEST. Making a contribution does not increase your chances or odds of winning.<br/><br/>Entrants agree to be bound by these Rules and by the decisions of the Sponsor, which are final and binding in all respects. To be eligible to win the prize, entries must be completed and received by the Sponsor as specified below. All applicable federal, state, and local laws and regulations apply.<br/><br/>The Promotion begins on July 13, 2016 at 12:00 p.m. Eastern Daylight Time and ends on July 28, 2016 at 11:59pm Eastern Daylight Time (“Entry Period”). All entries must be received by 11:59pm Eastern Daylight Time on Thursday, July 28, 2016.<br/><br/>One (1) winner will receive the following Prize: [Amazon gift card]. Odds of winning depend on the number of entries received. <br/><br/>This Promotion is open to citizens and permanent residents (green card holders) of Ohio who are at least 18 years of age or the age of majority as determined by state law. Prize may not be substituted or exchanged and is not redeemable for cash. All federal, state, and local taxes associated with the receipt or use of any prize awarded are the sole responsibility of the winner. <br/><br/>The winner of this promotion will be notified on or before September 1, 2016. Unless otherwise prohibited by applicable law, submitting an entry in this promotion constitutes the entrant’s permission to use his or her name, hometown, likeness, and/or prize information, without limitation, for promotional purposes without further permission or compensation. As a condition of being awarded any prize, unless otherwise prohibited by applicable law, the contest winner consents to the use of her name, hometown, likeness and/or prize information, without limitation, for promotional purposes without further permission or compensation. As a condition of being awarded a prize, the winner may be required to execute and deliver to Sponsor a signed affidavit of eligibility and acceptance of these Rules and release of liability, and any other legal, regulatory, or tax-related documents as required by the Sponsor.<br/><br/>By entering this promotion, you release the Sponsor and Sponsor’s directors, officers, employees, consultants and other representatives or agents from any liability whatsoever, and waive any and all causes of action related to any claims, costs, injuries, losses, or damages of any kind arising out of or in connection with the promotion or delivery, misdelivery, acceptance, possession, use or inability to use any prize (including, without limitation, claims, costs, injuries, losses, and damages related to personal injuries, death, damage to or destruction of property, rights of publicity or privacy, defamation or portrayal in a false light, whether intentional or unintentional), whether under a theory of contract, tort (including negligence), warranty or other theory. <br/><br/>The Sponsor is One Nation, Inc., 45 North Hill Drive, Suite 100, Warrenton, VA 20186.<br/><br/><br/>';

    app.contentTag.innerHTML = '<div id="raffle_content"> <div class="inner"><div id="title">Answer These Questions, Win A $500 Amazon Gift Card</div><br/> <div id="question1"> <div class="question">1. If the election for U.S. Senate were<br/> held today, who would you vote for?</div> <div id="choices1" class="radio"> <input type="radio" name="choice1" value="0" id="ted"> <label for="ted">Ted Strickland</label><br /> <input type="radio" name="choice1" value="1" id="rob"> <label for="rob">Rob Portman</label><br/> <input type="radio" name="choice1" value="2" id="und"> <label for="und">Undecided</label> </div> </div> <br/> <div id="question2"> <div class="question">2. Which ONE of the following issues is most important to you?</div> <div id="choices2" class="radio"> <input type="radio" name="choice2" value="0" id="national"> <label for="national">National Security</label><br /> <input type="radio" name="choice2" value="1" id="social"> <label for="social">Social Security</label><br/> <input type="radio" name="choice2" value="2" id="health"> <label for="health">Health Care</label><br/> <input type="radio" name="choice2" value="3" id="income"> <label for="income">Income Inequality</label> </div> </div></div> <div id="contest_tc" class="abs">Contest Terms & Conditions</div> <img id="next_btn" class="abs" src="' + app.path + 'img/btn_arrow.png"> <div id="tac" class="abs hide">' + tac + ' </div> <div id="scroll" class="abs hide"><img id="scroller" src="' + app.path + 'img/updown.png"><div id="up"></div><div id="down"></div></div> <img src="' + app.path + 'img/xbtn.png" id="close_tc" class="abs hide"> <div class="abs hide" id="mailer"><strong>Enter Your Email</strong><br/><br/><input type="text" placeholder="Email" /><button id="submit">SUBMIT</button></div> <div class="abs hide" id="thankyou"><strong>Thank you for<br/>submitting<br/>your email.</strong></div> <div id="snackbar"></div> </div> ';

    app.contentTag.querySelector('#raffle_content').style.background = 'url(' + app.path + 'img/bg.jpg)';

    var inner = app.contentTag.querySelector('.inner');
    var contest = app.contentTag.querySelector('#contest_tc');
    var next = app.contentTag.querySelector('#next_btn');
    var tace = app.contentTag.querySelector('#tac');
    var scroll = app.contentTag.querySelector('#scroll');
    var x = app.contentTag.querySelector('#close_tc');
    var mailer = app.contentTag.querySelector('#mailer');
    var thankyou = app.contentTag.querySelector('#thankyou');

    app.loadJs(app.path + 'js/zenscroll-min.js', function () {

        var dur = 500;
        var off = 30;
        var myscroll = zenscroll.createScroller(tace, dur, off);

        var down = app.contentTag.querySelector('#down');
        var up = app.contentTag.querySelector('#up');

        down.addEventListener('click', function () {
            myscroll.toY(tace.scrollTop + 200)
        }, false);
        up.addEventListener('click', function () {
            myscroll.toY(tace.scrollTop - 200)
        }, false);
    })

    app.contentTag.querySelector('#contest_tc').addEventListener('click', function () {
        inner.className += ' hide';
        contest.className += ' hide';
        next.className += ' hide';
        tace.className = tace.className.replace(' hide', '');
        scroll.className = scroll.className.replace(' hide', '');
        x.className = x.className.replace(' hide', '');
        app.tracker('E', 'termsconditions');
    }, false);

    app.contentTag.querySelector('#close_tc').addEventListener('click', function () {
        inner.className = inner.className.replace(' hide', '');
        contest.className = contest.className.replace(' hide', '')
        next.className = next.className.replace(' hide', '');
        tace.className += ' hide';
        scroll.className += ' hide';
        x.className += ' hide';
    }, false);

    var toAlert = [true, true];

    app.contentTag.querySelector('#next_btn').addEventListener('click', function () {
        if (!app.contentTag.querySelector('input[type=radio][name=choice1]:checked')) {
            toAlert[0] = true;
        } else {
            toAlert[0] = false;
            var values = ['Ted Strickland', 'Rob Portman', 'Undecided'];
            app.tracker('E', 'votewho_qn1', 'votewho_qn1', values[app.contentTag.querySelector('input[type=radio][name=choice1]:checked').value]);
        }

        if (!app.contentTag.querySelector('input[type=radio][name=choice2]:checked')) {
            toAlert[1] = true;
        } else {
            toAlert[1] = false;
            var values = ['National Security', 'Social Security', 'Health Care', 'Income Inequality'];
            app.tracker('E', 'imptissue_qn2', 'imptissue_qn2', values[app.contentTag.querySelector('input[type=radio][name=choice2]:checked').value]);
        }

        if (toAlert[0] || toAlert[1]) {
            alertSnack('Please select your answers.')
            return false;
        }

        inner.className += ' hide';
        contest.className += ' hide';
        next.className += ' hide';
        mailer.className = mailer.className.replace(' hide', '');
    }, false);


    app.contentTag.querySelector('#submit').addEventListener('click', function () {
        var emailFilter = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

        var email = mailer.querySelector('input').value;

        if (email !== '' && emailFilter.test(email)) {
            mailer.className += ' hide';
            thankyou.className = thankyou.className.replace(' hide', '');
            app.tracker('E', 'emailsubmit', 'emailsubmit', email);
            app.tracker('E', 'thankyou');
        } else {
            alertSnack('Please enter your valid email.')
        }
    }, false);

    app.loadCss(app.path + 'css/style.css');

} ();