$(function(){
    // alert('d')
    $('.portfolio').click(function(){
        $('.menu').slideToggle()
    })

    $('#seohyeon').fullpage({
        anchors : ['page1','page2','page3','page4','page5','page6'], 
        
        afterLoad: function(anchorLink, index){
            if(index == 1){
        $('header nav').fadeOut(50);
          } else {
        $('header nav').fadeIn(50);
    }
}
    })
    $('.fixed img').mouseenter(function(){
        $('.fixed p').fadeIn(300);
    })
    $('.fixed img').mouseleave(function(){
        $('.fixed p').fadeOut(300);
    })
    $('.lang a').click(function(){
        $(this).addClass('on').siblings().removeClass('on')
    })
    document.querySelector('.go-page1').addEventListener('click', function (e) {
  e.preventDefault();
  window.location.href = window.location.pathname;
});

// project slide 
var swiper = new Swiper('.sh', {
  slidesPerView: 1.3,
  spaceBetween: 15,
  centeredSlides: true,
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

$('.buttons li').click(function () {
  let idx = $(this).index();

  $('.buttons li').removeClass('on');
  $(this).addClass('on');

  swiper.slideToLoop(idx); 
});

swiper.on('slideChange', function () {
  let idx = swiper.realIndex;

  $('.buttons li').removeClass('on');
  $('.buttons li').eq(idx).addClass('on');
});

// profile slide
profileswiper = new Swiper('.profile-swiper', {
  slidesPerView: 1.3,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  clickable: true,
});

$('.profile-buttons li').click(function () {
  let idx = $(this).index();

  $('.profile-buttons li').removeClass('on');
  $(this).addClass('on');

  profileswiper.slideToLoop(idx); 
});

profileswiper.on('slideChange', function () {
  let idx = profileswiper.realIndex;

  $('.profile-buttons li').removeClass('on');
  $('.profile-buttons li').eq(idx).addClass('on');
});
});
