'use strict';

$(function() {

    var currentIdx = 1,
        currentScore = 0,
        answers = {},
        currentAnswers = [],
        $allQuestions = $('.question'),
        questionN = $allQuestions.length - 1;

    $('.indicator__inner__current').text(String(currentIdx));
    $('.indicator__inner__max, .result__score__inner__max').text(String(questionN));

    $('.result__score__inner__current').text(String(currentScore));
    $('.result__score').css('height', $('.result__score').width());

    var updateColors = function() {
        var colorIdx = $($allQuestions.get(currentIdx - 1)).attr('rel'),
            allClasses = function(prefix) {
                return function() {
                    var ret = [];
                    for (var i = 1; i <= 10; ++i) { ret.push(prefix + String(i)); }
                    return ret.join(' ');
                };
            };

        $('.indicator').removeClass(allClasses('color-')).addClass('color-' + colorIdx);
        $('.next-button').removeClass(allClasses('background-color-')).addClass('background-color-' + colorIdx);
    };

    var isAnswered = function(idx) {
        return answers[idx] != null;
    };

    var answer = function(questionIdx, answerIdx) {
        if (currentAnswers.indexOf(answerIdx) >= 0) { return; }

        currentAnswers = currentAnswers.concat([answerIdx]).sort();

        var $question = $($allQuestions.get(questionIdx - 1)),
            ok = $question.find('.question__bottom__result__ok')
                          .attr('rel').replace(' ', '').split(',').sort();

        var end = function(win) {
            answers[questionIdx] = currentAnswers;
            $question.find('.question__bottom__answers').css('display', 'none');
            $question.find('.question__bottom__result').css('display', 'block');
            $question.find('.question__bottom__result__' + (win ? 'ok' : 'ko'))
                .css('display', 'block');

            currentAnswers = [];
            currentScore += win ? 1 : 0;
            $('.result__score__inner__current').text(String(currentScore));
            $('.result__text__ok').css('display', currentScore > questionN * 0.75 ? 'block' : 'none');
            $('.result__text__ko').css('display', currentScore > questionN * 0.75 ? 'none' : 'block');

            $('.next-button').removeClass('next-button--hidden');

            $question.find('x-gif').removeAttr('stopped');
        };

        if (ok.indexOf(answerIdx) < 0) {
            end(false);
        } else {
            if (_.isEqual(ok, currentAnswers)) {
                end(true);
            }
        }
    };

    $allQuestions.each(function() {
        var $this = $(this),
            colorIdx = Math.floor(Math.random() * 10) + 1,
            $answers = $this.find('.question__bottom__answers__answer'),
            answerHeight = 100 / Math.ceil($answers.length / 2),
            $title = $this.find('.question__top__title span');

        var resizeTitle = function() {
            var height = $title.height(),
                parentHeight = $title.parents('.question__top').innerHeight() - 75;

            if (height == null || parentHeight == null) { return; }

            if (height > parentHeight) {
                $title.css('font-size', function() {
                    return (parseInt($title.css('font-size')) - 4) + 'px';
                });
                resizeTitle();
            }
        };
        setTimeout(resizeTitle, 100);

        $this.attr('rel', colorIdx);
        $this.find('.question__top__title, .result__score')
             .addClass('background-color-' + String(colorIdx));
        $this.find('.question__top__text, .question__bottom__answers__answer, .result__more, .question__bottom')
             .addClass('border-color-' + String(colorIdx));
        $this.find('.question__bottom__answers__answer, .question__bottom__result__ok, .result__title, .result__tweet__link, .result__more a')
             .addClass('color-' + String(colorIdx));
        $this.find('.question__bottom__result__ok__title').addClass('underline-color-' + String(colorIdx));

        var toggleColors = function() {
            if (!$(this).hasClass('selected')) {
                $(this).css({
                    color : $(this).css('background-color'),
                    'background-color' : $(this).css('color')
                });
            }
        };

        $answers.css('height', String(answerHeight) + '%')
                .on('click', function() {
                    toggleColors.bind(this)();
                    $(this).addClass('selected');
                    answer(currentIdx, $(this).attr('rel'));
                })
                .on('mousedown', toggleColors).on('mouseup', toggleColors)
                .on('touchstart', toggleColors).on('touchend', toggleColors);
    });

    $('.next-button').on('click', function() { $.fn.fullpage.moveSectionDown(); });

    $('.result__tweet__link').on('click', function(event) {
        event.preventDefault();

        var url = encodeURIComponent(window.location !== window.parent.location ? document.referrer : document.location.href),
            baseText = $(this).attr('rel'),
            text = encodeURIComponent(baseText.replace('XX', 'J\'ai fait ' + String(currentScore) +
                                                             '/' + String($allQuestions.length - 1) +
                                                             ' au quiz de l\'été de @libe. Et vous ?')),
            link = 'https://twitter.com/intent/tweet?original_referer=' + '' + '&text=' + text + ' ' + url;

        window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
    });

    $('.expand-button').on('click', function() {
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement ) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            $(this).find('i').removeClass('fa-expand').addClass('fa-compress');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            $(this).find('i').removeClass('fa-compress').addClass('fa-expand');
        }
    });

    /*
    ** Time to launch everything !
    */
    $('#wrapper').fullpage({
        sectionSelector: '.question',
        onLeave: function(index, nextIndex, direction) {
            if (direction === 'up') { return false; }

            var ret = isAnswered(currentIdx);
            if (ret) {
                ++currentIdx;
                if (currentIdx < $allQuestions.length) {
                    updateColors();
                    $('.indicator__inner__current').text(String(currentIdx));
                }
                $('.next-button').addClass('next-button--hidden');
                $('.indicator').addClass(function() { return nextIndex === $allQuestions.length ? 'indicator--hidden' : ''; });
            }

            return ret;
        }
    });
    updateColors();
});
