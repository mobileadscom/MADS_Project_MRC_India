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

            if (i === 1) continue;

            var img = document.createElement('img');

            if (typeof value == 'undefined') {
                value = '';
            }

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{rmatype}}', type);
            src = src.replace('{{rmavalue}}', value);

            /* Insert TT's macro */
            // if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
            //     src = src.replace('tt={{rmatt}}', '');
            // } else {
            src = src.replace('{{rmatt}}', tt);
            this.trackedEngagementType.push(tt);
            // }

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

var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function () {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
}

var API_KEY = 'AIzaSyATXN5KlKRubdH643deD012vBIcZ6V1bRQ';

var renderAd = function (data) {
    var app = new mads();

    var score = 0;

    var dy = {
        'logo': app.path + 'img/logo.png',
        'title': 'Online <br/>Behavior Shopping',
        'questions': [
            {
                'question': '1. How often?',
                'answers': ['Answer 1', 'Answer 2'],
                'type': 'check'
            },
            {
                'question': '2. How often?',
                'answers': ['Answer 1', 'Answer 2'],
                'type': 'check'
            },
            {
                'question': '3. How often?',
                'answers': ['Answer 1', 'Answer 2'],
                'type': 'radio'
            }
        ]
    }

    dy = data;

    // dy.questions = [];

    // for (var i = 2; i < values.length; i++) {
    //     if (!values[i][1] && !values[i][2] && !values[i][3]) {
    //         continue;
    //     }
    //     var no = values[i][0].replace('Question ', '');
    //     var question = no + '. ' + values[i][1];
    //     var type = values[i][2];
    //     var answers = values[i][3];
    //     answers = answers.split(',');
    //     dy.questions.push({
    //         'question': question,
    //         'answers': answers,
    //         'type': type
    //     })
    // }

    var qa = [
        {
            'Q': '1. How often do you shop for products online?',
            'A': ['Not at all often', 'Slightly often', 'Very often', 'All the time'],
            'T': 'question_1',
            'long': true,
            'type': 'R'
        }, {
            'Q': '2. What is the most important thing you look for when buying online? (Select all that apply)',
            'A': ['Discounts', 'Latest Arrivals', 'Delivery Time', 'Premium brands', 'Ease of Buying'],
            'T': 'question_2',
            'type': 'C',
            'long': true
        }, {
            'Q': '3. What is your preferred medium for online shopping?',
            'A': ['Mobile Website', 'Mobile App', 'Desktop Website', 'Tablet'],
            'T': 'question_3',
            'long': true,
            'type': 'R'
        }, {
            'Q': '4. What types of products do you typically buy online? (Select all that apply)',
            'A': ['Clothes & Shoes', 'Electronic appliances', 'Books', 'Furniture', 'Groceries', 'Household items'],
            'T': 'question_4',
            'long': true,
            'type': 'C'
        }, {
            'Q': '5. Which online shopping website do you prefer the most?',
            'A': ['Flipkart', 'Snapdeal', 'Amazon', 'Paytm', 'Myntra', 'Others'],
            'T': 'question_5',
            'type': 'R',
            'long': true,
            'end': true
        }]


    // if (typeof this.custTracker !== 'undefined' && typeof this.custTracker[1] !== 'undefined') {
    //     dy = JSON.parse(this.custTracker[1]);
    //     qa = [];
    // } else {
    //     dy = [];
    // }

    qa = [];
    // dy = [];

    for (var i in dy.questions) {
        var q = dy.questions[i].question
        var a = dy.questions[i].answers
        var t = dy.questions[i].type === 'check' ? 'C' : 'R'

        var po = {
            'Q': q,
            'A': a,
            'T': 'question_' + parseInt(i) + 1,
            'type': t,
            'long': true
        }

        if (dy.questions.length == parseInt(i) + 1) {
            po.end = true;
        }

        qa.push(po);
    }

    var logo = dy.logo || app.path + 'img/logo.png';
    var title = dy.title || 'Online<br/>Shopping Behavior';

    var current = 0,
        pageq = [],
        results = [],
        content = '<div id="logo"><img src="' + logo + '" /></div><div id="heading"><span>' + title + '</span></div>';

    app.contentTag.innerHTML = '<div id="main" class="abs"><div id="header">' + content + '</div><div id="ad-content" class="abs"></div></div></div>';

    var main = document.getElementById('main'),
        content = document.getElementById('ad-content'),
        front = document.getElementById('front');

    var end = document.createElement('div');
    end.className = 'thankyou hide abs';
    end.innerText = 'Thank you for your response';

    var pager = document.createElement('div');
    pager.className = 'pager abs';
    pager.innerText = '1 out of ' + qa.length;
    content.appendChild(pager);

    var arrows = document.createElement('div');
    arrows.className = 'arrows hide abs';
    arrows.innerHTML = '<div id="back" class="left abs">Back</div><a href="http://www.pulseresearch.org/privacy" target="_blank">Privacy Policy</a><div id="next" class="right abs">Next</div>'
    content.appendChild(arrows);

    var left = document.querySelector('.left');
    var right = document.querySelector('.right');

    left.style.opacity = 0;
    right.style.opacity = 0.2;

    left.addEventListener('click', function (e) {
        if (this.getAttribute('enabled') == 'false') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        if (current <= 4) {
            arrows.childNodes[2].setAttribute('enabled', true);
            arrows.childNodes[2].innerText = 'Next';
            arrows.childNodes[2].style.right = 0;
        }

        pageq[current].className = 'questionaire hide' + (qa[current].long ? ' long' : '') + (qa[current].end ? ' end' : '');
        current -= 1;
        pageq[current].className = 'questionaire' + (qa[current].long ? ' long' : '') + (qa[current].end ? ' end' : '');
        setTimeout(function () {
            pageq[current].style.opacity = 1;
        }, 1)

        if (typeof results[current - 1] !== 'undefined') {
            arrows.childNodes[0].setAttribute('enabled', true);
            arrows.childNodes[0].style.opacity = 1;
        } else {
            arrows.childNodes[0].setAttribute('enabled', false);
            arrows.childNodes[0].style.opacity = 0.2;
        }

        if (typeof results[current] !== 'undefined') {
            arrows.childNodes[2].setAttribute('enabled', true);
            arrows.childNodes[2].style.opacity = 1;
        } else {
            arrows.childNodes[2].setAttribute('enabled', false);
            arrows.childNodes[2].style.opacity = 0.2;
        }

        for (var c in pageq[current].childNodes) {
            var s = pageq[current].childNodes[c]
            if (typeof s.className !== 'undefined') {
                s.className = s.className.replace('selected', '');
            }
        }

        if (typeof results[current] !== 'undefined') {
            var s = pageq[current].childNodes[qa[current].A.indexOf(results[current].A) + 1];
            s.className = s.className + ' selected';
        }

        if (current === 0) {
            left.style.opacity = 0;
        }

        pager.innerText = (current + 1) + ' out of ' + qa.length;
    }, false);

    right.addEventListener('click', function (e) {
        if (this.getAttribute('enabled') == 'false') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // On Submit All
        if (current === qa.length - 1) {
            pager.innerText = ''
            arrows.childNodes[2].setAttribute('enabled', false);
            arrows.childNodes[2].style.opacity = 0;
            arrows.childNodes[0].setAttribute('enabled', false);
            arrows.childNodes[0].style.opacity = 0;
            end.className = 'thankyou abs';

            for (var i in results) {
                app.tracker('E', results[i].T, results[i].T, results[i].A);
            }
        }

        if (current === qa.length - 2) {
            arrows.childNodes[2].setAttribute('enabled', true);
            arrows.childNodes[2].innerText = 'Submit';
            arrows.childNodes[2].style.right = '0';
        }

        pageq[current].className = 'questionaire hide' + (qa[current].long && typeof qa[current].long !== 'undefined' ? ' long' : '') + (qa[current].end ? ' end' : '');
        current += 1;

        if (typeof qa[current] === 'undefined') {
            return false;
        }

        pageq[current].className = 'questionaire' + (qa[current].long ? ' long' : '') + (qa[current].end ? ' end' : '');

        setTimeout(function () {
            pageq[current].style.opacity = 1;
        }, 1)

        if (typeof results[current - 1] !== 'undefined') {
            arrows.childNodes[0].setAttribute('enabled', true);
            arrows.childNodes[0].style.opacity = 1;
        } else {
            arrows.childNodes[0].setAttribute('enabled', false);
            arrows.childNodes[0].style.opacity = 0.2;
        }

        if (typeof results[current] !== 'undefined') {
            arrows.childNodes[2].setAttribute('enabled', true);
            arrows.childNodes[2].style.opacity = 1;
        } else {
            arrows.childNodes[2].setAttribute('enabled', false);
            arrows.childNodes[2].style.opacity = 0.2;
        }

        for (var c in pageq[current].childNodes) {
            var s = pageq[current].childNodes[c]
            if (typeof s.className !== 'undefined') {
                s.className = s.className.replace('selected', '');
            }
        }

        if (typeof results[current] !== 'undefined') {
            var s = pageq[current].childNodes[qa[current].A.indexOf(results[current].A) + 1];
            s.className = s.className + ' selected';
        }

        if (current === 0) {
            left.style.opacity = 1;
        }

        pager.innerText = (current + 1) + ' out of ' + qa.length;
    }, false);

    var getURLParameter = function (name, custom) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec((typeof custom !== 'undefined' ? custom : location.search)) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

    for (var i in qa) {
        var q = document.createElement('div');
        q.className = 'questionaire hide' + (qa[i].long ? ' long' : '') + (qa[i].end ? ' end' : '');
        q.id = 'question_' + i;
        q.setAttribute('data-index', i);
        q.setAttribute('data-tracker_type', qa[i].T);
        q.setAttribute('data-correct', false);
        q.innerHTML = '<div class="question q' + i + '">' + qa[i].Q + '</div>';

        var type = qa[i].type;

        for (var a in qa[i].A) {
            if (type === 'R') {
                var answer = document.createElement('div');
                var input = document.createElement('input');
                var label = document.createElement('label');
                input.type = 'radio';
                input.name = 'answertoq' + i;
                input.id = 'answer' + i + a;
                input.value = qa[i].A[a];
                label.setAttribute('for', input.id);
                label.className = 'label';
                label.innerText = qa[i].A[a].trim();
                answer.className = 'answer q' + i + ' a' + a
                answer.appendChild(input);
                answer.appendChild(label);
                q.appendChild(answer);
            } else if (type === 'C') {
                var answer = document.createElement('div');
                var input = document.createElement('input');
                var label = document.createElement('label');
                input.type = 'checkbox';
                input.name = 'answertoq' + i;
                input.id = 'answer' + i + a;
                input.value = qa[i].A[a];
                label.setAttribute('for', input.id);
                label.className = 'label';
                label.innerText = qa[i].A[a].trim();
                answer.className = 'answer checkboxes q' + i + ' a' + a
                answer.appendChild(input);
                answer.appendChild(label);
                q.appendChild(answer);
            }

            answer.onclick = function (e) {
                var isCheckbox = false;
                var isLastQuestion = false;
                var _this = this;

                if (current === qa.length - 1) {
                    arrows.childNodes[2].setAttribute('enabled', true);
                    arrows.childNodes[2].innerText = 'Submit';
                    arrows.childNodes[2].style.right = '0';
                }

                if (this.getAttribute('disabled') === 'disabled') {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                this.setAttribute('disabled', 'disabled');
                if (this.querySelector('input[type="checkbox"]'))
                    this.querySelector('input[type="checkbox"]').checked = !this.querySelector('input[type="checkbox"]').checked;

                if (this.querySelector('input[type="radio"]'))
                    this.querySelector('input[type="radio"]').checked = true;
                // this.parentElement.querySelector('input').check = !this.parentElement.querySelector('input').check; 

                if (current === qa.length - 1) {
                    isLastQuestion = true;
                    arrows.childNodes[2].setAttribute('enabled', true);
                    arrows.childNodes[2].style.opacity = 1;
                    arrows.childNodes[2].innerText = 'Submit';
                    arrows.childNodes[2].style.right = '0';

                    if (results.map(function (e) {
                        return e.Q
                    }).indexOf(this.parentElement.childNodes[0].innerText) === -1) {
                        results.push({
                            'Q': this.parentElement.childNodes[0].innerText,
                            'A': this.querySelector('label').innerText,
                            'T': this.parentElement.getAttribute('data-tracker_type')
                        })
                    } else {
                        results[this.parentElement.getAttribute('data-index')] = {
                            'Q': this.parentElement.childNodes[0].innerText,
                            'A': this.querySelector('label').innerText,
                            'T': this.parentElement.getAttribute('data-tracker_type')
                        }
                    }
                }

                if (this.className.indexOf('checkboxes') > -1) {
                    isCheckbox = true;
                    arrows.childNodes[2].setAttribute('enabled', true);
                    arrows.childNodes[2].style.opacity = 0.2;
                    arrows.childNodes[2].className += ' check';

                    if (this.parentElement.querySelectorAll('[type="checkbox"]:checked').length === 0) {
                        arrows.childNodes[2].setAttribute('enabled', false);
                        arrows.childNodes[2].style.opacity = 0.2;
                    } else {
                        arrows.childNodes[2].style.opacity = 1;
                    }

                    var checks = '';

                    var elems = this.parentElement.querySelectorAll('[type="checkbox"]:checked');

                    for (var i in elems) {
                        if (typeof elems[i].value !== 'undefined') {
                            checks += elems[i].value + ',';
                        }
                    }

                    checks = checks.substring(0, checks.length - 1);

                    if (results.map(function (e) {
                        return e.Q
                    }).indexOf(this.parentElement.childNodes[0].innerText) === -1) {
                        results.push({
                            'Q': this.parentElement.childNodes[0].innerText,
                            'A': checks,
                            'T': this.parentElement.getAttribute('data-tracker_type')
                        })
                    } else {
                        results[this.parentElement.getAttribute('data-index')] = {
                            'Q': this.parentElement.childNodes[0].innerText,
                            'A': checks,
                            'T': this.parentElement.getAttribute('data-tracker_type')
                        }
                    }
                }

                // e.target.className.indexOf('label') === -1 &&

                if (!isCheckbox && !isLastQuestion) {
                    if (e.target.className.indexOf('selected') > -1 || this.className.indexOf('selected') > -1) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }

                    if (results.map(function (e) {
                        return e.Q
                    }).indexOf(this.parentElement.childNodes[0].innerText) === -1) {
                        results.push({
                            'Q': this.parentElement.childNodes[0].innerText,
                            'A': this.querySelector('label').innerText,
                            'T': this.parentElement.getAttribute('data-tracker_type')
                        })
                    } else {
                        results[this.parentElement.getAttribute('data-index')] = {
                            'Q': this.parentElement.childNodes[0].innerText,
                            'A': this.querySelector('label').innerText,
                            'T': this.parentElement.getAttribute('data-tracker_type')
                        }
                    }

                    if (typeof results[current] !== 'undefined') {
                        arrows.childNodes[0].setAttribute('enabled', true);
                    } else {
                        arrows.childNodes[0].setAttribute('enabled', false);
                    }

                    if (typeof results[current + 1] !== 'undefined') {
                        arrows.childNodes[2].setAttribute('enabled', true);
                    } else {
                        arrows.childNodes[2].setAttribute('enabled', false);
                    }

                    this.parentElement.className = 'questionaire hide' + (qa[current].long ? ' long' : '') + (qa[current].end ? ' end' : '');
                    current = (current != pageq.length - 1) ? current + 1 : 'end';

                    if (current !== 'end') {
                        left.style.opacity = 1;
                        pageq[current].className = 'questionaire' + (qa[current].long ? ' long' : '') + (qa[current].end ? ' end' : '');
                        setTimeout(function () {
                            pageq[current].style.opacity = 1;
                        }, 1)
                        pager.innerText = (current + 1) + ' out of ' + qa.length;
                        if (qa[current].type === 'C') {
                            arrows.childNodes[2].style.opacity = 1;
                        }
                        // app.tracker('E', this.parentElement.getAttribute('data-tracker_type'));
                    } else {
                        pager.innerText = ''
                        arrows.childNodes[2].setAttribute('enabled', false);
                        arrows.childNodes[2].style.opacity = 0;
                        arrows.childNodes[0].setAttribute('enabled', false);
                        arrows.childNodes[0].style.opacity = 0;
                        end.className = 'thankyou abs';


                        // app.tracker('E', this.parentElement.getAttribute('data-tracker_type'));
                    }
                }


                setTimeout(function () {
                    _this.removeAttribute('disabled');
                }, 500);
            };


        }

        pageq.push(q);
        content.appendChild(q);

        if (qa[i].end) {
            var last = document.createElement('div');
            last.className = 'answer last';
            last.innerText = 'Last Question'
            q.appendChild(last);
            content.appendChild(end);
        }
    }


    main.style.background = '#000';

    var onceMain = true;

    //main.addEventListener('click', function() { For Main Click
    (function () {
        if (onceMain) {
            pageq[0].className = 'questionaire';
            arrows.className = 'arrows abs';
            arrows.childNodes[0].setAttribute('enabled', false);
            arrows.childNodes[2].setAttribute('enabled', false);
            setTimeout(function () {
                pageq[0].style.opacity = 1;
                arrows.style.opacity = 1;
            }, 1)
            onceMain = false;
        }
    })()
    // }, false); For Main Click

    app.loadCss(app.path + 'css/style.css');
};

var dapp = function () {
    var app = new mads();
    var jsonLink = null;

    if (typeof app.custTracker !== 'undefined' && app.custTracker.length === 2) {
        jsonLink = app.custTracker[1];
    }

    getJSON(jsonLink || 'https://cdn.rawgit.com/sevensilvers/0ad785494aefcd73cc19671540fc9e24/raw/8d16737b4c1e6f0a07c95fd2ebf96cbf08860b5a/pb.mb-v1.json',
        function (err, data) {
            var ad = renderAd(data);
        });
} ();




