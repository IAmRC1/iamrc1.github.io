!function(e){const t=anime.timeline({easing:"easeInOutCubic",duration:800,autoplay:!1}).add({targets:"#loader",opacity:0,duration:1e3,begin:function(e){window.scrollTo(0,0)}}).add({targets:"#preloader",opacity:0,complete:function(e){document.querySelector("#preloader").style.visibility="hidden",document.querySelector("#preloader").style.display="none"}}).add({targets:".s-header",translateY:[-100,0],opacity:[0,1]},"-=200").add({targets:".s-intro__bg",opacity:[0,1],duration:1e3}).add({targets:[".animate-on-load"],translateY:[100,0],opacity:[0,1],delay:anime.stagger(400)});document.querySelector("#preloader")&&(e.classList.add("ss-preload"),window.addEventListener("load",(function(){e.classList.remove("ss-preload"),e.classList.add("ss-loaded"),t.play()}))),function(){const e=document.querySelector(".s-header__menu-toggle"),t=document.querySelector(".s-header__nav-wrap"),s=document.querySelector("body");e&&t&&(e.addEventListener("click",(function(t){t.preventDefault(),e.classList.toggle("is-clicked"),s.classList.toggle("menu-is-open")})),t.querySelectorAll(".s-header__nav a").forEach((function(t){t.addEventListener("click",(function(t){window.matchMedia("(max-width: 900px)").matches&&(e.classList.toggle("is-clicked"),s.classList.toggle("menu-is-open"))}))})),window.addEventListener("resize",(function(){window.matchMedia("(min-width: 901px)").matches&&(s.classList.contains("menu-is-open")&&s.classList.remove("menu-is-open"),e.classList.contains("is-clicked")&&e.classList.remove("is-clicked"))})))}(),function(){const e=document.querySelector(".s-header");e&&window.addEventListener("scroll",(function(){window.scrollY>1?e.classList.add("sticky"):e.classList.remove("sticky")}))}(),function(){const e=document.querySelectorAll("[data-animate-block]");window.addEventListener("scroll",(function(){let t=window.pageYOffset;e.forEach((function(e){const s=window.innerHeight,i=e.offsetTop+.1*s-s,n=e.offsetHeight,a=t>i&&t<=i+n,o=e.classList.contains("ss-animated");a&&!o&&anime({targets:e.querySelectorAll("[data-animate-el]"),opacity:[0,1],translateY:[100,0],delay:anime.stagger(200,{start:200}),duration:600,easing:"easeInOutCubic",begin:function(t){e.classList.add("ss-animated")}})}))}))}(),function(){const e=document.querySelector(".ss-go-top");e&&(window.scrollY>=900&&e.classList.add("link-is-visible"),window.addEventListener("scroll",(function(){window.scrollY>=900?e.classList.contains("link-is-visible")||e.classList.add("link-is-visible"):e.classList.remove("link-is-visible")})))}()}(document.documentElement);