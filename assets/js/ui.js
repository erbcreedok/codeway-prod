$(function () {
  // gallery
  $('.carousel').carousel();
  // gallery swipe
  $('.carousel').bcSwipe({threshold: 50});

  // custom select
  $('select').selectric();

  // masks
  if (landing.getPhoneMask()) {
    $('[name=phone]').mask(landing.getPhoneMask(), {autoclear: false});
  }

  // scrolled header
  highlightHeader();
  window.onscroll = function (e) {
    highlightHeader();
  };

  // smooth scrolling using jQuery easing
  $(
    'a.js-scroll-trigger[href*="#"]:not([href="#"]):not([href="#signup"])',
  ).click(function (e) {
    e.preventDefault();
    if (
      location.pathname.replace(/^\//, '') ==
      this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top - 56,
          }, 1000, 'easeInOutExpo',
        );
        return false;
      }
    }
  });
  // signup button
  $('a[href="#signup"]').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    var course = this.dataset.course;
    var signupDlg = $('.modal-signup');
    $('.modal-fcourse').modal('hide');
    signupDlg.find('input[name=course]').val(course);
    signupDlg.modal('show');
    $('body').addClass('modal-open');
  });

  // city selector
  $('#city').change(function (e) {
    window.location = $(this).val();
  });

  // faq accordeon
  $('.faq__item-title').on('click', function (e) {
    e.preventDefault();
    if ($(this).parents('.faq__item').hasClass('active')) {
      $(this).parents('.faq__item').removeClass('active');
    } else {
      $('.faq__item').removeClass('active');
      $(this).parents('.faq__item').addClass('active');
    }
  });

  // school toggler
  $('.school__selector').on('click', function (e) {
    $(this).toggleClass('active');
    $('.school__sections').toggleClass('active');
  });

  // footer email
  $('.footer__subscribe-form').on('submit', function (e) {
    e.preventDefault();
    var city = $('#city option:selected').text();
    var email = $('.footer__subscribe-form input[name=email]').val();
    if (!isEmail(email)) {
      return;
    }
    var submitBtn = $(this).find('button[type=submit]');
    submitBtn.prop('disabled', true);
    landing.subscribe(email, city,
      function (data) {
        showSuccess('Сейчас на ваш email придет письмо с подтверждением');
      },
      function (data) {
        showFail();
      },
      function () {
        submitBtn.prop('disabled', false);
      },
    );
  });

  // signup form
  $('.signup__form').on('submit', function (e) {
    e.preventDefault();
    // validation
    var that = $(this);
    var data = {
      name: that.find('input[name=name]').val(),
      phone: normalizePhone(that.find('input[name=phone]').val()),
      email: that.find('input[name=email]').val(),
      course: that.find('input[name=course]').val(),
    };
    var problems = false;

    if (!isName(data['name'])) {
      problems = true;
      that.find('input[name=name]').parents('.input-group').addClass('error');
    }

    if (!isPhoneComplete($(this).find('input[name=phone]').val())) {
      problems = true;
      that.find('input[name=phone]').parents('.input-group').addClass('error');
    }

    if (landing.isEmailRequired() && !isEmail(data['email'])) {
      problems = true;
      that.find('input[name=email]').parents('.input-group').addClass('error');
    }

    if (!problems) {
      var submitBtn = that.find('button[type=submit]');
      submitBtn.attr('disabled', true);
      landing.signup(data, showSuccess, showFail, function () {
        submitBtn.attr('disabled', null);
        $('.modal-signup').modal('hide');
      });
    }
  });

  // info form
  $('.info__form').on('submit', function (e) {
    e.preventDefault();
    $('.modal-info').modal('hide');
    $('.modal-thanks').modal('show');
    $('body').addClass('modal-open');
  });

  // thanks dialog
  $('.modal-thanks').click(function () {
    $(this).modal('hide');
  });

  function showSuccess(msg) {
    var thanks = $('.modal-thanks');
    msg && msg.length > 20
      ? thanks.addClass('small-text')
      : thanks.removeClass('small-text');
    thanks.removeClass('error');
    thanks.find('.modal__thanks-label:not(.error)').text(msg || 'Спасибо');
    thanks.modal('show');
    $('body').addClass('modal-open');
  }

  function showFail() {
    var thanks = $('.modal-thanks');
    thanks.addClass('small-text error');
    thanks.modal('show');
    $('body').addClass('modal-open');
  }

  (function initSignupFormFields() {
    function initField(field, fnValidate) {
      field.on('keyup', function (e) {
        if (fnValidate($(this).val())) {
          $(this).parents('.input-group').removeClass('error');
        }
      });
      field.on('focus', function (e) {
        $(this).parents('.input-group').addClass('active');
      });
      field.on('blur', function (e) {
        $(this).parents('.input-group').removeClass('active');
        if (fnValidate($(this).val())) {
          $(this).parents('.input-group').addClass('validated').removeClass('error');
        } else {
          $(this).parents('.input-group').addClass('error');
        }
      });
    }
    initField($('.signup__form input[name=name]'), isName);
    initField($('.signup__form input[name=phone]'), isPhoneComplete);
    initField($('.signup__form input[name=email]'), isEmail);
  })();

  function showRedirectDialog() {
    // city guess billet
    // overlay for mobile

    if ($(window).width() <= 980) {
      $('body').addClass('modal-open');
    }
    $('.city-billet').addClass('active');
  }

  (function initRedirectDialog() {
    var redirectData = landing.getRedirectData();
    $('.city-billet__close, .city-billet__button--no').on('click', function (e) {
      e.preventDefault();
      $('.city-billet').removeClass('active');
      $('body').removeClass('modal-open');
      $.post('/cancel-redirect?host=' + landing.getHost(), landing.getCsrf());
    });
    $('.city-billet__button--yes').on('click', function (e) {
      e.preventDefault();
      window.location = redirectData.url;
    });
    if (redirectData) {
      $('#redirect-city-name').text(redirectData.title);
      setTimeout(showRedirectDialog, 2000);
    }
  })();
  $(document).trigger('landing_init');
});

// changing header's colors
function highlightHeader() {
  if ($(window).scrollTop() >= 10) {
    $('.main-nav').addClass('scrolled');
  } else {
    $('.main-nav').removeClass('scrolled');
  }
}

function normalizePhone(phone, mask) {
  // TBD: actual normalization using mask
  phone = phone.replace('(+7)|8', '7'); // russian phone
  phone = phone.replace(/[ |()\-+]/g, '');
  return phone;
}

function isPhoneComplete(phone) {
  // Incomplete phone number has placeholder symbols
  phone = phone.replace(/[ |()\-+]/g, '');
  return /\d+$/.test(phone); // must contain only digits, mask sets length restriction
}

function isName(name) {
  var regex = /^([а-яА-Яa-zA-Z ()\-]{2,50})+$/;
  return regex.test(name);
}

function isEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
