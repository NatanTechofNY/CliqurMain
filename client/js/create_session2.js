if (Meteor.isClient) {


  Template.create_session2.events({
    'click .ses_toggle': function () {
      $( '.ses_sideBar' ).toggleClass( "ses_slide" );
      $( '.ses_close' ).toggleClass( "ses_rotate" );
      $( '.ses_toggle' ).toggleClass( "ses_hide" );
      $( '.ses_sideNav' ).toggleClass( "ses_fromTop" );
    },
    'click .ses_close': function () {
      $( '.ses_sideBar' ).toggleClass( "ses_slide" );
      $( '.ses_toggle' ).toggleClass( "ses_hide" );
      $( '.ses_close' ).toggleClass( "ses_rotate" );
      $( '.ses_sideNav' ).toggleClass( "ses_fromTop" );
    },
    'click .ses_custom-select-trigger': function (event) {
      $('html').one('click',function() {
        $(".ses_custom-select").removeClass("ses_opened");
      });
      $(event.currentTarget).parents(".ses_custom-select").toggleClass("ses_opened");
      event.stopPropagation();
    },
    'click .ses_custom-option': function(event) {
      $(event.currentTarget).parents(".ses_custom-select-wrapper").find("select").val($(event.currentTarget).data("value"));
      $(event.currentTarget).parents(".ses_custom-options").find(".ses_custom-option").removeClass("ses_selection");
      $(event.currentTarget).addClass("selection");
      $(event.currentTarget).parents(".ses_custom-select").removeClass("ses_opened");
      $(event.currentTarget).parents(".ses_custom-select").find(".ses_custom-select-trigger").text($(event.currentTarget).text());
    },
    'click .ses_jTablePageNext': function() {
      var list = $('.ses_pagination').find('li');
      $.each(list, function(position, element){
        if($(element).is('.ses_active')){
          $(list[position-1]).trigger('click');
        };
      });
    }
  });

  var $t_forprivcall = this;
  Template.create_session2.rendered = function () {
    (function () {
      var removeSuccess;
      removeSuccess = function () {
        return $('.ses_button').removeClass('ses_success');
      };
      $(document).ready(function () {
        return $('.ses_button').click(function () {
        $(this).addClass('ses_success');
          return setTimeout(removeSuccess, 3000);
        });
      });
    }.call($t_forprivcall));

    $(".ses_custom-select").each(function() {
      var classes = $(this).attr("class"),
        id      = $(this).attr("id"),
        name    = $(this).attr("name");
      var template =  '<div class="ses_' + classes + '">';
        template += '<span class="ses_custom-select-trigger">' + $(this).attr("placeholder") + '</span>';
        template += '<div class="ses_custom-options">';
        $(this).find("option").each(function() {
          template += '<span class="ses_custom-option ' + $(this).attr("class") + '" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</span>';
        });
      template += '</div></div>';

      $(this).wrap('<div class="ses_custom-select-wrapper"></div>');
      $(this).hide();
      $(this).after(template);
    });


    $(".ses_custom-option:first-of-type").hover(function() {
      $(this).parents(".ses_custom-options").addClass("option-hover");
    }, function() {
      $(this).parents(".ses_custom-options").removeClass("ses_option-hover");
    });

  };


};