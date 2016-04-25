/**
 * RUBY ELEMENTS JQUERY PLUGIN
 * @author          HaiBach
 * @version         1.0
 */

/**
 * LIST OF PLUGINS :
 *  + @plugin Menu
 *  + @plugin Backtop
 */

!function(n){"use strict";window.rm01VA||(window.rm01VA={codeName:"rubymenu",codeData:"options",namespace:"rm01"},rm01VA.optsDefault={isAutoInit:!0,isOffCanvas:!0,direction:"hor",textBack:null,widthOffCanvas:[0,767],html:{caret:'<span class="{ns}caret"></span>',toggle:'<a class="{ns}btn-toggle"><span></span><span></span><span></span></a>',back:'<li class="{ns}list {ns}listback"><a class="{ns}linkback"><span class="{ns}arrowback">&lsaquo;</span></a></li>'}}),n[rm01VA.codeName]=function(e,s){var a={codekey:Math.ceil(1e9*Math.random()),ev:n("<div/>"),ns:rm01VA.namespace},t={},r={},i=function(){l.mergeAllOpts(),l.init(),l.cssName(),o.addClasses(),c.addElements(),d.resize(),d.tapOpenCanvas(),d.tapOnLink()},o={addClasses:function(){var s=a.ns;e.addClass(s+"ready"),!r.dirsHor&&e.addClass(s+"drawer");var t=function(n,e,s){var t=n.find(o.ns(e));return t.length&&t.addClass(a.ns+s),t},i=t(e,"> .{ns}menu","menu-lv1"),l=t(i,"> li > .{ns}menu","menu-lv2"),c=t(l,"> li > .{ns}menu","menu-lv3"),d=(t(e,".{ns}menu > li","list"),t(i,"> li","list-lv1"),t(l,"> li","list-lv2"),t(c,"> li","list-lv3"),function(e,s){var t=e.find(o.ns("> .{ns}menu > li"));return t.each(function(){var e=n(this),t=e.find(o.ns(".{ns}menu"));t.length&&e.addClass(a.ns+s)}),t});a.$listParentLV1=d(e,"list-parent-lv1"),a.$listParentLV2=d(a.$listParentLV1,"list-parent-lv2")},ns:function(n){return n.replace(/\{ns\}/g,a.ns)},stringToObject:function(e){return"string"==typeof e&&(e=e.replace(/\u0027/g,'"'),e=n.parseJSON(e)),n.isPlainObject(e)?e:{}},camelCase:function(n){return n.replace(/-([a-z])/gi,function(n,e){return e.toUpperCase()})},properCase:function(n){return n.charAt(0).toUpperCase()+n.slice(1)},matchMedia:function(e,s){if(window.matchMedia){var a="(min-width: WMINpx) and (max-width: WMAXpx)".replace("WMIN",e).replace("WMAX",s);if(window.matchMedia(a).matches)return!0}else{var t=n(window).width();if(t>=e&&s>=t)return!0}return!1}},l={mergeAllOpts:function(){var a=e.data(rm01VA.codeData);a=o.stringToObject(a),t=n.extend(!0,t,rm01VA.optsDefault,s,a),e.removeAttr("data-"+rm01VA.codeData)},init:function(){r.dirsHor="hor"==t.direction,r.dirsHor||(r.drawer=!0)},cssName:function(){var n=function(n){var e=document.createElement("p").style,s="Webkit Moz ms O".split(" "),a="-webkit- -moz- -ms- -o-".split(" "),t=o.camelCase(n);if(void 0!=e[t])return"";for(var r=o.properCase(t),i=0,l=s.length;l>i;i++)if(void 0!=e[s[i]+r])return a[i];return""};a.prefix=n("animation-druation")},resize:function(){var s=(n(window).width(),t.widthOffCanvas),i=a.ns,l=i+t.direction,c=i+"offcanvas",d=i+"drawer",u=i+"hanger";r.offCanvasLast=r.offCanvas,r.offCanvas=t.isOffCanvas,r.offCanvas&&(r.offCanvas=o.matchMedia(s[0],s[1]));var m=l+(r.dirsHor?" "+u:""),p=c+(r.dirsHor?" "+d:""),v=r.offCanvas?p:m,h=r.offCanvas?m:p;e.addClass(v).removeClass(h);var g=a.ns+"show";r.offCanvas?a.$canvasToggle.addClass(g):a.$canvasToggle.removeClass(g),r.offCanvas?r.dirsHor&&(r.drawer=!0):(f.pushOff(),r.dirsHor&&(r.drawer=!1)),r.offCanvas!=r.offCanvasLast&&f.removeOpenAll()}},c={addElements:function(){a.$linkback=n();var s=e.find(o.ns("> .{ns}menu .{ns}menu"));s.each(function(){var e=n(this),s=e.siblings("a"),r=t.textBack;null==r&&(r=s.length?s.html():"");var i=n(o.ns(t.html.back)),l=i.find("a");l.html(l.html()+r),e.prepend(i),a.$linkback=a.$linkback.add(l)}),a.$linkToggle=e.find(o.ns(".{ns}menu .{ns}menu")).siblings("a"),a.$linkToggle.append(o.ns(t.html.caret)),a.$canvasToggle=n(o.ns(t.html.toggle)),e.before(a.$canvasToggle)}},d={resize:function(){var e="resize."+a.ns+a.codekey;n(window).off(e).on(e,function(){clearTimeout(a.tiResize),a.tiResize=setTimeout(function(){l.resize()},100)}),l.resize()},tapOpenCanvas:function(){var e=(n("html"),"click."+a.ns+a.codekey);a.$canvasToggle.on(e,function(){return r.push?(f.pushOff(),f.removeOpenAll()):f.pushOn(),!1})},tapOnLink:function(){var s=a.ns,t="click."+s+a.codekey;a.$linkToggle.on(t,function(){var e=n(this),a=e.closest(o.ns(".{ns}list")),t=s+"open";return a.length&&(r.drawer?!a.hasClass(t)&&u.drawer(e,"open"):u.hanger(e)),!1}),a.$linkback.on(t,function(){var e=n(this),s=e.closest(o.ns(".{ns}menu")).siblings("a");return u.drawer(s,"closed"),!1}),n("html").on(t,function(a){var t=n(a.target),i=t.closest("."+s);i.is(e)||r.offCanvas||r.dirsHor&&f.removeOpenAll()})}},u={hanger:function(n){var e=n.closest(o.ns(".{ns}list")),s=n.closest(o.ns(".{ns}menu")),t=n.siblings(o.ns(".{ns}menu")),r=a.ns,i=r+"open",l=r+"fx-open";if(e.hasClass(i))f.removeOpenAll(s);else{f.removeOpenAll(s),s.add(e).addClass(i),t.addClass(l);var c=1e3*parseFloat(t.css(a.prefix+"animation-duration"));clearTimeout(a.tiFxHanger),a.tiFxHanger=setTimeout(function(){t.removeClass(l)},c)}},drawer:function(n,e){var s=n.closest(o.ns(".{ns}list")),t=n.closest(o.ns(".{ns}menu")),r=a.ns,i=r+"open",l=function(){var l,c,d;"open"==e?(l=r+"fx-open",c=t,d=n.siblings(o.ns(".{ns}menu")).clone().addClass(a.ns+"ghost")):(l=r+"fx-closed",c=n.siblings(o.ns(".{ns}menu")),d=t.clone().removeClass(i).addClass(r+"ghost"),d.find(o.ns(".{ns}ghost")).remove(),d.find(o.ns(".{ns}open")).removeClass(r+"open")),c.after(d).add(d).addClass(l);var u=a.prefix+"animation-duration",f=parseFloat(c.css(u)),m=parseFloat(d.css(u));a.speedCur=f>m?f:m,a.speedCur*=1e3,clearTimeout(a.tiFxDrawer),a.tiFxDrawer=setTimeout(function(){t.add(s)["open"==e?"addClass":"removeClass"](i),c.removeClass(l),d.remove()},a.speedCur)};s.length&&l()}},f={pushOff:function(){n("html").add(e).add(a.$canvasToggle).removeClass(a.ns+"push"),r.push=!1},pushOn:function(){n("html").add(e).add(a.$canvasToggle).addClass(a.ns+"push"),r.push=!0},searchOpen:function(n,e){var s=n[e](o.ns(".{ns}open"));s.length&&s.removeClass(a.ns+"open")},removeOpenAll:function(n){n||(n=e),f.searchOpen(n,"find")},removeOpenCur:function(n){f.searchOpen(n,"closest")}};a=n.extend(a,f),n.data(e[0],rm01VA.codeName,a),i()},n.fn[rm01VA.codeName]=function(){var e=arguments,s=rm01VA.codeName,a=null;return n(this).each(function(){var t=n(this),r=t.data(s);void 0==e[0]&&(e[0]={}),n.isPlainObject(e[0])&&(r||new n[s](t,e[0]),a=t.data(s))}),a};var e=function(e){e.each(function(){n(this)[rm01VA.codeName]()})};n(document).ready(function(){e(n("."+rm01VA.namespace))})}(jQuery),function(n){var e,s,a="rb01",t=1e10*Math.random(),r='<a class="{ns}" alt="Top Page"><span class="{ns}first"></span><span class="{ns}last"></span></a>',i=300,o=a+"actived",l=function(){c(),d()},c=function(){var s=r.replace(/\{ns\}/g,a);n("body").append(s),e=n("."+a)},d=function(){var r="click."+a+t;e.on(r,function(e){return n("html, body").animate({scrollTop:0},i),!1});var l="scroll."+a+t,c=n(window),d=!1,u=function(){c.scrollTop()>300?d||(e.addClass(o),d=!0):d&&(e.removeClass(o),d=!1)};n(window).on(l,function(){clearTimeout(s),s=setTimeout(u,200)})};n(document).ready(function(){l()})}(jQuery);