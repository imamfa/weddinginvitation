<script>
  document.addEventListener("DOMContentLoaded", function() {
    const playButton = document.getElementById("playMusic");
    playButton.addEventListener("click", () => {
      document.getElementById("bgm").play();
    });
  });
</script>

jQuery(document).ready(function ($) {
  $(this).find(':submit').removeAttr("disabled");
  CUI = {
    ajaxurl: CUI_WP.ajaxurl,
    nonce: CUI_WP.cuiNonce,
    textCounter: CUI_WP.textCounter,
    textCounterNum: (CUI_WP.textCounterNum !== '') ? CUI_WP.textCounterNum : 300,
    jpages: CUI_WP.jpages,
    numPerPage: (CUI_WP.jPagesNum !== '') ? CUI_WP.jPagesNum : 10,
    widthWrap: (CUI_WP.widthWrap !== '') ? CUI_WP.widthWrap : '',
    autoLoad: CUI_WP.autoLoad,
    thanksComment: CUI_WP.thanksComment,
    thanksReplyComment: CUI_WP.thanksReplyComment,
    duplicateComment: CUI_WP.duplicateComment,
    insertImage: CUI_WP.insertImage,
    insertVideo: CUI_WP.insertVideo,
    insertLink: CUI_WP.insertLink,
    accept: CUI_WP.accept,
    cancel: CUI_WP.cancel,
    reply: CUI_WP.reply,
    checkVideo: CUI_WP.checkVideo,
    textWriteComment: CUI_WP.textWriteComment,
    classPopularComment: CUI_WP.classPopularComment,
  };

  // =============================
// Open Invitation Modal Handler
// =============================
jQuery(document).ready(function($) {
  // 1) Set background sampul
  var sampulbg = $('.modalx').data('sampul');
  $('.modalx').css('background-image',
    'url(' + sampulbg + ') !important'
  );
  // 2) Kunci scroll halaman sampai tombol diklik
  $('body').css('overflow', 'hidden');
  // 3) Pasang listener tombol Open Invitation
  $('#wdp-button-wrapper button').on('click', function() {
    $('.modalx').addClass('removeModals');
    $('body').css('overflow', 'auto');
  });
});


  //Remove duplicate comment box
  jQuery('.cui-wrap-comments').each(function (index, element) {
    var ids = jQuery('[id=\'' + this.id + '\']');
    if (ids.length > 1) {
      ids.slice(1).closest('.cui-wrapper').remove();
    }
  });

  //Remove id from input hidden comment_parent and comment_post_ID. Para prevenir duplicados
  jQuery('.cui-container-form [name="comment_parent"], .cui-container-form [name="comment_post_ID"]').each(function (index, input) {
    $(input).removeAttr('id');
  });


  // Textarea Counter Plugin
  // if (typeof jQuery.fn.textareaCount == 'function' && CUI.textCounter == 'true') {
  //   $('.cui-textarea').each(function () {
  //     var textCount = {
  //       'maxCharacterSize': CUI.textCounterNum,
  //       'originalStyle': 'cui-counter-info',
  //       'warningStyle': 'cui-counter-warn',
  //       'warningNumber': 20,
  //       'displayFormat': '#left'
  //     };
  //     $(this).textareaCount(textCount);
  //   });
  // }

  // PlaceHolder Plugin
  if (typeof jQuery.fn.placeholder == 'function') {
    $('.cui-wrap-form input, .cui-wrap-form textarea, #cui-modal input, #cui-modal textarea').placeholder();
  }
  // Autosize Plugin
  if (typeof autosize == 'function') {
    autosize($('textarea.cui-textarea'));
  }

  //Actualizamos alturas de los videos
  $('.cui-wrapper').each(function () {
    rezizeBoxComments_CUI($(this));
    restoreIframeHeight($(this));
  });
  $(window).resize(function () {
    $('.cui-wrapper').each(function () {
      rezizeBoxComments_CUI($(this));
      restoreIframeHeight($(this));
    });
  });

  // CAPTCHA
  if ($('.cui-captcha').length) {
    captchaValues = captcha_CUI(9);
    $('.cui-captcha-text').html(captchaValues.n1 + ' &#43; ' + captchaValues.n2 + ' = ');
  }

  // OBTENER COMENTARIOS

  $(document).delegate('a.cui-link', 'click', function (e) {
    e.preventDefault();
    var linkVars = getUrlVars_CUI($(this).attr('href'));
    var post_id = linkVars.post_id;
    var num_comments = linkVars.comments;
    var num_get_comments = linkVars.get;
    var order_comments = linkVars.order;
    $("#cui-wrap-commnent-" + post_id).slideToggle(200);
    var $container_comment = $('#cui-container-comment-' + post_id);
    if ($container_comment.length && $container_comment.html().length === 0) {
      getComments_CUI(post_id, num_comments, num_get_comments, order_comments);
    }
    return false;
  });
  // CARGAR COMENTARIOS AUTOMÁTICAMENTE

  if ($('a.cui-link').length) {
    $('a.cui-link.auto-load-true').each(function () {
      $(this).click();
    });
  }

  //Mostrar - Ocultar Enlaces de Responder, Editar
  // $(document).delegate('li.cui-item-comment', 'mouseover mouseout', function (event) {
  //   event.stopPropagation();
  //   if (event.type === 'mouseover') {
  //     $(this).find('.cui-comment-actions:first').show();
  //   } else {
  //     $(this).find('.cui-comment-actions').hide();
  //   }
  // });

  //Cancelar acciones
  $(document).find('.cui-container-form').keyup(function (tecla) {
    post_id = $(this).find('form').attr('id').replace('commentform-', '');
    if (tecla.which == 27) {
      cancelCommentAction_CUI(post_id);
    }
  });

  //Mostrar - Ocultar Enlaces de Responder, Editar
  $(document).delegate('input.cui-cancel-btn', 'click', function (event) {
    event.stopPropagation();
    post_id = $(this).closest('form').attr('id').replace('commentform-', '');
    cancelCommentAction_CUI(post_id);
  });

  // RESPONDER COMENTARIOS
  $(document).delegate('.cui-reply-link', 'click', function (e) {
    e.preventDefault();
    var linkVars = getUrlVars_CUI($(this).attr('href'));
    var comment_id = linkVars.comment_id;
    var post_id = linkVars.post_id;
    //Restauramos cualquier acción
    cancelCommentAction_CUI(post_id);
    var form = $('#commentform-' + post_id);
    form.find('[name="comment_parent"]').val(comment_id);//input oculto con referencia al padre
    form.find('.cui-textarea').val('').attr('placeholder', CUI_WP.reply + '. ESC (' + CUI_WP.cancel + ')').focus();
    form.find('input[name="submit"]').addClass('cui-reply-action');
    $('#commentform-' + post_id).find('input.cui-cancel-btn').show();
    //scroll
    scrollThis_CUI(form);

    return false;
  });

  //EDITAR COMENTARIOS
  $(document).delegate('.cui-edit-link', 'click', function (e) {
    e.preventDefault();
    var linkVars = getUrlVars_CUI($(this).attr('href'));
    var comment_id = linkVars.comment_id;
    var post_id = linkVars.post_id;
    //Restauramos cualquier acción
    cancelCommentAction_CUI(post_id);
    var form = $('#commentform-' + post_id);
    form.find('[name="comment_parent"]').val(comment_id);//input oculto con referencia al padre
    form.find('.cui-textarea').val('').focus();
    form.find('input[name="submit"]').addClass('cui-edit-action');
    //scroll
    scrollThis_CUI(form);
    getCommentText_CUI(post_id, comment_id);
  });

  //ELIMINAR COMENTARIOS
  $(document).delegate('.cui-delete-link', 'click', function (e) {
    e.preventDefault();
    var linkVars = getUrlVars_CUI($(this).attr('href'));
    var comment_id = linkVars.comment_id;
    var post_id = linkVars.post_id;
    if (confirm(CUI_WP.textMsgDeleteComment)) {
      deleteComment_CUI(post_id, comment_id);
    }
  });

  $('input, textarea').focus(function (event) {
    $(this).removeClass('cui-error');
    $(this).siblings('.cui-error-info').hide();
  });

  // ENVIAR COMENTARIO
  $(document).on('submit', '.cui-container-form form', function (event) {
    event.preventDefault();
    $(this).find(':submit').attr("disabled", "disabled");
    $('input, textarea').removeClass('cui-error');
    var formID = $(this).attr('id');
    var post_id = formID.replace('commentform-', '');
    var form = $('#commentform-' + post_id);
    var link_show_comments = $('#cui-link-' + post_id);
    var num_comments = link_show_comments.attr('href').split('=')[2];
    var form_ok = true;

    // VALIDAR COMENTARIO
    var $content = form.find('textarea').val().replace(/\s+/g, ' ');
    //Si el comentario tiene menos de 2 caracteres no se enviará
    if ($content.length < 2) {
      form.find('.cui-textarea').addClass('cui-error');
      form.find('.cui-error-info-text').show();
      setTimeout(function () {
        form.find('.cui-error-info-text').fadeOut(500);
      }, 2500);
      $(this).find(':submit').removeAttr('disabled');
      return false;
    }
    else {
      // VALIDAR CAMPOS DE TEXTO
      if ($(this).find('input#author').length) {
        var $author = $(this).find('input#author');
        var $authorVal = $author.val().replace(/\s+/g, ' ');
        var $authorRegEx = /^[^?%$=\/]{1,30}$/i;

        if ($authorVal == ' ' || !$authorRegEx.test($authorVal)) {
          $author.addClass('cui-error');
          form.find('.cui-error-info-name').show();
          setTimeout(function () {
            form.find('.cui-error-info-name').fadeOut(500);
          }, 3000);
          form_ok = false;
        }
      }
      if ($(this).find('input#email').length) {
        var $emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
        var $email = $(this).find('input#email');
        var $emailVal = $email.val().replace(/\s+/g, '');
        $email.val($emailVal);

        if (!$emailRegEx.test($emailVal)) {
          $email.addClass('cui-error');
          form.find('.cui-error-info-email').show();
          setTimeout(function () {
            form.find('.cui-error-info-email').fadeOut(500);
          }, 3000);
          form_ok = false;
        }
      }
      if (!form_ok) {
        $(this).find(':submit').removeAttr('disabled');
        return false;
      }

      // VALIDAR CAPTCHA
      if ($('.cui-captcha').length) {
        var captcha = $('#cui-captcha-value-' + post_id);
        form_ok = true;
        if (captcha.val() != (captchaValues.n1 + captchaValues.n2)) {
          form_ok = false;
          captcha.addClass('cui-error');
        }
        captchaValues = captcha_CUI(9);
        $('.cui-captcha-text').html(captchaValues.n1 + ' &#43; ' + captchaValues.n2 + ' = ');
        captcha.val('');
      }

      //Si el formulario está validado
      if (form_ok === true) {
        //Si no existe campo lo creamos
        if (!form.find('input[name="comment_press"]').length) {
          form.find('input[name="submit"]').after('<input type="hidden" name="comment_press" value="true">');
        }
        comment_id = form.find('[name="comment_parent"]').val();
        //Insertamos un nuevo comentario
        if (form.find('input[name="submit"]').hasClass('cui-edit-action')) {
          editComment_CUI(post_id, comment_id);
        }
        else if (form.find('input[name="submit"]').hasClass('cui-reply-action')) {
          insertCommentReply_CUI(post_id, comment_id, num_comments);
        }
        else {
          insertComment_CUI(post_id, num_comments);
        }
        cancelCommentAction_CUI(post_id);
      }
      $(this).find(':submit').removeAttr('disabled');
    }
    return false;
  });//end submit

  function getComments_CUI(post_id, num_comments, num_get_comments, order_comments) {
    var status = $('#cui-comment-status-' + post_id);
    var $container_comments = $("ul#cui-container-comment-" + post_id);
    if (num_comments > 0) {
      jQuery.ajax({
        type: "POST",
        dataType: "html",// tipo de información que se espera de respuesta
        url: CUI.ajaxurl,
        data: {
          action: 'get_comments',
          post_id: post_id,
          get: num_get_comments,
          order: order_comments,
          nonce: CUI.nonce
        },
        beforeSend: function () {
          status.addClass('cui-loading').html('<span class="cuio-loading"></span>').show();
        },
        success: function (data) {
          status.removeClass('cui-loading').html('').hide();
          $container_comments.html(data);
          highlightPopularComments_CUI(post_id, $container_comments);
          $container_comments.show();//Mostramos los Comentarios
          //Insertamos Paginación de Comentarios
          jPages_CUI(post_id, CUI.numPerPage);
          toggleMoreComments($container_comments);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          clog('ajax error');
          clog('jqXHR');
          clog(jqXHR);
          clog('errorThrown');
          clog(errorThrown);
        },
        complete: function (jqXHR, textStatus) {
        }
      });//end jQuery.ajax
    }//end if
    return false;
  }//end function


  function highlightPopularComments_CUI(post_id, $container_comments) {
    var order = $container_comments.data('order');
    if (order == 'likes' && $container_comments.hasClass('cui-multiple-comments cui-has-likes')) {
      var top_likes = $container_comments.find('>.cui-item-comment').eq(0).data('likes');
      var temp = false;
      $container_comments.find('>.cui-item-comment').each(function (index, comment) {
        if (!temp && $(comment).data('likes') == top_likes) {
          $(comment).addClass(CUI.classPopularComment);
          temp = true;
        }
      });
    }
  }

  function jQFormSerializeArrToJson(formSerializeArr) {
    var jsonObj = {};
    jQuery.map(formSerializeArr, function (n, i) {
      jsonObj[n.name] = n.value;
    });

    return jsonObj;
  }

  function insertComment_CUI(post_id, num_comments) {
    var link_show_comments = $('#cui-link-' + post_id);
    var comment_form = $('#commentform-' + post_id);
    var status = $('#cui-comment-status-' + post_id);
    var form_data = comment_form.serialize();//obtenemos los datos

    $.ajax({
      type: 'post',
      method: 'post',
      url: comment_form.attr('action'),
      data: form_data,
      dataType: "html",
      beforeSend: function () {
        status.addClass('cui-loading').html('<span class="cuio-loading"></span>').show();
      },
      success: function (data, textStatus) {
        cc('success data', data)
        status.removeClass('cui-loading').html('');
        if (data != "error") {
          status.html('<p class="cui-ajax-success">' + CUI.thanksComment + '</p>');
          if (link_show_comments.find('span').length) {
            num_comments = String(parseInt(num_comments, 10) + 1);
            link_show_comments.find('span').html(num_comments);
          }
        }
        else {
          status.html('<p class="cui-ajax-error">Error processing your form</p>');
        }
        //Agregamos el nuevo comentario a la lista
        $('ul#cui-container-comment-' + post_id).prepend(data).show();
        //Actualizamos el Paginador
        jPages_CUI(post_id, CUI.numPerPage, true);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        status.removeClass('cui-loading').html('<p class="cui-ajax-error" >' + CUI.duplicateComment + '</p>');
      },
      complete: function (jqXHR, textStatus) {
        setTimeout(function () {
          status.removeClass('cui-loading').fadeOut(600);
        }, 2500);
      }
    });//end ajax
    return false;
  }

  function insertCommentReply_CUI(post_id, comment_id, num_comments) {
    var link_show_comments = $('#cui-link-' + post_id);
    var comment_form = $('#commentform-' + post_id);
    var status = $('#cui-comment-status-' + post_id);
    var item_comment = $('#cui-item-comment-' + comment_id);
    var form_data = comment_form.serialize();//obtenemos los datos

    $.ajax({
      type: 'post',
      method: 'post',
      url: comment_form.attr('action'),
      data: form_data,
      beforeSend: function () {
        status.addClass('cui-loading').html('<span class="cuio-loading"></span>').show();
      },
      success: function (data, textStatus) {
        cc('success data', data)
        status.removeClass('cui-loading').html('');
        if (data != "error") {
          status.html('<p class="cui-ajax-success">' + CUI.thanksReplyComment + '</p>');
          if (link_show_comments.find('span').length) {
            num_comments = parseInt(num_comments, 10) + 1;
            link_show_comments.find('span').html(num_comments);
          }
          if (!item_comment.find('ul').length) {
            item_comment.append('<ul class="children"></ul>');
          }
          //Agregamos el nuevo comentario a la lista
          item_comment.find('ul').append(data);

          //scroll
          setTimeout(function () {
            scrollThis_CUI(item_comment.find('ul li').last());
          }, 1000);
        }
        else {
          status.html('<p class="cui-ajax-error">Error in processing your form.</p>');
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        status.html('<p class="cui-ajax-error" >' + CUI.duplicateComment + '</p>');
      },
      complete: function (jqXHR, textStatus) {
        setTimeout(function () {
          status.removeClass('cui-loading').fadeOut(600);
        }, 2500);
      }
    });//end ajax
    return false;

  }

  function editComment_CUI(post_id, comment_id) {
    var form = $("#commentform-" + post_id);
    var status = $('#cui-comment-status-' + post_id);
    jQuery.ajax({
      type: "POST",
      //dataType: "html",
      url: CUI.ajaxurl,
      data: {
        action: 'edit_comment_cui',
        post_id: post_id,
        comment_id: comment_id,
        comment_content: form.find('.cui-textarea').val(),
        nonce: CUI.nonce
      },
      beforeSend: function () {
        status.addClass('cui-loading').html('<span class="cuio-loading"></span>').show();
      },
      success: function (result) {
        status.removeClass('cui-loading').html('');
        var data = jQuery.parseJSON(result);
        if (data.ok === true) {
          $('#cui-comment-' + comment_id).find('.cui-comment-text').html(data.comment_text);
          //scroll
          setTimeout(function () {
            scrollThis_CUI($('#cui-comment-' + comment_id));
          }, 1000);
        }
        else {
          console.log("Errors: " + data.error);
        }
      },//end success
      complete: function (jqXHR, textStatus) {
        setTimeout(function () {
          status.removeClass('cui-loading').fadeOut(600);
        }, 2500);
      }
    });//end jQuery.ajax
    return false;
  }

  function getCommentText_CUI(post_id, comment_id) {
    var form = $("#commentform-" + post_id);
    var status = $('#cui-comment-status-' + post_id);
    jQuery.ajax({
      type: "POST",
      dataType: "html",
      url: CUI.ajaxurl,
      data: {
        action: 'get_comment_text_cui',
        post_id: post_id,
        comment_id: comment_id,
        nonce: CUI.nonce
      },
      beforeSend: function () {
        //status.addClass('cui-loading').html('<span class="cuio-loading"></span>').show();
      },
      success: function (data) {
        //status.removeClass('cui-loading').html('');
        if (data !== 'cui-error') {
          $('#cui-textarea-' + post_id).val(data);
          autosize.update($('#cui-textarea-' + post_id));
          //$('#commentform-'+post_id).find('input[name="submit"]').hide();
          $('#commentform-' + post_id).find('input.cui-cancel-btn').show();
        }
        else {

        }
      },//end success
      complete: function (jqXHR, textStatus) {
        //setTimeout(function(){
        //status.removeClass('cui-loading').hide();
        //},2500);
      }
    });//end jQuery.ajax
    return false;
  }//end function


  function deleteComment_CUI(post_id, comment_id) {
    jQuery.ajax({
      type: "POST",
      dataType: "html",
      url: CUI.ajaxurl,
      data: {
        action: 'delete_comment_cui',
        post_id: post_id,
        comment_id: comment_id,
        nonce: CUI.nonce
      },
      beforeSend: function () {
      },
      success: function (data) {
        if (data === 'ok') {
          $('#cui-item-comment-' + comment_id).remove();
        }
      }//end success
    });//end jQuery.ajax
    return false;
  }//end function

  //MOSTRAR/OCULTAR MÁS COMENTARIOS
  function toggleMoreComments($container_comments) {
    //console.log("======================= toggleMoreComments ", $container_comments.attr('id'));
    var liComments = $container_comments.find('>li.depth-1.cui-item-comment');
    liComments.each(function (index, element) {
      var ulChildren = $(this).find('> ul.children');
      if (ulChildren.length && ulChildren.find('li').length > 3) {
        ulChildren.find('li:gt(2)').css('display', 'none');
        ulChildren.append('<a href="#" class="cui-load-more-comments">' + CUI_WP.textLoadMore + '</a>');
      }
    });
  }

  $(document).delegate('a.cui-load-more-comments', 'click', function (e) {
    e.preventDefault();
    $(this).parent().find('li.cui-item-comment').fadeIn("slow");
    $(this).remove();
  });

  $(document).delegate('.cui-media-btns a', 'click', function (e) {
    e.preventDefault();
    var post_id = $(this).attr('href').split('=')[1].replace('&action', '');
    var $action = $(this).attr('href').split('=')[2];
    $('body').append('<div id="cui-overlay"></div>');
    $('body').append('<div id="cui-modal"></div>');
    $modalHtml = '<div id="cui-modal-wrap"><span id="cui-modal-close"></span><div id="cui-modal-header"><h3 id="cui-modal-title">Título</h3></div><div id="cui-modal-content"><p>Hola</p></div><div id="cui-modal-footer"><a id="cui-modal-ok-' + post_id + '" class="cui-modal-ok cui-modal-btn" href="#">' + CUI.accept + '</a><a class="cui-modal-cancel cui-modal-btn" href="#">' + CUI.cancel + '</a></div></div>';
    $("#cui-modal").append($modalHtml).fadeIn(250);

    switch ($action) {
      case 'url':
        $('#cui-modal').removeClass().addClass('cui-modal-url');
        $('#cui-modal-title').html(CUI.insertLink);
        $('#cui-modal-content').html('<input type="text" id="cui-modal-url-link" class="cui-modal-input" placeholder="' + CUI_WP.textUrlLink + '"/><input type="text" id="cui-modal-text-link" class="cui-modal-input" placeholder="' + CUI_WP.textToDisplay + '"/>');
        break;

      case 'image':
        $('#cui-modal').removeClass().addClass('cui-modal-image');
        $('#cui-modal-title').html(CUI.insertImage);
        $('#cui-modal-content').html('<input type="text" id="cui-modal-url-image" class="cui-modal-input" placeholder="' + CUI_WP.textUrlImage + '"/><div id="cui-modal-preview"></div>');
        break;

      case 'video':
        $('#cui-modal').removeClass().addClass('cui-modal-video');
        $('#cui-modal-title').html(CUI.insertVideo);
        $('#cui-modal-content').html('<input type="text" id="cui-modal-url-video" class="cui-modal-input" placeholder="' + CUI_WP.textUrlVideo + '"/><div id="cui-modal-preview"></div>');
        $('#cui-modal-footer').prepend('<a id="cui-modal-verifique-video" class="cui-modal-verifique cui-modal-btn" href="#">' + CUI.checkVideo + '</a>');
        break;
    }
  });//
  //acción Ok
  $(document).delegate('.cui-modal-ok', 'click', function (e) {
    e.preventDefault();
    $('#cui-modal input, #cui-modal textarea').removeClass('cui-error');
    var $action = $('#cui-modal').attr('class');
    var post_id = $(this).attr('id').replace('cui-modal-ok-', '');
    switch ($action) {
      case 'cui-modal-url':
        processUrl_CUI(post_id);
        break;
      case 'cui-modal-image':
        processImage_CUI(post_id);
        break;
      case 'cui-modal-video':
        processVideo_CUI(post_id);
        break;
    }
    autosize.update($('.cui-textarea'));
    closeModal_CUI();
    return false;
  });
  //eliminamos errores
  $(document).delegate('#cui-modal input, #cui-modal textarea', 'focus', function (e) {
    $(this).removeClass('cui-error');
  });

  function processUrl_CUI(post_id) {
    var $ok = true;
    var $urlField = $('#cui-modal-url-link');
    var $textField = $('#cui-modal-text-link');
    if ($urlField.val().length < 1) {
      $ok = false;
      $urlField.addClass('cui-error');
    }
    if ($textField.val().length < 1) {
      $ok = false;
      $textField.addClass('cui-error');
    }
    if ($ok) {
      var $urlVal = $urlField.val().replace(/https?:\/\//gi, '');
      var link_show_comments = '<a href="http://' + $urlVal + '" title="' + $textField.val() + '" rel="nofollow" target="_blank">' + $textField.val() + '</a>';
      insertInTextArea_CUI(post_id, link_show_comments);
    }
    return false;
  }

  function processImage_CUI(post_id) {
    var $ok = true;
    var $urlField = $('#cui-modal-url-image');
    if ($urlField.val().length < 1) {
      $ok = false;
      $urlField.addClass('cui-error');
    }
    if ($ok) {
      var $urlVal = $urlField.val();
      var $image = '<img src="' + $urlVal + '" />';
      insertInTextArea_CUI(post_id, $image);
    }
    return false;
  }

  //vista previa de imagen
  $(document).delegate('#cui-modal-url-image', 'change', function (e) {
    setTimeout(function () {
      $('#cui-modal-preview').html('<img src="' + $('#cui-modal-url-image').val() + '" />');
    }, 200);
  });

  function processVideo_CUI(post_id) {
    var $ok = true;
    var $urlField = $('#cui-modal-url-video');
    if (!$('#cui-modal-preview').find('iframe').length) {
      $ok = false;
      $('#cui-modal-preview').html('<p class="cui-modal-error">Please check the video url</p>');
    }
    if ($ok) {
      var $video = '<p>' + $('#cui-modal-preview').find('input[type="hidden"]').val() + '</p>';
      insertInTextArea_CUI(post_id, $video);
    }
    return false;
  }

  //vista previa de video
  $(document).delegate('#cui-modal-verifique-video', 'click', function (e) {
    e.preventDefault();
    var $urlVideo = $('#cui-modal-url-video');
    var $urlVideoVal = $urlVideo.val().replace(/\s+/g, '');
    $urlVideo.removeClass('cui-error');
    $(this).attr('id', '');//desactivamos el enlace

    if ($urlVideoVal.length < 1) {
      $urlVideo.addClass('cui-error');
      $('.cui-modal-video').find('a.cui-modal-verifique').attr('id', 'cui-modal-verifique-video');//activamos el enlace
      return false;
    }

    var data = 'url_video=' + $urlVideoVal;
    $.ajax({
      url: CUI.ajaxurl,
      data: data + '&action=verificar_video_CUI',
      type: "POST",
      dataType: "html",
      beforeSend: function () {
        $('#cui-modal-preview').html('<div class="cui-loading cui-loading-2"></div>');
      },
      success: function (data) {
        if (data != 'error') {
          $('#cui-modal-preview').html(data);
        } else {
          $('#cui-modal-preview').html('<p class="cui-modal-error">Invalid video url</p>');
        }
      },
      error: function (xhr) {
        $('#cui-modal-preview').html('<p class="cui-modal-error">Failed to process, try again</p>');
      },
      complete: function (jqXHR, textStatus) {
        $('.cui-modal-video').find('a.cui-modal-verifique').attr('id', 'cui-modal-verifique-video');//activamos el enlace
      }
    });//end ajax
  });

  function closeModal_CUI() {
    $('#cui-overlay, #cui-modal').remove();
    return false;
  }

  //acción cancelar
  $(document).delegate('#cui-modal-close, .cui-modal-cancel', 'click', function (e) {
    e.preventDefault();
    closeModal_CUI();
    return false;
  });

  function jPages_CUI(post_id, $numPerPage, $destroy) {
    //Si existe el plugin jPages y está activado
    if (typeof jQuery.fn.jPages == 'function' && CUI.jpages == 'true') {
      var $idList = 'cui-container-comment-' + post_id;
      var $holder = 'div.cui-holder-' + post_id;
      var num_comments = jQuery('#' + $idList + ' > li').length;
      if (num_comments > $numPerPage) {
        if ($destroy) {
          jQuery('#' + $idList).children().removeClass('animated jp-hidden');
        }
        jQuery($holder).jPages({
          containerID: $idList,
          previous: "← " + CUI_WP.textNavPrev,
          next: CUI_WP.textNavNext + " →",
          perPage: parseInt($numPerPage, 10),
          minHeight: false,
          keyBrowse: true,
          direction: "forward",
          animation: "fadeIn",
        });
      }//end if
    }//end if
    return false;
  }

  function captcha_CUI($max) {
    if (!$max) $max = 5;
    return {
      n1: Math.floor(Math.random() * $max + 1),
      n2: Math.floor(Math.random() * $max + 1),
    };
  }

  function scrollThis_CUI($this) {
    if ($this.length) {
      var $position = $this.offset().top;
      var $scrollThis = Math.abs($position - 200);
      $('html,body').animate({ scrollTop: $scrollThis }, 'slow');
    }
    return false;
  }

  function getUrlVars_CUI(url) {
    var query = url.substring(url.indexOf('?') + 1);
    var parts = query.split("&");
    var params = {};
    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i].split("=");
      params[pair[0]] = pair[1];
    }
    return params;
  }

  function cancelCommentAction_CUI(post_id) {
    $('form#commentform-' + post_id).find('[name="comment_parent"]').val('0');
    $('form#commentform-' + post_id).find('.cui-textarea').val('').attr('placeholder', CUI.textWriteComment);
    $('form#commentform-' + post_id).find('input[name="submit"]').removeClass();
    $('form#commentform-' + post_id).find('input.cui-cancel-btn').hide();
    autosize.update($('#cui-textarea-' + post_id));
    $('input, textarea').removeClass('cui-error');
    captchaValues = captcha_CUI(9);
    $('.cui-captcha-text').html(captchaValues.n1 + ' &#43; ' + captchaValues.n2 + ' = ');
  }

  function restoreIframeHeight(wrapper) {
    var widthWrapper = CUI.widthWrap ? parseInt(CUI.widthWrap, 10) : wrapper.outerWidth();
    // if(widthWrapper >= 321 ) {
    // 	wrapper.find('iframe').attr('height','250px');
    // } else {
    // 	wrapper.find('iframe').attr('height','160px');
    // }
  }

  function rezizeBoxComments_CUI(wrapper) {
    var widthWrapper = CUI.widthWrap ? parseInt(CUI.widthWrap, 10) : wrapper.outerWidth();
    if (widthWrapper <= 480) {
      wrapper.addClass('cui-full');
    } else {
      wrapper.removeClass('cui-full');
    }
  }

  function insertInTextArea_CUI(post_id, $value) {
    //Get textArea HTML control
    var $fieldID = document.getElementById('cui-textarea-' + post_id);

    //IE
    if (document.selection) {
      $fieldID.focus();
      var sel = document.selection.createRange();
      sel.text = $value;
      return;
    }
    //Firefox, chrome, mozilla
    else if ($fieldID.selectionStart || $fieldID.selectionStart == '0') {
      var startPos = $fieldID.selectionStart;
      var endPos = $fieldID.selectionEnd;
      var scrollTop = $fieldID.scrollTop;
      $fieldID.value = $fieldID.value.substring(0, startPos) + $value + $fieldID.value.substring(endPos, $fieldID.value.length);
      $fieldID.focus();
      $fieldID.selectionStart = startPos + $value.length;
      $fieldID.selectionEnd = startPos + $value.length;
      $fieldID.scrollTop = scrollTop;
    }
    else {
      $fieldID.value += textArea.value;
      $fieldID.focus();
    }
  }

  // LIKE COMMENTS
  $(document).delegate('a.cui-rating-link', 'click', function (e) {
    e.preventDefault();
    var comment_id = $(this).attr('href').split('=')[1].replace('&method', '');
    var $method = $(this).attr('href').split('=')[2];
    commentRating_CUI(comment_id, $method);
    return false;
  });

  function commentRating_CUI(comment_id, $method) {
    var $ratingCount = $('#cui-comment-' + comment_id).find('.cui-rating-count');
    var $currentLikes = $ratingCount.text();
    jQuery.ajax({
      type: 'POST',
      url: CUI.ajaxurl,
      data: {
        action: 'comment_rating',
        comment_id: comment_id,
        method: $method,
        nonce: CUI.nonce
      },
      beforeSend: function () {
        $ratingCount.html('').addClass('cuio-loading');
      },
      success: function (result) {
        var data = $.parseJSON(result);
        if (data.success === true) {
          $ratingCount.html(data.likes).attr('title', data.likes + ' ' + CUI_WP.textLikes);
          if (data.likes < 0) {
            $ratingCount.removeClass().addClass('cui-rating-count cui-rating-negative');
          }
          else if (data.likes > 0) {
            $ratingCount.removeClass().addClass('cui-rating-count cui-rating-positive');
          }
          else {
            $ratingCount.removeClass().addClass('cui-rating-count cui-rating-neutral');
          }
        } else {
          $ratingCount.html($currentLikes);
        }
      },
      error: function (xhr) {
        $ratingCount.html($currentLikes);
      },
      complete: function (data) {
        $ratingCount.removeClass('cuio-loading');
      }//end success

    });//end jQuery.ajax
  }

  function clog(msg) {
    console.log(msg);
  }

  function cc(msg, msg2) {
    console.log(msg, msg2);
  }

  // show and hide note
    $(document).delegate('a.cui_note_button','click',function (e) {
        e.preventDefault();
       var note_area = $(this).closest('.cui-select-attending').find('.cui_note_texarea');
        note_area.toggleClass('active');
    })
});//end ready


function gotoTop() {
    var elmnt = document.getElementById("cui-box");
    elmnt.scrollTop = 0;
}


jQuery("document").ready(function() {
  // var iHeight = $("#cui-box").height();
  // $(this).addClass("jp-show");
  // $(this).removeClass("jp-hidden");

  // $('.li').removeClass('jp-hidden');
  // $('.li').addClass("jp-show");

 jQuery('.cui-container-comments li.comment').addClass('jp-show');
  // $(this).parent().addClass('jp-hidden');

 



  // var msg = 'DIV height is :<b> ' + iHeight + 'px</b> and ScrollHeight is :<b>' + iScrollHeight + 'px</b>';

  // $("span").html(msg);

});



/**
 * jQuery jPages v0.7
 * Client side pagination with jQuery
 * http://luis-almeida.github.com/jPages
 *
 * Licensed under the MIT license.
 * Copyright 2012 Luís Almeida
 * https://github.com/luis-almeida
 */

 ;(function($,window,document,undefined){var name="jPages",instance=null,defaults={containerID:"",first:false,previous:"← previous",next:"next →",last:false,links:"numeric",startPage:1,perPage:10,midRange:5,startRange:1,endRange:1,keyBrowse:false,scrollBrowse:false,pause:0,clickStop:false,delay:50,direction:"forward",animation:"",fallback:400,minHeight:true,callback:undefined};function Plugin(element,options){this.options=$.extend({},defaults,options);this._container=$("#"+this.options.containerID);if(!this._container.length)return;this.jQwindow=$(window);this.jQdocument=$(document);this._holder=$(element);this._nav={};this._first=$(this.options.first);this._previous=$(this.options.previous);this._next=$(this.options.next);this._last=$(this.options.last);this._items=this._container.children(":visible");this._itemsShowing=$([]);this._itemsHiding=$([]);this._numPages=Math.ceil(this._items.length/this.options.perPage);this._currentPageNum=this.options.startPage;this._clicked=false;this._cssAnimSupport=this.getCSSAnimationSupport();this.init();}Plugin.prototype={constructor:Plugin,getCSSAnimationSupport:function(){var animation=false,animationstring='animation',keyframeprefix='',domPrefixes='Webkit Moz O ms Khtml'.split(' '),pfx='',elm=this._container.get(0);if(elm.style.animationName)animation=true;if(animation===false){for(var i=0;i<domPrefixes.length;i++){if(elm.style[domPrefixes[i]+'AnimationName']!==undefined){pfx=domPrefixes[i];animationstring=pfx+'Animation';keyframeprefix='-'+pfx.toLowerCase()+'-';animation=true;break;}}}return animation;},init:function(){this.setStyles();this.setNav();this.paginate(this._currentPageNum);this.setMinHeight();},setStyles:function(){var requiredStyles="<style>"+".jp-invisible { visibility: hidden !important; } "+".jp-hidden { display: none !important; }"+"</style>";$(requiredStyles).appendTo("head");if(this._cssAnimSupport&&this.options.animation.length)this._items.addClass("animated jp-hidden");else this._items.hide();},setNav:function(){var navhtml=this.writeNav();this._holder.each(this.bind(function(index,element){var holder=$(element);holder.html(navhtml);this.cacheNavElements(holder,index);this.bindNavHandlers(index);this.disableNavSelection(element);},this));if(this.options.keyBrowse)this.bindNavKeyBrowse();if(this.options.scrollBrowse)this.bindNavScrollBrowse();},writeNav:function(){var i=1,navhtml;navhtml=this.writeBtn("first")+this.writeBtn("previous");for(;i<=this._numPages;i++){if(i===1&&this.options.startRange===0)navhtml+="<span>...</span>";if(i>this.options.startRange&&i<=this._numPages-this.options.endRange)navhtml+="<a href='#' class='jp-hidden'>";else
navhtml+="<a>";switch(this.options.links){case"numeric":navhtml+=i;break;case"blank":break;case"title":var title=this._items.eq(i-1).attr("data-title");navhtml+=title!==undefined?title:"";break;}navhtml+="</a>";if(i===this.options.startRange||i===this._numPages-this.options.endRange)navhtml+="<span>...</span>";}navhtml+=this.writeBtn("next")+this.writeBtn("last")+"</div>";return navhtml;},writeBtn:function(which){return this.options[which]!==false&&!$(this["_"+which]).length?"<a class='jp-"+which+"'>"+this.options[which]+"</a>":"";},cacheNavElements:function(holder,index){this._nav[index]={};this._nav[index].holder=holder;this._nav[index].first=this._first.length?this._first:this._nav[index].holder.find("a.jp-first");this._nav[index].previous=this._previous.length?this._previous:this._nav[index].holder.find("a.jp-previous");this._nav[index].next=this._next.length?this._next:this._nav[index].holder.find("a.jp-next");this._nav[index].last=this._last.length?this._last:this._nav[index].holder.find("a.jp-last");this._nav[index].fstBreak=this._nav[index].holder.find("span:first");this._nav[index].lstBreak=this._nav[index].holder.find("span:last");this._nav[index].pages=this._nav[index].holder.find("a").not(".jp-first, .jp-previous, .jp-next, .jp-last");this._nav[index].permPages=this._nav[index].pages.slice(0,this.options.startRange).add(this._nav[index].pages.slice(this._numPages-this.options.endRange,this._numPages));this._nav[index].pagesShowing=$([]);this._nav[index].currentPage=$([]);},bindNavHandlers:function(index){var nav=this._nav[index];nav.holder.bind("click.jPages",this.bind(function(evt){var newPage=this.getNewPage(nav,$(evt.target));if(this.validNewPage(newPage)){this._clicked=true;this.paginate(newPage);}evt.preventDefault();},this));if(this._first.length){this._first.bind("click.jPages",this.bind(function(){if(this.validNewPage(1)){this._clicked=true;this.paginate(1);}},this));}if(this._previous.length){this._previous.bind("click.jPages",this.bind(function(){var newPage=this._currentPageNum-1;if(this.validNewPage(newPage)){this._clicked=true;this.paginate(newPage);}},this));}if(this._next.length){this._next.bind("click.jPages",this.bind(function(){var newPage=this._currentPageNum+1;if(this.validNewPage(newPage)){this._clicked=true;this.paginate(newPage);}},this));}if(this._last.length){this._last.bind("click.jPages",this.bind(function(){if(this.validNewPage(this._numPages)){this._clicked=true;this.paginate(this._numPages);}},this));}},disableNavSelection:function(element){if(typeof element.onselectstart!="undefined")element.onselectstart=function(){return false;};else if(typeof element.style.MozUserSelect!="undefined")element.style.MozUserSelect="none";else
element.onmousedown=function(){return false;};},bindNavKeyBrowse:function(){this.jQdocument.bind("keydown.jPages",this.bind(function(evt){var target=evt.target.nodeName.toLowerCase();if(this.elemScrolledIntoView()&&target!=="input"&&target!="textarea"){var newPage=this._currentPageNum;if(evt.which==37)newPage=this._currentPageNum-1;if(evt.which==39)newPage=this._currentPageNum+1;if(this.validNewPage(newPage)){this._clicked=true;this.paginate(newPage);}}},this));},elemScrolledIntoView:function(){var docViewTop,docViewBottom,elemTop,elemBottom;docViewTop=this.jQwindow.scrollTop();docViewBottom=docViewTop+this.jQwindow.height();elemTop=this._container.offset().top;elemBottom=elemTop+this._container.height();return((elemBottom>=docViewTop)&&(elemTop<=docViewBottom));},bindNavScrollBrowse:function(){this._container.bind("mousewheel.jPages DOMMouseScroll.jPages",this.bind(function(evt){var newPage=(evt.originalEvent.wheelDelta||-evt.originalEvent.detail)>0?(this._currentPageNum-1):(this._currentPageNum+1);if(this.validNewPage(newPage)){this._clicked=true;this.paginate(newPage);}evt.preventDefault();return false;},this));},getNewPage:function(nav,target){if(target.is(nav.currentPage))return this._currentPageNum;if(target.is(nav.pages))return nav.pages.index(target)+1;if(target.is(nav.first))return 1;if(target.is(nav.last))return this._numPages;if(target.is(nav.previous))return nav.pages.index(nav.currentPage);if(target.is(nav.next))return nav.pages.index(nav.currentPage)+2;},validNewPage:function(newPage){return newPage!==this._currentPageNum&&newPage>0&&newPage<=this._numPages;},paginate:function(page){var itemRange,pageInterval;itemRange=this.updateItems(page);pageInterval=this.updatePages(page);this._currentPageNum=page;if($.isFunction(this.options.callback))this.callback(page,itemRange,pageInterval);this.updatePause();},updateItems:function(page){var range=this.getItemRange(page);this._itemsHiding=this._itemsShowing;this._itemsShowing=this._items.slice(range.start,range.end);if(this._cssAnimSupport&&this.options.animation.length)this.cssAnimations(page);else this.jQAnimations(page);return range;},getItemRange:function(page){var range={};range.start=(page-1)*this.options.perPage;range.end=range.start+this.options.perPage;if(range.end>this._items.length)range.end=this._items.length;return range;},cssAnimations:function(page){clearInterval(this._delay);this._itemsHiding.removeClass(this.options.animation+" jp-invisible").addClass("jp-hidden");this._itemsShowing.removeClass("jp-hidden").addClass("jp-invisible");this._itemsOriented=this.getDirectedItems(page);this._index=0;this._delay=setInterval(this.bind(function(){if(this._index===this._itemsOriented.length)clearInterval(this._delay);else{this._itemsOriented.eq(this._index).removeClass("jp-invisible").addClass(this.options.animation);}this._index=this._index+1;},this),this.options.delay);},jQAnimations:function(page){clearInterval(this._delay);this._itemsHiding.addClass("jp-hidden");this._itemsShowing.fadeTo(0,0).removeClass("jp-hidden");this._itemsOriented=this.getDirectedItems(page);this._index=0;this._delay=setInterval(this.bind(function(){if(this._index===this._itemsOriented.length)clearInterval(this._delay);else{this._itemsOriented.eq(this._index).fadeTo(this.options.fallback,1);}this._index=this._index+1;},this),this.options.delay);},getDirectedItems:function(page){var itemsToShow;switch(this.options.direction){case"backwards":itemsToShow=$(this._itemsShowing.get().reverse());break;case"random":itemsToShow=$(this._itemsShowing.get().sort(function(){return(Math.round(Math.random())-0.5);}));break;case"auto":itemsToShow=page>=this._currentPageNum?this._itemsShowing:$(this._itemsShowing.get().reverse());break;default:itemsToShow=this._itemsShowing;}return itemsToShow;},updatePages:function(page){var interval,index,nav;interval=this.getInterval(page);for(index in this._nav){if(this._nav.hasOwnProperty(index)){nav=this._nav[index];this.updateBtns(nav,page);this.updateCurrentPage(nav,page);this.updatePagesShowing(nav,interval);this.updateBreaks(nav,interval);}}return interval;},getInterval:function(page){var neHalf,upperLimit,start,end;neHalf=Math.ceil(this.options.midRange/2);upperLimit=this._numPages-this.options.midRange;start=page>neHalf?Math.max(Math.min(page-neHalf,upperLimit),0):0;end=page>neHalf?Math.min(page+neHalf-(this.options.midRange%2>0?1:0),this._numPages):Math.min(this.options.midRange,this._numPages);return{start:start,end:end};},updateBtns:function(nav,page){if(page===1){nav.first.addClass("jp-disabled");nav.previous.addClass("jp-disabled");}if(page===this._numPages){nav.next.addClass("jp-disabled");nav.last.addClass("jp-disabled");}if(this._currentPageNum===1&&page>1){nav.first.removeClass("jp-disabled");nav.previous.removeClass("jp-disabled");}if(this._currentPageNum===this._numPages&&page<this._numPages){nav.next.removeClass("jp-disabled");nav.last.removeClass("jp-disabled");}},updateCurrentPage:function(nav,page){nav.currentPage.removeClass("jp-current");nav.currentPage=nav.pages.eq(page-1).addClass("jp-current");},updatePagesShowing:function(nav,interval){var newRange=nav.pages.slice(interval.start,interval.end).not(nav.permPages);nav.pagesShowing.not(newRange).addClass("jp-hidden");newRange.not(nav.pagesShowing).removeClass("jp-hidden");nav.pagesShowing=newRange;},updateBreaks:function(nav,interval){if(interval.start>this.options.startRange||(this.options.startRange===0&&interval.start>0))nav.fstBreak.removeClass("jp-hidden");else nav.fstBreak.addClass("jp-hidden");if(interval.end<this._numPages-this.options.endRange)nav.lstBreak.removeClass("jp-hidden");else nav.lstBreak.addClass("jp-hidden");},callback:function(page,itemRange,pageInterval){var pages={current:page,interval:pageInterval,count:this._numPages},items={showing:this._itemsShowing,oncoming:this._items.slice(itemRange.start+this.options.perPage,itemRange.end+this.options.perPage),range:itemRange,count:this._items.length};pages.interval.start=pages.interval.start+1;items.range.start=items.range.start+1;this.options.callback(pages,items);},updatePause:function(){if(this.options.pause&&this._numPages>1){clearTimeout(this._pause);if(this.options.clickStop&&this._clicked)return;else{this._pause=setTimeout(this.bind(function(){this.paginate(this._currentPageNum!==this._numPages?this._currentPageNum+1:1);},this),this.options.pause);}}},setMinHeight:function(){if(this.options.minHeight&&!this._container.is("table, tbody")){setTimeout(this.bind(function(){this._container.css({"min-height":this._container.css("height")});},this),1000);}},bind:function(fn,me){return function(){return fn.apply(me,arguments);};},destroy:function(){this.jQdocument.unbind("keydown.jPages");this._container.unbind("mousewheel.jPages DOMMouseScroll.jPages");if(this.options.minHeight)this._container.css("min-height","");if(this._cssAnimSupport&&this.options.animation.length)this._items.removeClass("animated jp-hidden jp-invisible "+this.options.animation);else this._items.removeClass("jp-hidden").fadeTo(0,1);this._holder.unbind("click.jPages").empty();}};$.fn[name]=function(arg){var type=$.type(arg);if(type==="object"){if(this.length&&!$.data(this,name)){instance=new Plugin(this,arg);this.each(function(){$.data(this,name,instance);});}return this;}if(type==="string"&&arg==="destroy"){instance.destroy();this.each(function(){$.removeData(this,name);});return this;}if(type==='number'&&arg%1===0){if(instance.validNewPage(arg))instance.paginate(arg);return this;}return this;};})(jQuery,window,document);



/*! bdtUIkit 3.16.3 | https://www.getuikit.com | (c) 2014 - 2023 YOOtheme | MIT License */
(function(ge, me) {
  typeof exports == "object" && typeof module < "u" ? module.exports = me() : typeof define == "function" && define.amd ? define("uikit", me) : (ge = typeof globalThis < "u" ? globalThis : ge || self,
  ge.bdtUIkit = me())
}
)(this, function() {
  "use strict";
  const {hasOwnProperty: ge, toString: me} = Object.prototype;
  function Mt(t, e) {
      return ge.call(t, e)
  }
  const wo = /\B([A-Z])/g
    , Zt = ft(t=>t.replace(wo, "-$1").toLowerCase())
    , bo = /-(\w)/g
    , ve = ft(t=>t.replace(bo, bs))
    , _t = ft(t=>t.length ? bs(null, t.charAt(0)) + t.slice(1) : "");
  function bs(t, e) {
      return e ? e.toUpperCase() : ""
  }
  function ht(t, e) {
      var i;
      return (i = t == null ? void 0 : t.startsWith) == null ? void 0 : i.call(t, e)
  }
  function Qt(t, e) {
      var i;
      return (i = t == null ? void 0 : t.endsWith) == null ? void 0 : i.call(t, e)
  }
  function v(t, e) {
      var i;
      return (i = t == null ? void 0 : t.includes) == null ? void 0 : i.call(t, e)
  }
  function $t(t, e) {
      var i;
      return (i = t == null ? void 0 : t.findIndex) == null ? void 0 : i.call(t, e)
  }
  const {isArray: Q, from: _i} = Array
    , {assign: xt} = Object;
  function dt(t) {
      return typeof t == "function"
  }
  function Et(t) {
      return t !== null && typeof t == "object"
  }
  function yt(t) {
      return me.call(t) === "[object Object]"
  }
  function Ut(t) {
      return Et(t) && t === t.window
  }
  function je(t) {
      return Ei(t) === 9
  }
  function qe(t) {
      return Ei(t) >= 1
  }
  function te(t) {
      return Ei(t) === 1
  }
  function Ei(t) {
      return !Ut(t) && Et(t) && t.nodeType
  }
  function Ii(t) {
      return typeof t == "boolean"
  }
  function N(t) {
      return typeof t == "string"
  }
  function ee(t) {
      return typeof t == "number"
  }
  function vt(t) {
      return ee(t) || N(t) && !isNaN(t - parseFloat(t))
  }
  function we(t) {
      return !(Q(t) ? t.length : Et(t) && Object.keys(t).length)
  }
  function V(t) {
      return t === void 0
  }
  function Pi(t) {
      return Ii(t) ? t : t === "true" || t === "1" || t === "" ? !0 : t === "false" || t === "0" ? !1 : t
  }
  function kt(t) {
      const e = Number(t);
      return isNaN(e) ? !1 : e
  }
  function $(t) {
      return parseFloat(t) || 0
  }
  function R(t) {
      return k(t)[0]
  }
  function k(t) {
      return qe(t) ? [t] : Array.from(t || []).filter(qe)
  }
  function ie(t) {
      if (Ut(t))
          return t;
      t = R(t);
      const e = je(t) ? t : t == null ? void 0 : t.ownerDocument;
      return (e == null ? void 0 : e.defaultView) || window
  }
  function be(t, e) {
      return t === e || Et(t) && Et(e) && Object.keys(t).length === Object.keys(e).length && St(t, (i,s)=>i === e[s])
  }
  function Ai(t, e, i) {
      return t.replace(new RegExp(`${e}|${i}`,"g"), s=>s === e ? i : e)
  }
  function se(t) {
      return t[t.length - 1]
  }
  function St(t, e) {
      for (const i in t)
          if (e(t[i], i) === !1)
              return !1;
      return !0
  }
  function Ve(t, e) {
      return t.slice().sort(({[e]: i=0},{[e]: s=0})=>i > s ? 1 : s > i ? -1 : 0)
  }
  function Nt(t, e) {
      return t.reduce((i,s)=>i + $(dt(e) ? e(s) : s[e]), 0)
  }
  function $s(t, e) {
      const i = new Set;
      return t.filter(({[e]: s})=>i.has(s) ? !1 : i.add(s))
  }
  function U(t, e=0, i=1) {
      return Math.min(Math.max(kt(t) || 0, e), i)
  }
  function P() {}
  function Oi(...t) {
      return [["bottom", "top"], ["right", "left"]].every(([e,i])=>Math.min(...t.map(({[e]: s})=>s)) - Math.max(...t.map(({[i]: s})=>s)) > 0)
  }
  function Ye(t, e) {
      return t.x <= e.right && t.x >= e.left && t.y <= e.bottom && t.y >= e.top
  }
  function Di(t, e, i) {
      const s = e === "width" ? "height" : "width";
      return {
          [s]: t[e] ? Math.round(i * t[s] / t[e]) : t[s],
          [e]: i
      }
  }
  function xs(t, e) {
      t = {
          ...t
      };
      for (const i in t)
          t = t[i] > e[i] ? Di(t, i, e[i]) : t;
      return t
  }
  function $o(t, e) {
      t = xs(t, e);
      for (const i in t)
          t = t[i] < e[i] ? Di(t, i, e[i]) : t;
      return t
  }
  const Ge = {
      ratio: Di,
      contain: xs,
      cover: $o
  };
  function ct(t, e, i=0, s=!1) {
      e = k(e);
      const {length: n} = e;
      return n ? (t = vt(t) ? kt(t) : t === "next" ? i + 1 : t === "previous" ? i - 1 : t === "last" ? n - 1 : e.indexOf(R(t)),
      s ? U(t, 0, n - 1) : (t %= n,
      t < 0 ? t + n : t)) : -1
  }
  function ft(t) {
      const e = Object.create(null);
      return i=>e[i] || (e[i] = t(i))
  }
  class Xe {
      constructor() {
          this.promise = new Promise((e,i)=>{
              this.reject = i,
              this.resolve = e
          }
          )
      }
  }
  function f(t, e, i) {
      var s;
      if (Et(e)) {
          for (const n in e)
              f(t, n, e[n]);
          return
      }
      if (V(i))
          return (s = R(t)) == null ? void 0 : s.getAttribute(e);
      for (const n of k(t))
          dt(i) && (i = i.call(n, f(n, e))),
          i === null ? $e(n, e) : n.setAttribute(e, i)
  }
  function wt(t, e) {
      return k(t).some(i=>i.hasAttribute(e))
  }
  function $e(t, e) {
      k(t).forEach(i=>i.removeAttribute(e))
  }
  function tt(t, e) {
      for (const i of [e, `data-${e}`])
          if (wt(t, i))
              return f(t, i)
  }
  const xo = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
  };
  function Bi(t) {
      return k(t).some(e=>xo[e.tagName.toLowerCase()])
  }
  function q(t) {
      return k(t).some(e=>e.offsetWidth || e.offsetHeight || e.getClientRects().length)
  }
  const xe = "input,select,textarea,button";
  function Mi(t) {
      return k(t).some(e=>_(e, xe))
  }
  const ye = `${xe},a[href],[tabindex]`;
  function Je(t) {
      return _(t, ye)
  }
  function A(t) {
      var e;
      return (e = R(t)) == null ? void 0 : e.parentElement
  }
  function ke(t, e) {
      return k(t).filter(i=>_(i, e))
  }
  function _(t, e) {
      return k(t).some(i=>i.matches(e))
  }
  function Y(t, e) {
      return te(t) ? t.closest(ht(e, ">") ? e.slice(1) : e) : k(t).map(i=>Y(i, e)).filter(Boolean)
  }
  function D(t, e) {
      return N(e) ? !!Y(t, e) : R(e).contains(R(t))
  }
  function ne(t, e) {
      const i = [];
      for (; t = A(t); )
          (!e || _(t, e)) && i.push(t);
      return i
  }
  function E(t, e) {
      t = R(t);
      const i = t ? k(t.children) : [];
      return e ? ke(i, e) : i
  }
  function oe(t, e) {
      return e ? k(t).indexOf(R(e)) : E(A(t)).indexOf(t)
  }
  function ut(t, e) {
      return Ni(t, ks(t, e))
  }
  function Se(t, e) {
      return Te(t, ks(t, e))
  }
  function Ni(t, e) {
      return R(Ss(t, R(e), "querySelector"))
  }
  function Te(t, e) {
      return k(Ss(t, R(e), "querySelectorAll"))
  }
  const yo = /(^|[^\\],)\s*[!>+~-]/
    , ys = ft(t=>t.match(yo));
  function ks(t, e=document) {
      return N(t) && ys(t) || je(e) ? e : e.ownerDocument
  }
  const ko = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g
    , So = ft(t=>t.replace(ko, "$1 *"));
  function Ss(t, e=document, i) {
      if (!t || !N(t))
          return t;
      if (t = So(t),
      ys(t)) {
          const s = Co(t);
          t = "";
          for (let n of s) {
              let o = e;
              if (n[0] === "!") {
                  const r = n.substr(1).trim().split(" ");
                  if (o = Y(A(e), r[0]),
                  n = r.slice(1).join(" ").trim(),
                  !n.length && s.length === 1)
                      return o
              }
              if (n[0] === "-") {
                  const r = n.substr(1).trim().split(" ")
                    , a = (o || e).previousElementSibling;
                  o = _(a, n.substr(1)) ? a : null,
                  n = r.slice(1).join(" ")
              }
              o && (t += `${t ? "," : ""}${_o(o)} ${n}`)
          }
          e = document
      }
      try {
          return e[i](t)
      } catch {
          return null
      }
  }
  const To = /.*?[^\\](?:,|$)/g
    , Co = ft(t=>t.match(To).map(e=>e.replace(/,$/, "").trim()));
  function _o(t) {
      const e = [];
      for (; t.parentNode; ) {
          const i = f(t, "id");
          if (i) {
              e.unshift(`#${zi(i)}`);
              break
          } else {
              let {tagName: s} = t;
              s !== "HTML" && (s += `:nth-child(${oe(t) + 1})`),
              e.unshift(s),
              t = t.parentNode
          }
      }
      return e.join(" > ")
  }
  function zi(t) {
      return N(t) ? CSS.escape(t) : ""
  }
  function x(...t) {
      let[e,i,s,n,o=!1] = Fi(t);
      n.length > 1 && (n = Io(n)),
      o != null && o.self && (n = Po(n)),
      s && (n = Eo(s, n));
      for (const r of i)
          for (const a of e)
              a.addEventListener(r, n, o);
      return ()=>zt(e, i, n, o)
  }
  function zt(...t) {
      let[e,i,,s,n=!1] = Fi(t);
      for (const o of i)
          for (const r of e)
              r.removeEventListener(o, s, n)
  }
  function L(...t) {
      const [e,i,s,n,o=!1,r] = Fi(t)
        , a = x(e, i, s, l=>{
          const c = !r || r(l);
          c && (a(),
          n(l, c))
      }
      , o);
      return a
  }
  function m(t, e, i) {
      return Hi(t).every(s=>s.dispatchEvent(Ft(e, !0, !0, i)))
  }
  function Ft(t, e=!0, i=!1, s) {
      return N(t) && (t = new CustomEvent(t,{
          bubbles: e,
          cancelable: i,
          detail: s
      })),
      t
  }
  function Fi(t) {
      return t[0] = Hi(t[0]),
      N(t[1]) && (t[1] = t[1].split(" ")),
      dt(t[2]) && t.splice(2, 0, !1),
      t
  }
  function Eo(t, e) {
      return i=>{
          const s = t[0] === ">" ? Te(t, i.currentTarget).reverse().filter(n=>D(i.target, n))[0] : Y(i.target, t);
          s && (i.current = s,
          e.call(this, i),
          delete i.current)
      }
  }
  function Io(t) {
      return e=>Q(e.detail) ? t(e, ...e.detail) : t(e)
  }
  function Po(t) {
      return function(e) {
          if (e.target === e.currentTarget || e.target === e.current)
              return t.call(null, e)
      }
  }
  function Ts(t) {
      return t && "addEventListener"in t
  }
  function Ao(t) {
      return Ts(t) ? t : R(t)
  }
  function Hi(t) {
      return Q(t) ? t.map(Ao).filter(Boolean) : N(t) ? Te(t) : Ts(t) ? [t] : k(t)
  }
  function Tt(t) {
      return t.pointerType === "touch" || !!t.touches
  }
  function re(t) {
      var e, i;
      const {clientX: s, clientY: n} = ((e = t.touches) == null ? void 0 : e[0]) || ((i = t.changedTouches) == null ? void 0 : i[0]) || t;
      return {
          x: s,
          y: n
      }
  }
  const Oo = {
      "animation-iteration-count": !0,
      "column-count": !0,
      "fill-opacity": !0,
      "flex-grow": !0,
      "flex-shrink": !0,
      "font-weight": !0,
      "line-height": !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      "stroke-dasharray": !0,
      "stroke-dashoffset": !0,
      widows: !0,
      "z-index": !0,
      zoom: !0
  };
  function h(t, e, i, s) {
      const n = k(t);
      for (const o of n)
          if (N(e)) {
              if (e = Li(e),
              V(i))
                  return getComputedStyle(o).getPropertyValue(e);
              o.style.setProperty(e, vt(i) && !Oo[e] ? `${i}px` : i || ee(i) ? i : "", s)
          } else if (Q(e)) {
              const r = {};
              for (const a of e)
                  r[a] = h(o, a);
              return r
          } else
              Et(e) && (s = i,
              St(e, (r,a)=>h(o, a, r, s)));
      return n[0]
  }
  const Li = ft(t=>Do(t));
  function Do(t) {
      if (ht(t, "--"))
          return t;
      t = Zt(t);
      const {style: e} = document.documentElement;
      if (t in e)
          return t;
      for (const i of ["webkit", "moz"]) {
          const s = `-${i}-${t}`;
          if (s in e)
              return s
      }
  }
  function y(t, ...e) {
      Cs(t, e, "add")
  }
  function z(t, ...e) {
      Cs(t, e, "remove")
  }
  function Wi(t, e) {
      f(t, "class", i=>(i || "").replace(new RegExp(`\\b${e}\\b\\s?`,"g"), ""))
  }
  function Ri(t, ...e) {
      e[0] && z(t, e[0]),
      e[1] && y(t, e[1])
  }
  function B(t, e) {
      return [e] = ji(e),
      !!e && k(t).some(i=>i.classList.contains(e))
  }
  function j(t, e, i) {
      const s = ji(e);
      V(i) || (i = !!i);
      for (const n of k(t))
          for (const o of s)
              n.classList.toggle(o, i)
  }
  function Cs(t, e, i) {
      e = e.reduce((s,n)=>s.concat(ji(n)), []);
      for (const s of k(t))
          s.classList[i](...e)
  }
  function ji(t) {
      return String(t).split(/[ ,]/).filter(Boolean)
  }
  function Bo(t, e, i=400, s="linear") {
      return i = Math.round(i),
      Promise.all(k(t).map(n=>new Promise((o,r)=>{
          for (const l in e) {
              const c = h(n, l);
              c === "" && h(n, l, c)
          }
          const a = setTimeout(()=>m(n, "transitionend"), i);
          L(n, "transitionend transitioncanceled", ({type: l})=>{
              clearTimeout(a),
              z(n, "bdt-transition"),
              h(n, {
                  transitionProperty: "",
                  transitionDuration: "",
                  transitionTimingFunction: ""
              }),
              l === "transitioncanceled" ? r() : o(n)
          }
          , {
              self: !0
          }),
          y(n, "bdt-transition"),
          h(n, {
              transitionProperty: Object.keys(e).map(Li).join(","),
              transitionDuration: `${i}ms`,
              transitionTimingFunction: s,
              ...e
          })
      }
      )))
  }
  const S = {
      start: Bo,
      async stop(t) {
          m(t, "transitionend"),
          await Promise.resolve()
      },
      async cancel(t) {
          m(t, "transitioncanceled"),
          await Promise.resolve()
      },
      inProgress(t) {
          return B(t, "bdt-transition")
      }
  }
    , Ce = "bdt-animation-";
  function _s(t, e, i=200, s, n) {
      return Promise.all(k(t).map(o=>new Promise((r,a)=>{
          m(o, "animationcanceled");
          const l = setTimeout(()=>m(o, "animationend"), i);
          L(o, "animationend animationcanceled", ({type: c})=>{
              clearTimeout(l),
              c === "animationcanceled" ? a() : r(o),
              h(o, "animationDuration", ""),
              Wi(o, `${Ce}\\S*`)
          }
          , {
              self: !0
          }),
          h(o, "animationDuration", `${i}ms`),
          y(o, e, Ce + (n ? "leave" : "enter")),
          ht(e, Ce) && (s && y(o, `bdt-transform-origin-${s}`),
          n && y(o, `${Ce}reverse`))
      }
      )))
  }
  const Mo = new RegExp(`${Ce}(enter|leave)`)
    , pt = {
      in: _s,
      out(t, e, i, s) {
          return _s(t, e, i, s, !0)
      },
      inProgress(t) {
          return Mo.test(f(t, "class"))
      },
      cancel(t) {
          m(t, "animationcanceled")
      }
  };
  function No(t) {
      if (document.readyState !== "loading") {
          t();
          return
      }
      L(document, "DOMContentLoaded", t)
  }
  function X(t, ...e) {
      return e.some(i=>{
          var s;
          return ((s = t == null ? void 0 : t.tagName) == null ? void 0 : s.toLowerCase()) === i.toLowerCase()
      }
      )
  }
  function Es(t) {
      return t = w(t),
      t.innerHTML = "",
      t
  }
  function It(t, e) {
      return V(e) ? w(t).innerHTML : W(Es(t), e)
  }
  const zo = Qe("prepend")
    , W = Qe("append")
    , Ke = Qe("before")
    , Ze = Qe("after");
  function Qe(t) {
      return function(e, i) {
          var s;
          const n = k(N(i) ? Ht(i) : i);
          return (s = w(e)) == null || s[t](...n),
          Is(n)
      }
  }
  function ot(t) {
      k(t).forEach(e=>e.remove())
  }
  function Ue(t, e) {
      for (e = R(Ke(t, e)); e.firstChild; )
          e = e.firstChild;
      return W(e, t),
      e
  }
  function qi(t, e) {
      return k(k(t).map(i=>i.hasChildNodes() ? Ue(k(i.childNodes), e) : W(i, e)))
  }
  function _e(t) {
      k(t).map(A).filter((e,i,s)=>s.indexOf(e) === i).forEach(e=>e.replaceWith(...e.childNodes))
  }
  const Fo = /^\s*<(\w+|!)[^>]*>/
    , Ho = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
  function Ht(t) {
      const e = Ho.exec(t);
      if (e)
          return document.createElement(e[1]);
      const i = document.createElement("div");
      return Fo.test(t) ? i.insertAdjacentHTML("beforeend", t.trim()) : i.textContent = t,
      Is(i.childNodes)
  }
  function Is(t) {
      return t.length > 1 ? t : t[0]
  }
  function Ct(t, e) {
      if (te(t))
          for (e(t),
          t = t.firstElementChild; t; ) {
              const i = t.nextElementSibling;
              Ct(t, e),
              t = i
          }
  }
  function w(t, e) {
      return Ps(t) ? R(Ht(t)) : Ni(t, e)
  }
  function O(t, e) {
      return Ps(t) ? k(Ht(t)) : Te(t, e)
  }
  function Ps(t) {
      return N(t) && ht(t.trim(), "<")
  }
  const Lt = {
      width: ["left", "right"],
      height: ["top", "bottom"]
  };
  function b(t) {
      const e = te(t) ? R(t).getBoundingClientRect() : {
          height: et(t),
          width: Ee(t),
          top: 0,
          left: 0
      };
      return {
          height: e.height,
          width: e.width,
          top: e.top,
          left: e.left,
          bottom: e.top + e.height,
          right: e.left + e.width
      }
  }
  function I(t, e) {
      const i = b(t);
      if (t) {
          const {scrollY: n, scrollX: o} = ie(t)
            , r = {
              height: n,
              width: o
          };
          for (const a in Lt)
              for (const l of Lt[a])
                  i[l] += r[a]
      }
      if (!e)
          return i;
      const s = h(t, "position");
      St(h(t, ["left", "top"]), (n,o)=>h(t, o, e[o] - i[o] + $(s === "absolute" && n === "auto" ? ti(t)[o] : n)))
  }
  function ti(t) {
      let {top: e, left: i} = I(t);
      const {ownerDocument: {body: s, documentElement: n}, offsetParent: o} = R(t);
      let r = o || n;
      for (; r && (r === s || r === n) && h(r, "position") === "static"; )
          r = r.parentNode;
      if (te(r)) {
          const a = I(r);
          e -= a.top + $(h(r, "borderTopWidth")),
          i -= a.left + $(h(r, "borderLeftWidth"))
      }
      return {
          top: e - $(h(t, "marginTop")),
          left: i - $(h(t, "marginLeft"))
      }
  }
  function Wt(t) {
      t = R(t);
      const e = [t.offsetTop, t.offsetLeft];
      for (; t = t.offsetParent; )
          if (e[0] += t.offsetTop + $(h(t, "borderTopWidth")),
          e[1] += t.offsetLeft + $(h(t, "borderLeftWidth")),
          h(t, "position") === "fixed") {
              const i = ie(t);
              return e[0] += i.scrollY,
              e[1] += i.scrollX,
              e
          }
      return e
  }
  const et = As("height")
    , Ee = As("width");
  function As(t) {
      const e = _t(t);
      return (i,s)=>{
          if (V(s)) {
              if (Ut(i))
                  return i[`inner${e}`];
              if (je(i)) {
                  const n = i.documentElement;
                  return Math.max(n[`offset${e}`], n[`scroll${e}`])
              }
              return i = R(i),
              s = h(i, t),
              s = s === "auto" ? i[`offset${e}`] : $(s) || 0,
              s - ae(i, t)
          } else
              return h(i, t, !s && s !== 0 ? "" : +s + ae(i, t) + "px")
      }
  }
  function ae(t, e, i="border-box") {
      return h(t, "boxSizing") === i ? Nt(Lt[e].map(_t), s=>$(h(t, `padding${s}`)) + $(h(t, `border${s}Width`))) : 0
  }
  function ei(t) {
      for (const e in Lt)
          for (const i in Lt[e])
              if (Lt[e][i] === t)
                  return Lt[e][1 - i];
      return t
  }
  function rt(t, e="width", i=window, s=!1) {
      return N(t) ? Nt(Wo(t), n=>{
          const o = jo(n);
          return o ? qo(o === "vh" ? Vo() : o === "vw" ? Ee(ie(i)) : s ? i[`offset${_t(e)}`] : b(i)[e], n) : n
      }
      ) : $(t)
  }
  const Lo = /-?\d+(?:\.\d+)?(?:v[wh]|%|px)?/g
    , Wo = ft(t=>t.toString().replace(/\s/g, "").match(Lo) || [])
    , Ro = /(?:v[hw]|%)$/
    , jo = ft(t=>(t.match(Ro) || [])[0]);
  function qo(t, e) {
      return t * $(e) / 100
  }
  let Ie, le;
  function Vo() {
      return Ie || (le || (le = w("<div>"),
      h(le, {
          height: "100vh",
          position: "fixed"
      }),
      x(window, "resize", ()=>Ie = null)),
      W(document.body, le),
      Ie = le.clientHeight,
      ot(le),
      Ie)
  }
  const Rt = typeof window < "u"
    , J = Rt && document.dir === "rtl"
    , jt = Rt && "ontouchstart"in window
    , he = Rt && window.PointerEvent
    , gt = he ? "pointerdown" : jt ? "touchstart" : "mousedown"
    , ii = he ? "pointermove" : jt ? "touchmove" : "mousemove"
    , Pt = he ? "pointerup" : jt ? "touchend" : "mouseup"
    , At = he ? "pointerenter" : jt ? "" : "mouseenter"
    , qt = he ? "pointerleave" : jt ? "" : "mouseleave"
    , si = he ? "pointercancel" : "touchcancel"
    , G = {
      reads: [],
      writes: [],
      read(t) {
          return this.reads.push(t),
          Yi(),
          t
      },
      write(t) {
          return this.writes.push(t),
          Yi(),
          t
      },
      clear(t) {
          Ds(this.reads, t),
          Ds(this.writes, t)
      },
      flush: Vi
  };
  function Vi(t) {
      Os(G.reads),
      Os(G.writes.splice(0)),
      G.scheduled = !1,
      (G.reads.length || G.writes.length) && Yi(t + 1)
  }
  const Yo = 4;
  function Yi(t) {
      G.scheduled || (G.scheduled = !0,
      t && t < Yo ? Promise.resolve().then(()=>Vi(t)) : requestAnimationFrame(()=>Vi(1)))
  }
  function Os(t) {
      let e;
      for (; e = t.shift(); )
          try {
              e()
          } catch (i) {
              console.error(i)
          }
  }
  function Ds(t, e) {
      const i = t.indexOf(e);
      return ~i && t.splice(i, 1)
  }
  function Gi() {}
  Gi.prototype = {
      positions: [],
      init() {
          this.positions = [];
          let t;
          this.unbind = x(document, "mousemove", e=>t = re(e)),
          this.interval = setInterval(()=>{
              t && (this.positions.push(t),
              this.positions.length > 5 && this.positions.shift())
          }
          , 50)
      },
      cancel() {
          var t;
          (t = this.unbind) == null || t.call(this),
          clearInterval(this.interval)
      },
      movesTo(t) {
          if (this.positions.length < 2)
              return !1;
          const e = t.getBoundingClientRect()
            , {left: i, right: s, top: n, bottom: o} = e
            , [r] = this.positions
            , a = se(this.positions)
            , l = [r, a];
          return Ye(a, e) ? !1 : [[{
              x: i,
              y: n
          }, {
              x: s,
              y: o
          }], [{
              x: i,
              y: o
          }, {
              x: s,
              y: n
          }]].some(u=>{
              const d = Go(l, u);
              return d && Ye(d, e)
          }
          )
      }
  };
  function Go([{x: t, y: e},{x: i, y: s}], [{x: n, y: o},{x: r, y: a}]) {
      const l = (a - o) * (i - t) - (r - n) * (s - e);
      if (l === 0)
          return !1;
      const c = ((r - n) * (e - o) - (a - o) * (t - n)) / l;
      return c < 0 ? !1 : {
          x: t + c * (i - t),
          y: e + c * (s - e)
      }
  }
  function ce(t, e, i, s=!0) {
      const n = new IntersectionObserver(s ? (o,r)=>{
          o.some(a=>a.isIntersecting) && e(o, r)
      }
      : e,i);
      for (const o of k(t))
          n.observe(o);
      return n
  }
  const Xo = Rt && window.ResizeObserver;
  function Pe(t, e, i={
      box: "border-box"
  }) {
      return Xo ? Ms(ResizeObserver, t, e, i) : (Jo(),
      Ae.add(e),
      {
          disconnect() {
              Ae.delete(e)
          }
      })
  }
  let Ae;
  function Jo() {
      if (Ae)
          return;
      Ae = new Set;
      let t;
      const e = ()=>{
          if (!t) {
              t = !0,
              requestAnimationFrame(()=>t = !1);
              for (const i of Ae)
                  i()
          }
      }
      ;
      x(window, "load resize", e),
      x(document, "loadedmetadata load", e, !0)
  }
  function Bs(t, e, i) {
      return Ms(MutationObserver, t, e, i)
  }
  function Ms(t, e, i, s) {
      const n = new t(i);
      for (const o of k(e))
          n.observe(o, s);
      return n
  }
  const K = {};
  K.events = K.created = K.beforeConnect = K.connected = K.beforeDisconnect = K.disconnected = K.destroy = Xi,
  K.args = function(t, e) {
      return e !== !1 && Xi(e || t)
  }
  ,
  K.update = function(t, e) {
      return Ve(Xi(t, dt(e) ? {
          read: e
      } : e), "order")
  }
  ,
  K.props = function(t, e) {
      if (Q(e)) {
          const i = {};
          for (const s of e)
              i[s] = String;
          e = i
      }
      return K.methods(t, e)
  }
  ,
  K.computed = K.methods = function(t, e) {
      return e ? t ? {
          ...t,
          ...e
      } : e : t
  }
  ,
  K.i18n = K.data = function(t, e, i) {
      return i ? Ns(t, e, i) : e ? t ? function(s) {
          return Ns(t, e, s)
      }
      : e : t
  }
  ;
  function Ns(t, e, i) {
      return K.computed(dt(t) ? t.call(i, i) : t, dt(e) ? e.call(i, i) : e)
  }
  function Xi(t, e) {
      return t = t && !Q(t) ? [t] : t,
      e ? t ? t.concat(e) : Q(e) ? e : [e] : t
  }
  function Ko(t, e) {
      return V(e) ? t : e
  }
  function ue(t, e, i) {
      const s = {};
      if (dt(e) && (e = e.options),
      e.extends && (t = ue(t, e.extends, i)),
      e.mixins)
          for (const o of e.mixins)
              t = ue(t, o, i);
      for (const o in t)
          n(o);
      for (const o in e)
          Mt(t, o) || n(o);
      function n(o) {
          s[o] = (K[o] || Ko)(t[o], e[o], i)
      }
      return s
  }
  function de(t, e=[]) {
      try {
          return t ? ht(t, "{") ? JSON.parse(t) : e.length && !v(t, ":") ? {
              [e[0]]: t
          } : t.split(";").reduce((i,s)=>{
              const [n,o] = s.split(/:(.*)/);
              return n && !V(o) && (i[n.trim()] = o.trim()),
              i
          }
          , {}) : {}
      } catch {
          return {}
      }
  }
  function zs(t) {
      if (oi(t) && Ji(t, {
          func: "playVideo",
          method: "play"
      }),
      ni(t))
          try {
              t.play().catch(P)
          } catch {}
  }
  function Fs(t) {
      oi(t) && Ji(t, {
          func: "pauseVideo",
          method: "pause"
      }),
      ni(t) && t.pause()
  }
  function Hs(t) {
      oi(t) && Ji(t, {
          func: "mute",
          method: "setVolume",
          value: 0
      }),
      ni(t) && (t.muted = !0)
  }
  function Ls(t) {
      return ni(t) || oi(t)
  }
  function ni(t) {
      return X(t, "video")
  }
  function oi(t) {
      return X(t, "iframe") && (Ws(t) || Rs(t))
  }
  function Ws(t) {
      return !!t.src.match(/\/\/.*?youtube(-nocookie)?\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/)
  }
  function Rs(t) {
      return !!t.src.match(/vimeo\.com\/video\/.*/)
  }
  async function Ji(t, e) {
      await Qo(t),
      js(t, e)
  }
  function js(t, e) {
      try {
          t.contentWindow.postMessage(JSON.stringify({
              event: "command",
              ...e
          }), "*")
      } catch {}
  }
  const Ki = "_ukPlayer";
  let Zo = 0;
  function Qo(t) {
      if (t[Ki])
          return t[Ki];
      const e = Ws(t)
        , i = Rs(t)
        , s = ++Zo;
      let n;
      return t[Ki] = new Promise(o=>{
          e && L(t, "load", ()=>{
              const r = ()=>js(t, {
                  event: "listening",
                  id: s
              });
              n = setInterval(r, 100),
              r()
          }
          ),
          L(window, "message", o, !1, ({data: r})=>{
              try {
                  return r = JSON.parse(r),
                  e && (r == null ? void 0 : r.id) === s && r.event === "onReady" || i && Number(r == null ? void 0 : r.player_id) === s
              } catch {}
          }
          ),
          t.src = `${t.src}${v(t.src, "?") ? "&" : "?"}${e ? "enablejsapi=1" : `api=1&player_id=${s}`}`
      }
      ).then(()=>clearInterval(n))
  }
  function Zi(t, e=0, i=0) {
      return q(t) ? Oi(...Vt(t).map(s=>{
          const {top: n, left: o, bottom: r, right: a} = at(s);
          return {
              top: n - e,
              left: o - i,
              bottom: r + e,
              right: a + i
          }
      }
      ).concat(I(t))) : !1
  }
  function qs(t, {offset: e=0}={}) {
      const i = q(t) ? mt(t, !1, ["hidden"]) : [];
      return i.reduce((r,a,l)=>{
          const {scrollTop: c, scrollHeight: u, offsetHeight: d} = a
            , p = at(a)
            , g = u - p.height
            , {height: T, top: F} = i[l - 1] ? at(i[l - 1]) : I(t);
          let M = Math.ceil(F - p.top - e + c);
          return e > 0 && d < T + e ? M += e : e = 0,
          M > g ? (e -= M - g,
          M = g) : M < 0 && (e -= M,
          M = 0),
          ()=>s(a, M - c).then(r)
      }
      , ()=>Promise.resolve())();
      function s(r, a) {
          return new Promise(l=>{
              const c = r.scrollTop
                , u = n(Math.abs(a))
                , d = Date.now();
              (function p() {
                  const g = o(U((Date.now() - d) / u));
                  r.scrollTop = c + a * g,
                  g === 1 ? l() : requestAnimationFrame(p)
              }
              )()
          }
          )
      }
      function n(r) {
          return 40 * Math.pow(r, .375)
      }
      function o(r) {
          return .5 * (1 - Math.cos(Math.PI * r))
      }
  }
  function Qi(t, e=0, i=0) {
      if (!q(t))
          return 0;
      const [s] = mt(t, !0)
        , {scrollHeight: n, scrollTop: o} = s
        , {height: r} = at(s)
        , a = n - r
        , l = Wt(t)[0] - Wt(s)[0]
        , c = Math.max(0, l - r + e)
        , u = Math.min(a, l + t.offsetHeight - i);
      return U((o - c) / (u - c))
  }
  function mt(t, e=!1, i=[]) {
      const s = Vs(t);
      let n = ne(t).reverse();
      n = n.slice(n.indexOf(s) + 1);
      const o = $t(n, r=>h(r, "position") === "fixed");
      return ~o && (n = n.slice(o)),
      [s].concat(n.filter(r=>h(r, "overflow").split(" ").some(a=>v(["auto", "scroll", ...i], a)) && (!e || r.scrollHeight > at(r).height))).reverse()
  }
  function Vt(t) {
      return mt(t, !1, ["hidden", "clip"])
  }
  function at(t) {
      const e = ie(t)
        , {document: {documentElement: i}} = e;
      let s = t === Vs(t) ? e : t;
      const {visualViewport: n} = e;
      if (Ut(s) && n) {
          let {height: r, width: a, scale: l, pageTop: c, pageLeft: u} = n;
          return r = Math.round(r * l),
          a = Math.round(a * l),
          {
              height: r,
              width: a,
              top: c,
              left: u,
              bottom: c + r,
              right: u + a
          }
      }
      let o = I(s);
      if (h(s, "display") === "inline")
          return o;
      for (let[r,a,l,c] of [["width", "x", "left", "right"], ["height", "y", "top", "bottom"]])
          Ut(s) ? s = i : o[l] += $(h(s, `border-${l}-width`)),
          o[r] = o[a] = s[`client${_t(r)}`],
          o[c] = o[r] + o[l];
      return o
  }
  function Vs(t) {
      return ie(t).document.scrollingElement
  }
  const lt = [["width", "x", "left", "right"], ["height", "y", "top", "bottom"]];
  function Ys(t, e, i) {
      i = {
          attach: {
              element: ["left", "top"],
              target: ["left", "top"],
              ...i.attach
          },
          offset: [0, 0],
          placement: [],
          ...i
      },
      Q(e) || (e = [e, e]),
      I(t, Gs(t, e, i))
  }
  function Gs(t, e, i) {
      const s = Xs(t, e, i)
        , {boundary: n, viewportOffset: o=0, placement: r} = i;
      let a = s;
      for (const [l,[c,,u,d]] of Object.entries(lt)) {
          const p = Uo(t, e[l], o, n, l);
          if (ri(s, p, l))
              continue;
          let g = 0;
          if (r[l] === "flip") {
              const T = i.attach.target[l];
              if (T === d && s[d] <= p[d] || T === u && s[u] >= p[u])
                  continue;
              g = er(t, e, i, l)[u] - s[u];
              const F = tr(t, e[l], o, l);
              if (!ri(Ui(s, g, l), F, l)) {
                  if (ri(s, F, l))
                      continue;
                  if (i.recursion)
                      return !1;
                  const M = ir(t, e, i);
                  if (M && ri(M, F, 1 - l))
                      return M;
                  continue
              }
          } else if (r[l] === "shift") {
              const T = I(e[l])
                , {offset: F} = i;
              g = U(U(s[u], p[u], p[d] - s[c]), T[u] - s[c] + F[l], T[d] - F[l]) - s[u]
          }
          a = Ui(a, g, l)
      }
      return a
  }
  function Xs(t, e, i) {
      let {attach: s, offset: n} = {
          attach: {
              element: ["left", "top"],
              target: ["left", "top"],
              ...i.attach
          },
          offset: [0, 0],
          ...i
      }
        , o = I(t);
      for (const [r,[a,,l,c]] of Object.entries(lt)) {
          const u = s.target[r] === s.element[r] ? at(e[r]) : I(e[r]);
          o = Ui(o, u[l] - o[l] + Js(s.target[r], c, u[a]) - Js(s.element[r], c, o[a]) + +n[r], r)
      }
      return o
  }
  function Ui(t, e, i) {
      const [,s,n,o] = lt[i]
        , r = {
          ...t
      };
      return r[n] = t[s] = t[n] + e,
      r[o] += e,
      r
  }
  function Js(t, e, i) {
      return t === "center" ? i / 2 : t === e ? i : 0
  }
  function Uo(t, e, i, s, n) {
      let o = Zs(...Ks(t, e).map(at));
      return i && (o[lt[n][2]] += i,
      o[lt[n][3]] -= i),
      s && (o = Zs(o, I(Q(s) ? s[n] : s))),
      o
  }
  function tr(t, e, i, s) {
      const [n,o,r,a] = lt[s]
        , [l] = Ks(t, e)
        , c = at(l);
      return ["auto", "scroll"].includes(h(l, `overflow-${o}`)) && (c[r] -= l[`scroll${_t(r)}`],
      c[a] = c[r] + l[`scroll${_t(n)}`]),
      c[r] += i,
      c[a] -= i,
      c
  }
  function Ks(t, e) {
      return Vt(e).filter(i=>D(t, i))
  }
  function Zs(...t) {
      let e = {};
      for (const i of t)
          for (const [,,s,n] of lt)
              e[s] = Math.max(e[s] || 0, i[s]),
              e[n] = Math.min(...[e[n], i[n]].filter(Boolean));
      return e
  }
  function ri(t, e, i) {
      const [,,s,n] = lt[i];
      return t[s] >= e[s] && t[n] <= e[n]
  }
  function er(t, e, {offset: i, attach: s}, n) {
      return Xs(t, e, {
          attach: {
              element: Qs(s.element, n),
              target: Qs(s.target, n)
          },
          offset: sr(i, n)
      })
  }
  function ir(t, e, i) {
      return Gs(t, e, {
          ...i,
          attach: {
              element: i.attach.element.map(Us).reverse(),
              target: i.attach.target.map(Us).reverse()
          },
          offset: i.offset.reverse(),
          placement: i.placement.reverse(),
          recursion: !0
      })
  }
  function Qs(t, e) {
      const i = [...t]
        , s = lt[e].indexOf(t[e]);
      return ~s && (i[e] = lt[e][1 - s % 2 + 2]),
      i
  }
  function Us(t) {
      for (let e = 0; e < lt.length; e++) {
          const i = lt[e].indexOf(t);
          if (~i)
              return lt[1 - e][i % 2 + 2]
      }
  }
  function sr(t, e) {
      return t = [...t],
      t[e] *= -1,
      t
  }
  var nr = Object.freeze({
      __proto__: null,
      $: w,
      $$: O,
      Animation: pt,
      Deferred: Xe,
      Dimensions: Ge,
      MouseTracker: Gi,
      Transition: S,
      addClass: y,
      after: Ze,
      append: W,
      apply: Ct,
      assign: xt,
      attr: f,
      before: Ke,
      boxModelAdjust: ae,
      camelize: ve,
      children: E,
      clamp: U,
      closest: Y,
      createEvent: Ft,
      css: h,
      data: tt,
      dimensions: b,
      each: St,
      empty: Es,
      endsWith: Qt,
      escape: zi,
      fastdom: G,
      filter: ke,
      find: Ni,
      findAll: Te,
      findIndex: $t,
      flipPosition: ei,
      fragment: Ht,
      getEventPos: re,
      getIndex: ct,
      hasAttr: wt,
      hasClass: B,
      hasOwn: Mt,
      hasTouch: jt,
      height: et,
      html: It,
      hyphenate: Zt,
      inBrowser: Rt,
      includes: v,
      index: oe,
      intersectRect: Oi,
      isArray: Q,
      isBoolean: Ii,
      isDocument: je,
      isElement: te,
      isEmpty: we,
      isEqual: be,
      isFocusable: Je,
      isFunction: dt,
      isInView: Zi,
      isInput: Mi,
      isNode: qe,
      isNumber: ee,
      isNumeric: vt,
      isObject: Et,
      isPlainObject: yt,
      isRtl: J,
      isString: N,
      isTag: X,
      isTouch: Tt,
      isUndefined: V,
      isVideo: Ls,
      isVisible: q,
      isVoidElement: Bi,
      isWindow: Ut,
      last: se,
      matches: _,
      memoize: ft,
      mergeOptions: ue,
      mute: Hs,
      noop: P,
      observeIntersection: ce,
      observeMutation: Bs,
      observeResize: Pe,
      off: zt,
      offset: I,
      offsetPosition: Wt,
      offsetViewport: at,
      on: x,
      once: L,
      overflowParents: Vt,
      parent: A,
      parents: ne,
      parseOptions: de,
      pause: Fs,
      play: zs,
      pointInRect: Ye,
      pointerCancel: si,
      pointerDown: gt,
      pointerEnter: At,
      pointerLeave: qt,
      pointerMove: ii,
      pointerUp: Pt,
      position: ti,
      positionAt: Ys,
      prepend: zo,
      propName: Li,
      query: ut,
      queryAll: Se,
      ready: No,
      remove: ot,
      removeAttr: $e,
      removeClass: z,
      removeClasses: Wi,
      replaceClass: Ri,
      scrollIntoView: qs,
      scrollParents: mt,
      scrolledOver: Qi,
      selFocusable: ye,
      selInput: xe,
      sortBy: Ve,
      startsWith: ht,
      sumBy: Nt,
      swap: Ai,
      toArray: _i,
      toBoolean: Pi,
      toEventTargets: Hi,
      toFloat: $,
      toNode: R,
      toNodes: k,
      toNumber: kt,
      toPx: rt,
      toWindow: ie,
      toggleClass: j,
      trigger: m,
      ucfirst: _t,
      uniqueBy: $s,
      unwrap: _e,
      width: Ee,
      within: D,
      wrapAll: Ue,
      wrapInner: qi
  });
  function or(t) {
      const e = t.data;
      t.use = function(n) {
          if (!n.installed)
              return n.call(null, this),
              n.installed = !0,
              this
      }
      ,
      t.mixin = function(n, o) {
          o = (N(o) ? t.component(o) : o) || this,
          o.options = ue(o.options, n)
      }
      ,
      t.extend = function(n) {
          n = n || {};
          const o = this
            , r = function(l) {
              this._init(l)
          };
          return r.prototype = Object.create(o.prototype),
          r.prototype.constructor = r,
          r.options = ue(o.options, n),
          r.super = o,
          r.extend = o.extend,
          r
      }
      ,
      t.update = function(n, o) {
          n = n ? R(n) : document.body;
          for (const r of ne(n).reverse())
              s(r[e], o);
          Ct(n, r=>s(r[e], o))
      }
      ;
      let i;
      Object.defineProperty(t, "container", {
          get() {
              return i || document.body
          },
          set(n) {
              i = w(n)
          }
      });
      function s(n, o) {
          if (n)
              for (const r in n)
                  n[r]._connected && n[r]._callUpdate(o)
      }
  }
  function rr(t) {
      t.prototype._callHook = function(s) {
          var n;
          (n = this.$options[s]) == null || n.forEach(o=>o.call(this))
      }
      ,
      t.prototype._callConnected = function() {
          this._connected || (this._data = {},
          this._computed = {},
          this._initProps(),
          this._callHook("beforeConnect"),
          this._connected = !0,
          this._initEvents(),
          this._initObservers(),
          this._callHook("connected"),
          this._callUpdate())
      }
      ,
      t.prototype._callDisconnected = function() {
          this._connected && (this._callHook("beforeDisconnect"),
          this._disconnectObservers(),
          this._unbindEvents(),
          this._callHook("disconnected"),
          this._connected = !1,
          delete this._watch)
      }
      ,
      t.prototype._callUpdate = function(s="update") {
          this._connected && ((s === "update" || s === "resize") && this._callWatches(),
          this.$options.update && (this._updates || (this._updates = new Set,
          G.read(()=>{
              this._connected && e.call(this, this._updates),
              delete this._updates
          }
          )),
          this._updates.add(s.type || s)))
      }
      ,
      t.prototype._callWatches = function() {
          if (this._watch)
              return;
          const s = !Mt(this, "_watch");
          this._watch = G.read(()=>{
              this._connected && i.call(this, s),
              this._watch = null
          }
          )
      }
      ;
      function e(s) {
          for (const {read: n, write: o, events: r=[]} of this.$options.update) {
              if (!s.has("update") && !r.some(l=>s.has(l)))
                  continue;
              let a;
              n && (a = n.call(this, this._data, s),
              a && yt(a) && xt(this._data, a)),
              o && a !== !1 && G.write(()=>{
                  this._connected && o.call(this, this._data, s)
              }
              )
          }
      }
      function i(s) {
          const {$options: {computed: n}} = this
            , o = {
              ...this._computed
          };
          this._computed = {};
          for (const r in n) {
              const {watch: a, immediate: l} = n[r];
              a && (s && l || Mt(o, r) && !be(o[r], this[r])) && a.call(this, this[r], o[r])
          }
      }
  }
  function ar(t) {
      let e = 0;
      t.prototype._init = function(i) {
          i = i || {},
          i.data = ur(i, this.constructor.options),
          this.$options = ue(this.constructor.options, i, this),
          this.$el = null,
          this.$props = {},
          this._uid = e++,
          this._initData(),
          this._initMethods(),
          this._initComputeds(),
          this._callHook("created"),
          i.el && this.$mount(i.el)
      }
      ,
      t.prototype._initData = function() {
          const {data: i={}} = this.$options;
          for (const s in i)
              this.$props[s] = this[s] = i[s]
      }
      ,
      t.prototype._initMethods = function() {
          const {methods: i} = this.$options;
          if (i)
              for (const s in i)
                  this[s] = i[s].bind(this)
      }
      ,
      t.prototype._initComputeds = function() {
          const {computed: i} = this.$options;
          if (this._computed = {},
          i)
              for (const s in i)
                  lr(this, s, i[s])
      }
      ,
      t.prototype._initProps = function(i) {
          let s;
          i = i || tn(this.$options);
          for (s in i)
              V(i[s]) || (this.$props[s] = i[s]);
          const n = [this.$options.computed, this.$options.methods];
          for (s in this.$props)
              s in i && hr(n, s) && (this[s] = this.$props[s])
      }
      ,
      t.prototype._initEvents = function() {
          this._events = [];
          for (const i of this.$options.events || [])
              if (Mt(i, "handler"))
                  ai(this, i);
              else
                  for (const s in i)
                      ai(this, i[s], s)
      }
      ,
      t.prototype._unbindEvents = function() {
          this._events.forEach(i=>i()),
          delete this._events
      }
      ,
      t.prototype._initObservers = function() {
          this._observers = [fr(this), dr(this)]
      }
      ,
      t.prototype.registerObserver = function(...i) {
          this._observers.push(...i)
      }
      ,
      t.prototype._disconnectObservers = function() {
          this._observers.forEach(i=>i == null ? void 0 : i.disconnect())
      }
  }
  function tn(t) {
      const e = {}
        , {args: i=[], props: s={}, el: n, id: o} = t;
      if (!s)
          return e;
      for (const a in s) {
          const l = Zt(a);
          let c = tt(n, l);
          V(c) || (c = s[a] === Boolean && c === "" ? !0 : ts(s[a], c),
          !(l === "target" && ht(c, "_")) && (e[a] = c))
      }
      const r = de(tt(n, o), i);
      for (const a in r) {
          const l = ve(a);
          V(s[l]) || (e[l] = ts(s[l], r[a]))
      }
      return e
  }
  function lr(t, e, i) {
      Object.defineProperty(t, e, {
          enumerable: !0,
          get() {
              const {_computed: s, $props: n, $el: o} = t;
              return Mt(s, e) || (s[e] = (i.get || i).call(t, n, o)),
              s[e]
          },
          set(s) {
              const {_computed: n} = t;
              n[e] = i.set ? i.set.call(t, s) : s,
              V(n[e]) && delete n[e]
          }
      })
  }
  function ai(t, e, i) {
      yt(e) || (e = {
          name: i,
          handler: e
      });
      let {name: s, el: n, handler: o, capture: r, passive: a, delegate: l, filter: c, self: u} = e;
      if (n = dt(n) ? n.call(t) : n || t.$el,
      Q(n)) {
          n.forEach(d=>ai(t, {
              ...e,
              el: d
          }, i));
          return
      }
      !n || c && !c.call(t) || t._events.push(x(n, s, l ? N(l) ? l : l.call(t) : null, N(o) ? t[o] : o.bind(t), {
          passive: a,
          capture: r,
          self: u
      }))
  }
  function hr(t, e) {
      return t.every(i=>!i || !Mt(i, e))
  }
  function ts(t, e) {
      return t === Boolean ? Pi(e) : t === Number ? kt(e) : t === "list" ? cr(e) : t === Object && N(e) ? de(e) : t ? t(e) : e
  }
  function cr(t) {
      return Q(t) ? t : N(t) ? t.split(/,(?![^(]*\))/).map(e=>vt(e) ? kt(e) : Pi(e.trim())) : [t]
  }
  function ur({data: t={}}, {args: e=[], props: i={}}) {
      Q(t) && (t = t.slice(0, e.length).reduce((s,n,o)=>(yt(n) ? xt(s, n) : s[e[o]] = n,
      s), {}));
      for (const s in t)
          V(t[s]) ? delete t[s] : i[s] && (t[s] = ts(i[s], t[s]));
      return t
  }
  function dr(t) {
      let {el: e, computed: i} = t.$options;
      if (!i)
          return;
      for (const n in i)
          if (i[n].document) {
              e = e.ownerDocument;
              break
          }
      const s = new MutationObserver(()=>t._callWatches());
      return s.observe(e, {
          childList: !0,
          subtree: !0
      }),
      s
  }
  function fr(t) {
      const {$options: e, $props: i} = t
        , {id: s, attrs: n, props: o, el: r} = e;
      if (!o || n === !1)
          return;
      const a = Q(n) ? n : Object.keys(o)
        , l = a.map(u=>Zt(u)).concat(s)
        , c = new MutationObserver(u=>{
          const d = tn(e);
          u.some(({attributeName: p})=>{
              const g = p.replace("data-", "");
              return (g === s ? a : [ve(g), ve(p)]).some(T=>!V(d[T]) && d[T] !== i[T])
          }
          ) && t.$reset()
      }
      );
      return c.observe(r, {
          attributes: !0,
          attributeFilter: l.concat(l.map(u=>`data-${u}`))
      }),
      c
  }
  function pr(t) {
      const e = t.data;
      t.prototype.$create = function(i, s, n) {
          return t[i](s, n)
      }
      ,
      t.prototype.$mount = function(i) {
          const {name: s} = this.$options;
          i[e] || (i[e] = {}),
          !i[e][s] && (i[e][s] = this,
          this.$el = this.$options.el = this.$options.el || i,
          D(i, document) && this._callConnected())
      }
      ,
      t.prototype.$reset = function() {
          this._callDisconnected(),
          this._callConnected()
      }
      ,
      t.prototype.$destroy = function(i=!1) {
          const {el: s, name: n} = this.$options;
          s && this._callDisconnected(),
          this._callHook("destroy"),
          s != null && s[e] && (delete s[e][n],
          we(s[e]) || delete s[e],
          i && ot(this.$el))
      }
      ,
      t.prototype.$emit = function(i) {
          this._callUpdate(i)
      }
      ,
      t.prototype.$update = function(i=this.$el, s) {
          t.update(i, s)
      }
      ,
      t.prototype.$getComponent = t.getComponent,
      Object.defineProperty(t.prototype, "$container", Object.getOwnPropertyDescriptor(t, "container"))
  }
  const Ot = {};
  function gr(t) {
      const {data: e, prefix: i} = t;
      t.component = function(s, n) {
          var o;
          s = Zt(s);
          const r = i + s;
          if (!n)
              return yt(Ot[r]) && (Ot[r] = Ot[`data-${r}`] = t.extend(Ot[r])),
              Ot[r];
          s = ve(s),
          t[s] = function(l, c) {
              const u = t.component(s);
              return u.options.functional ? new u({
                  data: yt(l) ? l : [...arguments]
              }) : l ? O(l).map(d)[0] : d();
              function d(p) {
                  const g = t.getComponent(p, s);
                  if (g)
                      if (c)
                          g.$destroy();
                      else
                          return g;
                  return new u({
                      el: p,
                      data: c
                  })
              }
          }
          ;
          const a = yt(n) ? {
              ...n
          } : n.options;
          return a.id = r,
          a.name = s,
          (o = a.install) == null || o.call(a, t, a, s),
          t._initialized && !a.functional && requestAnimationFrame(()=>t[s](`[${r}],[data-${r}]`)),
          Ot[r] = Ot[`data-${r}`] = yt(n) ? a : n
      }
      ,
      t.getComponents = s=>(s == null ? void 0 : s[e]) || {},
      t.getComponent = (s,n)=>t.getComponents(s)[n],
      t.connect = s=>{
          if (s[e])
              for (const n in s[e])
                  s[e][n]._callConnected();
          for (const n of s.getAttributeNames()) {
              const o = en(n);
              o && t[o](s)
          }
      }
      ,
      t.disconnect = s=>{
          for (const n in s[e])
              s[e][n]._callDisconnected()
      }
  }
  function en(t) {
      const e = Ot[t];
      return e && (yt(e) ? e : e.options).name
  }
  const it = function(t) {
      this._init(t)
  };
  it.util = nr,
  it.data = "__uikit__",
  it.prefix = "bdt-",
  it.options = {},
  it.version = "3.16.3",
  or(it),
  rr(it),
  ar(it),
  gr(it),
  pr(it);
  function mr(t) {
      const {connect: e, disconnect: i} = t;
      if (!Rt || !window.MutationObserver)
          return;
      requestAnimationFrame(function() {
          m(document, "uikit:init", t),
          document.body && Ct(document.body, e),
          new MutationObserver(o=>o.forEach(s)).observe(document, {
              childList: !0,
              subtree: !0
          }),
          new MutationObserver(o=>o.forEach(n)).observe(document, {
              attributes: !0,
              subtree: !0
          }),
          t._initialized = !0
      });
      function s({addedNodes: o, removedNodes: r}) {
          for (const a of o)
              Ct(a, e);
          for (const a of r)
              Ct(a, i)
      }
      function n({target: o, attributeName: r}) {
          var a;
          const l = en(r);
          if (l) {
              if (wt(o, r)) {
                  t[l](o);
                  return
              }
              (a = t.getComponent(o, l)) == null || a.$destroy()
          }
      }
  }
  var st = {
      connected() {
          y(this.$el, this.$options.id)
      }
  }
    , Oe = {
      data: {
          preload: 5
      },
      methods: {
          lazyload(t=this.$el, e=this.$el) {
              this.registerObserver(ce(t, (i,s)=>{
                  for (const n of k(dt(e) ? e() : e))
                      O('[loading="lazy"]', n).slice(0, this.preload - 1).forEach(o=>$e(o, "loading"));
                  for (const n of i.filter(({isIntersecting: o})=>o).map(({target: o})=>o))
                      s.unobserve(n)
              }
              ))
          }
      }
  }
    , Yt = {
      props: {
          cls: Boolean,
          animation: "list",
          duration: Number,
          velocity: Number,
          origin: String,
          transition: String
      },
      data: {
          cls: !1,
          animation: [!1],
          duration: 200,
          velocity: .2,
          origin: !1,
          transition: "ease",
          clsEnter: "bdt-togglabe-enter",
          clsLeave: "bdt-togglabe-leave"
      },
      computed: {
          hasAnimation({animation: t}) {
              return !!t[0]
          },
          hasTransition({animation: t}) {
              return ["slide", "reveal"].some(e=>ht(t[0], e))
          }
      },
      methods: {
          toggleElement(t, e, i) {
              return new Promise(s=>Promise.all(k(t).map(n=>{
                  const o = Ii(e) ? e : !this.isToggled(n);
                  if (!m(n, `before${o ? "show" : "hide"}`, [this]))
                      return Promise.reject();
                  const r = (dt(i) ? i : i === !1 || !this.hasAnimation ? vr : this.hasTransition ? wr : br)(n, o, this)
                    , a = o ? this.clsEnter : this.clsLeave;
                  y(n, a),
                  m(n, o ? "show" : "hide", [this]);
                  const l = ()=>{
                      z(n, a),
                      m(n, o ? "shown" : "hidden", [this])
                  }
                  ;
                  return r ? r.then(l, ()=>(z(n, a),
                  Promise.reject())) : l()
              }
              )).then(s, P))
          },
          isToggled(t=this.$el) {
              return [t] = k(t),
              B(t, this.clsEnter) ? !0 : B(t, this.clsLeave) ? !1 : this.cls ? B(t, this.cls.split(" ")[0]) : q(t)
          },
          _toggle(t, e) {
              if (!t)
                  return;
              e = Boolean(e);
              let i;
              this.cls ? (i = v(this.cls, " ") || e !== B(t, this.cls),
              i && j(t, this.cls, v(this.cls, " ") ? void 0 : e)) : (i = e === t.hidden,
              i && (t.hidden = !e)),
              O("[autofocus]", t).some(s=>q(s) ? s.focus() || !0 : s.blur()),
              i && m(t, "toggled", [e, this])
          }
      }
  };
  function vr(t, e, {_toggle: i}) {
      return pt.cancel(t),
      S.cancel(t),
      i(t, e)
  }
  async function wr(t, e, {animation: i, duration: s, velocity: n, transition: o, _toggle: r}) {
      var a;
      const [l="reveal",c="top"] = ((a = i[0]) == null ? void 0 : a.split("-")) || []
        , u = [["left", "right"], ["top", "bottom"]]
        , d = u[v(u[0], c) ? 0 : 1]
        , p = d[1] === c
        , T = ["width", "height"][u.indexOf(d)]
        , F = `margin-${d[0]}`
        , M = `margin-${c}`;
      let Bt = b(t)[T];
      const vs = S.inProgress(t);
      await S.cancel(t),
      e && r(t, !0);
      const rh = Object.fromEntries(["padding", "border", "width", "height", "minWidth", "minHeight", "overflowY", "overflowX", F, M].map(vo=>[vo, t.style[vo]]))
        , Re = b(t)
        , ws = $(h(t, F))
        , po = $(h(t, M))
        , Kt = Re[T] + po;
      !vs && !e && (Bt += po);
      const [Ci] = qi(t, "<div>");
      h(Ci, {
          boxSizing: "border-box",
          height: Re.height,
          width: Re.width,
          ...h(t, ["overflow", "padding", "borderTop", "borderRight", "borderBottom", "borderLeft", "borderImage", M])
      }),
      h(t, {
          padding: 0,
          border: 0,
          minWidth: 0,
          minHeight: 0,
          [M]: 0,
          width: Re.width,
          height: Re.height,
          overflow: "hidden",
          [T]: Bt
      });
      const go = Bt / Kt;
      s = (n * Kt + s) * (e ? 1 - go : go);
      const mo = {
          [T]: e ? Kt : 0
      };
      p && (h(t, F, Kt - Bt + ws),
      mo[F] = e ? ws : Kt + ws),
      !p ^ l === "reveal" && (h(Ci, F, -Kt + Bt),
      S.start(Ci, {
          [F]: e ? 0 : -Kt
      }, s, o));
      try {
          await S.start(t, mo, s, o)
      } finally {
          h(t, rh),
          _e(Ci.firstChild),
          e || r(t, !1)
      }
  }
  function br(t, e, i) {
      pt.cancel(t);
      const {animation: s, duration: n, _toggle: o} = i;
      return e ? (o(t, !0),
      pt.in(t, s[0], n, i.origin)) : pt.out(t, s[1] || s[0], n, i.origin).then(()=>o(t, !1))
  }
  function sn(t) {
      return Math.ceil(Math.max(0, ...O("[stroke]", t).map(e=>{
          try {
              return e.getTotalLength()
          } catch {
              return 0
          }
      }
      )))
  }
  let es;
  function nn(t) {
      const e = x(t, "touchmove", s=>{
          if (s.targetTouches.length !== 1)
              return;
          let[{scrollHeight: n, clientHeight: o}] = mt(s.target);
          o >= n && s.cancelable && s.preventDefault()
      }
      , {
          passive: !1
      });
      if (es)
          return e;
      es = !0;
      const {scrollingElement: i} = document;
      return h(i, {
          overflowY: CSS.supports("overflow", "clip") ? "clip" : "hidden",
          touchAction: "none",
          paddingRight: Ee(window) - i.clientWidth || ""
      }),
      ()=>{
          es = !1,
          e(),
          h(i, {
              overflowY: "",
              touchAction: "",
              paddingRight: ""
          })
      }
  }
  function De(t) {
      return ["origin", "pathname", "search"].every(e=>t[e] === location[e])
  }
  function on(t) {
      if (De(t)) {
          const e = decodeURIComponent(t.hash).substring(1);
          return document.getElementById(e) || document.getElementsByName(e)[0]
      }
  }
  function Dt(t, e=t.$el, i="") {
      if (e.id)
          return e.id;
      let s = `${t.$options.id}-${t._uid}${i}`;
      return w(`#${s}`) && (s = Dt(t, e, `${i}-2`)),
      s
  }
  const C = {
      TAB: 9,
      ESC: 27,
      SPACE: 32,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
  };
  var rn = {
      mixins: [st, Oe, Yt],
      props: {
          animation: Boolean,
          targets: String,
          active: null,
          collapsible: Boolean,
          multiple: Boolean,
          toggle: String,
          content: String,
          offset: Number
      },
      data: {
          targets: "> *",
          active: !1,
          animation: !0,
          collapsible: !0,
          multiple: !1,
          clsOpen: "bdt-open",
          toggle: "> .bdt-accordion-title",
          content: "> .bdt-accordion-content",
          offset: 0
      },
      computed: {
          items: {
              get({targets: t}, e) {
                  return O(t, e)
              },
              watch(t, e) {
                  if (e || B(t, this.clsOpen))
                      return;
                  const i = this.active !== !1 && t[Number(this.active)] || !this.collapsible && t[0];
                  i && this.toggle(i, !1)
              },
              immediate: !0
          },
          toggles: {
              get({toggle: t}) {
                  return this.items.map(e=>w(t, e))
              },
              watch() {
                  this.$emit()
              },
              immediate: !0
          },
          contents: {
              get({content: t}) {
                  return this.items.map(e=>{
                      var i;
                      return ((i = e._wrapper) == null ? void 0 : i.firstElementChild) || w(t, e)
                  }
                  )
              },
              watch(t) {
                  for (const e of t)
                      li(e, !B(this.items.find(i=>D(e, i)), this.clsOpen));
                  this.$emit()
              },
              immediate: !0
          }
      },
      connected() {
          this.lazyload()
      },
      events: [{
          name: "click keydown",
          delegate() {
              return `${this.targets} ${this.$props.toggle}`
          },
          async handler(t) {
              var e;
              t.type === "keydown" && t.keyCode !== C.SPACE || (t.preventDefault(),
              (e = this._off) == null || e.call(this),
              this._off = xr(t.target),
              await this.toggle(oe(this.toggles, t.current)),
              this._off())
          }
      }, {
          name: "shown hidden",
          self: !0,
          delegate() {
              return this.targets
          },
          handler() {
              this.$emit()
          }
      }],
      update() {
          const t = ke(this.items, `.${this.clsOpen}`);
          for (const e in this.items) {
              const i = this.toggles[e]
                , s = this.contents[e];
              if (!i || !s)
                  continue;
              i.id = Dt(this, i, `-title-${e}`),
              s.id = Dt(this, s, `-content-${e}`);
              const n = v(t, this.items[e]);
              f(i, {
                  role: X(i, "a") ? "button" : null,
                  "aria-controls": s.id,
                  "aria-expanded": n,
                  "aria-disabled": !this.collapsible && t.length < 2 && n
              }),
              f(s, {
                  role: "region",
                  "aria-labelledby": i.id
              })
          }
      },
      methods: {
          async toggle(t, e) {
              t = this.items[ct(t, this.items)];
              let i = [t];
              const s = ke(this.items, `.${this.clsOpen}`);
              !this.multiple && !v(s, i[0]) && (i = i.concat(s)),
              !(!this.collapsible && s.length < 2 && v(s, t)) && await Promise.all(i.map(n=>this.toggleElement(n, !v(s, n), (o,r)=>{
                  if (j(o, this.clsOpen, r),
                  e === !1 || !this.animation) {
                      li(w(this.content, o), !r);
                      return
                  }
                  return $r(o, r, this)
              }
              )))
          }
      }
  };
  function li(t, e) {
      t && (t.hidden = e)
  }
  async function $r(t, e, {content: i, duration: s, velocity: n, transition: o}) {
      var r;
      i = ((r = t._wrapper) == null ? void 0 : r.firstElementChild) || w(i, t),
      t._wrapper || (t._wrapper = Ue(i, "<div>"));
      const a = t._wrapper;
      h(a, "overflow", "hidden");
      const l = $(h(a, "height"));
      await S.cancel(a),
      li(i, !1);
      const c = Nt(["marginTop", "marginBottom"], d=>h(i, d)) + b(i).height
        , u = l / c;
      s = (n * c + s) * (e ? 1 - u : u),
      h(a, "height", l),
      await S.start(a, {
          height: e ? c : 0
      }, s, o),
      _e(i),
      delete t._wrapper,
      e || li(i, !0)
  }
  function xr(t) {
      const [e] = mt(t, !0);
      let i;
      return function s() {
          i = requestAnimationFrame(()=>{
              const {top: n} = t.getBoundingClientRect();
              n < 0 && (e.scrollTop += n),
              s()
          }
          )
      }(),
      ()=>requestAnimationFrame(()=>cancelAnimationFrame(i))
  }
  var yr = {
      mixins: [st, Yt],
      args: "animation",
      props: {
          animation: Boolean,
          close: String
      },
      data: {
          animation: !0,
          selClose: ".bdt-alert-close",
          duration: 150
      },
      events: {
          name: "click",
          delegate() {
              return this.selClose
          },
          handler(t) {
              t.preventDefault(),
              this.close()
          }
      },
      methods: {
          async close() {
              await this.toggleElement(this.$el, !1, kr),
              this.$destroy(!0)
          }
      }
  };
  function kr(t, e, {duration: i, transition: s, velocity: n}) {
      const o = $(h(t, "height"));
      return h(t, "height", o),
      S.start(t, {
          height: 0,
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          borderTop: 0,
          borderBottom: 0,
          opacity: 0
      }, n * o + i, s)
  }
  var an = {
      args: "autoplay",
      props: {
          automute: Boolean,
          autoplay: Boolean
      },
      data: {
          automute: !1,
          autoplay: !0
      },
      connected() {
          this.inView = this.autoplay === "inview",
          this.inView && !wt(this.$el, "preload") && (this.$el.preload = "none"),
          X(this.$el, "iframe") && !wt(this.$el, "allow") && (this.$el.allow = "autoplay"),
          this.automute && Hs(this.$el),
          this.registerObserver(ce(this.$el, ()=>this.$emit(), {}, !1))
      },
      update: {
          read({visible: t}) {
              return Ls(this.$el) ? {
                  prev: t,
                  visible: q(this.$el) && h(this.$el, "visibility") !== "hidden",
                  inView: this.inView && Zi(this.$el)
              } : !1
          },
          write({prev: t, visible: e, inView: i}) {
              !e || this.inView && !i ? Fs(this.$el) : (this.autoplay === !0 && !t || this.inView && i) && zs(this.$el)
          }
      }
  }
    , bt = {
      connected() {
          var t;
          this.registerObserver(Pe(((t = this.$options.resizeTargets) == null ? void 0 : t.call(this)) || this.$el, ()=>this.$emit("resize")))
      }
  }
    , Sr = {
      mixins: [bt, an],
      props: {
          width: Number,
          height: Number
      },
      data: {
          automute: !0
      },
      events: {
          "load loadedmetadata"() {
              this.$emit("resize")
          }
      },
      resizeTargets() {
          return [this.$el, ln(this.$el) || A(this.$el)]
      },
      update: {
          read() {
              const {ratio: t, cover: e} = Ge
                , {$el: i, width: s, height: n} = this;
              let o = {
                  width: s,
                  height: n
              };
              if (!o.width || !o.height) {
                  const c = {
                      width: i.naturalWidth || i.videoWidth || i.clientWidth,
                      height: i.naturalHeight || i.videoHeight || i.clientHeight
                  };
                  o.width ? o = t(c, "width", o.width) : n ? o = t(c, "height", o.height) : o = c
              }
              const {offsetHeight: r, offsetWidth: a} = ln(i) || A(i)
                , l = e(o, {
                  width: a + (a % 2 ? 1 : 0),
                  height: r + (r % 2 ? 1 : 0)
              });
              return !l.width || !l.height ? !1 : l
          },
          write({height: t, width: e}) {
              h(this.$el, {
                  height: t,
                  width: e
              })
          },
          events: ["resize"]
      }
  };
  function ln(t) {
      for (; t = A(t); )
          if (h(t, "position") !== "static")
              return t
  }
  var Be = {
      props: {
          container: Boolean
      },
      data: {
          container: !0
      },
      computed: {
          container({container: t}) {
              return t === !0 && this.$container || t && w(t)
          }
      }
  }
    , hn = {
      props: {
          pos: String,
          offset: null,
          flip: Boolean,
          shift: Boolean,
          inset: Boolean
      },
      data: {
          pos: `bottom-${J ? "right" : "left"}`,
          offset: !1,
          flip: !0,
          shift: !0,
          inset: !1
      },
      connected() {
          this.pos = this.$props.pos.split("-").concat("center").slice(0, 2),
          [this.dir,this.align] = this.pos,
          this.axis = v(["top", "bottom"], this.dir) ? "y" : "x"
      },
      methods: {
          positionAt(t, e, i) {
              let s = [this.getPositionOffset(t), this.getShiftOffset(t)];
              const n = [this.flip && "flip", this.shift && "shift"]
                , o = {
                  element: [this.inset ? this.dir : ei(this.dir), this.align],
                  target: [this.dir, this.align]
              };
              if (this.axis === "y") {
                  for (const l in o)
                      o[l].reverse();
                  s.reverse(),
                  n.reverse()
              }
              const r = Tr(t)
                , a = b(t);
              h(t, {
                  top: -a.height,
                  left: -a.width
              }),
              Ys(t, e, {
                  attach: o,
                  offset: s,
                  boundary: i,
                  placement: n,
                  viewportOffset: this.getViewportOffset(t)
              }),
              r()
          },
          getPositionOffset(t) {
              return rt(this.offset === !1 ? h(t, "--bdt-position-offset") : this.offset, this.axis === "x" ? "width" : "height", t) * (v(["left", "top"], this.dir) ? -1 : 1) * (this.inset ? -1 : 1)
          },
          getShiftOffset(t) {
              return this.align === "center" ? 0 : rt(h(t, "--bdt-position-shift-offset"), this.axis === "y" ? "width" : "height", t) * (v(["left", "top"], this.align) ? 1 : -1)
          },
          getViewportOffset(t) {
              return rt(h(t, "--bdt-position-viewport-offset"))
          }
      }
  };
  function Tr(t) {
      const [e] = mt(t)
        , {scrollTop: i} = e;
      return ()=>{
          i !== e.scrollTop && (e.scrollTop = i)
      }
  }
  let Z;
  var cn = {
      mixins: [Be, Oe, hn, Yt],
      args: "pos",
      props: {
          mode: "list",
          toggle: Boolean,
          boundary: Boolean,
          boundaryX: Boolean,
          boundaryY: Boolean,
          target: Boolean,
          targetX: Boolean,
          targetY: Boolean,
          stretch: Boolean,
          delayShow: Number,
          delayHide: Number,
          autoUpdate: Boolean,
          clsDrop: String,
          animateOut: Boolean,
          bgScroll: Boolean
      },
      data: {
          mode: ["click", "hover"],
          toggle: "- *",
          boundary: !1,
          boundaryX: !1,
          boundaryY: !1,
          target: !1,
          targetX: !1,
          targetY: !1,
          stretch: !1,
          delayShow: 0,
          delayHide: 800,
          autoUpdate: !0,
          clsDrop: !1,
          animateOut: !1,
          bgScroll: !0,
          animation: ["bdt-animation-fade"],
          cls: "bdt-open",
          container: !1
      },
      computed: {
          boundary({boundary: t, boundaryX: e, boundaryY: i}, s) {
              return [ut(e || t, s) || window, ut(i || t, s) || window]
          },
          target({target: t, targetX: e, targetY: i}, s) {
              return e = e || t || this.targetEl,
              i = i || t || this.targetEl,
              [e === !0 ? window : ut(e, s), i === !0 ? window : ut(i, s)]
          }
      },
      created() {
          this.tracker = new Gi
      },
      beforeConnect() {
          this.clsDrop = this.$props.clsDrop || `bdt-${this.$options.name}`
      },
      connected() {
          y(this.$el, "bdt-drop", this.clsDrop),
          this.toggle && !this.targetEl && (this.targetEl = Er(this)),
          this._style = (({width: t, height: e})=>({
              width: t,
              height: e
          }))(this.$el.style)
      },
      disconnected() {
          this.isActive() && (this.hide(!1),
          Z = null),
          h(this.$el, this._style)
      },
      events: [{
          name: "click",
          delegate() {
              return ".bdt-drop-close"
          },
          handler(t) {
              t.preventDefault(),
              this.hide(!1)
          }
      }, {
          name: "click",
          delegate() {
              return 'a[href*="#"]'
          },
          handler({defaultPrevented: t, current: e}) {
              const {hash: i} = e;
              !t && i && De(e) && !D(i, this.$el) && this.hide(!1)
          }
      }, {
          name: "beforescroll",
          handler() {
              this.hide(!1)
          }
      }, {
          name: "toggle",
          self: !0,
          handler(t, e) {
              t.preventDefault(),
              this.isToggled() ? this.hide(!1) : this.show(e == null ? void 0 : e.$el, !1)
          }
      }, {
          name: "toggleshow",
          self: !0,
          handler(t, e) {
              t.preventDefault(),
              this.show(e == null ? void 0 : e.$el)
          }
      }, {
          name: "togglehide",
          self: !0,
          handler(t) {
              t.preventDefault(),
              _(this.$el, ":focus,:hover") || this.hide()
          }
      }, {
          name: `${At} focusin`,
          filter() {
              return v(this.mode, "hover")
          },
          handler(t) {
              Tt(t) || this.clearTimers()
          }
      }, {
          name: `${qt} focusout`,
          filter() {
              return v(this.mode, "hover")
          },
          handler(t) {
              !Tt(t) && t.relatedTarget && this.hide()
          }
      }, {
          name: "toggled",
          self: !0,
          handler(t, e) {
              f(this.targetEl, "aria-expanded", e ? !0 : null),
              e && (this.clearTimers(),
              this.position())
          }
      }, {
          name: "show",
          self: !0,
          handler() {
              Z = this,
              this.tracker.init();
              const t = [Ir(this), Ar(this), Or(this), this.autoUpdate && Pr(this), !this.bgScroll && nn(this.$el)];
              L(this.$el, "hide", ()=>t.forEach(e=>e && e()), {
                  self: !0
              })
          }
      }, {
          name: "beforehide",
          self: !0,
          handler() {
              this.clearTimers()
          }
      }, {
          name: "hide",
          handler({target: t}) {
              if (this.$el !== t) {
                  Z = Z === null && D(t, this.$el) && this.isToggled() ? this : Z;
                  return
              }
              Z = this.isActive() ? null : Z,
              this.tracker.cancel()
          }
      }],
      update: {
          write() {
              this.isToggled() && !B(this.$el, this.clsEnter) && this.position()
          }
      },
      methods: {
          show(t=this.targetEl, e=!0) {
              if (this.isToggled() && t && this.targetEl && t !== this.targetEl && this.hide(!1, !1),
              this.targetEl = t,
              this.clearTimers(),
              !this.isActive()) {
                  if (Z) {
                      if (e && Z.isDelaying) {
                          this.showTimer = setTimeout(()=>_(t, ":hover") && this.show(), 10);
                          return
                      }
                      let i;
                      for (; Z && i !== Z && !D(this.$el, Z.$el); )
                          i = Z,
                          Z.hide(!1, !1)
                  }
                  this.container && A(this.$el) !== this.container && W(this.container, this.$el),
                  this.showTimer = setTimeout(()=>this.toggleElement(this.$el, !0), e && this.delayShow || 0)
              }
          },
          hide(t=!0, e=!0) {
              const i = ()=>this.toggleElement(this.$el, !1, this.animateOut && e);
              this.clearTimers(),
              this.isDelaying = Cr(this.$el).some(s=>this.tracker.movesTo(s)),
              t && this.isDelaying ? this.hideTimer = setTimeout(this.hide, 50) : t && this.delayHide ? this.hideTimer = setTimeout(i, this.delayHide) : i()
          },
          clearTimers() {
              clearTimeout(this.showTimer),
              clearTimeout(this.hideTimer),
              this.showTimer = null,
              this.hideTimer = null,
              this.isDelaying = !1
          },
          isActive() {
              return Z === this
          },
          position() {
              z(this.$el, "bdt-drop-stack"),
              h(this.$el, this._style),
              this.$el.hidden = !0;
              const t = this.target.map(n=>_r(this.$el, n))
                , e = this.getViewportOffset(this.$el)
                , i = [[0, ["x", "width", "left", "right"]], [1, ["y", "height", "top", "bottom"]]];
              for (const [n,[o,r]] of i)
                  this.axis !== o && v([o, !0], this.stretch) && h(this.$el, {
                      [r]: Math.min(I(this.boundary[n])[r], t[n][r] - 2 * e),
                      [`overflow-${o}`]: "auto"
                  });
              const s = t[0].width - 2 * e;
              this.$el.hidden = !1,
              h(this.$el, "maxWidth", ""),
              this.$el.offsetWidth > s && y(this.$el, "bdt-drop-stack"),
              h(this.$el, "maxWidth", s),
              this.positionAt(this.$el, this.target, this.boundary);
              for (const [n,[o,r,a,l]] of i)
                  if (this.axis === o && v([o, !0], this.stretch)) {
                      const c = Math.abs(this.getPositionOffset(this.$el))
                        , u = I(this.target[n])
                        , d = I(this.$el);
                      h(this.$el, {
                          [r]: (u[a] > d[a] ? u[a] - Math.max(I(this.boundary[n])[a], t[n][a] + e) : Math.min(I(this.boundary[n])[l], t[n][l] - e) - u[l]) - c,
                          [`overflow-${o}`]: "auto"
                      }),
                      this.positionAt(this.$el, this.target, this.boundary)
                  }
          }
      }
  };
  function Cr(t) {
      const e = [];
      return Ct(t, i=>h(i, "position") !== "static" && e.push(i)),
      e
  }
  function _r(t, e) {
      return at(Vt(e).find(i=>D(t, i)))
  }
  function Er(t) {
      const {$el: e} = t.$create("toggle", ut(t.toggle, t.$el), {
          target: t.$el,
          mode: t.mode
      });
      return f(e, "aria-haspopup", !0),
      t.lazyload(e),
      e
  }
  function Ir(t) {
      const e = ()=>t.$emit()
        , i = x(window, "resize", e)
        , s = Pe(Vt(t.$el).concat(t.target), e);
      return ()=>{
          s.disconnect(),
          i()
      }
  }
  function Pr(t) {
      return x([document, ...Vt(t.$el)], "scroll", ()=>t.$emit(), {
          passive: !0
      })
  }
  function Ar(t) {
      return x(document, "keydown", e=>{
          e.keyCode === C.ESC && t.hide(!1)
      }
      )
  }
  function Or(t) {
      return x(document, gt, ({target: e})=>{
          D(e, t.$el) || L(document, `${Pt} ${si} scroll`, ({defaultPrevented: i, type: s, target: n})=>{
              !i && s === Pt && e === n && !(t.targetEl && D(e, t.targetEl)) && t.hide(!1)
          }
          , !0)
      }
      )
  }
  var un = {
      mixins: [st, Be],
      props: {
          dropdown: String,
          align: String,
          clsDrop: String,
          boundary: Boolean,
          dropbar: Boolean,
          dropbarAnchor: Boolean,
          duration: Number,
          mode: Boolean,
          offset: Boolean,
          stretch: Boolean,
          delayShow: Boolean,
          delayHide: Boolean,
          target: Boolean,
          targetX: Boolean,
          targetY: Boolean,
          animation: Boolean,
          animateOut: Boolean
      },
      data: {
          dropdown: "> li > a, > ul > li > a",
          align: J ? "right" : "left",
          clsDrop: "bdt-dropdown",
          clsDropbar: "bdt-dropnav-dropbar",
          boundary: !0,
          dropbar: !1,
          dropbarAnchor: !1,
          duration: 200,
          container: !1
      },
      computed: {
          dropbarAnchor({dropbarAnchor: t}, e) {
              return ut(t, e) || e
          },
          dropbar: {
              get({dropbar: t}) {
                  return t ? (t = this._dropbar || ut(t, this.$el) || w(`+ .${this.clsDropbar}`, this.$el),
                  t || (this._dropbar = w("<div></div>"))) : null
              },
              watch(t) {
                  y(t, "bdt-dropbar", "bdt-dropbar-top", this.clsDropbar, `bdt-${this.$options.name}-dropbar`)
              },
              immediate: !0
          },
          dropContainer(t, e) {
              return this.container || e
          },
          dropdowns: {
              get({clsDrop: t}, e) {
                  var i;
                  const s = O(`.${t}`, e);
                  if (this.dropContainer !== e)
                      for (const n of O(`.${t}`, this.dropContainer)) {
                          const o = (i = this.getDropdown(n)) == null ? void 0 : i.targetEl;
                          !v(s, n) && o && D(o, this.$el) && s.push(n)
                      }
                  return s
              },
              watch(t) {
                  this.$create("drop", t.filter(e=>!this.getDropdown(e)), {
                      ...this.$props,
                      flip: !1,
                      shift: !0,
                      pos: `bottom-${this.align}`,
                      boundary: this.boundary === !0 ? this.$el : this.boundary
                  })
              },
              immediate: !0
          },
          items: {
              get({dropdown: t}, e) {
                  return O(t, e)
              },
              watch(t) {
                  f(E(this.$el), "role", "presentation"),
                  f(t, {
                      tabindex: -1,
                      role: "menuitem"
                  }),
                  f(t[0], "tabindex", 0)
              },
              immediate: !0
          }
      },
      connected() {
          f(this.$el, "role", "menubar")
      },
      disconnected() {
          ot(this._dropbar),
          delete this._dropbar
      },
      events: [{
          name: "mouseover focusin",
          delegate() {
              return this.dropdown
          },
          handler({current: t, type: e}) {
              const i = this.getActive();
              if (i && v(i.mode, "hover") && i.targetEl && !D(i.targetEl, t) && !i.isDelaying && i.hide(!1),
              e === "focusin")
                  for (const s of this.items)
                      f(s, "tabindex", t === s ? 0 : -1)
          }
      }, {
          name: "keydown",
          delegate() {
              return this.dropdown
          },
          handler(t) {
              const {current: e, keyCode: i} = t
                , s = this.getActive();
              i === C.DOWN && wt(e, "aria-expanded") && (t.preventDefault(),
              !s || s.targetEl !== e ? (e.click(),
              L(this.dropContainer, "show", ({target: n})=>fn(n))) : fn(s.$el)),
              dn(t, this.items, s)
          }
      }, {
          name: "keydown",
          el() {
              return this.dropContainer
          },
          delegate() {
              return `.${this.clsDrop}`
          },
          handler(t) {
              var e;
              const {current: i, keyCode: s} = t;
              if (!v(this.dropdowns, i))
                  return;
              const n = this.getActive();
              let o = -1;
              if (s === C.HOME ? o = 0 : s === C.END ? o = "last" : s === C.UP ? o = "previous" : s === C.DOWN ? o = "next" : s === C.ESC && ((e = n.targetEl) == null || e.focus()),
              ~o) {
                  t.preventDefault();
                  const r = O(ye, i);
                  r[ct(o, r, $t(r, a=>_(a, ":focus")))].focus()
              }
              dn(t, this.items, n)
          }
      }, {
          name: "mouseleave",
          el() {
              return this.dropbar
          },
          filter() {
              return this.dropbar
          },
          handler() {
              const t = this.getActive();
              t && v(t.mode, "hover") && !this.dropdowns.some(e=>_(e, ":hover")) && t.hide()
          }
      }, {
          name: "beforeshow",
          el() {
              return this.dropContainer
          },
          filter() {
              return this.dropbar
          },
          handler({target: t}) {
              this.isDropbarDrop(t) && (this.dropbar.previousElementSibling !== this.dropbarAnchor && Ze(this.dropbarAnchor, this.dropbar),
              y(t, `${this.clsDrop}-dropbar`))
          }
      }, {
          name: "show",
          el() {
              return this.dropContainer
          },
          filter() {
              return this.dropbar
          },
          handler({target: t}) {
              if (!this.isDropbarDrop(t))
                  return;
              const e = this.getDropdown(t)
                , i = ()=>{
                  const s = ne(t, `.${this.clsDrop}`).concat(t).map(a=>I(a))
                    , n = Math.min(...s.map(({top: a})=>a))
                    , o = Math.max(...s.map(({bottom: a})=>a))
                    , r = I(this.dropbar);
                  h(this.dropbar, "top", this.dropbar.offsetTop - (r.top - n)),
                  this.transitionTo(o - n + $(h(t, "marginBottom")), t)
              }
              ;
              this._observer = Pe([e.$el, ...e.target], i),
              i()
          }
      }, {
          name: "beforehide",
          el() {
              return this.dropContainer
          },
          filter() {
              return this.dropbar
          },
          handler(t) {
              const e = this.getActive();
              _(this.dropbar, ":hover") && e.$el === t.target && !this.items.some(i=>e.targetEl !== i && _(i, ":focus")) && t.preventDefault()
          }
      }, {
          name: "hide",
          el() {
              return this.dropContainer
          },
          filter() {
              return this.dropbar
          },
          handler({target: t}) {
              var e;
              if (!this.isDropbarDrop(t))
                  return;
              (e = this._observer) == null || e.disconnect();
              const i = this.getActive();
              (!i || i.$el === t) && this.transitionTo(0)
          }
      }],
      methods: {
          getActive() {
              var t;
              return v(this.dropdowns, (t = Z) == null ? void 0 : t.$el) && Z
          },
          async transitionTo(t, e) {
              const {dropbar: i} = this
                , s = et(i);
              e = s < t && e,
              await S.cancel([e, i]),
              h(e, "clipPath", `polygon(0 0,100% 0,100% ${s}px,0 ${s}px)`),
              et(i, s),
              await Promise.all([S.start(i, {
                  height: t
              }, this.duration), S.start(e, {
                  clipPath: `polygon(0 0,100% 0,100% ${t}px,0 ${t}px)`
              }, this.duration).finally(()=>h(e, {
                  clipPath: ""
              }))]).catch(P)
          },
          getDropdown(t) {
              return this.$getComponent(t, "drop") || this.$getComponent(t, "dropdown")
          },
          isDropbarDrop(t) {
              return this.getDropdown(t) && B(t, this.clsDrop)
          }
      }
  };
  function dn(t, e, i) {
      var s, n, o;
      const {current: r, keyCode: a} = t;
      let l = -1;
      a === C.HOME ? l = 0 : a === C.END ? l = "last" : a === C.LEFT ? l = "previous" : a === C.RIGHT ? l = "next" : a === C.TAB && ((s = i.targetEl) == null || s.focus(),
      (n = i.hide) == null || n.call(i, !1)),
      ~l && (t.preventDefault(),
      (o = i.hide) == null || o.call(i, !1),
      e[ct(l, e, e.indexOf(i.targetEl || r))].focus())
  }
  function fn(t) {
      var e;
      w(":focus", t) || (e = w(ye, t)) == null || e.focus()
  }
  var Dr = {
      mixins: [st],
      args: "target",
      props: {
          target: Boolean
      },
      data: {
          target: !1
      },
      computed: {
          input(t, e) {
              return w(xe, e)
          },
          state() {
              return this.input.nextElementSibling
          },
          target({target: t}, e) {
              return t && (t === !0 && A(this.input) === e && this.input.nextElementSibling || w(t, e))
          }
      },
      update() {
          var t;
          const {target: e, input: i} = this;
          if (!e)
              return;
          let s;
          const n = Mi(e) ? "value" : "textContent"
            , o = e[n]
            , r = (t = i.files) != null && t[0] ? i.files[0].name : _(i, "select") && (s = O("option", i).filter(a=>a.selected)[0]) ? s.textContent : i.value;
          o !== r && (e[n] = r)
      },
      events: [{
          name: "change",
          handler() {
              this.$emit()
          }
      }, {
          name: "reset",
          el() {
              return Y(this.$el, "form")
          },
          handler() {
              this.$emit()
          }
      }]
  }
    , pn = {
      mixins: [bt],
      props: {
          margin: String,
          firstColumn: Boolean
      },
      data: {
          margin: "bdt-margin-small-top",
          firstColumn: "bdt-first-column"
      },
      resizeTargets() {
          return [this.$el, ..._i(this.$el.children)]
      },
      connected() {
          this.registerObserver(Bs(this.$el, ()=>this.$reset(), {
              childList: !0,
              attributes: !0,
              attributeFilter: ["style"]
          }))
      },
      update: {
          read() {
              const t = is(this.$el.children);
              return {
                  rows: t,
                  columns: Br(t)
              }
          },
          write({columns: t, rows: e}) {
              for (const i of e)
                  for (const s of i)
                      j(s, this.margin, e[0] !== i),
                      j(s, this.firstColumn, t[0].includes(s))
          },
          events: ["resize"]
      }
  };
  function is(t) {
      return gn(t, "top", "bottom")
  }
  function Br(t) {
      const e = [];
      for (const i of t) {
          const s = gn(i, "left", "right");
          for (let n = 0; n < s.length; n++)
              e[n] = e[n] ? e[n].concat(s[n]) : s[n]
      }
      return J ? e.reverse() : e
  }
  function gn(t, e, i) {
      const s = [[]];
      for (const n of t) {
          if (!q(n))
              continue;
          let o = hi(n);
          for (let r = s.length - 1; r >= 0; r--) {
              const a = s[r];
              if (!a[0]) {
                  a.push(n);
                  break
              }
              let l;
              if (a[0].offsetParent === n.offsetParent ? l = hi(a[0]) : (o = hi(n, !0),
              l = hi(a[0], !0)),
              o[e] >= l[i] - 1 && o[e] !== l[e]) {
                  s.push([n]);
                  break
              }
              if (o[i] - 1 > l[e] || o[e] === l[e]) {
                  a.push(n);
                  break
              }
              if (r === 0) {
                  s.unshift([n]);
                  break
              }
          }
      }
      return s
  }
  function hi(t, e=!1) {
      let {offsetTop: i, offsetLeft: s, offsetHeight: n, offsetWidth: o} = t;
      return e && ([i,s] = Wt(t)),
      {
          top: i,
          left: s,
          bottom: i + n,
          right: s + o
      }
  }
  var ci = {
      connected() {
          mn(this._uid, ()=>this.$emit("scroll"))
      },
      disconnected() {
          vn(this._uid)
      }
  };
  const ui = new Map;
  let Me;
  function mn(t, e) {
      Me = Me || x(window, "scroll", ()=>ui.forEach(i=>i()), {
          passive: !0,
          capture: !0
      }),
      ui.set(t, e)
  }
  function vn(t) {
      ui.delete(t),
      Me && !ui.size && (Me(),
      Me = null)
  }
  var Mr = {
      extends: pn,
      mixins: [st],
      name: "grid",
      props: {
          masonry: Boolean,
          parallax: Number
      },
      data: {
          margin: "bdt-grid-margin",
          clsStack: "bdt-grid-stack",
          masonry: !1,
          parallax: 0
      },
      connected() {
          this.masonry && y(this.$el, "bdt-flex-top bdt-flex-wrap-top"),
          this.parallax && mn(this._uid, ()=>this.$emit("scroll"))
      },
      disconnected() {
          vn(this._uid)
      },
      update: [{
          write({columns: t}) {
              j(this.$el, this.clsStack, t.length < 2)
          },
          events: ["resize"]
      }, {
          read(t) {
              let {columns: e, rows: i} = t;
              if (!e.length || !this.masonry && !this.parallax || wn(this.$el))
                  return t.translates = !1,
                  !1;
              let s = !1;
              const n = E(this.$el)
                , o = e.map(c=>Nt(c, "offsetHeight"))
                , r = zr(n, this.margin) * (i.length - 1)
                , a = Math.max(...o) + r;
              this.masonry && (e = e.map(c=>Ve(c, "offsetTop")),
              s = Nr(i, e));
              let l = Math.abs(this.parallax);
              return l && (l = o.reduce((c,u,d)=>Math.max(c, u + r + (d % 2 ? l : l / 8) - a), 0)),
              {
                  padding: l,
                  columns: e,
                  translates: s,
                  height: s ? a : ""
              }
          },
          write({height: t, padding: e}) {
              h(this.$el, "paddingBottom", e || ""),
              t !== !1 && h(this.$el, "height", t)
          },
          events: ["resize"]
      }, {
          read() {
              return this.parallax && wn(this.$el) ? !1 : {
                  scrolled: this.parallax ? Qi(this.$el) * Math.abs(this.parallax) : !1
              }
          },
          write({columns: t, scrolled: e, translates: i}) {
              e === !1 && !i || t.forEach((s,n)=>s.forEach((o,r)=>h(o, "transform", !e && !i ? "" : `translateY(${(i && -i[n][r]) + (e ? n % 2 ? e : e / 8 : 0)}px)`)))
          },
          events: ["scroll", "resize"]
      }]
  };
  function wn(t) {
      return E(t).some(e=>h(e, "position") === "absolute")
  }
  function Nr(t, e) {
      const i = t.map(s=>Math.max(...s.map(n=>n.offsetHeight)));
      return e.map(s=>{
          let n = 0;
          return s.map((o,r)=>n += r ? i[r - 1] - s[r - 1].offsetHeight : 0)
      }
      )
  }
  function zr(t, e) {
      const [i] = t.filter(s=>B(s, e));
      return $(i ? h(i, "marginTop") : h(t[0], "paddingLeft"))
  }
  var Fr = {
      mixins: [bt],
      args: "target",
      props: {
          target: String,
          row: Boolean
      },
      data: {
          target: "> *",
          row: !0
      },
      computed: {
          elements: {
              get({target: t}, e) {
                  return O(t, e)
              },
              watch() {
                  this.$reset()
              }
          }
      },
      resizeTargets() {
          return [this.$el, ...this.elements]
      },
      update: {
          read() {
              return {
                  rows: (this.row ? is(this.elements) : [this.elements]).map(Hr)
              }
          },
          write({rows: t}) {
              for (const {heights: e, elements: i} of t)
                  i.forEach((s,n)=>h(s, "minHeight", e[n]))
          },
          events: ["resize"]
      }
  };
  function Hr(t) {
      if (t.length < 2)
          return {
              heights: [""],
              elements: t
          };
      h(t, "minHeight", "");
      let e = t.map(Lr);
      const i = Math.max(...e);
      return {
          heights: t.map((s,n)=>e[n].toFixed(2) === i.toFixed(2) ? "" : i),
          elements: t
      }
  }
  function Lr(t) {
      let e = !1;
      q(t) || (e = t.style.display,
      h(t, "display", "block", "important"));
      const i = b(t).height - ae(t, "height", "content-box");
      return e !== !1 && h(t, "display", e),
      i
  }
  var Wr = {
      mixins: [bt],
      props: {
          expand: Boolean,
          offsetTop: Boolean,
          offsetBottom: Boolean,
          minHeight: Number
      },
      data: {
          expand: !1,
          offsetTop: !1,
          offsetBottom: !1,
          minHeight: 0
      },
      resizeTargets() {
          return [this.$el, ...mt(this.$el)]
      },
      update: {
          read({minHeight: t}) {
              if (!q(this.$el))
                  return !1;
              let e = "";
              const i = ae(this.$el, "height", "content-box")
                , {body: s, scrollingElement: n} = document
                , [o] = mt(this.$el)
                , {height: r} = at(o === s ? n : o);
              if (this.expand)
                  e = Math.max(r - (b(o).height - b(this.$el).height) - i, 0);
              else {
                  const a = n === o || s === o;
                  if (e = `calc(${a ? "100vh" : `${r}px`}`,
                  this.offsetTop)
                      if (a) {
                          const l = Wt(this.$el)[0] - Wt(o)[0];
                          e += l > 0 && l < r / 2 ? ` - ${l}px` : ""
                      } else
                          e += ` - ${h(o, "paddingTop")}`;
                  this.offsetBottom === !0 ? e += ` - ${b(this.$el.nextElementSibling).height}px` : vt(this.offsetBottom) ? e += ` - ${this.offsetBottom}vh` : this.offsetBottom && Qt(this.offsetBottom, "px") ? e += ` - ${$(this.offsetBottom)}px` : N(this.offsetBottom) && (e += ` - ${b(ut(this.offsetBottom, this.$el)).height}px`),
                  e += `${i ? ` - ${i}px` : ""})`
              }
              return {
                  minHeight: e,
                  prev: t
              }
          },
          write({minHeight: t}) {
              h(this.$el, {
                  minHeight: t
              }),
              this.minHeight && $(h(this.$el, "minHeight")) < this.minHeight && h(this.$el, "minHeight", this.minHeight)
          },
          events: ["resize"]
      }
  }
    , bn = {
      args: "src",
      props: {
          id: Boolean,
          icon: String,
          src: String,
          style: String,
          width: Number,
          height: Number,
          ratio: Number,
          class: String,
          strokeAnimation: Boolean,
          attributes: "list"
      },
      data: {
          ratio: 1,
          include: ["style", "class"],
          class: "",
          strokeAnimation: !1
      },
      beforeConnect() {
          this.class += " bdt-svg"
      },
      connected() {
          !this.icon && v(this.src, "#") && ([this.src,this.icon] = this.src.split("#")),
          this.svg = this.getSvg().then(t=>{
              if (this._connected) {
                  const e = Vr(t, this.$el);
                  return this.svgEl && e !== this.svgEl && ot(this.svgEl),
                  this.applyAttributes(e, t),
                  this.svgEl = e
              }
          }
          , P),
          this.strokeAnimation && this.svg.then(t=>{
              this._connected && t && (xn(t),
              this.registerObserver(ce(t, (e,i)=>{
                  xn(t),
                  i.disconnect()
              }
              )))
          }
          )
      },
      disconnected() {
          this.svg.then(t=>{
              this._connected || (Bi(this.$el) && (this.$el.hidden = !1),
              ot(t),
              this.svgEl = null)
          }
          ),
          this.svg = null
      },
      methods: {
          async getSvg() {
              return X(this.$el, "img") && !this.$el.complete && this.$el.loading === "lazy" ? new Promise(t=>L(this.$el, "load", ()=>t(this.getSvg()))) : jr(await Rr(this.src), this.icon) || Promise.reject("SVG not found.")
          },
          applyAttributes(t, e) {
              for (const o in this.$options.props)
                  v(this.include, o) && o in this && f(t, o, this[o]);
              for (const o in this.attributes) {
                  const [r,a] = this.attributes[o].split(":", 2);
                  f(t, r, a)
              }
              this.id || $e(t, "id");
              const i = ["width", "height"];
              let s = i.map(o=>this[o]);
              s.some(o=>o) || (s = i.map(o=>f(e, o)));
              const n = f(e, "viewBox");
              n && !s.some(o=>o) && (s = n.split(" ").slice(2)),
              s.forEach((o,r)=>f(t, i[r], $(o) * this.ratio || null))
          }
      }
  };
  const Rr = ft(async t=>t ? ht(t, "data:") ? decodeURIComponent(t.split(",")[1]) : (await fetch(t)).text() : Promise.reject());
  function jr(t, e) {
      return e && v(t, "<symbol") && (t = qr(t, e) || t),
      t = w(t.substr(t.indexOf("<svg"))),
      (t == null ? void 0 : t.hasChildNodes()) && t
  }
  const $n = /<symbol([^]*?id=(['"])(.+?)\2[^]*?<\/)symbol>/g
    , di = {};
  function qr(t, e) {
      if (!di[t]) {
          di[t] = {},
          $n.lastIndex = 0;
          let i;
          for (; i = $n.exec(t); )
              di[t][i[3]] = `<svg xmlns="http://www.w3.org/2000/svg"${i[1]}svg>`
      }
      return di[t][e]
  }
  function xn(t) {
      const e = sn(t);
      e && t.style.setProperty("--bdt-animation-stroke", e)
  }
  function Vr(t, e) {
      if (Bi(e) || X(e, "canvas")) {
          e.hidden = !0;
          const s = e.nextElementSibling;
          return yn(t, s) ? s : Ze(e, t)
      }
      const i = e.lastElementChild;
      return yn(t, i) ? i : W(e, t)
  }
  function yn(t, e) {
      return X(t, "svg") && X(e, "svg") && t.innerHTML === e.innerHTML
  }
  var ss = {
      props: {
          i18n: Object
      },
      data: {
          i18n: null
      },
      methods: {
          t(t, ...e) {
              var i, s, n;
              let o = 0;
              return ((n = ((i = this.i18n) == null ? void 0 : i[t]) || ((s = this.$options.i18n) == null ? void 0 : s[t])) == null ? void 0 : n.replace(/%s/g, ()=>e[o++] || "")) || ""
          }
      }
  }
    , Yr = '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"/><line fill="none" stroke="#000" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"/></svg>'
    , Gr = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" stroke-width="1.4" x1="1" y1="1" x2="19" y2="19"/><line fill="none" stroke="#000" stroke-width="1.4" x1="19" y1="1" x2="1" y2="19"/></svg>'
    , Xr = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><polyline fill="none" stroke="#000" stroke-width="1.1" points="1 3.5 6 8.5 11 3.5"/></svg>'
    , Jr = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="4" width="1" height="11"/><rect x="4" y="9" width="11" height="1"/></svg>'
    , Kr = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><polyline fill="none" stroke="#000" stroke-width="1.1" points="1 3.5 6 8.5 11 3.5"/></svg>'
    , Zr = '<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.1" points="1 4 7 10 13 4"/></svg>'
    , Qr = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><polyline fill="none" stroke="#000" stroke-width="1.1" points="1 3.5 6 8.5 11 3.5"/></svg>'
    , Ur = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><style>.bdt-navbar-toggle-animate svg>[class*=line-]{transition:.2s ease-in-out;transition-property:transform,opacity;transform-origin:center;opacity:1}.bdt-navbar-toggle svg>.line-3{opacity:0}.bdt-navbar-toggle-animate[aria-expanded=true] svg>.line-3{opacity:1}.bdt-navbar-toggle-animate[aria-expanded=true] svg>.line-2{transform:rotate(45deg)}.bdt-navbar-toggle-animate[aria-expanded=true] svg>.line-3{transform:rotate(-45deg)}.bdt-navbar-toggle-animate[aria-expanded=true] svg>.line-1,.bdt-navbar-toggle-animate[aria-expanded=true] svg>.line-4{opacity:0}.bdt-navbar-toggle-animate[aria-expanded=true] svg>.line-1{transform:translateY(6px) scaleX(0)}.bdt-navbar-toggle-animate[aria-expanded=true] svg>.line-4{transform:translateY(-6px) scaleX(0)}</style><rect class="line-1" y="3" width="20" height="2"/><rect class="line-2" y="9" width="20" height="2"/><rect class="line-3" y="9" width="20" height="2"/><rect class="line-4" y="15" width="20" height="2"/></svg>'
    , ta = '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="19" y="0" width="1" height="40"/><rect x="0" y="19" width="40" height="1"/></svg>'
    , ea = '<svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="1 1 6 6 1 11"/></svg>'
    , ia = '<svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="6 1 1 6 6 11"/></svg>'
    , sa = '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="9" cy="9" r="7"/><path fill="none" stroke="#000" stroke-width="1.1" d="M14,14 L18,18 L14,14 Z"/></svg>'
    , na = '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.8" cx="17.5" cy="17.5" r="16.5"/><line fill="none" stroke="#000" stroke-width="1.8" x1="38" y1="39" x2="29" y2="30"/></svg>'
    , oa = '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="10.5" cy="10.5" r="9.5"/><line fill="none" stroke="#000" stroke-width="1.1" x1="23" y1="23" x2="17" y2="17"/></svg>'
    , ra = '<svg width="14" height="24" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.4" points="1.225,23 12.775,12 1.225,1 "/></svg>'
    , aa = '<svg width="25" height="40" viewBox="0 0 25 40" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="2" points="4.002,38.547 22.527,20.024 4,1.5 "/></svg>'
    , la = '<svg width="14" height="24" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.4" points="12.775,1 1.225,12 12.775,23 "/></svg>'
    , ha = '<svg width="25" height="40" viewBox="0 0 25 40" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="2" points="20.527,1.5 2,20.024 20.525,38.547 "/></svg>'
    , ca = '<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" cx="15" cy="15" r="14"/></svg>'
    , ua = '<svg width="18" height="10" viewBox="0 0 18 10" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="1 9 9 1 17 9 "/></svg>';
  const fi = {
      spinner: ca,
      totop: ua,
      marker: Jr,
      "close-icon": Yr,
      "close-large": Gr,
      "drop-parent-icon": Xr,
      "nav-parent-icon": Kr,
      "nav-parent-icon-large": Zr,
      "navbar-parent-icon": Qr,
      "navbar-toggle-icon": Ur,
      "overlay-icon": ta,
      "pagination-next": ea,
      "pagination-previous": ia,
      "search-icon": sa,
      "search-large": na,
      "search-navbar": oa,
      "slidenav-next": ra,
      "slidenav-next-large": aa,
      "slidenav-previous": la,
      "slidenav-previous-large": ha
  }
    , ns = {
      install: xa,
      extends: bn,
      args: "icon",
      props: ["icon"],
      data: {
          include: []
      },
      isIcon: !0,
      beforeConnect() {
          y(this.$el, "bdt-icon")
      },
      methods: {
          async getSvg() {
              const t = ya(this.icon);
              if (!t)
                  throw "Icon not found.";
              return t
          }
      }
  }
    , Gt = {
      args: !1,
      extends: ns,
      data: t=>({
          icon: Zt(t.constructor.options.name)
      }),
      beforeConnect() {
          y(this.$el, this.$options.id)
      }
  }
    , da = {
      extends: Gt,
      beforeConnect() {
          const t = this.$props.icon;
          this.icon = Y(this.$el, ".bdt-nav-primary") ? `${t}-large` : t
      }
  }
    , fa = {
      extends: Gt,
      beforeConnect() {
          this.icon = B(this.$el, "bdt-search-icon") && ne(this.$el, ".bdt-search-large").length ? "search-large" : ne(this.$el, ".bdt-search-navbar").length ? "search-navbar" : this.$props.icon
      }
  }
    , pa = {
      extends: Gt,
      beforeConnect() {
          f(this.$el, "role", "status")
      },
      methods: {
          async getSvg() {
              const t = await ns.methods.getSvg.call(this);
              return this.ratio !== 1 && h(w("circle", t), "strokeWidth", 1 / this.ratio),
              t
          }
      }
  }
    , Xt = {
      extends: Gt,
      mixins: [ss],
      beforeConnect() {
          const t = Y(this.$el, "a,button");
          f(t, "role", this.role !== null && X(t, "a") ? "button" : this.role);
          const e = this.t("label");
          e && !wt(t, "aria-label") && f(t, "aria-label", e)
      }
  }
    , kn = {
      extends: Xt,
      beforeConnect() {
          y(this.$el, "bdt-slidenav");
          const t = this.$props.icon;
          this.icon = B(this.$el, "bdt-slidenav-large") ? `${t}-large` : t
      }
  }
    , ga = {
      extends: Xt,
      i18n: {
          label: "Open menu"
      }
  }
    , ma = {
      extends: Xt,
      i18n: {
          label: "Close"
      },
      beforeConnect() {
          this.icon = `close-${B(this.$el, "bdt-close-large") ? "large" : "icon"}`
      }
  }
    , va = {
      extends: Xt,
      i18n: {
          label: "Open"
      }
  }
    , wa = {
      extends: Xt,
      i18n: {
          label: "Back to top"
      }
  }
    , ba = {
      extends: Xt,
      i18n: {
          label: "Next page"
      },
      data: {
          role: null
      }
  }
    , $a = {
      extends: Xt,
      i18n: {
          label: "Previous page"
      },
      data: {
          role: null
      }
  }
    , pi = {};
  function xa(t) {
      t.icon.add = (e,i)=>{
          const s = N(e) ? {
              [e]: i
          } : e;
          St(s, (n,o)=>{
              fi[o] = n,
              delete pi[o]
          }
          ),
          t._initialized && Ct(document.body, n=>St(t.getComponents(n), o=>{
              o.$options.isIcon && o.icon in s && o.$reset()
          }
          ))
      }
  }
  function ya(t) {
      return fi[t] ? (pi[t] || (pi[t] = w((fi[ka(t)] || fi[t]).trim())),
      pi[t].cloneNode(!0)) : null
  }
  function ka(t) {
      return J ? Ai(Ai(t, "left", "right"), "previous", "next") : t
  }
  const Sa = Rt && "loading"in HTMLImageElement.prototype;
  var Ta = {
      args: "dataSrc",
      props: {
          dataSrc: String,
          sources: String,
          margin: String,
          target: String,
          loading: String
      },
      data: {
          dataSrc: "",
          sources: !1,
          margin: "50%",
          target: !1,
          loading: "lazy"
      },
      connected() {
          if (this.loading !== "lazy") {
              this.load();
              return
          }
          const t = [this.$el, ...Se(this.$props.target, this.$el)];
          Sa && gi(this.$el) && (this.$el.loading = "lazy",
          os(this.$el),
          t.length === 1) || (Pa(this.$el),
          this.registerObserver(ce(t, (e,i)=>{
              this.load(),
              i.disconnect()
          }
          , {
              rootMargin: this.margin
          })))
      },
      disconnected() {
          this._data.image && (this._data.image.onload = "")
      },
      methods: {
          load() {
              if (this._data.image)
                  return this._data.image;
              const t = gi(this.$el) ? this.$el : _a(this.$el, this.dataSrc, this.sources);
              return $e(t, "loading"),
              os(this.$el, t.currentSrc),
              this._data.image = t
          }
      }
  };
  function os(t, e) {
      if (gi(t)) {
          const i = A(t);
          (X(i, "picture") ? E(i) : [t]).forEach(n=>Sn(n, n))
      } else
          e && !v(t.style.backgroundImage, e) && (h(t, "backgroundImage", `url(${zi(e)})`),
          m(t, Ft("load", !1)))
  }
  const Ca = ["data-src", "data-srcset", "sizes"];
  function Sn(t, e) {
      Ca.forEach(i=>{
          const s = tt(t, i);
          s && f(e, i.replace(/^(data-)+/, ""), s)
      }
      )
  }
  function _a(t, e, i) {
      const s = new Image;
      return Ea(s, i),
      Sn(t, s),
      s.onload = ()=>{
          os(t, s.currentSrc)
      }
      ,
      f(s, "src", e),
      s
  }
  function Ea(t, e) {
      if (e = Ia(e),
      e.length) {
          const i = Ht("<picture>");
          for (const s of e) {
              const n = Ht("<source>");
              f(n, s),
              W(i, n)
          }
          W(i, t)
      }
  }
  function Ia(t) {
      if (!t)
          return [];
      if (ht(t, "["))
          try {
              t = JSON.parse(t)
          } catch {
              t = []
          }
      else
          t = de(t);
      return Q(t) || (t = [t]),
      t.filter(e=>!we(e))
  }
  function Pa(t) {
      gi(t) && !wt(t, "src") && f(t, "src", 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>')
  }
  function gi(t) {
      return X(t, "img")
  }
  var mi = {
      props: {
          media: Boolean
      },
      data: {
          media: !1
      },
      connected() {
          const t = Aa(this.media, this.$el);
          if (this.matchMedia = !0,
          t) {
              this.mediaObj = window.matchMedia(t);
              const e = ()=>{
                  this.matchMedia = this.mediaObj.matches,
                  m(this.$el, Ft("mediachange", !1, !0, [this.mediaObj]))
              }
              ;
              this.offMediaObj = x(this.mediaObj, "change", ()=>{
                  e(),
                  this.$emit("resize")
              }
              ),
              e()
          }
      },
      disconnected() {
          var t;
          (t = this.offMediaObj) == null || t.call(this)
      }
  };
  function Aa(t, e) {
      if (N(t)) {
          if (ht(t, "@"))
              t = $(h(e, `--bdt-breakpoint-${t.substr(1)}`));
          else if (isNaN(t))
              return t
      }
      return t && vt(t) ? `(min-width: ${t}px)` : ""
  }
  var Oa = {
      mixins: [st, mi, bt],
      props: {
          fill: String
      },
      data: {
          fill: "",
          clsWrapper: "bdt-leader-fill",
          clsHide: "bdt-leader-hide",
          attrFill: "data-fill"
      },
      computed: {
          fill({fill: t}) {
              return t || h(this.$el, "--bdt-leader-fill-content")
          }
      },
      connected() {
          [this.wrapper] = qi(this.$el, `<span class="${this.clsWrapper}">`)
      },
      disconnected() {
          _e(this.wrapper.childNodes)
      },
      update: {
          read() {
              return {
                  width: Math.trunc(this.$el.offsetWidth / 2),
                  fill: this.fill,
                  hide: !this.matchMedia
              }
          },
          write({width: t, fill: e, hide: i}) {
              j(this.wrapper, this.clsHide, i),
              f(this.wrapper, this.attrFill, new Array(t).join(e))
          },
          events: ["resize"]
      }
  };
  const nt = [];
  var rs = {
      mixins: [st, Be, Yt],
      props: {
          selPanel: String,
          selClose: String,
          escClose: Boolean,
          bgClose: Boolean,
          stack: Boolean,
          role: String
      },
      data: {
          cls: "bdt-open",
          escClose: !0,
          bgClose: !0,
          overlay: !0,
          stack: !1,
          role: "dialog"
      },
      computed: {
          panel({selPanel: t}, e) {
              return w(t, e)
          },
          transitionElement() {
              return this.panel
          },
          bgClose({bgClose: t}) {
              return t && this.panel
          }
      },
      connected() {
          f(this.panel || this.$el, "role", this.role),
          this.overlay && f(this.panel || this.$el, "aria-modal", !0)
      },
      beforeDisconnect() {
          v(nt, this) && this.toggleElement(this.$el, !1, !1)
      },
      events: [{
          name: "click",
          delegate() {
              return `${this.selClose},a[href*="#"]`
          },
          handler(t) {
              const {current: e, defaultPrevented: i} = t
                , {hash: s} = e;
              !i && s && De(e) && !D(s, this.$el) && w(s, document.body) ? this.hide() : _(e, this.selClose) && (t.preventDefault(),
              this.hide())
          }
      }, {
          name: "toggle",
          self: !0,
          handler(t) {
              t.defaultPrevented || (t.preventDefault(),
              this.isToggled() === v(nt, this) && this.toggle())
          }
      }, {
          name: "beforeshow",
          self: !0,
          handler(t) {
              if (v(nt, this))
                  return !1;
              !this.stack && nt.length ? (Promise.all(nt.map(e=>e.hide())).then(this.show),
              t.preventDefault()) : nt.push(this)
          }
      }, {
          name: "show",
          self: !0,
          handler() {
              this.stack && h(this.$el, "zIndex", $(h(this.$el, "zIndex")) + nt.length);
              const t = [this.overlay && Ba(this), this.overlay && nn(this.$el), this.bgClose && Ma(this), this.escClose && Na(this)];
              L(this.$el, "hidden", ()=>t.forEach(e=>e && e()), {
                  self: !0
              }),
              y(document.documentElement, this.clsPage)
          }
      }, {
          name: "shown",
          self: !0,
          handler() {
              Je(this.$el) || f(this.$el, "tabindex", "-1"),
              _(this.$el, ":focus-within") || this.$el.focus()
          }
      }, {
          name: "hidden",
          self: !0,
          handler() {
              v(nt, this) && nt.splice(nt.indexOf(this), 1),
              h(this.$el, "zIndex", ""),
              nt.some(t=>t.clsPage === this.clsPage) || z(document.documentElement, this.clsPage)
          }
      }],
      methods: {
          toggle() {
              return this.isToggled() ? this.hide() : this.show()
          },
          show() {
              return this.container && A(this.$el) !== this.container ? (W(this.container, this.$el),
              new Promise(t=>requestAnimationFrame(()=>this.show().then(t)))) : this.toggleElement(this.$el, !0, Tn)
          },
          hide() {
              return this.toggleElement(this.$el, !1, Tn)
          }
      }
  };
  function Tn(t, e, {transitionElement: i, _toggle: s}) {
      return new Promise((n,o)=>L(t, "show hide", ()=>{
          var r;
          (r = t._reject) == null || r.call(t),
          t._reject = o,
          s(t, e);
          const a = L(i, "transitionstart", ()=>{
              L(i, "transitionend transitioncancel", n, {
                  self: !0
              }),
              clearTimeout(l)
          }
          , {
              self: !0
          })
            , l = setTimeout(()=>{
              a(),
              n()
          }
          , Da(h(i, "transitionDuration")))
      }
      )).then(()=>delete t._reject)
  }
  function Da(t) {
      return t ? Qt(t, "ms") ? $(t) : $(t) * 1e3 : 0
  }
  function Ba(t) {
      return x(document, "focusin", e=>{
          se(nt) === t && !D(e.target, t.$el) && t.$el.focus()
      }
      )
  }
  function Ma(t) {
      return x(document, gt, ({target: e})=>{
          se(nt) !== t || t.overlay && !D(e, t.$el) || D(e, t.panel) || L(document, `${Pt} ${si} scroll`, ({defaultPrevented: i, type: s, target: n})=>{
              !i && s === Pt && e === n && t.hide()
          }
          , !0)
      }
      )
  }
  function Na(t) {
      return x(document, "keydown", e=>{
          e.keyCode === 27 && se(nt) === t && t.hide()
      }
      )
  }
  var za = {
      install: Fa,
      mixins: [rs],
      data: {
          clsPage: "bdt-modal-page",
          selPanel: ".bdt-modal-dialog",
          selClose: ".bdt-modal-close, .bdt-modal-close-default, .bdt-modal-close-outside, .bdt-modal-close-full"
      },
      events: [{
          name: "show",
          self: !0,
          handler() {
              B(this.panel, "bdt-margin-auto-vertical") ? y(this.$el, "bdt-flex") : h(this.$el, "display", "block"),
              et(this.$el)
          }
      }, {
          name: "hidden",
          self: !0,
          handler() {
              h(this.$el, "display", ""),
              z(this.$el, "bdt-flex")
          }
      }]
  };
  function Fa({modal: t}) {
      t.dialog = function(i, s) {
          const n = t(`<div class="bdt-modal"> <div class="bdt-modal-dialog">${i}</div> </div>`, s);
          return n.show(),
          x(n.$el, "hidden", async()=>{
              await Promise.resolve(),
              n.$destroy(!0)
          }
          , {
              self: !0
          }),
          n
      }
      ,
      t.alert = function(i, s) {
          return e(({i18n: n})=>`<div class="bdt-modal-body">${N(i) ? i : It(i)}</div> <div class="bdt-modal-footer bdt-text-right"> <button class="bdt-button bdt-button-primary bdt-modal-close" autofocus>${n.ok}</button> </div>`, s, n=>n.resolve())
      }
      ,
      t.confirm = function(i, s) {
          return e(({i18n: n})=>`<form> <div class="bdt-modal-body">${N(i) ? i : It(i)}</div> <div class="bdt-modal-footer bdt-text-right"> <button class="bdt-button bdt-button-default bdt-modal-close" type="button">${n.cancel}</button> <button class="bdt-button bdt-button-primary" autofocus>${n.ok}</button> </div> </form>`, s, n=>n.reject())
      }
      ,
      t.prompt = function(i, s, n) {
          return e(({i18n: o})=>`<form class="bdt-form-stacked"> <div class="bdt-modal-body"> <label>${N(i) ? i : It(i)}</label> <input class="bdt-input" value="${s || ""}" autofocus> </div> <div class="bdt-modal-footer bdt-text-right"> <button class="bdt-button bdt-button-default bdt-modal-close" type="button">${o.cancel}</button> <button class="bdt-button bdt-button-primary">${o.ok}</button> </div> </form>`, n, o=>o.resolve(null), o=>w("input", o.$el).value)
      }
      ,
      t.i18n = {
          ok: "Ok",
          cancel: "Cancel"
      };
      function e(i, s, n, o) {
          s = {
              bgClose: !1,
              escClose: !0,
              role: "alertdialog",
              i18n: t.i18n,
              ...s
          };
          const r = t.dialog(i(s), s)
            , a = new Xe;
          let l = !1;
          return x(r.$el, "submit", "form", c=>{
              c.preventDefault(),
              a.resolve(o == null ? void 0 : o(r)),
              l = !0,
              r.hide()
          }
          ),
          x(r.$el, "hide", ()=>!l && n(a)),
          a.promise.dialog = r,
          a.promise
      }
  }
  var Ha = {
      extends: rn,
      data: {
          targets: "> .bdt-parent",
          toggle: "> a",
          content: "> ul"
      }
  }
    , La = {
      extends: un,
      data: {
          dropdown: ".bdt-navbar-nav > li > a, .bdt-navbar-item, .bdt-navbar-toggle",
          clsDrop: "bdt-navbar-dropdown"
      },
      computed: {
          items: {
              get({dropdown: t}, e) {
                  return O(t, e)
              },
              watch(t) {
                  const e = B(this.$el, "bdt-navbar-justify");
                  for (const i of O(".bdt-navbar-nav, .bdt-navbar-left, .bdt-navbar-right", this.$el))
                      h(i, "flexGrow", e ? O(this.dropdown, i).length : "");
                  f(O(".bdt-navbar-nav", this.$el), "role", "group"),
                  f(O(".bdt-navbar-nav > *", this.$el), "role", "presentation"),
                  f(t, {
                      tabindex: -1,
                      role: "menuitem"
                  }),
                  f(t[0], "tabindex", 0)
              },
              immediate: !0
          }
      }
  }
    , Cn = {
      props: {
          swiping: Boolean
      },
      data: {
          swiping: !0
      },
      computed: {
          swipeTarget(t, e) {
              return e
          }
      },
      connected() {
          this.swiping && ai(this, {
              el: this.swipeTarget,
              name: gt,
              passive: !0,
              handler(t) {
                  if (!Tt(t))
                      return;
                  const e = re(t)
                    , i = "tagName"in t.target ? t.target : A(t.target);
                  L(document, `${Pt} ${si} scroll`, s=>{
                      const {x: n, y: o} = re(s);
                      (s.type !== "scroll" && i && n && Math.abs(e.x - n) > 100 || o && Math.abs(e.y - o) > 100) && setTimeout(()=>{
                          m(i, "swipe"),
                          m(i, `swipe${Wa(e.x, e.y, n, o)}`)
                      }
                      )
                  }
                  )
              }
          })
      }
  };
  function Wa(t, e, i, s) {
      return Math.abs(t - i) >= Math.abs(e - s) ? t - i > 0 ? "Left" : "Right" : e - s > 0 ? "Up" : "Down"
  }
  var Ra = {
      mixins: [rs, Cn],
      args: "mode",
      props: {
          mode: String,
          flip: Boolean,
          overlay: Boolean
      },
      data: {
          mode: "slide",
          flip: !1,
          overlay: !1,
          clsPage: "bdt-offcanvas-page",
          clsContainer: "bdt-offcanvas-container",
          selPanel: ".bdt-offcanvas-bar",
          clsFlip: "bdt-offcanvas-flip",
          clsContainerAnimation: "bdt-offcanvas-container-animation",
          clsSidebarAnimation: "bdt-offcanvas-bar-animation",
          clsMode: "bdt-offcanvas",
          clsOverlay: "bdt-offcanvas-overlay",
          selClose: ".bdt-offcanvas-close",
          container: !1
      },
      computed: {
          clsFlip({flip: t, clsFlip: e}) {
              return t ? e : ""
          },
          clsOverlay({overlay: t, clsOverlay: e}) {
              return t ? e : ""
          },
          clsMode({mode: t, clsMode: e}) {
              return `${e}-${t}`
          },
          clsSidebarAnimation({mode: t, clsSidebarAnimation: e}) {
              return t === "none" || t === "reveal" ? "" : e
          },
          clsContainerAnimation({mode: t, clsContainerAnimation: e}) {
              return t !== "push" && t !== "reveal" ? "" : e
          },
          transitionElement({mode: t}) {
              return t === "reveal" ? A(this.panel) : this.panel
          }
      },
      update: {
          read() {
              this.isToggled() && !q(this.$el) && this.hide()
          },
          events: ["resize"]
      },
      events: [{
          name: "touchmove",
          self: !0,
          passive: !1,
          filter() {
              return this.overlay
          },
          handler(t) {
              t.cancelable && t.preventDefault()
          }
      }, {
          name: "show",
          self: !0,
          handler() {
              this.mode === "reveal" && !B(A(this.panel), this.clsMode) && (Ue(this.panel, "<div>"),
              y(A(this.panel), this.clsMode));
              const {body: t, scrollingElement: e} = document;
              y(t, this.clsContainer, this.clsFlip),
              h(t, "touch-action", "pan-y pinch-zoom"),
              h(this.$el, "display", "block"),
              h(this.panel, "maxWidth", e.clientWidth),
              y(this.$el, this.clsOverlay),
              y(this.panel, this.clsSidebarAnimation, this.mode === "reveal" ? "" : this.clsMode),
              et(t),
              y(t, this.clsContainerAnimation),
              this.clsContainerAnimation && ja()
          }
      }, {
          name: "hide",
          self: !0,
          handler() {
              z(document.body, this.clsContainerAnimation),
              h(document.body, "touch-action", "")
          }
      }, {
          name: "hidden",
          self: !0,
          handler() {
              this.clsContainerAnimation && qa(),
              this.mode === "reveal" && _e(this.panel),
              z(this.panel, this.clsSidebarAnimation, this.clsMode),
              z(this.$el, this.clsOverlay),
              h(this.$el, "display", ""),
              h(this.panel, "maxWidth", ""),
              z(document.body, this.clsContainer, this.clsFlip)
          }
      }, {
          name: "swipeLeft swipeRight",
          handler(t) {
              this.isToggled() && Qt(t.type, "Left") ^ this.flip && this.hide()
          }
      }]
  };
  function ja() {
      _n().content += ",user-scalable=0"
  }
  function qa() {
      const t = _n();
      t.content = t.content.replace(/,user-scalable=0$/, "")
  }
  function _n() {
      return w('meta[name="viewport"]', document.head) || W(document.head, '<meta name="viewport">')
  }
  var Va = {
      mixins: [st, bt],
      props: {
          selContainer: String,
          selContent: String,
          minHeight: Number
      },
      data: {
          selContainer: ".bdt-modal",
          selContent: ".bdt-modal-dialog",
          minHeight: 150
      },
      computed: {
          container({selContainer: t}, e) {
              return Y(e, t)
          },
          content({selContent: t}, e) {
              return Y(e, t)
          }
      },
      resizeTargets() {
          return [this.container, this.content]
      },
      update: {
          read() {
              return !this.content || !this.container || !q(this.$el) ? !1 : {
                  max: Math.max(this.minHeight, et(this.container) - (b(this.content).height - et(this.$el)))
              }
          },
          write({max: t}) {
              h(this.$el, {
                  minHeight: this.minHeight,
                  maxHeight: t
              })
          },
          events: ["resize"]
      }
  }
    , Ya = {
      mixins: [bt],
      props: ["width", "height"],
      resizeTargets() {
          return [this.$el, A(this.$el)]
      },
      connected() {
          y(this.$el, "bdt-responsive-width")
      },
      update: {
          read() {
              return q(this.$el) && this.width && this.height ? {
                  width: Ee(A(this.$el)),
                  height: this.height
              } : !1
          },
          write(t) {
              et(this.$el, Ge.contain({
                  height: this.height,
                  width: this.width
              }, t).height)
          },
          events: ["resize"]
      }
  }
    , Ga = {
      props: {
          offset: Number
      },
      data: {
          offset: 0
      },
      connected() {
          Xa(this)
      },
      disconnected() {
          Ja(this)
      },
      methods: {
          async scrollTo(t) {
              t = t && w(t) || document.body,
              m(this.$el, "beforescroll", [this, t]) && (await qs(t, {
                  offset: this.offset
              }),
              m(this.$el, "scrolled", [this, t]))
          }
      }
  };
  const Ne = new Set;
  function Xa(t) {
      Ne.size || x(document, "click", En),
      Ne.add(t)
  }
  function Ja(t) {
      Ne.delete(t),
      Ne.size || zt(document, "click", En)
  }
  function En(t) {
      if (!t.defaultPrevented)
          for (const e of Ne)
              D(t.target, e.$el) && De(e.$el) && (t.preventDefault(),
              e.scrollTo(on(e.$el)))
  }
  var Ka = {
      mixins: [ci],
      args: "cls",
      props: {
          cls: String,
          target: String,
          hidden: Boolean,
          margin: String,
          repeat: Boolean,
          delay: Number
      },
      data: ()=>({
          cls: "",
          target: !1,
          hidden: !0,
          margin: "-1px",
          repeat: !1,
          delay: 0,
          inViewClass: "bdt-scrollspy-inview"
      }),
      computed: {
          elements: {
              get({target: t}, e) {
                  return t ? O(t, e) : [e]
              },
              watch(t, e) {
                  this.hidden && h(ke(t, `:not(.${this.inViewClass})`), "opacity", 0),
                  be(t, e) || this.$reset()
              },
              immediate: !0
          }
      },
      connected() {
          this._data.elements = new Map,
          this.registerObserver(ce(this.elements, t=>{
              const e = this._data.elements;
              for (const {target: i, isIntersecting: s} of t) {
                  e.has(i) || e.set(i, {
                      cls: tt(i, "bdt-scrollspy-class") || this.cls
                  });
                  const n = e.get(i);
                  !this.repeat && n.show || (n.show = s)
              }
              this.$emit()
          }
          , {
              rootMargin: this.margin
          }, !1))
      },
      disconnected() {
          for (const [t,e] of this._data.elements.entries())
              z(t, this.inViewClass, (e == null ? void 0 : e.cls) || "")
      },
      update: [{
          write(t) {
              for (const [e,i] of t.elements.entries())
                  i.show && !i.inview && !i.queued ? (i.queued = !0,
                  t.promise = (t.promise || Promise.resolve()).then(()=>new Promise(s=>setTimeout(s, this.delay))).then(()=>{
                      this.toggle(e, !0),
                      setTimeout(()=>{
                          i.queued = !1,
                          this.$emit()
                      }
                      , 300)
                  }
                  )) : !i.show && i.inview && !i.queued && this.repeat && this.toggle(e, !1)
          }
      }],
      methods: {
          toggle(t, e) {
              var i;
              const s = this._data.elements.get(t);
              if (s) {
                  if ((i = s.off) == null || i.call(s),
                  h(t, "opacity", !e && this.hidden ? 0 : ""),
                  j(t, this.inViewClass, e),
                  j(t, s.cls),
                  /\bbdt-animation-/.test(s.cls)) {
                      const n = ()=>Wi(t, "bdt-animation-[\\w-]+");
                      e ? s.off = L(t, "animationcancel animationend", n) : n()
                  }
                  m(t, e ? "inview" : "outview"),
                  s.inview = e,
                  this.$update(t)
              }
          }
      }
  }
    , Za = {
      mixins: [ci],
      props: {
          cls: String,
          closest: String,
          scroll: Boolean,
          overflow: Boolean,
          offset: Number
      },
      data: {
          cls: "bdt-active",
          closest: !1,
          scroll: !1,
          overflow: !0,
          offset: 0
      },
      computed: {
          links: {
              get(t, e) {
                  return O('a[href*="#"]', e).filter(i=>i.hash && De(i))
              },
              watch(t) {
                  this.scroll && this.$create("scroll", t, {
                      offset: this.offset || 0
                  })
              },
              immediate: !0
          },
          elements({closest: t}) {
              return Y(this.links, t || "*")
          }
      },
      update: [{
          read() {
              const t = this.links.map(on).filter(Boolean)
                , {length: e} = t;
              if (!e || !q(this.$el))
                  return !1;
              const [i] = mt(t, !0)
                , {scrollTop: s, scrollHeight: n} = i
                , o = at(i)
                , r = n - o.height;
              let a = !1;
              if (s === r)
                  a = e - 1;
              else {
                  for (let l = 0; l < t.length && !(I(t[l]).top - o.top - this.offset > 0); l++)
                      a = +l;
                  a === !1 && this.overflow && (a = 0)
              }
              return {
                  active: a
              }
          },
          write({active: t}) {
              const e = t !== !1 && !B(this.elements[t], this.cls);
              this.links.forEach(i=>i.blur());
              for (let i = 0; i < this.elements.length; i++)
                  j(this.elements[i], this.cls, +i === t);
              e && m(this.$el, "active", [t, this.elements[t]])
          },
          events: ["scroll", "resize"]
      }]
  }
    , Qa = {
      mixins: [st, mi, bt, ci],
      props: {
          position: String,
          top: null,
          bottom: null,
          start: null,
          end: null,
          offset: String,
          overflowFlip: Boolean,
          animation: String,
          clsActive: String,
          clsInactive: String,
          clsFixed: String,
          clsBelow: String,
          selTarget: String,
          showOnUp: Boolean,
          targetOffset: Number
      },
      data: {
          position: "top",
          top: !1,
          bottom: !1,
          start: !1,
          end: !1,
          offset: 0,
          overflowFlip: !1,
          animation: "",
          clsActive: "bdt-active",
          clsInactive: "",
          clsFixed: "bdt-sticky-fixed",
          clsBelow: "bdt-sticky-below",
          selTarget: "",
          showOnUp: !1,
          targetOffset: !1
      },
      computed: {
          selTarget({selTarget: t}, e) {
              return t && w(t, e) || e
          }
      },
      resizeTargets() {
          return document.documentElement
      },
      connected() {
          this.start = In(this.start || this.top),
          this.end = In(this.end || this.bottom),
          this.placeholder = w("+ .bdt-sticky-placeholder", this.$el) || w('<div class="bdt-sticky-placeholder"></div>'),
          this.isFixed = !1,
          this.setActive(!1),
          this.registerObserver(Pe(this.$el, ()=>!this.isFixed && this.$emit("resize")))
      },
      disconnected() {
          this.isFixed && (this.hide(),
          z(this.selTarget, this.clsInactive)),
          Pn(this.$el),
          ot(this.placeholder),
          this.placeholder = null
      },
      events: [{
          name: "resize",
          el() {
              return [window, window.visualViewport]
          },
          handler() {
              this.$emit("resizeViewport")
          }
      }, {
          name: "load hashchange popstate",
          el() {
              return window
          },
          filter() {
              return this.targetOffset !== !1
          },
          handler() {
              const {scrollingElement: t} = document;
              !location.hash || t.scrollTop === 0 || setTimeout(()=>{
                  const e = I(w(location.hash))
                    , i = I(this.$el);
                  this.isFixed && Oi(e, i) && (t.scrollTop = e.top - i.height - rt(this.targetOffset, "height", this.placeholder) - rt(this.offset, "height", this.placeholder))
              }
              )
          }
      }],
      update: [{
          read({height: t, width: e, margin: i, sticky: s}, n) {
              if (this.inactive = !this.matchMedia || !q(this.$el),
              this.inactive)
                  return;
              const o = this.isFixed && n.has("resize") && !s;
              o && (h(this.selTarget, "transition", "0s"),
              this.hide()),
              this.active || ({height: t, width: e} = I(this.$el),
              i = h(this.$el, "margin")),
              o && (this.show(),
              requestAnimationFrame(()=>h(this.selTarget, "transition", "")));
              const r = rt("100vh", "height")
                , a = et(window)
                , l = document.scrollingElement.scrollHeight - r;
              let c = this.position;
              this.overflowFlip && t > r && (c = c === "top" ? "bottom" : "top");
              const u = this.isFixed ? this.placeholder : this.$el;
              let d = rt(this.offset, "height", s ? this.$el : u);
              c === "bottom" && (t < a || this.overflowFlip) && (d += a - t);
              const p = this.overflowFlip ? 0 : Math.max(0, t + d - r)
                , g = I(u).top
                , T = I(this.$el).height
                , F = (this.start === !1 ? g : as(this.start, this.$el, g)) - d
                , M = this.end === !1 ? l : Math.min(l, as(this.end, this.$el, g + t, !0) - T - d + p);
              return s = l && !this.showOnUp && F + d === g && M === Math.min(l, as("!*", this.$el, 0, !0) - T - d + p) && h(A(this.$el), "overflowY") === "visible",
              {
                  start: F,
                  end: M,
                  offset: d,
                  overflow: p,
                  topOffset: g,
                  height: t,
                  elHeight: T,
                  width: e,
                  margin: i,
                  top: Wt(u)[0],
                  sticky: s
              }
          },
          write({height: t, width: e, margin: i, offset: s, sticky: n}) {
              if ((this.inactive || n || !this.isFixed) && Pn(this.$el),
              this.inactive)
                  return;
              n && (t = e = i = 0,
              h(this.$el, {
                  position: "sticky",
                  top: s
              }));
              const {placeholder: o} = this;
              h(o, {
                  height: t,
                  width: e,
                  margin: i
              }),
              D(o, document) || (o.hidden = !0),
              (n ? Ke : Ze)(this.$el, o)
          },
          events: ["resize", "resizeViewport"]
      }, {
          read({scroll: t=0, dir: e="down", overflow: i, overflowScroll: s=0, start: n, end: o}) {
              const r = document.scrollingElement.scrollTop;
              return {
                  dir: t <= r ? "down" : "up",
                  prevDir: e,
                  scroll: r,
                  prevScroll: t,
                  offsetParentTop: I((this.isFixed ? this.placeholder : this.$el).offsetParent).top,
                  overflowScroll: U(s + U(r, n, o) - U(t, n, o), 0, i)
              }
          },
          write(t, e) {
              const i = e.has("scroll")
                , {initTimestamp: s=0, dir: n, prevDir: o, scroll: r, prevScroll: a=0, top: l, start: c, topOffset: u, height: d} = t;
              if (r < 0 || r === a && i || this.showOnUp && !i && !this.isFixed)
                  return;
              const p = Date.now();
              if ((p - s > 300 || n !== o) && (t.initScroll = r,
              t.initTimestamp = p),
              !(this.showOnUp && !this.isFixed && Math.abs(t.initScroll - r) <= 30 && Math.abs(a - r) <= 10))
                  if (this.inactive || r < c || this.showOnUp && (r <= c || n === "down" && i || n === "up" && !this.isFixed && r <= u + d)) {
                      if (!this.isFixed) {
                          pt.inProgress(this.$el) && l > r && (pt.cancel(this.$el),
                          this.hide());
                          return
                      }
                      this.animation && r > u ? (pt.cancel(this.$el),
                      pt.out(this.$el, this.animation).then(()=>this.hide(), P)) : this.hide()
                  } else
                      this.isFixed ? this.update() : this.animation && r > u ? (pt.cancel(this.$el),
                      this.show(),
                      pt.in(this.$el, this.animation).catch(P)) : this.show()
          },
          events: ["resize", "resizeViewport", "scroll"]
      }],
      methods: {
          show() {
              this.isFixed = !0,
              this.update(),
              this.placeholder.hidden = !1
          },
          hide() {
              const {offset: t, sticky: e} = this._data;
              this.setActive(!1),
              z(this.$el, this.clsFixed, this.clsBelow),
              e ? h(this.$el, "top", t) : h(this.$el, {
                  position: "",
                  top: "",
                  width: "",
                  marginTop: ""
              }),
              this.placeholder.hidden = !0,
              this.isFixed = !1
          },
          update() {
              let {width: t, scroll: e=0, overflow: i, overflowScroll: s=0, start: n, end: o, offset: r, topOffset: a, height: l, elHeight: c, offsetParentTop: u, sticky: d} = this._data;
              const p = n !== 0 || e > n;
              if (!d) {
                  let g = "fixed";
                  e > o && (r += o - u,
                  g = "absolute"),
                  h(this.$el, {
                      position: g,
                      width: t
                  }),
                  h(this.$el, "marginTop", 0, "important")
              }
              i && (r -= s),
              h(this.$el, "top", r),
              this.setActive(p),
              j(this.$el, this.clsBelow, e > a + (d ? Math.min(l, c) : l)),
              y(this.$el, this.clsFixed)
          },
          setActive(t) {
              const e = this.active;
              this.active = t,
              t ? (Ri(this.selTarget, this.clsInactive, this.clsActive),
              e !== t && m(this.$el, "active")) : (Ri(this.selTarget, this.clsActive, this.clsInactive),
              e !== t && m(this.$el, "inactive"))
          }
      }
  };
  function as(t, e, i, s) {
      if (!t)
          return 0;
      if (vt(t) || N(t) && t.match(/^-?\d/))
          return i + rt(t, "height", e, !0);
      {
          const n = t === !0 ? A(e) : ut(t, e);
          return I(n).bottom - (s && n && D(e, n) ? $(h(n, "paddingBottom")) : 0)
      }
  }
  function In(t) {
      return t === "true" ? !0 : t === "false" ? !1 : t
  }
  function Pn(t) {
      h(t, {
          position: "",
          top: "",
          marginTop: "",
          width: ""
      })
  }
  const ls = ".bdt-disabled *, .bdt-disabled, [disabled]";
  var An = {
      mixins: [Oe, Cn, Yt],
      args: "connect",
      props: {
          connect: String,
          toggle: String,
          itemNav: String,
          active: Number,
          followFocus: Boolean
      },
      data: {
          connect: "~.bdt-switcher",
          toggle: "> * > :first-child",
          itemNav: !1,
          active: 0,
          cls: "bdt-active",
          attrItem: "bdt-switcher-item",
          selVertical: ".bdt-nav",
          followFocus: !1
      },
      computed: {
          connects: {
              get({connect: t}, e) {
                  return Se(t, e)
              },
              watch(t) {
                  this.swiping && h(t, "touchAction", "pan-y pinch-zoom"),
                  this.$emit()
              },
              document: !0,
              immediate: !0
          },
          connectChildren: {
              get() {
                  return this.connects.map(t=>E(t)).flat()
              },
              watch() {
                  const t = this.index();
                  for (const e of this.connects)
                      E(e).forEach((i,s)=>j(i, this.cls, s === t)),
                      this.lazyload(this.$el, E(e));
                  this.$emit()
              },
              immediate: !0
          },
          toggles: {
              get({toggle: t}, e) {
                  return O(t, e)
              },
              watch(t) {
                  this.$emit();
                  const e = this.index();
                  this.show(~e ? e : t[this.active] || t[0])
              },
              immediate: !0
          },
          children() {
              return E(this.$el).filter(t=>this.toggles.some(e=>D(e, t)))
          },
          swipeTarget() {
              return this.connects
          }
      },
      connected() {
          f(this.$el, "role", "tablist")
      },
      events: [{
          name: "click keydown",
          delegate() {
              return this.toggle
          },
          handler(t) {
              !_(t.current, ls) && (t.type === "click" || t.keyCode === C.SPACE) && (t.preventDefault(),
              this.show(t.current))
          }
      }, {
          name: "keydown",
          delegate() {
              return this.toggle
          },
          handler(t) {
              const {current: e, keyCode: i} = t
                , s = _(this.$el, this.selVertical);
              let n = i === C.HOME ? 0 : i === C.END ? "last" : i === C.LEFT && !s || i === C.UP && s ? "previous" : i === C.RIGHT && !s || i === C.DOWN && s ? "next" : -1;
              if (~n) {
                  t.preventDefault();
                  const o = this.toggles.filter(a=>!_(a, ls))
                    , r = o[ct(n, o, o.indexOf(e))];
                  r.focus(),
                  this.followFocus && this.show(r)
              }
          }
      }, {
          name: "click",
          el() {
              return this.connects.concat(this.itemNav ? Se(this.itemNav, this.$el) : [])
          },
          delegate() {
              return `[${this.attrItem}],[data-${this.attrItem}]`
          },
          handler(t) {
              Y(t.target, "a,button") && (t.preventDefault(),
              this.show(tt(t.current, this.attrItem)))
          }
      }, {
          name: "swipeRight swipeLeft",
          filter() {
              return this.swiping
          },
          el() {
              return this.connects
          },
          handler({type: t}) {
              this.show(Qt(t, "Left") ? "next" : "previous")
          }
      }],
      update() {
          var t;
          f(this.connects, "role", "presentation"),
          f(E(this.$el), "role", "presentation");
          for (const e in this.toggles) {
              const i = this.toggles[e]
                , s = (t = this.connects[0]) == null ? void 0 : t.children[e];
              f(i, "role", "tab"),
              s && (i.id = Dt(this, i, `-tab-${e}`),
              s.id = Dt(this, s, `-tabpanel-${e}`),
              f(i, "aria-controls", s.id),
              f(s, {
                  role: "tabpanel",
                  "aria-labelledby": i.id
              }))
          }
          f(this.$el, "aria-orientation", _(this.$el, this.selVertical) ? "vertical" : null)
      },
      methods: {
          index() {
              return $t(this.children, t=>B(t, this.cls))
          },
          show(t) {
              const e = this.toggles.filter(r=>!_(r, ls))
                , i = this.index()
                , s = ct(!qe(t) || v(e, t) ? t : 0, e, ct(this.toggles[i], e))
                , n = ct(e[s], this.toggles);
              this.children.forEach((r,a)=>{
                  j(r, this.cls, n === a),
                  f(this.toggles[a], {
                      "aria-selected": n === a,
                      tabindex: n === a ? null : -1
                  })
              }
              );
              const o = i >= 0 && i !== s;
              this.connects.forEach(async({children: r})=>{
                  await this.toggleElement(k(r).filter(a=>B(a, this.cls)), !1, o),
                  await this.toggleElement(r[n], !0, o)
              }
              )
          }
      }
  }
    , Ua = {
      mixins: [st],
      extends: An,
      props: {
          media: Boolean
      },
      data: {
          media: 960,
          attrItem: "bdt-tab-item",
          selVertical: ".bdt-tab-left,.bdt-tab-right"
      },
      connected() {
          const t = B(this.$el, "bdt-tab-left") ? "bdt-tab-left" : B(this.$el, "bdt-tab-right") ? "bdt-tab-right" : !1;
          t && this.$create("toggle", this.$el, {
              cls: t,
              mode: "media",
              media: this.media
          })
      }
  };
  const tl = 32;
  var el = {
      mixins: [Oe, mi, Yt],
      args: "target",
      props: {
          href: String,
          target: null,
          mode: "list",
          queued: Boolean
      },
      data: {
          href: !1,
          target: !1,
          mode: "click",
          queued: !0
      },
      computed: {
          target({href: t, target: e}, i) {
              return e = Se(e || t, i),
              e.length && e || [i]
          }
      },
      connected() {
          v(this.mode, "media") || (Je(this.$el) || f(this.$el, "tabindex", "0"),
          !this.cls && X(this.$el, "a") && f(this.$el, "role", "button")),
          this.lazyload(this.$el, ()=>this.target)
      },
      events: [{
          name: gt,
          filter() {
              return v(this.mode, "hover")
          },
          handler(t) {
              this._preventClick = null,
              !(!Tt(t) || this._showState || this.$el.disabled) && (m(this.$el, "focus"),
              L(document, gt, ()=>m(this.$el, "blur"), !0, e=>!D(e.target, this.$el)),
              v(this.mode, "click") && (this._preventClick = !0))
          }
      }, {
          name: `${At} ${qt} focus blur`,
          filter() {
              return v(this.mode, "hover")
          },
          handler(t) {
              if (Tt(t) || this.$el.disabled)
                  return;
              const e = v([At, "focus"], t.type)
                , i = this.isToggled(this.target);
              if (!(!e && (t.type === qt && _(this.$el, ":focus") || t.type === "blur" && _(this.$el, ":hover")))) {
                  if (this._showState && e && i !== this._showState) {
                      e || (this._showState = null);
                      return
                  }
                  this._showState = e ? i : null,
                  this.toggle(`toggle${e ? "show" : "hide"}`)
              }
          }
      }, {
          name: "keydown",
          filter() {
              return v(this.mode, "click") && !X(this.$el, "input")
          },
          handler(t) {
              t.keyCode === tl && (t.preventDefault(),
              this.$el.click())
          }
      }, {
          name: "click",
          filter() {
              return ["click", "hover"].some(t=>v(this.mode, t))
          },
          handler(t) {
              let e;
              (this._preventClick || Y(t.target, 'a[href="#"], a[href=""]') || (e = Y(t.target, "a[href]")) && (!this.isToggled(this.target) || e.hash && _(this.target, e.hash))) && t.preventDefault(),
              !this._preventClick && v(this.mode, "click") && this.toggle()
          }
      }, {
          name: "mediachange",
          filter() {
              return v(this.mode, "media")
          },
          el() {
              return this.target
          },
          handler(t, e) {
              e.matches ^ this.isToggled(this.target) && this.toggle()
          }
      }],
      methods: {
          async toggle(t) {
              if (!m(this.target, t || "toggle", [this]))
                  return;
              if (wt(this.$el, "aria-expanded") && f(this.$el, "aria-expanded", !this.isToggled(this.target)),
              !this.queued)
                  return this.toggleElement(this.target);
              const e = this.target.filter(s=>B(s, this.clsLeave));
              if (e.length) {
                  for (const s of this.target) {
                      const n = v(e, s);
                      this.toggleElement(s, n, n)
                  }
                  return
              }
              const i = this.target.filter(this.isToggled);
              await this.toggleElement(i, !1),
              await this.toggleElement(this.target.filter(s=>!v(i, s)), !0)
          }
      }
  }
    , il = Object.freeze({
      __proto__: null,
      Accordion: rn,
      Alert: yr,
      Close: ma,
      Cover: Sr,
      Drop: cn,
      DropParentIcon: Gt,
      Dropdown: cn,
      Dropnav: un,
      FormCustom: Dr,
      Grid: Mr,
      HeightMatch: Fr,
      HeightViewport: Wr,
      Icon: ns,
      Img: Ta,
      Leader: Oa,
      Margin: pn,
      Marker: va,
      Modal: za,
      Nav: Ha,
      NavParentIcon: da,
      Navbar: La,
      NavbarParentIcon: Gt,
      NavbarToggleIcon: ga,
      Offcanvas: Ra,
      OverflowAuto: Va,
      OverlayIcon: Gt,
      PaginationNext: ba,
      PaginationPrevious: $a,
      Responsive: Ya,
      Scroll: Ga,
      Scrollspy: Ka,
      ScrollspyNav: Za,
      SearchIcon: fa,
      SlidenavNext: kn,
      SlidenavPrevious: kn,
      Spinner: pa,
      Sticky: Qa,
      Svg: bn,
      Switcher: An,
      Tab: Ua,
      Toggle: el,
      Totop: wa,
      Video: an
  });
  St(il, (t,e)=>it.component(e, t)),
  mr(it);
  const sl = ["days", "hours", "minutes", "seconds"];
  var nl = {
      mixins: [st],
      props: {
          date: String,
          clsWrapper: String,
          role: String
      },
      data: {
          date: "",
          clsWrapper: ".bdt-countdown-%unit%",
          role: "timer"
      },
      connected() {
          f(this.$el, "role", this.role),
          this.date = $(Date.parse(this.$props.date)),
          this.end = !1,
          this.start()
      },
      disconnected() {
          this.stop()
      },
      events: [{
          name: "visibilitychange",
          el() {
              return document
          },
          handler() {
              document.hidden ? this.stop() : this.start()
          }
      }],
      methods: {
          start() {
              this.stop(),
              this.update(),
              this.timer || (m(this.$el, "countdownstart"),
              this.timer = setInterval(this.update, 1e3))
          },
          stop() {
              this.timer && (clearInterval(this.timer),
              m(this.$el, "countdownstop"),
              this.timer = null)
          },
          update() {
              const t = ol(this.date);
              t.total || (this.stop(),
              this.end || (m(this.$el, "countdownend"),
              this.end = !0));
              for (const e of sl) {
                  const i = w(this.clsWrapper.replace("%unit%", e), this.$el);
                  if (!i)
                      continue;
                  let s = String(Math.trunc(t[e]));
                  s = s.length < 2 ? `0${s}` : s,
                  i.textContent !== s && (s = s.split(""),
                  s.length !== i.children.length && It(i, s.map(()=>"<span></span>").join("")),
                  s.forEach((n,o)=>i.children[o].textContent = n))
              }
          }
      }
  };
  function ol(t) {
      const e = Math.max(0, t - Date.now()) / 1e3;
      return {
          total: e,
          seconds: e % 60,
          minutes: e / 60 % 60,
          hours: e / 60 / 60 % 24,
          days: e / 60 / 60 / 24
      }
  }
  const hs = "bdt-transition-leave"
    , cs = "bdt-transition-enter";
  function On(t, e, i, s=0) {
      const n = vi(e, !0)
        , o = {
          opacity: 1
      }
        , r = {
          opacity: 0
      }
        , a = u=>()=>n === vi(e) ? u() : Promise.reject()
        , l = a(async()=>{
          y(e, hs),
          await Promise.all(Bn(e).map((u,d)=>new Promise(p=>setTimeout(()=>S.start(u, r, i / 2, "ease").then(p), d * s)))),
          z(e, hs)
      }
      )
        , c = a(async()=>{
          const u = et(e);
          y(e, cs),
          t(),
          h(E(e), {
              opacity: 0
          }),
          await rl();
          const d = E(e)
            , p = et(e);
          h(e, "alignContent", "flex-start"),
          et(e, u);
          const g = Bn(e);
          h(d, r);
          const T = g.map(async(F,M)=>{
              await al(M * s),
              await S.start(F, o, i / 2, "ease")
          }
          );
          u !== p && T.push(S.start(e, {
              height: p
          }, i / 2 + g.length * s, "ease")),
          await Promise.all(T).then(()=>{
              z(e, cs),
              n === vi(e) && (h(e, {
                  height: "",
                  alignContent: ""
              }),
              h(d, {
                  opacity: ""
              }),
              delete e.dataset.transition)
          }
          )
      }
      );
      return B(e, hs) ? Dn(e).then(c) : B(e, cs) ? Dn(e).then(l).then(c) : l().then(c)
  }
  function vi(t, e) {
      return e && (t.dataset.transition = 1 + vi(t)),
      kt(t.dataset.transition) || 0
  }
  function Dn(t) {
      return Promise.all(E(t).filter(S.inProgress).map(e=>new Promise(i=>L(e, "transitionend transitioncanceled", i))))
  }
  function Bn(t) {
      return is(E(t)).reduce((e,i)=>e.concat(Ve(i.filter(s=>Zi(s)), "offsetLeft")), [])
  }
  function rl() {
      return new Promise(t=>requestAnimationFrame(t))
  }
  function al(t) {
      return new Promise(e=>setTimeout(e, t))
  }
  async function ll(t, e, i) {
      await zn();
      let s = E(e);
      const n = s.map(p=>Mn(p, !0))
        , o = {
          ...h(e, ["height", "padding"]),
          display: "block"
      };
      await Promise.all(s.concat(e).map(S.cancel)),
      t(),
      s = s.concat(E(e).filter(p=>!v(s, p))),
      await Promise.resolve(),
      G.flush();
      const r = f(e, "style")
        , a = h(e, ["height", "padding"])
        , [l,c] = hl(e, s, n)
        , u = s.map(p=>({
          style: f(p, "style")
      }));
      s.forEach((p,g)=>c[g] && h(p, c[g])),
      h(e, o),
      m(e, "scroll"),
      G.flush(),
      await zn();
      const d = s.map((p,g)=>A(p) === e && S.start(p, l[g], i, "ease")).concat(S.start(e, a, i, "ease"));
      try {
          await Promise.all(d),
          s.forEach((p,g)=>{
              f(p, u[g]),
              A(p) === e && h(p, "display", l[g].opacity === 0 ? "none" : "")
          }
          ),
          f(e, "style", r)
      } catch {
          f(s, "style", ""),
          cl(e, o)
      }
  }
  function Mn(t, e) {
      const i = h(t, "zIndex");
      return q(t) ? {
          display: "",
          opacity: e ? h(t, "opacity") : "0",
          pointerEvents: "none",
          position: "absolute",
          zIndex: i === "auto" ? oe(t) : i,
          ...Nn(t)
      } : !1
  }
  function hl(t, e, i) {
      const s = e.map((o,r)=>A(o) && r in i ? i[r] ? q(o) ? Nn(o) : {
          opacity: 0
      } : {
          opacity: q(o) ? 1 : 0
      } : !1)
        , n = s.map((o,r)=>{
          const a = A(e[r]) === t && (i[r] || Mn(e[r]));
          if (!a)
              return !1;
          if (!o)
              delete a.opacity;
          else if (!("opacity"in o)) {
              const {opacity: l} = a;
              l % 1 ? o.opacity = 1 : delete a.opacity
          }
          return a
      }
      );
      return [s, n]
  }
  function cl(t, e) {
      for (const i in e)
          h(t, i, "")
  }
  function Nn(t) {
      const {height: e, width: i} = I(t);
      return {
          height: e,
          width: i,
          transform: "",
          ...ti(t),
          ...h(t, ["marginTop", "marginLeft"])
      }
  }
  function zn() {
      return new Promise(t=>requestAnimationFrame(t))
  }
  var Fn = {
      props: {
          duration: Number,
          animation: Boolean
      },
      data: {
          duration: 150,
          animation: "slide"
      },
      methods: {
          animate(t, e=this.$el) {
              const i = this.animation;
              return (i === "fade" ? On : i === "delayed-fade" ? (...n)=>On(...n, 40) : i ? ll : ()=>(t(),
              Promise.resolve()))(t, e, this.duration).catch(P)
          }
      }
  }
    , ul = {
      mixins: [Fn],
      args: "target",
      props: {
          target: Boolean,
          selActive: Boolean
      },
      data: {
          target: null,
          selActive: !1,
          attrItem: "bdt-filter-control",
          cls: "bdt-active",
          duration: 250
      },
      computed: {
          toggles: {
              get({attrItem: t}, e) {
                  return O(`[${t}],[data-${t}]`, e)
              },
              watch(t) {
                  this.updateState();
                  const e = O(this.selActive, this.$el);
                  for (const i of t) {
                      this.selActive !== !1 && j(i, this.cls, v(e, i));
                      const s = wl(i);
                      X(s, "a") && f(s, "role", "button")
                  }
              },
              immediate: !0
          },
          children: {
              get({target: t}, e) {
                  return O(`${t} > *`, e)
              },
              watch(t, e) {
                  e && !gl(t, e) && this.updateState()
              },
              immediate: !0
          }
      },
      events: [{
          name: "click keydown",
          delegate() {
              return `[${this.attrItem}],[data-${this.attrItem}]`
          },
          handler(t) {
              t.type === "keydown" && t.keyCode !== C.SPACE || Y(t.target, "a,button") && (t.preventDefault(),
              this.apply(t.current))
          }
      }],
      methods: {
          apply(t) {
              const e = this.getState()
                , i = Ln(t, this.attrItem, this.getState());
              dl(e, i) || this.setState(i)
          },
          getState() {
              return this.toggles.filter(t=>B(t, this.cls)).reduce((t,e)=>Ln(e, this.attrItem, t), {
                  filter: {
                      "": ""
                  },
                  sort: []
              })
          },
          async setState(t, e=!0) {
              t = {
                  filter: {
                      "": ""
                  },
                  sort: [],
                  ...t
              },
              m(this.$el, "beforeFilter", [this, t]);
              for (const i of this.toggles)
                  j(i, this.cls, pl(i, this.attrItem, t));
              await Promise.all(O(this.target, this.$el).map(i=>{
                  const s = ()=>{
                      fl(t, i, E(i)),
                      this.$update(this.$el)
                  }
                  ;
                  return e ? this.animate(s, i) : s()
              }
              )),
              m(this.$el, "afterFilter", [this])
          },
          updateState() {
              G.write(()=>this.setState(this.getState(), !1))
          }
      }
  };
  function Hn(t, e) {
      return de(tt(t, e), ["filter"])
  }
  function dl(t, e) {
      return ["filter", "sort"].every(i=>be(t[i], e[i]))
  }
  function fl(t, e, i) {
      const s = ml(t);
      i.forEach(r=>h(r, "display", s && !_(r, s) ? "none" : ""));
      const [n,o] = t.sort;
      if (n) {
          const r = vl(i, n, o);
          be(r, i) || W(e, r)
      }
  }
  function Ln(t, e, i) {
      const {filter: s, group: n, sort: o, order: r="asc"} = Hn(t, e);
      return (s || V(o)) && (n ? s ? (delete i.filter[""],
      i.filter[n] = s) : (delete i.filter[n],
      (we(i.filter) || ""in i.filter) && (i.filter = {
          "": s || ""
      })) : i.filter = {
          "": s || ""
      }),
      V(o) || (i.sort = [o, r]),
      i
  }
  function pl(t, e, {filter: i={
      "": ""
  }, sort: [s,n]}) {
      const {filter: o="", group: r="", sort: a, order: l="asc"} = Hn(t, e);
      return V(a) ? r in i && o === i[r] || !o && r && !(r in i) && !i[""] : s === a && n === l
  }
  function gl(t, e) {
      return t.length === e.length && t.every(i=>e.includes(i))
  }
  function ml({filter: t}) {
      let e = "";
      return St(t, i=>e += i || ""),
      e
  }
  function vl(t, e, i) {
      return [...t].sort((s,n)=>tt(s, e).localeCompare(tt(n, e), void 0, {
          numeric: !0
      }) * (i === "asc" || -1))
  }
  function wl(t) {
      return w("a,button", t) || t
  }
  var us = {
      slide: {
          show(t) {
              return [{
                  transform: H(t * -100)
              }, {
                  transform: H()
              }]
          },
          percent(t) {
              return ze(t)
          },
          translate(t, e) {
              return [{
                  transform: H(e * -100 * t)
              }, {
                  transform: H(e * 100 * (1 - t))
              }]
          }
      }
  };
  function ze(t) {
      return Math.abs(h(t, "transform").split(",")[4] / t.offsetWidth) || 0
  }
  function H(t=0, e="%") {
      return t += t ? e : "",
      `translate3d(${t}, 0, 0)`
  }
  function fe(t) {
      return `scale3d(${t}, ${t}, 1)`
  }
  var Wn = {
      ...us,
      fade: {
          show() {
              return [{
                  opacity: 0
              }, {
                  opacity: 1
              }]
          },
          percent(t) {
              return 1 - h(t, "opacity")
          },
          translate(t) {
              return [{
                  opacity: 1 - t
              }, {
                  opacity: t
              }]
          }
      },
      scale: {
          show() {
              return [{
                  opacity: 0,
                  transform: fe(1 - .2)
              }, {
                  opacity: 1,
                  transform: fe(1)
              }]
          },
          percent(t) {
              return 1 - h(t, "opacity")
          },
          translate(t) {
              return [{
                  opacity: 1 - t,
                  transform: fe(1 - .2 * t)
              }, {
                  opacity: t,
                  transform: fe(1 - .2 + .2 * t)
              }]
          }
      }
  };
  function bl(t, e, i, {animation: s, easing: n}) {
      const {percent: o, translate: r, show: a=P} = s
        , l = a(i)
        , c = new Xe;
      return {
          dir: i,
          show(u, d=0, p) {
              const g = p ? "linear" : n;
              return u -= Math.round(u * U(d, -1, 1)),
              this.translate(d),
              wi(e, "itemin", {
                  percent: d,
                  duration: u,
                  timing: g,
                  dir: i
              }),
              wi(t, "itemout", {
                  percent: 1 - d,
                  duration: u,
                  timing: g,
                  dir: i
              }),
              Promise.all([S.start(e, l[1], u, g), S.start(t, l[0], u, g)]).then(()=>{
                  this.reset(),
                  c.resolve()
              }
              , P),
              c.promise
          },
          cancel() {
              S.cancel([e, t])
          },
          reset() {
              for (const u in l[0])
                  h([e, t], u, "")
          },
          forward(u, d=this.percent()) {
              return S.cancel([e, t]),
              this.show(u, d, !0)
          },
          translate(u) {
              this.reset();
              const d = r(u, i);
              h(e, d[1]),
              h(t, d[0]),
              wi(e, "itemtranslatein", {
                  percent: u,
                  dir: i
              }),
              wi(t, "itemtranslateout", {
                  percent: 1 - u,
                  dir: i
              })
          },
          percent() {
              return o(t || e, e, i)
          },
          getDistance() {
              return t == null ? void 0 : t.offsetWidth
          }
      }
  }
  function wi(t, e, i) {
      m(t, Ft(e, !1, !1, i))
  }
  var $l = {
      i18n: {
          next: "Next slide",
          previous: "Previous slide",
          slideX: "Slide %s",
          slideLabel: "%s of %s"
      },
      data: {
          selNav: !1
      },
      computed: {
          nav: {
              get({selNav: t}, e) {
                  return w(t, e)
              },
              watch(t, e) {
                  f(t, "role", "tablist"),
                  e && this.$emit()
              },
              immediate: !0
          },
          selNavItem({attrItem: t}) {
              return `[${t}],[data-${t}]`
          },
          navItems: {
              get(t, e) {
                  return O(this.selNavItem, e)
              },
              watch() {
                  this.$emit()
              }
          }
      },
      connected() {
          f(this.$el, "aria-roledescription", "carousel")
      },
      update: [{
          write() {
              this.slides.forEach((t,e)=>f(t, {
                  role: this.nav ? "tabpanel" : "group",
                  "aria-label": this.t("slideLabel", e + 1, this.length),
                  "aria-roledescription": this.nav ? null : "slide"
              })),
              this.nav && this.length !== this.nav.children.length && It(this.nav, this.slides.map((t,e)=>`<li ${this.attrItem}="${e}"><a href></a></li>`).join("")),
              f(E(this.nav).concat(this.list), "role", "presentation");
              for (const t of this.navItems) {
                  const e = tt(t, this.attrItem)
                    , i = w("a,button", t) || t;
                  let s, n = null;
                  if (vt(e)) {
                      const o = kt(e)
                        , r = this.slides[o];
                      r && (r.id || (r.id = Dt(this, r, `-item-${e}`)),
                      n = r.id),
                      s = this.t("slideX", $(e) + 1),
                      f(i, "role", "tab")
                  } else
                      this.list && (this.list.id || (this.list.id = Dt(this, this.list, "-items")),
                      n = this.list.id),
                      s = this.t(e);
                  f(i, {
                      "aria-controls": n,
                      "aria-label": f(i, "aria-label") || s
                  })
              }
          }
      }, {
          write() {
              this.navItems.concat(this.nav).forEach(t=>t && (t.hidden = !this.maxIndex)),
              this.updateNav()
          },
          events: ["resize"]
      }],
      events: [{
          name: "click keydown",
          delegate() {
              return this.selNavItem
          },
          handler(t) {
              Y(t.target, "a,button") && (t.type === "click" || t.keyCode === C.SPACE) && (t.preventDefault(),
              this.show(tt(t.current, this.attrItem)))
          }
      }, {
          name: "itemshow",
          handler: "updateNav"
      }, {
          name: "keydown",
          delegate() {
              return this.selNavItem
          },
          handler(t) {
              const {current: e, keyCode: i} = t
                , s = tt(e, this.attrItem);
              if (!vt(s))
                  return;
              let n = i === C.HOME ? 0 : i === C.END ? "last" : i === C.LEFT ? "previous" : i === C.RIGHT ? "next" : -1;
              ~n && (t.preventDefault(),
              this.show(n))
          }
      }],
      methods: {
          updateNav() {
              const t = this.getValidIndex();
              let e, i;
              for (const s of this.navItems) {
                  const n = tt(s, this.attrItem)
                    , o = w("a,button", s) || s;
                  if (vt(n)) {
                      const a = kt(n) === t;
                      j(s, this.clsActive, a),
                      f(o, {
                          "aria-selected": a,
                          tabindex: a ? null : -1
                      }),
                      a && (i = o),
                      e = e || _(o, ":focus")
                  } else
                      j(s, "bdt-invisible", this.finite && (n === "previous" && t === 0 || n === "next" && t >= this.maxIndex));
                  e && i && i.focus()
              }
          }
      }
  };
  const ds = {
      passive: !1,
      capture: !0
  }
    , Rn = {
      passive: !0,
      capture: !0
  }
    , xl = "touchstart mousedown"
    , fs = "touchmove mousemove"
    , jn = "touchend touchcancel mouseup click input scroll";
  var yl = {
      props: {
          draggable: Boolean
      },
      data: {
          draggable: !0,
          threshold: 10
      },
      created() {
          for (const t of ["start", "move", "end"]) {
              const e = this[t];
              this[t] = i=>{
                  const s = re(i).x * (J ? -1 : 1);
                  this.prevPos = s === this.pos ? this.prevPos : this.pos,
                  this.pos = s,
                  e(i)
              }
          }
      },
      events: [{
          name: xl,
          passive: !0,
          delegate() {
              return `${this.selList} > *`
          },
          handler(t) {
              !this.draggable || !Tt(t) && kl(t.target) || Y(t.target, xe) || t.button > 0 || this.length < 2 || this.start(t)
          }
      }, {
          name: "dragstart",
          handler(t) {
              t.preventDefault()
          }
      }, {
          name: fs,
          el() {
              return this.list
          },
          handler: P,
          ...ds
      }],
      methods: {
          start() {
              this.drag = this.pos,
              this._transitioner ? (this.percent = this._transitioner.percent(),
              this.drag += this._transitioner.getDistance() * this.percent * this.dir,
              this._transitioner.cancel(),
              this._transitioner.translate(this.percent),
              this.dragging = !0,
              this.stack = []) : this.prevIndex = this.index,
              x(document, fs, this.move, ds),
              x(document, jn, this.end, Rn),
              h(this.list, "userSelect", "none")
          },
          move(t) {
              const e = this.pos - this.drag;
              if (e === 0 || this.prevPos === this.pos || !this.dragging && Math.abs(e) < this.threshold)
                  return;
              h(this.list, "pointerEvents", "none"),
              t.cancelable && t.preventDefault(),
              this.dragging = !0,
              this.dir = e < 0 ? 1 : -1;
              const {slides: i} = this;
              let {prevIndex: s} = this
                , n = Math.abs(e)
                , o = this.getIndex(s + this.dir, s)
                , r = this._getDistance(s, o) || i[s].offsetWidth;
              for (; o !== s && n > r; )
                  this.drag -= r * this.dir,
                  s = o,
                  n -= r,
                  o = this.getIndex(s + this.dir, s),
                  r = this._getDistance(s, o) || i[s].offsetWidth;
              this.percent = n / r;
              const a = i[s]
                , l = i[o]
                , c = this.index !== o
                , u = s === o;
              let d;
              [this.index, this.prevIndex].filter(p=>!v([o, s], p)).forEach(p=>{
                  m(i[p], "itemhidden", [this]),
                  u && (d = !0,
                  this.prevIndex = s)
              }
              ),
              (this.index === s && this.prevIndex !== s || d) && m(i[this.index], "itemshown", [this]),
              c && (this.prevIndex = s,
              this.index = o,
              !u && m(a, "beforeitemhide", [this]),
              m(l, "beforeitemshow", [this])),
              this._transitioner = this._translate(Math.abs(this.percent), a, !u && l),
              c && (!u && m(a, "itemhide", [this]),
              m(l, "itemshow", [this]))
          },
          end() {
              if (zt(document, fs, this.move, ds),
              zt(document, jn, this.end, Rn),
              this.dragging)
                  if (this.dragging = null,
                  this.index === this.prevIndex)
                      this.percent = 1 - this.percent,
                      this.dir *= -1,
                      this._show(!1, this.index, !0),
                      this._transitioner = null;
                  else {
                      const t = (J ? this.dir * (J ? 1 : -1) : this.dir) < 0 == this.prevPos > this.pos;
                      this.index = t ? this.index : this.prevIndex,
                      t && (this.percent = 1 - this.percent),
                      this.show(this.dir > 0 && !t || this.dir < 0 && t ? "next" : "previous", !0)
                  }
              h(this.list, {
                  userSelect: "",
                  pointerEvents: ""
              }),
              this.drag = this.percent = null
          }
      }
  };
  function kl(t) {
      return h(t, "userSelect") !== "none" && k(t.childNodes).some(e=>e.nodeType === 3 && e.textContent.trim())
  }
  var Sl = {
      props: {
          autoplay: Boolean,
          autoplayInterval: Number,
          pauseOnHover: Boolean
      },
      data: {
          autoplay: !1,
          autoplayInterval: 7e3,
          pauseOnHover: !0
      },
      connected() {
          f(this.list, "aria-live", "polite"),
          this.autoplay && this.startAutoplay()
      },
      disconnected() {
          this.stopAutoplay()
      },
      update() {
          f(this.slides, "tabindex", "-1")
      },
      events: [{
          name: "visibilitychange",
          el() {
              return document
          },
          filter() {
              return this.autoplay
          },
          handler() {
              document.hidden ? this.stopAutoplay() : this.startAutoplay()
          }
      }, {
          name: `${At} focusin`,
          filter() {
              return this.autoplay
          },
          handler: "stopAutoplay"
      }, {
          name: `${qt} focusout`,
          filter() {
              return this.autoplay
          },
          handler: "startAutoplay"
      }],
      methods: {
          startAutoplay() {
              this.draggable && _(this.$el, ":focus-within") || this.pauseOnHover && _(this.$el, ":hover") || (this.stopAutoplay(),
              this.interval = setInterval(()=>!this.stack.length && this.show("next"), this.autoplayInterval),
              f(this.list, "aria-live", "off"))
          },
          stopAutoplay() {
              clearInterval(this.interval),
              f(this.list, "aria-live", "polite")
          }
      }
  }
    , qn = {
      mixins: [Sl, yl, $l, bt, ss],
      props: {
          clsActivated: Boolean,
          easing: String,
          index: Number,
          finite: Boolean,
          velocity: Number
      },
      data: ()=>({
          easing: "ease",
          finite: !1,
          velocity: 1,
          index: 0,
          prevIndex: -1,
          stack: [],
          percent: 0,
          clsActive: "bdt-active",
          clsActivated: !1,
          Transitioner: !1,
          transitionOptions: {}
      }),
      connected() {
          this.prevIndex = -1,
          this.index = this.getValidIndex(this.$props.index),
          this.stack = []
      },
      disconnected() {
          z(this.slides, this.clsActive)
      },
      computed: {
          duration({velocity: t}, e) {
              return Vn(e.offsetWidth / t)
          },
          list({selList: t}, e) {
              return w(t, e)
          },
          maxIndex() {
              return this.length - 1
          },
          slides: {
              get() {
                  return E(this.list)
              },
              watch() {
                  this.$emit()
              }
          },
          length() {
              return this.slides.length
          }
      },
      methods: {
          show(t, e=!1) {
              var i;
              if (this.dragging || !this.length)
                  return;
              const {stack: s} = this
                , n = e ? 0 : s.length
                , o = ()=>{
                  s.splice(n, 1),
                  s.length && this.show(s.shift(), !0)
              }
              ;
              if (s[e ? "unshift" : "push"](t),
              !e && s.length > 1) {
                  s.length === 2 && ((i = this._transitioner) == null || i.forward(Math.min(this.duration, 200)));
                  return
              }
              const r = this.getIndex(this.index)
                , a = B(this.slides, this.clsActive) && this.slides[r]
                , l = this.getIndex(t, this.index)
                , c = this.slides[l];
              if (a === c) {
                  o();
                  return
              }
              if (this.dir = Tl(t, r),
              this.prevIndex = r,
              this.index = l,
              a && !m(a, "beforeitemhide", [this]) || !m(c, "beforeitemshow", [this, a])) {
                  this.index = this.prevIndex,
                  o();
                  return
              }
              const u = this._show(a, c, e).then(()=>{
                  a && m(a, "itemhidden", [this]),
                  m(c, "itemshown", [this]),
                  s.shift(),
                  this._transitioner = null,
                  requestAnimationFrame(()=>s.length && this.show(s.shift(), !0))
              }
              );
              return a && m(a, "itemhide", [this]),
              m(c, "itemshow", [this]),
              u
          },
          getIndex(t=this.index, e=this.index) {
              return U(ct(t, this.slides, e, this.finite), 0, this.maxIndex)
          },
          getValidIndex(t=this.index, e=this.prevIndex) {
              return this.getIndex(t, e)
          },
          _show(t, e, i) {
              if (this._transitioner = this._getTransitioner(t, e, this.dir, {
                  easing: i ? e.offsetWidth < 600 ? "cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "cubic-bezier(0.165, 0.84, 0.44, 1)" : this.easing,
                  ...this.transitionOptions
              }),
              !i && !t)
                  return this._translate(1),
                  Promise.resolve();
              const {length: s} = this.stack;
              return this._transitioner[s > 1 ? "forward" : "show"](s > 1 ? Math.min(this.duration, 75 + 75 / (s - 1)) : this.duration, this.percent)
          },
          _getDistance(t, e) {
              return this._getTransitioner(t, t !== e && e).getDistance()
          },
          _translate(t, e=this.prevIndex, i=this.index) {
              const s = this._getTransitioner(e === i ? !1 : e, i);
              return s.translate(t),
              s
          },
          _getTransitioner(t=this.prevIndex, e=this.index, i=this.dir || 1, s=this.transitionOptions) {
              return new this.Transitioner(ee(t) ? this.slides[t] : t,ee(e) ? this.slides[e] : e,i * (J ? -1 : 1),s)
          }
      }
  };
  function Tl(t, e) {
      return t === "next" ? 1 : t === "previous" || t < e ? -1 : 1
  }
  function Vn(t) {
      return .5 * t + 300
  }
  var Yn = {
      mixins: [qn],
      props: {
          animation: String
      },
      data: {
          animation: "slide",
          clsActivated: "bdt-transition-active",
          Animations: us,
          Transitioner: bl
      },
      computed: {
          animation({animation: t, Animations: e}) {
              return {
                  ...e[t] || e.slide,
                  name: t
              }
          },
          transitionOptions() {
              return {
                  animation: this.animation
              }
          }
      },
      events: {
          beforeitemshow({target: t}) {
              y(t, this.clsActive)
          },
          itemshown({target: t}) {
              y(t, this.clsActivated)
          },
          itemhidden({target: t}) {
              z(t, this.clsActive, this.clsActivated)
          }
      }
  }
    , Gn = {
      mixins: [rs, Yn],
      functional: !0,
      props: {
          delayControls: Number,
          preload: Number,
          videoAutoplay: Boolean,
          template: String
      },
      data: ()=>({
          preload: 1,
          videoAutoplay: !1,
          delayControls: 3e3,
          items: [],
          cls: "bdt-open",
          clsPage: "bdt-lightbox-page",
          selList: ".bdt-lightbox-items",
          attrItem: "bdt-lightbox-item",
          selClose: ".bdt-close-large",
          selCaption: ".bdt-lightbox-caption",
          pauseOnHover: !1,
          velocity: 2,
          Animations: Wn,
          template: '<div class="bdt-lightbox bdt-overflow-hidden"> <ul class="bdt-lightbox-items"></ul> <div class="bdt-lightbox-toolbar bdt-position-top bdt-text-right bdt-transition-slide-top bdt-transition-opaque"> <button class="bdt-lightbox-toolbar-icon bdt-close-large" type="button" bdt-close></button> </div> <a class="bdt-lightbox-button bdt-position-center-left bdt-position-medium bdt-transition-fade" href bdt-slidenav-previous bdt-lightbox-item="previous"></a> <a class="bdt-lightbox-button bdt-position-center-right bdt-position-medium bdt-transition-fade" href bdt-slidenav-next bdt-lightbox-item="next"></a> <div class="bdt-lightbox-toolbar bdt-lightbox-caption bdt-position-bottom bdt-text-center bdt-transition-slide-bottom bdt-transition-opaque"></div> </div>'
      }),
      created() {
          const t = w(this.template)
            , e = w(this.selList, t);
          this.items.forEach(()=>W(e, "<li>"));
          const i = w("[bdt-close]", t)
            , s = this.t("close");
          i && s && (i.dataset.i18n = JSON.stringify({
              label: s
          })),
          this.$mount(W(this.container, t))
      },
      computed: {
          caption({selCaption: t}, e) {
              return w(t, e)
          }
      },
      events: [{
          name: `${ii} ${gt} keydown`,
          handler: "showControls"
      }, {
          name: "click",
          self: !0,
          delegate() {
              return `${this.selList} > *`
          },
          handler(t) {
              t.defaultPrevented || this.hide()
          }
      }, {
          name: "shown",
          self: !0,
          handler() {
              this.showControls()
          }
      }, {
          name: "hide",
          self: !0,
          handler() {
              this.hideControls(),
              z(this.slides, this.clsActive),
              S.stop(this.slides)
          }
      }, {
          name: "hidden",
          self: !0,
          handler() {
              this.$destroy(!0)
          }
      }, {
          name: "keyup",
          el() {
              return document
          },
          handler({keyCode: t}) {
              if (!this.isToggled(this.$el) || !this.draggable)
                  return;
              let e = -1;
              t === C.LEFT ? e = "previous" : t === C.RIGHT ? e = "next" : t === C.HOME ? e = 0 : t === C.END && (e = "last"),
              ~e && this.show(e)
          }
      }, {
          name: "beforeitemshow",
          handler(t) {
              this.isToggled() || (this.draggable = !1,
              t.preventDefault(),
              this.toggleElement(this.$el, !0, !1),
              this.animation = Wn.scale,
              z(t.target, this.clsActive),
              this.stack.splice(1, 0, this.index))
          }
      }, {
          name: "itemshow",
          handler() {
              It(this.caption, this.getItem().caption || "");
              for (let t = -this.preload; t <= this.preload; t++)
                  this.loadItem(this.index + t)
          }
      }, {
          name: "itemshown",
          handler() {
              this.draggable = this.$props.draggable
          }
      }, {
          name: "itemload",
          async handler(t, e) {
              const {source: i, type: s, alt: n="", poster: o, attrs: r={}} = e;
              if (this.setItem(e, "<span bdt-spinner></span>"),
              !i)
                  return;
              let a;
              const l = {
                  allowfullscreen: "",
                  style: "max-width: 100%; box-sizing: border-box;",
                  "bdt-responsive": "",
                  "bdt-video": `${this.videoAutoplay}`
              };
              if (s === "image" || i.match(/\.(avif|jpe?g|jfif|a?png|gif|svg|webp)($|\?)/i)) {
                  const c = Fe("img", {
                      src: i,
                      alt: n,
                      ...r
                  });
                  x(c, "load", ()=>this.setItem(e, c)),
                  x(c, "error", ()=>this.setError(e))
              } else if (s === "video" || i.match(/\.(mp4|webm|ogv)($|\?)/i)) {
                  const c = Fe("video", {
                      src: i,
                      poster: o,
                      controls: "",
                      playsinline: "",
                      "bdt-video": `${this.videoAutoplay}`,
                      ...r
                  });
                  x(c, "loadedmetadata", ()=>this.setItem(e, c)),
                  x(c, "error", ()=>this.setError(e))
              } else if (s === "iframe" || i.match(/\.(html|php)($|\?)/i))
                  this.setItem(e, Fe("iframe", {
                      src: i,
                      allowfullscreen: "",
                      class: "bdt-lightbox-iframe",
                      ...r
                  }));
              else if (a = i.match(/\/\/(?:.*?youtube(-nocookie)?\..*?(?:[?&]v=|\/shorts\/)|youtu\.be\/)([\w-]{11})[&?]?(.*)?/))
                  this.setItem(e, Fe("iframe", {
                      src: `https://www.youtube${a[1] || ""}.com/embed/${a[2]}${a[3] ? `?${a[3]}` : ""}`,
                      width: 1920,
                      height: 1080,
                      ...l,
                      ...r
                  }));
              else if (a = i.match(/\/\/.*?vimeo\.[a-z]+\/(\d+)[&?]?(.*)?/))
                  try {
                      const {height: c, width: u} = await (await fetch(`https://vimeo.com/api/oembed.json?maxwidth=1920&url=${encodeURI(i)}`, {
                          credentials: "omit"
                      })).json();
                      this.setItem(e, Fe("iframe", {
                          src: `https://player.vimeo.com/video/${a[1]}${a[2] ? `?${a[2]}` : ""}`,
                          width: u,
                          height: c,
                          ...l,
                          ...r
                      }))
                  } catch {
                      this.setError(e)
                  }
          }
      }],
      methods: {
          loadItem(t=this.index) {
              const e = this.getItem(t);
              this.getSlide(e).childElementCount || m(this.$el, "itemload", [e])
          },
          getItem(t=this.index) {
              return this.items[ct(t, this.slides)]
          },
          setItem(t, e) {
              m(this.$el, "itemloaded", [this, It(this.getSlide(t), e)])
          },
          getSlide(t) {
              return this.slides[this.items.indexOf(t)]
          },
          setError(t) {
              this.setItem(t, '<span bdt-icon="icon: bolt; ratio: 2"></span>')
          },
          showControls() {
              clearTimeout(this.controlsTimer),
              this.controlsTimer = setTimeout(this.hideControls, this.delayControls),
              y(this.$el, "bdt-active", "bdt-transition-active")
          },
          hideControls() {
              z(this.$el, "bdt-active", "bdt-transition-active")
          }
      }
  };
  function Fe(t, e) {
      const i = Ht(`<${t}>`);
      return f(i, e),
      i
  }
  var Cl = {
      install: _l,
      props: {
          toggle: String
      },
      data: {
          toggle: "a"
      },
      computed: {
          toggles: {
              get({toggle: t}, e) {
                  return O(t, e)
              },
              watch(t) {
                  this.hide();
                  for (const e of t)
                      X(e, "a") && f(e, "role", "button")
              },
              immediate: !0
          }
      },
      disconnected() {
          this.hide()
      },
      events: [{
          name: "click",
          delegate() {
              return `${this.toggle}:not(.bdt-disabled)`
          },
          handler(t) {
              t.preventDefault(),
              this.show(t.current)
          }
      }],
      methods: {
          show(t) {
              const e = $s(this.toggles.map(Xn), "source");
              if (te(t)) {
                  const {source: i} = Xn(t);
                  t = $t(e, ({source: s})=>i === s)
              }
              return this.panel = this.panel || this.$create("lightboxPanel", {
                  ...this.$props,
                  items: e
              }),
              x(this.panel.$el, "hidden", ()=>this.panel = null),
              this.panel.show(t)
          },
          hide() {
              var t;
              return (t = this.panel) == null ? void 0 : t.hide()
          }
      }
  };
  function _l(t, e) {
      t.lightboxPanel || t.component("lightboxPanel", Gn),
      xt(e.props, t.component("lightboxPanel").options.props)
  }
  function Xn(t) {
      const e = {};
      for (const i of ["href", "caption", "type", "poster", "alt", "attrs"])
          e[i === "href" ? "source" : i] = tt(t, i);
      return e.attrs = de(e.attrs),
      e
  }
  var El = {
      mixins: [Be],
      functional: !0,
      args: ["message", "status"],
      data: {
          message: "",
          status: "",
          timeout: 5e3,
          group: null,
          pos: "top-center",
          clsContainer: "bdt-notification",
          clsClose: "bdt-notification-close",
          clsMsg: "bdt-notification-message"
      },
      install: Il,
      computed: {
          marginProp({pos: t}) {
              return `margin${ht(t, "top") ? "Top" : "Bottom"}`
          },
          startProps() {
              return {
                  opacity: 0,
                  [this.marginProp]: -this.$el.offsetHeight
              }
          }
      },
      created() {
          const t = w(`.${this.clsContainer}-${this.pos}`, this.container) || W(this.container, `<div class="${this.clsContainer} ${this.clsContainer}-${this.pos}" style="display: block"></div>`);
          this.$mount(W(t, `<div class="${this.clsMsg}${this.status ? ` ${this.clsMsg}-${this.status}` : ""}" role="alert"> <a href class="${this.clsClose}" data-bdt-close></a> <div>${this.message}</div> </div>`))
      },
      async connected() {
          const t = $(h(this.$el, this.marginProp));
          await S.start(h(this.$el, this.startProps), {
              opacity: 1,
              [this.marginProp]: t
          }),
          this.timeout && (this.timer = setTimeout(this.close, this.timeout))
      },
      events: {
          click(t) {
              Y(t.target, 'a[href="#"],a[href=""]') && t.preventDefault(),
              this.close()
          },
          [At]() {
              this.timer && clearTimeout(this.timer)
          },
          [qt]() {
              this.timeout && (this.timer = setTimeout(this.close, this.timeout))
          }
      },
      methods: {
          async close(t) {
              const e = i=>{
                  const s = A(i);
                  m(i, "close", [this]),
                  ot(i),
                  s != null && s.hasChildNodes() || ot(s)
              }
              ;
              this.timer && clearTimeout(this.timer),
              t || await S.start(this.$el, this.startProps),
              e(this.$el)
          }
      }
  };
  function Il(t) {
      t.notification.closeAll = function(e, i) {
          Ct(document.body, s=>{
              const n = t.getComponent(s, "notification");
              n && (!e || e === n.group) && n.close(i)
          }
          )
      }
  }
  const bi = {
      x: $i,
      y: $i,
      rotate: $i,
      scale: $i,
      color: ps,
      backgroundColor: ps,
      borderColor: ps,
      blur: Jt,
      hue: Jt,
      fopacity: Jt,
      grayscale: Jt,
      invert: Jt,
      saturate: Jt,
      sepia: Jt,
      opacity: Al,
      stroke: Ol,
      bgx: Zn,
      bgy: Zn
  }
    , {keys: Jn} = Object;
  var Kn = {
      mixins: [mi],
      props: eo(Jn(bi), "list"),
      data: eo(Jn(bi), void 0),
      computed: {
          props(t, e) {
              const i = {};
              for (const n in t)
                  n in bi && !V(t[n]) && (i[n] = t[n].slice());
              const s = {};
              for (const n in i)
                  s[n] = bi[n](n, e, i[n], i);
              return s
          }
      },
      events: {
          load() {
              this.$emit()
          }
      },
      methods: {
          reset() {
              for (const t in this.getCss(0))
                  h(this.$el, t, "")
          },
          getCss(t) {
              const e = {
                  transform: "",
                  filter: ""
              };
              for (const i in this.props)
                  this.props[i](e, t);
              return e.willChange = Object.keys(e).filter(i=>e[i] !== "").join(","),
              e
          }
      }
  };
  function $i(t, e, i) {
      let s = yi(i) || {
          x: "px",
          y: "px",
          rotate: "deg"
      }[t] || "", n;
      return t === "x" || t === "y" ? (t = `translate${_t(t)}`,
      n = o=>$($(o).toFixed(s === "px" ? 0 : 6))) : t === "scale" && (s = "",
      n = o=>yi([o]) ? rt(o, "width", e, !0) / e.offsetWidth : o),
      i.length === 1 && i.unshift(t === "scale" ? 1 : 0),
      i = pe(i, n),
      (o,r)=>{
          o.transform += ` ${t}(${He(i, r)}${s})`
      }
  }
  function ps(t, e, i) {
      return i.length === 1 && i.unshift(Le(e, t, "")),
      i = pe(i, s=>Pl(e, s)),
      (s,n)=>{
          const [o,r,a] = to(i, n)
            , l = o.map((c,u)=>(c += a * (r[u] - c),
          u === 3 ? $(c) : parseInt(c, 10))).join(",");
          s[t] = `rgba(${l})`
      }
  }
  function Pl(t, e) {
      return Le(t, "color", e).split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map($)
  }
  function Jt(t, e, i) {
      i.length === 1 && i.unshift(0);
      const s = yi(i) || {
          blur: "px",
          hue: "deg"
      }[t] || "%";
      return t = {
          fopacity: "opacity",
          hue: "hue-rotate"
      }[t] || t,
      i = pe(i),
      (n,o)=>{
          const r = He(i, o);
          n.filter += ` ${t}(${r + s})`
      }
  }
  function Al(t, e, i) {
      return i.length === 1 && i.unshift(Le(e, t, "")),
      i = pe(i),
      (s,n)=>{
          s[t] = He(i, n)
      }
  }
  function Ol(t, e, i) {
      i.length === 1 && i.unshift(0);
      const s = yi(i)
        , n = sn(e);
      return i = pe(i.reverse(), o=>(o = $(o),
      s === "%" ? o * n / 100 : o)),
      i.some(([o])=>o) ? (h(e, "strokeDasharray", n),
      (o,r)=>{
          o.strokeDashoffset = He(i, r)
      }
      ) : P
  }
  function Zn(t, e, i, s) {
      i.length === 1 && i.unshift(0);
      const n = t === "bgy" ? "height" : "width";
      s[t] = pe(i, a=>rt(a, n, e));
      const o = ["bgx", "bgy"].filter(a=>a in s);
      if (o.length === 2 && t === "bgx")
          return P;
      if (Le(e, "backgroundSize", "") === "cover")
          return Dl(t, e, i, s);
      const r = {};
      for (const a of o)
          r[a] = Qn(e, a);
      return Un(o, r, s)
  }
  function Dl(t, e, i, s) {
      const n = Bl(e);
      if (!n.width)
          return P;
      const o = {
          width: e.offsetWidth,
          height: e.offsetHeight
      }
        , r = ["bgx", "bgy"].filter(u=>u in s)
        , a = {};
      for (const u of r) {
          const d = s[u].map(([M])=>M)
            , p = Math.min(...d)
            , g = Math.max(...d)
            , T = d.indexOf(p) < d.indexOf(g)
            , F = g - p;
          a[u] = `${(T ? -F : 0) - (T ? p : g)}px`,
          o[u === "bgy" ? "height" : "width"] += F
      }
      const l = Ge.cover(n, o);
      for (const u of r) {
          const d = u === "bgy" ? "height" : "width"
            , p = l[d] - o[d];
          a[u] = `max(${Qn(e, u)},-${p}px) + ${a[u]}`
      }
      const c = Un(r, a, s);
      return (u,d)=>{
          c(u, d),
          u.backgroundSize = `${l.width}px ${l.height}px`,
          u.backgroundRepeat = "no-repeat"
      }
  }
  function Qn(t, e) {
      return Le(t, `background-position-${e.substr(-1)}`, "")
  }
  function Un(t, e, i) {
      return function(s, n) {
          for (const o of t) {
              const r = He(i[o], n);
              s[`background-position-${o.substr(-1)}`] = `calc(${e[o]} + ${r}px)`
          }
      }
  }
  const xi = {};
  function Bl(t) {
      const e = h(t, "backgroundImage").replace(/^none|url\(["']?(.+?)["']?\)$/, "$1");
      if (xi[e])
          return xi[e];
      const i = new Image;
      return e && (i.src = e,
      !i.naturalWidth) ? (i.onload = ()=>{
          xi[e] = gs(i),
          m(t, Ft("load", !1))
      }
      ,
      gs(i)) : xi[e] = gs(i)
  }
  function gs(t) {
      return {
          width: t.naturalWidth,
          height: t.naturalHeight
      }
  }
  function pe(t, e=$) {
      const i = []
        , {length: s} = t;
      let n = 0;
      for (let o = 0; o < s; o++) {
          let[r,a] = N(t[o]) ? t[o].trim().split(" ") : [t[o]];
          if (r = e(r),
          a = a ? $(a) / 100 : null,
          o === 0 ? a === null ? a = 0 : a && i.push([r, 0]) : o === s - 1 && (a === null ? a = 1 : a !== 1 && (i.push([r, a]),
          a = 1)),
          i.push([r, a]),
          a === null)
              n++;
          else if (n) {
              const l = i[o - n - 1][1]
                , c = (a - l) / (n + 1);
              for (let u = n; u > 0; u--)
                  i[o - u][1] = l + c * (n - u + 1);
              n = 0
          }
      }
      return i
  }
  function to(t, e) {
      const i = $t(t.slice(1), ([,s])=>e <= s) + 1;
      return [t[i - 1][0], t[i][0], (e - t[i - 1][1]) / (t[i][1] - t[i - 1][1])]
  }
  function He(t, e) {
      const [i,s,n] = to(t, e);
      return ee(i) ? i + Math.abs(i - s) * n * (i < s ? 1 : -1) : +s
  }
  const Ml = /^-?\d+(\S+)?/;
  function yi(t, e) {
      var i;
      for (const s of t) {
          const n = (i = s.match) == null ? void 0 : i.call(s, Ml);
          if (n)
              return n[1]
      }
      return e
  }
  function Le(t, e, i) {
      const s = t.style[e]
        , n = h(h(t, e, i), e);
      return t.style[e] = s,
      n
  }
  function eo(t, e) {
      return t.reduce((i,s)=>(i[s] = e,
      i), {})
  }
  var Nl = {
      mixins: [Kn, bt, ci],
      props: {
          target: String,
          viewport: Number,
          easing: Number,
          start: String,
          end: String
      },
      data: {
          target: !1,
          viewport: 1,
          easing: 1,
          start: 0,
          end: 0
      },
      computed: {
          target({target: t}, e) {
              return io(t && ut(t, e) || e)
          },
          start({start: t}) {
              return rt(t, "height", this.target, !0)
          },
          end({end: t, viewport: e}) {
              return rt(t || (e = (1 - e) * 100) && `${e}vh+${e}%`, "height", this.target, !0)
          }
      },
      resizeTargets() {
          return [this.$el, this.target]
      },
      update: {
          read({percent: t}, e) {
              if (e.has("scroll") || (t = !1),
              !q(this.$el))
                  return !1;
              if (!this.matchMedia)
                  return;
              const i = t;
              return t = zl(Qi(this.target, this.start, this.end), this.easing),
              {
                  percent: t,
                  style: i === t ? !1 : this.getCss(t)
              }
          },
          write({style: t}) {
              if (!this.matchMedia) {
                  this.reset();
                  return
              }
              t && h(this.$el, t)
          },
          events: ["scroll", "resize"]
      }
  };
  function zl(t, e) {
      return e >= 0 ? Math.pow(t, e + 1) : 1 - Math.pow(1 - t, 1 - e)
  }
  function io(t) {
      return t ? "offsetTop"in t ? t : io(A(t)) : document.documentElement
  }
  var so = {
      update: {
          write() {
              if (this.stack.length || this.dragging)
                  return;
              const t = this.getValidIndex(this.index);
              !~this.prevIndex || this.index !== t ? this.show(t) : this._translate(1, this.prevIndex, this.index)
          },
          events: ["resize"]
      }
  }
    , no = {
      mixins: [Oe],
      connected() {
          this.lazyload(this.slides, this.getAdjacentSlides)
      }
  };
  function Fl(t, e, i, {center: s, easing: n, list: o}) {
      const r = new Xe
        , a = t ? We(t, o, s) : We(e, o, s) + b(e).width * i
        , l = e ? We(e, o, s) : a + b(t).width * i * (J ? -1 : 1);
      return {
          dir: i,
          show(c, u=0, d) {
              const p = d ? "linear" : n;
              return c -= Math.round(c * U(u, -1, 1)),
              this.translate(u),
              u = t ? u : U(u, 0, 1),
              ms(this.getItemIn(), "itemin", {
                  percent: u,
                  duration: c,
                  timing: p,
                  dir: i
              }),
              t && ms(this.getItemIn(!0), "itemout", {
                  percent: 1 - u,
                  duration: c,
                  timing: p,
                  dir: i
              }),
              S.start(o, {
                  transform: H(-l * (J ? -1 : 1), "px")
              }, c, p).then(r.resolve, P),
              r.promise
          },
          cancel() {
              S.cancel(o)
          },
          reset() {
              h(o, "transform", "")
          },
          forward(c, u=this.percent()) {
              return S.cancel(o),
              this.show(c, u, !0)
          },
          translate(c) {
              const u = this.getDistance() * i * (J ? -1 : 1);
              h(o, "transform", H(U(-l + (u - u * c), -ki(o), b(o).width) * (J ? -1 : 1), "px"));
              const d = this.getActives()
                , p = this.getItemIn()
                , g = this.getItemIn(!0);
              c = t ? U(c, -1, 1) : 0;
              for (const T of E(o)) {
                  const F = v(d, T)
                    , M = T === p
                    , Bt = T === g
                    , vs = M || !Bt && (F || i * (J ? -1 : 1) === -1 ^ Si(T, o) > Si(t || e));
                  ms(T, `itemtranslate${vs ? "in" : "out"}`, {
                      dir: i,
                      percent: Bt ? 1 - c : M ? c : F ? 1 : 0
                  })
              }
          },
          percent() {
              return Math.abs((h(o, "transform").split(",")[4] * (J ? -1 : 1) + a) / (l - a))
          },
          getDistance() {
              return Math.abs(l - a)
          },
          getItemIn(c=!1) {
              let u = this.getActives()
                , d = ro(o, We(e || t, o, s));
              if (c) {
                  const p = u;
                  u = d,
                  d = p
              }
              return d[$t(d, p=>!v(u, p))]
          },
          getActives() {
              return ro(o, We(t || e, o, s))
          }
      }
  }
  function We(t, e, i) {
      const s = Si(t, e);
      return i ? s - Hl(t, e) : Math.min(s, oo(e))
  }
  function oo(t) {
      return Math.max(0, ki(t) - b(t).width)
  }
  function ki(t) {
      return Nt(E(t), e=>b(e).width)
  }
  function Hl(t, e) {
      return b(e).width / 2 - b(t).width / 2
  }
  function Si(t, e) {
      return t && (ti(t).left + (J ? b(t).width - b(e).width : 0)) * (J ? -1 : 1) || 0
  }
  function ro(t, e) {
      e -= 1;
      const i = b(t).width
        , s = e + i + 2;
      return E(t).filter(n=>{
          const o = Si(n, t)
            , r = o + Math.min(b(n).width, i);
          return o >= e && r <= s
      }
      )
  }
  function ms(t, e, i) {
      m(t, Ft(e, !1, !1, i))
  }
  var Ll = {
      mixins: [st, qn, so, no],
      props: {
          center: Boolean,
          sets: Boolean
      },
      data: {
          center: !1,
          sets: !1,
          attrItem: "bdt-slider-item",
          selList: ".bdt-slider-items",
          selNav: ".bdt-slider-nav",
          clsContainer: "bdt-slider-container",
          Transitioner: Fl
      },
      computed: {
          avgWidth() {
              return ki(this.list) / this.length
          },
          finite({finite: t}) {
              return t || Wl(this.list, this.center)
          },
          maxIndex() {
              if (!this.finite || this.center && !this.sets)
                  return this.length - 1;
              if (this.center)
                  return se(this.sets);
              let t = 0;
              const e = oo(this.list)
                , i = $t(this.slides, s=>{
                  if (t >= e)
                      return !0;
                  t += b(s).width
              }
              );
              return ~i ? i : this.length - 1
          },
          sets({sets: t}) {
              if (!t)
                  return;
              let e = 0;
              const i = []
                , s = b(this.list).width;
              for (let n = 0; n < this.length; n++) {
                  const o = b(this.slides[n]).width;
                  e + o > s && (e = 0),
                  this.center ? e < s / 2 && e + o + b(this.slides[+n + 1]).width / 2 > s / 2 && (i.push(+n),
                  e = s / 2 - o / 2) : e === 0 && i.push(Math.min(+n, this.maxIndex)),
                  e += o
              }
              if (i.length)
                  return i
          },
          transitionOptions() {
              return {
                  center: this.center,
                  list: this.list
              }
          }
      },
      connected() {
          j(this.$el, this.clsContainer, !w(`.${this.clsContainer}`, this.$el))
      },
      update: {
          write() {
              for (const t of this.navItems) {
                  const e = kt(tt(t, this.attrItem));
                  e !== !1 && (t.hidden = !this.maxIndex || e > this.maxIndex || this.sets && !v(this.sets, e))
              }
              this.length && !this.dragging && !this.stack.length && (this.reorder(),
              this._translate(1)),
              this.updateActiveClasses()
          },
          events: ["resize"]
      },
      events: {
          beforeitemshow(t) {
              !this.dragging && this.sets && this.stack.length < 2 && !v(this.sets, this.index) && (this.index = this.getValidIndex());
              const e = Math.abs(this.index - this.prevIndex + (this.dir > 0 && this.index < this.prevIndex || this.dir < 0 && this.index > this.prevIndex ? (this.maxIndex + 1) * this.dir : 0));
              if (!this.dragging && e > 1) {
                  for (let s = 0; s < e; s++)
                      this.stack.splice(1, 0, this.dir > 0 ? "next" : "previous");
                  t.preventDefault();
                  return
              }
              const i = this.dir < 0 || !this.slides[this.prevIndex] ? this.index : this.prevIndex;
              this.duration = Vn(this.avgWidth / this.velocity) * (b(this.slides[i]).width / this.avgWidth),
              this.reorder()
          },
          itemshow() {
              ~this.prevIndex && y(this._getTransitioner().getItemIn(), this.clsActive)
          },
          itemshown() {
              this.updateActiveClasses()
          }
      },
      methods: {
          reorder() {
              if (this.finite) {
                  h(this.slides, "order", "");
                  return
              }
              const t = this.dir > 0 && this.slides[this.prevIndex] ? this.prevIndex : this.index;
              if (this.slides.forEach((n,o)=>h(n, "order", this.dir > 0 && o < t ? 1 : this.dir < 0 && o >= this.index ? -1 : "")),
              !this.center)
                  return;
              const e = this.slides[t];
              let i = b(this.list).width / 2 - b(e).width / 2
                , s = 0;
              for (; i > 0; ) {
                  const n = this.getIndex(--s + t, t)
                    , o = this.slides[n];
                  h(o, "order", n > t ? -2 : -1),
                  i -= b(o).width
              }
          },
          updateActiveClasses() {
              const t = this._getTransitioner(this.index).getActives()
                , e = [this.clsActive, (!this.sets || v(this.sets, $(this.index))) && this.clsActivated || ""];
              for (const i of this.slides) {
                  const s = v(t, i);
                  j(i, e, s),
                  f(i, "aria-hidden", !s),
                  f(O(ye, i), "tabindex", s ? null : -1)
              }
          },
          getValidIndex(t=this.index, e=this.prevIndex) {
              if (t = this.getIndex(t, e),
              !this.sets)
                  return t;
              let i;
              do {
                  if (v(this.sets, t))
                      return t;
                  i = t,
                  t = this.getIndex(t + this.dir, e)
              } while (t !== i);
              return t
          },
          getAdjacentSlides() {
              const {width: t} = b(this.list)
                , e = -t
                , i = t * 2
                , s = b(this.slides[this.index]).width
                , n = this.center ? t / 2 - s / 2 : 0
                , o = new Set;
              for (const r of [-1, 1]) {
                  let a = n + (r > 0 ? s : 0)
                    , l = 0;
                  do {
                      const c = this.slides[this.getIndex(this.index + r + l++ * r)];
                      a += b(c).width * r,
                      o.add(c)
                  } while (this.length > l && a > e && a < i)
              }
              return Array.from(o)
          }
      }
  };
  function Wl(t, e) {
      if (!t || t.length < 2)
          return !0;
      const {width: i} = b(t);
      if (!e)
          return Math.ceil(ki(t)) < Math.trunc(i + Rl(t));
      const s = E(t)
        , n = Math.trunc(i / 2);
      for (const o in s) {
          const r = s[o]
            , a = b(r).width
            , l = new Set([r]);
          let c = 0;
          for (const u of [-1, 1]) {
              let d = a / 2
                , p = 0;
              for (; d < n; ) {
                  const g = s[ct(+o + u + p++ * u, s)];
                  if (l.has(g))
                      return !0;
                  d += b(g).width,
                  l.add(g)
              }
              c = Math.max(c, a / 2 + b(s[ct(+o + u, s)]).width / 2 - (d - n))
          }
          if (c > Nt(s.filter(u=>!l.has(u)), u=>b(u).width))
              return !0
      }
      return !1
  }
  function Rl(t) {
      return Math.max(0, ...E(t).map(e=>b(e).width))
  }
  var ao = {
      mixins: [Kn],
      data: {
          selItem: "!li"
      },
      beforeConnect() {
          this.item = ut(this.selItem, this.$el)
      },
      disconnected() {
          this.item = null
      },
      events: [{
          name: "itemin itemout",
          self: !0,
          el() {
              return this.item
          },
          handler({type: t, detail: {percent: e, duration: i, timing: s, dir: n}}) {
              G.read(()=>{
                  if (!this.matchMedia)
                      return;
                  const o = this.getCss(ho(t, n, e))
                    , r = this.getCss(lo(t) ? .5 : n > 0 ? 1 : 0);
                  G.write(()=>{
                      h(this.$el, o),
                      S.start(this.$el, r, i, s).catch(P)
                  }
                  )
              }
              )
          }
      }, {
          name: "transitioncanceled transitionend",
          self: !0,
          el() {
              return this.item
          },
          handler() {
              S.cancel(this.$el)
          }
      }, {
          name: "itemtranslatein itemtranslateout",
          self: !0,
          el() {
              return this.item
          },
          handler({type: t, detail: {percent: e, dir: i}}) {
              G.read(()=>{
                  if (!this.matchMedia) {
                      this.reset();
                      return
                  }
                  const s = this.getCss(ho(t, i, e));
                  G.write(()=>h(this.$el, s))
              }
              )
          }
      }]
  };
  function lo(t) {
      return Qt(t, "in")
  }
  function ho(t, e, i) {
      return i /= 2,
      lo(t) ^ e < 0 ? i : 1 - i
  }
  var jl = {
      ...us,
      fade: {
          show() {
              return [{
                  opacity: 0,
                  zIndex: 0
              }, {
                  zIndex: -1
              }]
          },
          percent(t) {
              return 1 - h(t, "opacity")
          },
          translate(t) {
              return [{
                  opacity: 1 - t,
                  zIndex: 0
              }, {
                  zIndex: -1
              }]
          }
      },
      scale: {
          show() {
              return [{
                  opacity: 0,
                  transform: fe(1 + .5),
                  zIndex: 0
              }, {
                  zIndex: -1
              }]
          },
          percent(t) {
              return 1 - h(t, "opacity")
          },
          translate(t) {
              return [{
                  opacity: 1 - t,
                  transform: fe(1 + .5 * t),
                  zIndex: 0
              }, {
                  zIndex: -1
              }]
          }
      },
      pull: {
          show(t) {
              return t < 0 ? [{
                  transform: H(30),
                  zIndex: -1
              }, {
                  transform: H(),
                  zIndex: 0
              }] : [{
                  transform: H(-100),
                  zIndex: 0
              }, {
                  transform: H(),
                  zIndex: -1
              }]
          },
          percent(t, e, i) {
              return i < 0 ? 1 - ze(e) : ze(t)
          },
          translate(t, e) {
              return e < 0 ? [{
                  transform: H(30 * t),
                  zIndex: -1
              }, {
                  transform: H(-100 * (1 - t)),
                  zIndex: 0
              }] : [{
                  transform: H(-t * 100),
                  zIndex: 0
              }, {
                  transform: H(30 * (1 - t)),
                  zIndex: -1
              }]
          }
      },
      push: {
          show(t) {
              return t < 0 ? [{
                  transform: H(100),
                  zIndex: 0
              }, {
                  transform: H(),
                  zIndex: -1
              }] : [{
                  transform: H(-30),
                  zIndex: -1
              }, {
                  transform: H(),
                  zIndex: 0
              }]
          },
          percent(t, e, i) {
              return i > 0 ? 1 - ze(e) : ze(t)
          },
          translate(t, e) {
              return e < 0 ? [{
                  transform: H(t * 100),
                  zIndex: 0
              }, {
                  transform: H(-30 * (1 - t)),
                  zIndex: -1
              }] : [{
                  transform: H(-30 * t),
                  zIndex: -1
              }, {
                  transform: H(100 * (1 - t)),
                  zIndex: 0
              }]
          }
      }
  }
    , ql = {
      mixins: [st, Yn, so, no],
      props: {
          ratio: String,
          minHeight: Number,
          maxHeight: Number
      },
      data: {
          ratio: "16:9",
          minHeight: !1,
          maxHeight: !1,
          selList: ".bdt-slideshow-items",
          attrItem: "bdt-slideshow-item",
          selNav: ".bdt-slideshow-nav",
          Animations: jl
      },
      update: {
          read() {
              if (!this.list)
                  return !1;
              let[t,e] = this.ratio.split(":").map(Number);
              return e = e * this.list.offsetWidth / t || 0,
              this.minHeight && (e = Math.max(this.minHeight, e)),
              this.maxHeight && (e = Math.min(this.maxHeight, e)),
              {
                  height: e - ae(this.list, "height", "content-box")
              }
          },
          write({height: t}) {
              t > 0 && h(this.list, "minHeight", t)
          },
          events: ["resize"]
      },
      methods: {
          getAdjacentSlides() {
              return [1, -1].map(t=>this.slides[this.getIndex(this.index + t)])
          }
      }
  }
    , Vl = {
      mixins: [st, Fn],
      props: {
          group: String,
          threshold: Number,
          clsItem: String,
          clsPlaceholder: String,
          clsDrag: String,
          clsDragState: String,
          clsBase: String,
          clsNoDrag: String,
          clsEmpty: String,
          clsCustom: String,
          handle: String
      },
      data: {
          group: !1,
          threshold: 5,
          clsItem: "bdt-sortable-item",
          clsPlaceholder: "bdt-sortable-placeholder",
          clsDrag: "bdt-sortable-drag",
          clsDragState: "bdt-drag",
          clsBase: "bdt-sortable",
          clsNoDrag: "bdt-sortable-nodrag",
          clsEmpty: "bdt-sortable-empty",
          clsCustom: "",
          handle: !1,
          pos: {}
      },
      created() {
          for (const t of ["init", "start", "move", "end"]) {
              const e = this[t];
              this[t] = i=>{
                  xt(this.pos, re(i)),
                  e(i)
              }
          }
      },
      events: {
          name: gt,
          passive: !1,
          handler: "init"
      },
      computed: {
          target() {
              return (this.$el.tBodies || [this.$el])[0]
          },
          items() {
              return E(this.target)
          },
          isEmpty: {
              get() {
                  return we(this.items)
              },
              watch(t) {
                  j(this.target, this.clsEmpty, t)
              },
              immediate: !0
          },
          handles: {
              get({handle: t}, e) {
                  return t ? O(t, e) : this.items
              },
              watch(t, e) {
                  h(e, {
                      touchAction: "",
                      userSelect: ""
                  }),
                  h(t, {
                      touchAction: jt ? "none" : "",
                      userSelect: "none"
                  })
              },
              immediate: !0
          }
      },
      update: {
          write(t) {
              if (!this.drag || !A(this.placeholder))
                  return;
              const {pos: {x: e, y: i}, origin: {offsetTop: s, offsetLeft: n}, placeholder: o} = this;
              h(this.drag, {
                  top: i - s,
                  left: e - n
              });
              const r = this.getSortable(document.elementFromPoint(e, i));
              if (!r)
                  return;
              const {items: a} = r;
              if (a.some(S.inProgress))
                  return;
              const l = Jl(a, {
                  x: e,
                  y: i
              });
              if (a.length && (!l || l === o))
                  return;
              const c = this.getSortable(o)
                , u = Kl(r.target, l, o, e, i, r === c && t.moved !== l);
              u !== !1 && (u && o === u || (r !== c ? (c.remove(o),
              t.moved = l) : delete t.moved,
              r.insert(o, u),
              this.touched.add(r)))
          },
          events: ["move"]
      },
      methods: {
          init(t) {
              const {target: e, button: i, defaultPrevented: s} = t
                , [n] = this.items.filter(o=>D(e, o));
              !n || s || i > 0 || Mi(e) || D(e, `.${this.clsNoDrag}`) || this.handle && !D(e, this.handle) || (t.preventDefault(),
              this.touched = new Set([this]),
              this.placeholder = n,
              this.origin = {
                  target: e,
                  index: oe(n),
                  ...this.pos
              },
              x(document, ii, this.move),
              x(document, Pt, this.end),
              this.threshold || this.start(t))
          },
          start(t) {
              this.drag = Xl(this.$container, this.placeholder);
              const {left: e, top: i} = this.placeholder.getBoundingClientRect();
              xt(this.origin, {
                  offsetLeft: this.pos.x - e,
                  offsetTop: this.pos.y - i
              }),
              y(this.drag, this.clsDrag, this.clsCustom),
              y(this.placeholder, this.clsPlaceholder),
              y(this.items, this.clsItem),
              y(document.documentElement, this.clsDragState),
              m(this.$el, "start", [this, this.placeholder]),
              Yl(this.pos),
              this.move(t)
          },
          move(t) {
              this.drag ? this.$emit("move") : (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) && this.start(t)
          },
          end() {
              if (zt(document, ii, this.move),
              zt(document, Pt, this.end),
              !this.drag)
                  return;
              Gl();
              const t = this.getSortable(this.placeholder);
              this === t ? this.origin.index !== oe(this.placeholder) && m(this.$el, "moved", [this, this.placeholder]) : (m(t.$el, "added", [t, this.placeholder]),
              m(this.$el, "removed", [this, this.placeholder])),
              m(this.$el, "stop", [this, this.placeholder]),
              ot(this.drag),
              this.drag = null;
              for (const {clsPlaceholder: e, clsItem: i} of this.touched)
                  for (const s of this.touched)
                      z(s.items, e, i);
              this.touched = null,
              z(document.documentElement, this.clsDragState)
          },
          insert(t, e) {
              y(this.items, this.clsItem);
              const i = ()=>e ? Ke(e, t) : W(this.target, t);
              this.animate(i)
          },
          remove(t) {
              D(t, this.target) && this.animate(()=>ot(t))
          },
          getSortable(t) {
              do {
                  const e = this.$getComponent(t, "sortable");
                  if (e && (e === this || this.group !== !1 && e.group === this.group))
                      return e
              } while (t = A(t))
          }
      }
  };
  let co;
  function Yl(t) {
      let e = Date.now();
      co = setInterval(()=>{
          let {x: i, y: s} = t;
          s += document.scrollingElement.scrollTop;
          const n = (Date.now() - e) * .3;
          e = Date.now(),
          mt(document.elementFromPoint(i, t.y)).reverse().some(o=>{
              let {scrollTop: r, scrollHeight: a} = o;
              const {top: l, bottom: c, height: u} = at(o);
              if (l < s && l + 35 > s)
                  r -= n;
              else if (c > s && c - 35 < s)
                  r += n;
              else
                  return;
              if (r > 0 && r < a - u)
                  return o.scrollTop = r,
                  !0
          }
          )
      }
      , 15)
  }
  function Gl() {
      clearInterval(co)
  }
  function Xl(t, e) {
      let i;
      if (X(e, "li", "tr")) {
          i = w("<div>"),
          W(i, e.cloneNode(!0).children);
          for (const s of e.getAttributeNames())
              f(i, s, e.getAttribute(s))
      } else
          i = e.cloneNode(!0);
      return W(t, i),
      h(i, "margin", "0", "important"),
      h(i, {
          boxSizing: "border-box",
          width: e.offsetWidth,
          height: e.offsetHeight,
          padding: h(e, "padding")
      }),
      et(i.firstElementChild, et(e.firstElementChild)),
      i
  }
  function Jl(t, e) {
      return t[$t(t, i=>Ye(e, i.getBoundingClientRect()))]
  }
  function Kl(t, e, i, s, n, o) {
      if (!E(t).length)
          return;
      const r = e.getBoundingClientRect();
      if (!o)
          return Zl(t, i) || n < r.top + r.height / 2 ? e : e.nextElementSibling;
      const a = i.getBoundingClientRect()
        , l = uo([r.top, r.bottom], [a.top, a.bottom])
        , [c,u,d,p] = l ? [s, "width", "left", "right"] : [n, "height", "top", "bottom"]
        , g = a[u] < r[u] ? r[u] - a[u] : 0;
      return a[d] < r[d] ? g && c < r[d] + g ? !1 : e.nextElementSibling : g && c > r[p] - g ? !1 : e
  }
  function Zl(t, e) {
      const i = E(t).length === 1;
      i && W(t, e);
      const s = E(t)
        , n = s.some((o,r)=>{
          const a = o.getBoundingClientRect();
          return s.slice(r + 1).some(l=>{
              const c = l.getBoundingClientRect();
              return !uo([a.left, a.right], [c.left, c.right])
          }
          )
      }
      );
      return i && ot(e),
      n
  }
  function uo(t, e) {
      return t[1] > e[0] && e[1] > t[0]
  }
  var Ql = {
      mixins: [Be, Yt, hn],
      args: "title",
      props: {
          delay: Number,
          title: String
      },
      data: {
          pos: "top",
          title: "",
          delay: 0,
          animation: ["bdt-animation-scale-up"],
          duration: 100,
          cls: "bdt-active"
      },
      beforeConnect() {
          this.id = Dt(this),
          this._hasTitle = wt(this.$el, "title"),
          f(this.$el, {
              title: "",
              "aria-describedby": this.id
          }),
          Ul(this.$el)
      },
      disconnected() {
          this.hide(),
          f(this.$el, "title") || f(this.$el, "title", this._hasTitle ? this.title : null)
      },
      methods: {
          show() {
              this.isToggled(this.tooltip || null) || !this.title || (clearTimeout(this.showTimer),
              this.showTimer = setTimeout(this._show, this.delay))
          },
          async hide() {
              _(this.$el, "input:focus") || (clearTimeout(this.showTimer),
              this.isToggled(this.tooltip || null) && (await this.toggleElement(this.tooltip, !1, !1),
              ot(this.tooltip),
              this.tooltip = null))
          },
          _show() {
              this.tooltip = W(this.container, `<div id="${this.id}" class="bdt-${this.$options.name}" role="tooltip"> <div class="bdt-${this.$options.name}-inner">${this.title}</div> </div>`),
              x(this.tooltip, "toggled", (t,e)=>{
                  if (!e)
                      return;
                  const i = ()=>this.positionAt(this.tooltip, this.$el);
                  i();
                  const [s,n] = th(this.tooltip, this.$el, this.pos);
                  this.origin = this.axis === "y" ? `${ei(s)}-${n}` : `${n}-${ei(s)}`;
                  const o = [L(document, `keydown ${gt}`, this.hide, !1, r=>r.type === gt && !D(r.target, this.$el) || r.type === "keydown" && r.keyCode === C.ESC), x([document, ...Vt(this.$el)], "scroll", i, {
                      passive: !0
                  })];
                  L(this.tooltip, "hide", ()=>o.forEach(r=>r()), {
                      self: !0
                  })
              }
              ),
              this.toggleElement(this.tooltip, !0)
          }
      },
      events: {
          focus: "show",
          blur: "hide",
          [`${At} ${qt}`](t) {
              Tt(t) || this[t.type === At ? "show" : "hide"]()
          },
          [gt](t) {
              Tt(t) && this.show()
          }
      }
  };
  function Ul(t) {
      Je(t) || f(t, "tabindex", "0")
  }
  function th(t, e, [i,s]) {
      const n = I(t)
        , o = I(e)
        , r = [["left", "right"], ["top", "bottom"]];
      for (const l of r) {
          if (n[l[0]] >= o[l[1]]) {
              i = l[1];
              break
          }
          if (n[l[1]] <= o[l[0]]) {
              i = l[0];
              break
          }
      }
      const a = v(r[0], i) ? r[1] : r[0];
      return n[a[0]] === o[a[0]] ? s = a[0] : n[a[1]] === o[a[1]] ? s = a[1] : s = "center",
      [i, s]
  }
  var eh = {
      mixins: [ss],
      i18n: {
          invalidMime: "Invalid File Type: %s",
          invalidName: "Invalid File Name: %s",
          invalidSize: "Invalid File Size: %s Kilobytes Max"
      },
      props: {
          allow: String,
          clsDragover: String,
          concurrent: Number,
          maxSize: Number,
          method: String,
          mime: String,
          multiple: Boolean,
          name: String,
          params: Object,
          type: String,
          url: String
      },
      data: {
          allow: !1,
          clsDragover: "bdt-dragover",
          concurrent: 1,
          maxSize: 0,
          method: "POST",
          mime: !1,
          multiple: !1,
          name: "files[]",
          params: {},
          type: "",
          url: "",
          abort: P,
          beforeAll: P,
          beforeSend: P,
          complete: P,
          completeAll: P,
          error: P,
          fail: P,
          load: P,
          loadEnd: P,
          loadStart: P,
          progress: P
      },
      events: {
          change(t) {
              _(t.target, 'input[type="file"]') && (t.preventDefault(),
              t.target.files && this.upload(t.target.files),
              t.target.value = "")
          },
          drop(t) {
              Ti(t);
              const e = t.dataTransfer;
              e != null && e.files && (z(this.$el, this.clsDragover),
              this.upload(e.files))
          },
          dragenter(t) {
              Ti(t)
          },
          dragover(t) {
              Ti(t),
              y(this.$el, this.clsDragover)
          },
          dragleave(t) {
              Ti(t),
              z(this.$el, this.clsDragover)
          }
      },
      methods: {
          async upload(t) {
              if (t = _i(t),
              !t.length)
                  return;
              m(this.$el, "upload", [t]);
              for (const s of t) {
                  if (this.maxSize && this.maxSize * 1e3 < s.size) {
                      this.fail(this.t("invalidSize", this.maxSize));
                      return
                  }
                  if (this.allow && !fo(this.allow, s.name)) {
                      this.fail(this.t("invalidName", this.allow));
                      return
                  }
                  if (this.mime && !fo(this.mime, s.type)) {
                      this.fail(this.t("invalidMime", this.mime));
                      return
                  }
              }
              this.multiple || (t = t.slice(0, 1)),
              this.beforeAll(this, t);
              const e = ih(t, this.concurrent)
                , i = async s=>{
                  const n = new FormData;
                  s.forEach(o=>n.append(this.name, o));
                  for (const o in this.params)
                      n.append(o, this.params[o]);
                  try {
                      const o = await sh(this.url, {
                          data: n,
                          method: this.method,
                          responseType: this.type,
                          beforeSend: r=>{
                              const {xhr: a} = r;
                              x(a.upload, "progress", this.progress);
                              for (const l of ["loadStart", "load", "loadEnd", "abort"])
                                  x(a, l.toLowerCase(), this[l]);
                              return this.beforeSend(r)
                          }
                      });
                      this.complete(o),
                      e.length ? await i(e.shift()) : this.completeAll(o)
                  } catch (o) {
                      this.error(o)
                  }
              }
              ;
              await i(e.shift())
          }
      }
  };
  function fo(t, e) {
      return e.match(new RegExp(`^${t.replace(/\//g, "\\/").replace(/\*\*/g, "(\\/[^\\/]+)*").replace(/\*/g, "[^\\/]+").replace(/((?!\\))\?/g, "$1.")}$`,"i"))
  }
  function ih(t, e) {
      const i = [];
      for (let s = 0; s < t.length; s += e)
          i.push(t.slice(s, s + e));
      return i
  }
  function Ti(t) {
      t.preventDefault(),
      t.stopPropagation()
  }
  function sh(t, e) {
      const i = {
          data: null,
          method: "GET",
          headers: {},
          xhr: new XMLHttpRequest,
          beforeSend: P,
          responseType: "",
          ...e
      };
      return Promise.resolve().then(()=>i.beforeSend(i)).then(()=>nh(t, i))
  }
  function nh(t, e) {
      return new Promise((i,s)=>{
          const {xhr: n} = e;
          for (const o in e)
              if (o in n)
                  try {
                      n[o] = e[o]
                  } catch {}
          n.open(e.method.toUpperCase(), t);
          for (const o in e.headers)
              n.setRequestHeader(o, e.headers[o]);
          x(n, "load", ()=>{
              n.status === 0 || n.status >= 200 && n.status < 300 || n.status === 304 ? i(n) : s(xt(Error(n.statusText), {
                  xhr: n,
                  status: n.status
              }))
          }
          ),
          x(n, "error", ()=>s(xt(Error("Network Error"), {
              xhr: n
          }))),
          x(n, "timeout", ()=>s(xt(Error("Network Timeout"), {
              xhr: n
          }))),
          n.send(e.data)
      }
      )
  }
  var oh = Object.freeze({
      __proto__: null,
      Countdown: nl,
      Filter: ul,
      Lightbox: Cl,
      LightboxPanel: Gn,
      Notification: El,
      Parallax: Nl,
      Slider: Ll,
      SliderParallax: ao,
      Slideshow: ql,
      SlideshowParallax: ao,
      Sortable: Vl,
      Tooltip: Ql,
      Upload: eh
  });
  return St(oh, (t,e)=>it.component(e, t)),
  it
});


/*!
 * Countdown v0.1.0
 * https://github.com/fengyuanchen/countdown
 *
 * Copyright 2014 Fengyuan Chen
 * Released under the MIT license
 */


!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){"use strict";var b=function(c,d){this.$element=a(c),this.defaults=a.extend({},b.defaults,this.$element.data(),a.isPlainObject(d)?d:{}),this.init()};b.prototype={constructor:b,init:function(){var a=this.$element.html(),b=new Date(this.defaults.date||a);b.getTime()&&(this.content=a,this.date=b,this.find(),this.defaults.autoStart&&this.start())},find:function(){var a=this.$element;this.$days=a.find("[data-days]"),this.$hours=a.find("[data-hours]"),this.$minutes=a.find("[data-minutes]"),this.$seconds=a.find("[data-seconds]"),this.$days.length+this.$hours.length+this.$minutes.length+this.$seconds.length>0&&(this.found=!0)},reset:function(){this.found?(this.output("days"),this.output("hours"),this.output("minutes"),this.output("seconds")):this.output()},ready:function(){var a,b=this.date,c=100,d=1e3,e=6e4,f=36e5,g=864e5,h={};return b?(a=b.getTime()-(new Date).getTime(),0>=a?(this.end(),!1):(h.days=a,h.hours=h.days%g,h.minutes=h.hours%f,h.seconds=h.minutes%e,h.milliseconds=h.seconds%d,this.days=Math.floor(h.days/g),this.hours=Math.floor(h.hours/f),this.minutes=Math.floor(h.minutes/e),this.seconds=Math.floor(h.seconds/d),this.deciseconds=Math.floor(h.milliseconds/c),!0)):!1},start:function(){!this.active&&this.ready()&&(this.active=!0,this.reset(),this.autoUpdate=this.defaults.fast?setInterval(a.proxy(this.fastUpdate,this),100):setInterval(a.proxy(this.update,this),1e3))},stop:function(){this.active&&(this.active=!1,clearInterval(this.autoUpdate))},end:function(){this.date&&(this.stop(),this.days=0,this.hours=0,this.minutes=0,this.seconds=0,this.deciseconds=0,this.reset(),this.defaults.end())},destroy:function(){this.date&&(this.stop(),this.$days=null,this.$hours=null,this.$minutes=null,this.$seconds=null,this.$element.empty().html(this.content),this.$element.removeData("countdown"))},fastUpdate:function(){--this.deciseconds>=0?this.output("deciseconds"):(this.deciseconds=9,this.update())},update:function(){--this.seconds>=0?this.output("seconds"):(this.seconds=59,--this.minutes>=0?this.output("minutes"):(this.minutes=59,--this.hours>=0?this.output("hours"):(this.hours=23,--this.days>=0?this.output("days"):this.end())))},output:function(a){if(!this.found)return void this.$element.empty().html(this.template());switch(a){case"deciseconds":this.$seconds.text(this.getSecondsText());break;case"seconds":this.$seconds.text(this.seconds);break;case"minutes":this.$minutes.text(this.minutes);break;case"hours":this.$hours.text(this.hours);break;case"days":this.$days.text(this.days)}},template:function(){return this.defaults.text.replace("%s",this.days).replace("%s",this.hours).replace("%s",this.minutes).replace("%s",this.getSecondsText())},getSecondsText:function(){return this.active&&this.defaults.fast?this.seconds+"."+this.deciseconds:this.seconds}},b.defaults={autoStart:!0,date:null,fast:!1,end:a.noop,text:"%s days, %s hours, %s minutes, %s seconds"},b.setDefaults=function(c){a.extend(b.defaults,c)},a.fn.countdown=function(c){return this.each(function(){var d=a(this),e=d.data("countdown");e||d.data("countdown",e=new b(this,c)),"string"==typeof c&&a.isFunction(e[c])&&e[c]()})},a.fn.countdown.constructor=b,a.fn.countdown.setDefaults=b.setDefaults,a(function(){a("[countdown]").countdown()})}); 

jQuery("document").ready(function(t){t("#post-guestbook-box").submit(function(o){o.preventDefault();var e="action=guestbook_box_submit&id="+t(".guestbook-box-content").data("id")+"&avatar="+t("#hidden-avatar img").attr("src")+"&"+t(this).serialize();t.post(cevar.ajax_url,e,function(o){t(".guestbook-list").prepend(o),t("#post-guestbook-box")[0].reset()})})});

jQuery(document).on('click', '.delete', function () {
    var id = this.id;
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {"action": "your_delete_action", "element_id": id},
        success: function (data) {
            //run stuff on success here.  You can use `data` var in the 
           //return so you could post a message.  
        }
    });
});

//Neo - Conditional Statement for audio or Youtube
// jQuery("document").ready(function($) {
// 	var e = window.settingAutoplay;
// 	if(e) {
// 		$("#mute-sound").show();
// 		if(document.body.contains(document.getElementById("song"))) {
// 			document.getElementById("song").play();
// 		}
// 	} else { 
// 		$("#unmute-sound").show();
// 	}
// 	$("#audio-container").click(function(u) {
// 		if(e) {
// 			$("#mute-sound").hide();
// 			$("#unmute-sound").show();
// 			playAud();//document.getElementById("song").pause();
// 			e = !1
// 		} else {
// 			$("#unmute-sound").hide();
// 			$("#mute-sound").show();
// 			//document.getElementById("song").play();
// 			playAud();
// 			e = !0;
// 		}
// 	})
// 	function playAud(){
// 		if(document.body.contains(document.getElementById("song"))) {
// 			if(e){
// 				document.getElementById("song").pause();
// 			} else {
// 				document.getElementById("song").play();
// 			}
// 		} else {
// 			toggleAudio();
// 		}
// 	}
// });

(function ($) {"use strict"; var editMode = false;
// Sticky script starts
var wdpSticky = function ($scope, $) {
    var wdpStickySection = $scope.find('.wdp-sticky-section-yes').eq(0);

    wdpStickySection.each(function(i) {
        var dataSettings = $(this).data('settings');
        $.each( dataSettings, function(index, value) { 
            if( index === 'wdp_sticky_top_spacing' ){
                $scope.find('.wdp-sticky-section-yes').css( "top", value + "px" );
            }
        }); 
    });
    $scope.each(function(i) {
        var sectionSettings = $scope.data("settings");
        $.each( sectionSettings, function(index, value) { 
            if( index === 'wdp_sticky_top_spacing' ){
                $scope.css( "top", value + "px" );
            }
        }); 
    });
    
    if ( wdpStickySection.length > 0 ) {
        var parent = document.querySelector('.wdp-sticky-section-yes').parentElement;
        while (parent) {
            var hasOverflow = getComputedStyle(parent).overflow;
            if (hasOverflow !== 'visible') {
                parent.style.overflow = "visible"
            }
            parent = parent.parentElement;
        }
    }

    var columnClass = $scope.find( '.wdp-column-sticky' );
    var dataId = columnClass.data('id');
    var dataType = columnClass.data('type');
    var topSpacing = columnClass.data('top_spacing');

    if( dataType === 'column' ){
        var $target  = $scope;
        var wrapClass = columnClass.find( '.elementor-widget-wrap' );
    
        wrapClass.stickySidebar({
            topSpacing: topSpacing,
            bottomSpacing: 60,
            containerSelector: '.elementor-row',
            innerWrapperSelector: '.elementor-column-wrap',
        });
    }

}
// Sticky script ends
$(window).on('elementor/frontend/init', function () {
    if( elementorFrontend.isEditMode() ) {
        editMode = true;
    }
    
    elementorFrontend.hooks.addAction( 'frontend/element_ready/section', wdpSticky);
}); 

}(jQuery));


jQuery("document").ready(function($) {
    var showPagination = window.settingPagination;
    var hal = window.settingHalaman;
    var pagify = {
      items: {},
      container: null,
      totalPages: 1,
      perPage: 3,
      currentPage: 0,
      createNavigation: function () {
        this.totalPages = Math.ceil(this.items.length / this.perPage);
  
        $(".pagination", this.container.parent()).remove();
        var pagination = $('<div class="pagination"></div>').append(
          '<a class="nav prev disabled" data-next="false">←</a>'
        );
  
        for (var i = 0; i < this.totalPages; i++) {
          var pageElClass = "page";
          if (!i) pageElClass = "page current";
          var pageEl =
            '<a class="' +
            pageElClass +
            '" data-page="' +
            (i + 1) +
            '">' +
            (i + 1) +
            "</a>";
          pagination.append(pageEl);
        }
        pagination.append('<a class="nav next" data-next="true">→</a>');
  
        this.container.after(pagination);
  
        var that = this;
        $("body").off("click", ".nav");
        this.navigator = $("body").on("click", ".nav", function () {
          var el = $(this);
          that.navigate(el.data("next"));
        });
  
        $("body").off("click", ".page");
        this.pageNavigator = $("body").on("click", ".page", function () {
          var el = $(this);
          that.goToPage(el.data("page"));
        });
      },
      navigate: function (next) {
        // default perPage to 5
        if (isNaN(next) || next === undefined) {
          next = true;
        }
        $(".pagination .nav").removeClass("disabled");
        if (next) {
          this.currentPage++;
          if (this.currentPage > this.totalPages - 1)
            this.currentPage = this.totalPages - 1;
          if (this.currentPage == this.totalPages - 1)
            $(".pagination .nav.next").addClass("disabled");
        } else {
          this.currentPage--;
          if (this.currentPage < 0) this.currentPage = 0;
          if (this.currentPage == 0)
            $(".pagination .nav.prev").addClass("disabled");
        }
  
        this.showItems();
      },
      updateNavigation: function () {
        var pages = $(".pagination .page");
        pages.removeClass("current");
        $(
          '.pagination .page[data-page="' + (this.currentPage + 1) + '"]'
        ).addClass("current");
      },
      goToPage: function (page) {
        this.currentPage = page - 1;
  
        $(".pagination .nav").removeClass("disabled");
        if (this.currentPage == this.totalPages - 1)
          $(".pagination .nav.next").addClass("disabled");
  
        if (this.currentPage == 0)
          $(".pagination .nav.prev").addClass("disabled");
        this.showItems();
      },
      showItems: function () {
        this.items.hide();
        var base = this.perPage * this.currentPage;
        this.items.slice(base, base + this.perPage).show();
  
        this.updateNavigation();
      },
      init: function (container, items, perPage) {
        this.container = container;
        this.currentPage = 0;
        this.totalPages = 1;
        this.perPage = perPage;
        this.items = items;
        this.createNavigation();
        this.showItems();
      }
    };
  
    // stuff it all into a jQuery method!
    $.fn.pagify = function (perPage, itemSelector) {
      var el = $(this);
      var items = $(itemSelector, el);
  
      // default perPage to 5
      if (isNaN(perPage) || perPage === undefined) {
        perPage = 3;
      }
  
      // don't fire if fewer items than perPage
      if (items.length <= perPage) {
        return true;
      }
  
      pagify.init(el, items, perPage);
    };
    if(showPagination === 'yes'){
        $(".guestbook-list").pagify(hal, ".user-guestbook");
    }
  });


(()=>{var t,n={874(t,n,r){"use strict";var e=r(152),u=r.n(e);function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}r(486),void 0===("undefined"==typeof $?"undefined":o($))&&window.jQuery;var i=!1;(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))&&(i=!0),jQuery(document).ready(function(t){jQuery(document).ready(function(n){console.log();var r,e,o=null!==(r=null===(e=window)||void 0===e?void 0:e.guestInvitationData)&&void 0!==r?r:{},a=(window.location.origin,null==o?void 0:o.key),c=localStorage.getItem(a),f=null==o?void 0:o.invitationLink,l=t('textarea[data-content="contact"]'),s=t('textarea[data-content="message"]'),p=t("#invitation_url").find(":selected").attr("value");if(null!==a&&null!==c){var h=JSON.parse(c);s.val(null==h?void 0:h.message),l.val(null==h?void 0:h.contact)}else s.val(null==o?void 0:o.template);function v(t){return new Promise(n=>setTimeout(n,1e3*t))}async function g(t,r){let e={recipient_type:"individual",to:t,type:"text",text:{body:r}};return new Promise((t,r)=>{n.ajax({url:sendkit_ajax.ajax_url,type:"POST",dataType:"json",data:{action:"send_text_to_onesender",postData:e},success:function(n){t(n)},error:function(n,r,e){console.error("Error sending message:",n.responseText),t(!1)}})})}async function d(t,r){let e={action:"send_text_to_starsender",phone:t,message:r};return new Promise((t,r)=>{n.ajax({url:sendkit_ajax.ajax_url,type:"POST",dataType:"json",data:e,success:function(n){t(n)},error:function(n,r,e){console.error("Error sending message:",n.responseText),t(!1)}})})}t("#invitation_url").on("change",function(){t(this).data("invitation_url",t(this).val())}),t('button[data-content="button-submit"]').click(function(){var n=l.val(),r=s.val(),e={contact:n,message:r+="\r\n",invitationUrl:p,time:null};if(localStorage.setItem(a,JSON.stringify(e)),n&&n.trim().length){var o=n.split(/\n/).map((n,e)=>{var u,o,a=n.split(" - "),c=a[0],l=a[1],s=new URL(f);t("select").each(function(){let n=t(this).data("invitation_url")||"";s=f+n.concat(encodeURIComponent(c))}),r.replace("[nama]",c);var p=(u=c,o=s,r.replace(/\[link-undangan\]/g,o||"").replace(/\[nama\]/g,u).replace(/(<([^>]+)>)/gi,"")),h=(i?"whatsapp://send?phone=":"https://api.whatsapp.com/send?phone=")+"&text="+encodeURIComponent(p);return{name:c,phoneNumber:l,waLink:h,messageText:p,copylick:s}}),c=o.map((t,n)=>{var r=t.phoneNumber?" ("+t.phoneNumber+")":"";return"<tr><td>"+(n+1)+"</td><td>"+t.name+r+'</td><td style="text-align: center;"><div class="gb-flex gb-flex-col gb-space-y-2"><a href="'+t.waLink+'" target="_blank" class="btn wa btn-sm1 mb-1 btn-opsi"><i class="fa fa-brands fa-whatsapp"></i> Kirim</a>\n<a href="http://www.facebook.com/sharer/sharer.php?u='+t.copylick+'" &quote="'+t.copylick+'" target="_blank" class="btn fb btn-sm1 mb-1 btn-opsi"><i class="fa fa-brands fa-facebook"></i> Kirim</a>\n<button data-action="copy" data-clipboard-text="'+t.copylick+'" class="btn link btn-sm1 mb-1 gb-btn-copy btn-opsi"><i class="fa-regular fa-copy"></i> Link</button>\n<button data-action="copy" data-clipboard-text="'+t.messageText+'" class="btn textcopy btn-sm1 mb-1 gb-btn-copy btn-opsi"><i class="fa-regular fa-copy"></i> Text</button>\n<button data-action="delete" type="button" class="btn hapus btn-sm1 mb-1 btn-opsi"><i class="fa fa-trash-can"></i> Delete</button>\n</div></td></tr>'});t('tbody[data-content="body--contact"]').html(c),t('button[data-action="delete"]').on("click",function(){t(this).closest("tr").remove()}),new(u())(".gb-btn-copy").on("success",function(n){var r=t(".gb-notify");r.show(),setTimeout(function(){r.hide()},1e3),n.clearSelection()})}window.contacts=o.map(t=>({name:t.name,phoneNumber:t.phoneNumber,messageText:t.messageText}))}),(e=t(".sendbulk")).hide(),t('button[data-content="button-submit"]').click(function(){t('tbody[data-content="body--contact"]').find("tr").length>0?e.show():e.hide()}),t('button[data-content="button-bulk"]').click(async function(){if(!window.contacts||!window.contacts.length)return void console.log("No contacts found.");let r=t('button[data-content="button-bulk"]');r.prop("disabled",!0),r.text("Sending...");let e=n('<div id="progress-bar" class="progress" style="margin-top: 20px;"><div id="progress-bar-inner" class="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style="width: 10%"></div>');n("#progress-text").append(e);let u=n("#progress-bar-inner"),o=window.contacts.length;for(let t=0;t<o;t++){let e,i=window.contacts[t];(e="onesender"===wa_gateway?await g(i.phoneNumber,i.messageText):await d(i.phoneNumber,i.messageText))?console.log(`Message sent successfully to ${i.name} (${i.phoneNumber})`):console.log(`Failed to send message to ${i.name} (${i.phoneNumber})`);let a=(t+1)/o*100;u.css("width",a+"%"),await v(delayMinutes),n("#progress-bar").remove(),r.prop("disabled",!1),r.text("Bulk Send")}})})})},152:function(t){var n;n=function(){return function(){var t={686:function(t,n,r){"use strict";r.d(n,{default:function(){return y}});var e=r(279),u=r.n(e),o=r(370),i=r.n(o),a=r(817),c=r.n(a);function f(t){try{return document.execCommand(t)}catch(t){return!1}}var l=function(t){var n=c()(t);return f("cut"),n},s=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body},r="";if("string"==typeof t){var e,u,o,i,a=(e=t,u="rtl"===document.documentElement.getAttribute("dir"),(o=document.createElement("textarea")).style.fontSize="12pt",o.style.border="0",o.style.padding="0",o.style.margin="0",o.style.position="absolute",o.style[u?"right":"left"]="-9999px",i=window.pageYOffset||document.documentElement.scrollTop,o.style.top="".concat(i,"px"),o.setAttribute("readonly",""),o.value=e,o);n.container.appendChild(a),r=c()(a),f("copy"),a.remove()}else r=c()(t),f("copy");return r};function p(t){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function h(t){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function v(t,n){for(var r=0;r<n.length;r++){var e=n[r];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}function g(t,n){return(g=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _(t,n){var r="data-clipboard-".concat(t);if(n.hasAttribute(r))return n.getAttribute(r)}var y=function(t){!function(t,n){if("function"!=typeof n&&null!==n)throw TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),n&&g(t,n)}(c,t);var n,r,e,u,o,a=(n=c,r=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}(),function(){var t,e,u=d(n);if(r){var o=d(this).constructor;e=Reflect.construct(u,arguments,o)}else e=u.apply(this,arguments);return!(t=e)||"object"!==h(t)&&"function"!=typeof t?function(t){if(void 0===t)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(this):t});function c(t,n){var r;return function(t,n){if(!(t instanceof c))throw TypeError("Cannot call a class as a function")}(this),(r=a.call(this)).resolveOptions(n),r.listenClick(t),r}return e=c,u=[{key:"resolveOptions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof t.action?t.action:this.defaultAction,this.target="function"==typeof t.target?t.target:this.defaultTarget,this.text="function"==typeof t.text?t.text:this.defaultText,this.container="object"===h(t.container)?t.container:document.body}},{key:"listenClick",value:function(t){var n=this;this.listener=i()(t,"click",function(t){return n.onClick(t)})}},{key:"onClick",value:function(t){var n=t.delegateTarget||t.currentTarget,r=this.action(n)||"copy",e=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.action,r=void 0===n?"copy":n,e=t.container,u=t.target,o=t.text;if("copy"!==r&&"cut"!==r)throw Error('Invalid "action" value, use either "copy" or "cut"');if(void 0!==u){if(!u||"object"!==p(u)||1!==u.nodeType)throw Error('Invalid "target" value, use a valid Element');if("copy"===r&&u.hasAttribute("disabled"))throw Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===r&&(u.hasAttribute("readonly")||u.hasAttribute("disabled")))throw Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes')}return o?s(o,{container:e}):u?"cut"===r?l(u):s(u,{container:e}):void 0}({action:r,container:this.container,target:this.target(n),text:this.text(n)});this.emit(e?"success":"error",{action:r,text:e,trigger:n,clearSelection:function(){n&&n.focus(),document.activeElement.blur(),window.getSelection().removeAllRanges()}})}},{key:"defaultAction",value:function(t){return _("action",t)}},{key:"defaultTarget",value:function(t){var n=_("target",t);if(n)return document.querySelector(n)}},{key:"defaultText",value:function(t){return _("text",t)}},{key:"destroy",value:function(){this.listener.destroy()}}],o=[{key:"copy",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body};return s(t,n)}},{key:"cut",value:function(t){return l(t)}},{key:"isSupported",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],n=!!document.queryCommandSupported;return("string"==typeof t?[t]:t).forEach(function(t){n=n&&!!document.queryCommandSupported(t)}),n}}],u&&v(e.prototype,u),o&&v(e,o),c}(u())},828:function(t){if("undefined"!=typeof Element&&!Element.prototype.matches){var n=Element.prototype;n.matches=n.matchesSelector||n.mozMatchesSelector||n.msMatchesSelector||n.oMatchesSelector||n.webkitMatchesSelector}t.exports=function(t,n){for(;t&&9!==t.nodeType;){if("function"==typeof t.matches&&t.matches(n))return t;t=t.parentNode}}},438:function(t,n,r){var e=r(828);function u(t,n,r,e,u){var i=o.apply(this,arguments);return t.addEventListener(r,i,u),{destroy:function(){t.removeEventListener(r,i,u)}}}function o(t,n,r,u){return function(r){r.delegateTarget=e(r.target,n),r.delegateTarget&&u.call(t,r)}}t.exports=function(t,n,r,e,o){return"function"==typeof t.addEventListener?u.apply(null,arguments):"function"==typeof r?u.bind(null,document).apply(null,arguments):("string"==typeof t&&(t=document.querySelectorAll(t)),Array.prototype.map.call(t,function(t){return u(t,n,r,e,o)}))}},879:function(t,n){n.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},n.nodeList=function(t){var r=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===r||"[object HTMLCollection]"===r)&&"length"in t&&(0===t.length||n.node(t[0]))},n.string=function(t){return"string"==typeof t||t instanceof String},n.fn=function(t){return"[object Function]"===Object.prototype.toString.call(t)}},370:function(t,n,r){var e=r(879),u=r(438);t.exports=function(t,n,r){var o,i,a,c,f,l,s,p,h;if(!t&&!n&&!r)throw Error("Missing required arguments");if(!e.string(n))throw TypeError("Second argument must be a String");if(!e.fn(r))throw TypeError("Third argument must be a Function");if(e.node(t))return i=n,a=r,(o=t).addEventListener(i,a),{destroy:function(){o.removeEventListener(i,a)}};if(e.nodeList(t))return c=t,f=n,l=r,Array.prototype.forEach.call(c,function(t){t.addEventListener(f,l)}),{destroy:function(){Array.prototype.forEach.call(c,function(t){t.removeEventListener(f,l)})}};if(e.string(t))return s=t,p=n,h=r,u(document.body,s,p,h);throw TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}},817:function(t){t.exports=function(t){var n;if("SELECT"===t.nodeName)t.focus(),n=t.value;else if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName){var r=t.hasAttribute("readonly");r||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),r||t.removeAttribute("readonly"),n=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var e=window.getSelection(),u=document.createRange();u.selectNodeContents(t),e.removeAllRanges(),e.addRange(u),n=e.toString()}return n}},279:function(t){function n(){}n.prototype={on:function(t,n,r){var e=this.e||(this.e={});return(e[t]||(e[t]=[])).push({fn:n,ctx:r}),this},once:function(t,n,r){var e=this;function u(){e.off(t,u),n.apply(r,arguments)}return u._=n,this.on(t,u,r)},emit:function(t){for(var n=[].slice.call(arguments,1),r=((this.e||(this.e={}))[t]||[]).slice(),e=0,u=r.length;e<u;e++)r[e].fn.apply(r[e].ctx,n);return this},off:function(t,n){var r=this.e||(this.e={}),e=r[t],u=[];if(e&&n)for(var o=0,i=e.length;o<i;o++)e[o].fn!==n&&e[o].fn._!==n&&u.push(e[o]);return u.length?r[t]=u:delete r[t],this}},t.exports=n,t.exports.TinyEmitter=n}},n={};function r(e){if(n[e])return n[e].exports;var u=n[e]={exports:{}};return t[e](u,u.exports,r),u.exports}return r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,{a:n}),n},r.d=function(t,n){for(var e in n)r.o(n,e)&&!r.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:n[e]})},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r(686)}().default},t.exports=n()},486:function(t,n,r){var e;t=r.nmd(t),function(){var u,o="Expected a function",i="__lodash_hash_undefined__",a="__lodash_placeholder__",c=32,f=1/0,l=NaN,s=4294967295,p=[["ary",128],["bind",1],["bindKey",2],["curry",8],["curryRight",16],["flip",512],["partial",c],["partialRight",64],["rearg",256]],h="[object Arguments]",v="[object Array]",g="[object Boolean]",d="[object Date]",_="[object Error]",y="[object Function]",b="[object GeneratorFunction]",m="[object Map]",w="[object Number]",x="[object Object]",k="[object Promise]",j="[object RegExp]",A="[object Set]",S="[object String]",E="[object Symbol]",O="[object WeakMap]",T="[object ArrayBuffer]",R="[object DataView]",I="[object Float32Array]",z="[object Float64Array]",L="[object Int8Array]",C="[object Int16Array]",N="[object Int32Array]",W="[object Uint8Array]",U="[object Uint8ClampedArray]",P="[object Uint16Array]",M="[object Uint32Array]",B=/\b__p \+= '';/g,$=/\b(__p \+=) '' \+/g,D=/(__e\(.*?\)|\b__t\)) \+\n'';/g,q=/&(?:amp|lt|gt|quot|#39);/g,F=/[&<>"']/g,Z=RegExp(q.source),K=RegExp(F.source),H=/<%-([\s\S]+?)%>/g,V=/<%([\s\S]+?)%>/g,G=/<%=([\s\S]+?)%>/g,J=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Y=/^\w*$/,Q=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,X=/[\\^$.*+?()[\]{}|]/g,tt=RegExp(X.source),nt=/^\s+/,rt=/\s/,et=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ut=/\{\n\/\* \[wrapped with (.+)\] \*/,ot=/,? & /,it=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,at=/[()=,{}\[\]\/\s]/,ct=/\\(\\)?/g,ft=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,lt=/\w*$/,st=/^[-+]0x[0-9a-f]+$/i,pt=/^0b[01]+$/i,ht=/^\[object .+?Constructor\]$/,vt=/^0o[0-7]+$/i,gt=/^(?:0|[1-9]\d*)$/,dt=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,_t=/($^)/,yt=/['\n\r\u2028\u2029\\]/g,bt="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",mt="a-z\\xdf-\\xf6\\xf8-\\xff",wt="A-Z\\xc0-\\xd6\\xd8-\\xde",xt="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",kt="["+xt+"]",jt="["+bt+"]",At="["+mt+"]",St="[^\ud800-\udfff"+xt+"\\d+\\u2700-\\u27bf"+mt+wt+"]",Et="\ud83c[\udffb-\udfff]",Ot="[^\ud800-\udfff]",Tt="(?:\ud83c[\udde6-\uddff]){2}",Rt="[\ud800-\udbff][\udc00-\udfff]",It="["+wt+"]",zt="(?:"+At+"|"+St+")",Lt="(?:['’](?:d|ll|m|re|s|t|ve))?",Ct="(?:['’](?:D|LL|M|RE|S|T|VE))?",Nt="(?:"+jt+"|"+Et+")?",Wt="[\\ufe0e\\ufe0f]?",Ut=Wt+Nt+"(?:\\u200d(?:"+[Ot,Tt,Rt].join("|")+")"+Wt+Nt+")*",Pt="(?:"+["[\\u2700-\\u27bf]",Tt,Rt].join("|")+")"+Ut,Mt="(?:"+[Ot+jt+"?",jt,Tt,Rt,"[\ud800-\udfff]"].join("|")+")",Bt=RegExp("['’]","g"),$t=RegExp(jt,"g"),Dt=RegExp(Et+"(?="+Et+")|"+Mt+Ut,"g"),qt=RegExp([It+"?"+At+"+"+Lt+"(?="+[kt,It,"$"].join("|")+")","(?:"+It+"|"+St+")+"+Ct+"(?="+[kt,It+zt,"$"].join("|")+")",It+"?"+zt+"+"+Lt,It+"+"+Ct,"\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])","\\d+",Pt].join("|"),"g"),Ft=RegExp("[\\u200d\ud800-\udfff"+bt+"\\ufe0e\\ufe0f]"),Zt=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Kt=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Ht=-1,Vt={};Vt[I]=Vt[z]=Vt[L]=Vt[C]=Vt[N]=Vt[W]=Vt[U]=Vt[P]=Vt[M]=!0,Vt[h]=Vt[v]=Vt[T]=Vt[g]=Vt[R]=Vt[d]=Vt[_]=Vt[y]=Vt[m]=Vt[w]=Vt[x]=Vt[j]=Vt[A]=Vt[S]=Vt[O]=!1;var Gt={};Gt[h]=Gt[v]=Gt[T]=Gt[R]=Gt[g]=Gt[d]=Gt[I]=Gt[z]=Gt[L]=Gt[C]=Gt[N]=Gt[m]=Gt[w]=Gt[x]=Gt[j]=Gt[A]=Gt[S]=Gt[E]=Gt[W]=Gt[U]=Gt[P]=Gt[M]=!0,Gt[_]=Gt[y]=Gt[O]=!1;var Jt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Yt=parseFloat,Qt=parseInt,Xt="object"==typeof r.g&&r.g&&r.g.Object===Object&&r.g,tn="object"==typeof self&&self&&self.Object===Object&&self,nn=Xt||tn||Function("return this")(),rn=n&&!n.nodeType&&n,en=rn&&t&&!t.nodeType&&t,un=en&&en.exports===rn,on=un&&Xt.process,an=function(){try{return en&&en.require&&en.require("util").types||on&&on.binding&&on.binding("util")}catch(t){}}(),cn=an&&an.isArrayBuffer,fn=an&&an.isDate,ln=an&&an.isMap,sn=an&&an.isRegExp,pn=an&&an.isSet,hn=an&&an.isTypedArray;function vn(t,n,r){switch(r.length){case 0:return t.call(n);case 1:return t.call(n,r[0]);case 2:return t.call(n,r[0],r[1]);case 3:return t.call(n,r[0],r[1],r[2])}return t.apply(n,r)}function gn(t,n,r,e){for(var u=-1,o=null==t?0:t.length;++u<o;){var i=t[u];n(e,i,r(i),t)}return e}function dn(t,n){for(var r=-1,e=null==t?0:t.length;++r<e&&!1!==n(t[r],r,t););return t}function _n(t,n){for(var r=-1,e=null==t?0:t.length;++r<e;)if(!n(t[r],r,t))return!1;return!0}function yn(t,n){for(var r=-1,e=null==t?0:t.length,u=0,o=[];++r<e;){var i=t[r];n(i,r,t)&&(o[u++]=i)}return o}function bn(t,n){return!(null==t||!t.length)&&Tn(t,n,0)>-1}function mn(t,n,r){for(var e=-1,u=null==t?0:t.length;++e<u;)if(r(n,t[e]))return!0;return!1}function wn(t,n){for(var r=-1,e=null==t?0:t.length,u=Array(e);++r<e;)u[r]=n(t[r],r,t);return u}function xn(t,n){for(var r=-1,e=n.length,u=t.length;++r<e;)t[u+r]=n[r];return t}function kn(t,n,r,e){var u=-1,o=null==t?0:t.length;for(e&&o&&(r=t[++u]);++u<o;)r=n(r,t[u],u,t);return r}function jn(t,n,r,e){var u=null==t?0:t.length;for(e&&u&&(r=t[--u]);u--;)r=n(r,t[u],u,t);return r}function An(t,n){for(var r=-1,e=null==t?0:t.length;++r<e;)if(n(t[r],r,t))return!0;return!1}var Sn=Ln("length");function En(t,n,r){var e;return r(t,function(t,r,u){if(n(t,r,u))return e=r,!1}),e}function On(t,n,r,e){for(var u=t.length,o=r+(e?1:-1);e?o--:++o<u;)if(n(t[o],o,t))return o;return-1}function Tn(t,n,r){return n==n?function(t,n,r){for(var e=r-1,u=t.length;++e<u;)if(t[e]===n)return e;return-1}(t,n,r):On(t,In,r)}function Rn(t,n,r,e){for(var u=r-1,o=t.length;++u<o;)if(e(t[u],n))return u;return-1}function In(t){return t!=t}function zn(t,n){var r=null==t?0:t.length;return r?Wn(t,n)/r:l}function Ln(t){return function(n){return null==n?u:n[t]}}function Cn(t){return function(n){return null==t?u:t[n]}}function Nn(t,n,r,e,u){return u(t,function(t,u,o){r=e?(e=!1,t):n(r,t,u,o)}),r}function Wn(t,n){for(var r,e=-1,o=t.length;++e<o;){var i=n(t[e]);i!==u&&(r=r===u?i:r+i)}return r}function Un(t,n){for(var r=-1,e=Array(t);++r<t;)e[r]=n(r);return e}function Pn(t){return t?t.slice(0,tr(t)+1).replace(nt,""):t}function Mn(t){return function(n){return t(n)}}function Bn(t,n){return wn(n,function(n){return t[n]})}function $n(t,n){return t.has(n)}function Dn(t,n){for(var r=-1,e=t.length;++r<e&&Tn(n,t[r],0)>-1;);return r}function qn(t,n){for(var r=t.length;r--&&Tn(n,t[r],0)>-1;);return r}var Fn=Cn({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),Zn=Cn({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function Kn(t){return"\\"+Jt[t]}function Hn(t){return Ft.test(t)}function Vn(t){var n=-1,r=Array(t.size);return t.forEach(function(t,e){r[++n]=[e,t]}),r}function Gn(t,n){return function(r){return t(n(r))}}function Jn(t,n){for(var r=-1,e=t.length,u=0,o=[];++r<e;){var i=t[r];i!==n&&i!==a||(t[r]=a,o[u++]=r)}return o}function Yn(t){var n=-1,r=Array(t.size);return t.forEach(function(t){r[++n]=t}),r}function Qn(t){return Hn(t)?function(t){for(var n=Dt.lastIndex=0;Dt.test(t);)++n;return n}(t):Sn(t)}function Xn(t){return Hn(t)?t.match(Dt)||[]:t.split("")}function tr(t){for(var n=t.length;n--&&rt.test(t.charAt(n)););return n}var nr=Cn({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"}),rr=function t(n){var r,e=(n=null==n?nn:rr.defaults(nn.Object(),n,rr.pick(nn,Kt))).Array,rt=n.Date,bt=n.Error,mt=n.Function,wt=n.Math,xt=n.Object,kt=n.RegExp,jt=n.String,At=n.TypeError,St=e.prototype,Et=mt.prototype,Ot=xt.prototype,Tt=n["__core-js_shared__"],Rt=Et.toString,It=Ot.hasOwnProperty,zt=0,Lt=(r=/[^.]+$/.exec(Tt&&Tt.keys&&Tt.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"",Ct=Ot.toString,Nt=Rt.call(xt),Wt=nn._,Ut=kt("^"+Rt.call(It).replace(X,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Pt=un?n.Buffer:u,Mt=n.Symbol,Dt=n.Uint8Array,Ft=Pt?Pt.allocUnsafe:u,Jt=Gn(xt.getPrototypeOf,xt),Xt=xt.create,tn=Ot.propertyIsEnumerable,rn=St.splice,en=Mt?Mt.isConcatSpreadable:u,on=Mt?Mt.iterator:u,an=Mt?Mt.toStringTag:u,Sn=function(){try{var t=Qu(xt,"defineProperty");return t({},"",{}),t}catch(t){}}(),Cn=n.clearTimeout!==nn.clearTimeout&&n.clearTimeout,er=rt&&rt.now!==nn.Date.now&&rt.now,ur=n.setTimeout!==nn.setTimeout&&n.setTimeout,or=wt.ceil,ir=wt.floor,ar=xt.getOwnPropertySymbols,cr=Pt?Pt.isBuffer:u,fr=n.isFinite,lr=St.join,sr=Gn(xt.keys,xt),pr=wt.max,hr=wt.min,vr=rt.now,gr=n.parseInt,dr=wt.random,_r=St.reverse,yr=Qu(n,"DataView"),br=Qu(n,"Map"),mr=Qu(n,"Promise"),wr=Qu(n,"Set"),xr=Qu(n,"WeakMap"),kr=Qu(xt,"create"),jr=xr&&new xr,Ar={},Sr=Eo(yr),Er=Eo(br),Or=Eo(mr),Tr=Eo(wr),Rr=Eo(xr),Ir=Mt?Mt.prototype:u,zr=Ir?Ir.valueOf:u,Lr=Ir?Ir.toString:u;function Cr(t){if(Fi(t)&&!Li(t)&&!(t instanceof Pr)){if(t instanceof Ur)return t;if(It.call(t,"__wrapped__"))return Oo(t)}return new Ur(t)}var Nr=function(){function t(){}return function(n){if(!qi(n))return{};if(Xt)return Xt(n);t.prototype=n;var r=new t;return t.prototype=u,r}}();function Wr(){}function Ur(t,n){this.__wrapped__=t,this.__actions__=[],this.__chain__=!!n,this.__index__=0,this.__values__=u}function Pr(t){this.__wrapped__=t,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=s,this.__views__=[]}function Mr(t){var n=-1,r=null==t?0:t.length;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}function Br(t){var n=-1,r=null==t?0:t.length;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}function $r(t){var n=-1,r=null==t?0:t.length;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}function Dr(t){var n=-1,r=null==t?0:t.length;for(this.__data__=new $r;++n<r;)this.add(t[n])}function qr(t){var n=this.__data__=new Br(t);this.size=n.size}function Fr(t,n){var r=Li(t),e=!r&&zi(t),u=!r&&!e&&Ui(t),o=!r&&!e&&!u&&Qi(t),i=r||e||u||o,a=i?Un(t.length,jt):[],c=a.length;for(var f in t)!n&&!It.call(t,f)||i&&("length"==f||u&&("offset"==f||"parent"==f)||o&&("buffer"==f||"byteLength"==f||"byteOffset"==f)||oo(f,c))||a.push(f);return a}function Zr(t){var n=t.length;return n?t[Me(0,n-1)]:u}function Kr(t,n,r){(r===u||Ti(t[n],r))&&(r!==u||n in t)||Yr(t,n,r)}function Hr(t,n,r){var e=t[n];It.call(t,n)&&Ti(e,r)&&(r!==u||n in t)||Yr(t,n,r)}function Vr(t,n){for(var r=t.length;r--;)if(Ti(t[r][0],n))return r;return-1}function Gr(t,n,r,e){return ue(t,function(t,u,o){n(e,t,r(t),o)}),e}function Jr(t,n){return t&&_u(n,ma(n),t)}function Yr(t,n,r){"__proto__"==n&&Sn?Sn(t,n,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[n]=r}function Qr(t,n){for(var r=-1,o=n.length,i=e(o),a=null==t;++r<o;)i[r]=a?u:ga(t,n[r]);return i}function Xr(t,n,r){return t==t&&(r!==u&&(t=t<=r?t:r),n!==u&&(t=t>=n?t:n)),t}function te(t,n,r,e,o,i){var a,c=1&n,f=2&n;if(r&&(a=o?r(t,e,o,i):r(t)),a!==u)return a;if(!qi(t))return t;var l=Li(t);if(l){if(p=(s=t).length,v=new s.constructor(p),p&&"string"==typeof s[0]&&It.call(s,"index")&&(v.index=s.index,v.input=s.input),a=v,!c)return du(t,a)}else{var s,p,v,_,k,O,B,$,D,q=no(t),F=q==y||q==b;if(Ui(t))return lu(t,c);if(q==x||q==h||F&&!o){if(a=f||F?{}:eo(t),!c)return f?(O=t,k=t,B=(_=a)&&_u(k,wa(k),_),_u(O,to(O),B)):($=t,D=Jr(a,t),_u($,Xu($),D))}else{if(!Gt[q])return o?t:{};a=function(t,n,r){var e,u,o,i,a,c=t.constructor;switch(n){case T:return su(t);case g:case d:return new c(+t);case R:return e=t,u=r?su(e.buffer):e.buffer,new e.constructor(u,e.byteOffset,e.byteLength);case I:case z:case L:case C:case N:case W:case U:case P:case M:return pu(t,r);case m:return new c;case w:case S:return new c(t);case j:return(i=new(o=t).constructor(o.source,lt.exec(o))).lastIndex=o.lastIndex,i;case A:return new c;case E:return a=t,zr?xt(zr.call(a)):{}}}(t,q,c)}}i||(i=new qr);var Z=i.get(t);if(Z)return Z;i.set(t,a),Gi(t)?t.forEach(function(e){a.add(te(e,n,r,e,t,i))}):Zi(t)&&t.forEach(function(e,u){a.set(u,te(e,n,r,u,t,i))});var K=l?u:(4&n?f?Zu:Fu:f?wa:ma)(t);return dn(K||t,function(e,u){K&&(e=t[u=e]),Hr(a,u,te(e,n,r,u,t,i))}),a}function ne(t,n,r){var e=r.length;if(null==t)return!e;for(t=xt(t);e--;){var o=r[e],i=n[o],a=t[o];if(a===u&&!(o in t)||!i(a))return!1}return!0}function re(t,n,r){if("function"!=typeof t)throw new At(o);return yo(function(){t.apply(u,r)},n)}function ee(t,n,r,e){var u=-1,o=bn,i=!0,a=t.length,c=[],f=n.length;if(!a)return c;r&&(n=wn(n,Mn(r))),e?(o=mn,i=!1):n.length>=200&&(o=$n,i=!1,n=new Dr(n));t:for(;++u<a;){var l=t[u],s=null==r?l:r(l);if(l=e||0!==l?l:0,i&&s==s){for(var p=f;p--;)if(n[p]===s)continue t;c.push(l)}else o(n,s,e)||c.push(l)}return c}Cr.templateSettings={escape:H,evaluate:V,interpolate:G,variable:"",imports:{_:Cr}},Cr.prototype=Wr.prototype,Cr.prototype.constructor=Cr,Ur.prototype=Nr(Wr.prototype),Ur.prototype.constructor=Ur,Pr.prototype=Nr(Wr.prototype),Pr.prototype.constructor=Pr,Mr.prototype.clear=function(){this.__data__=kr?kr(null):{},this.size=0},Mr.prototype.delete=function(t){var n=this.has(t)&&delete this.__data__[t];return this.size-=n?1:0,n},Mr.prototype.get=function(t){var n=this.__data__;if(kr){var r=n[t];return r===i?u:r}return It.call(n,t)?n[t]:u},Mr.prototype.has=function(t){var n=this.__data__;return kr?n[t]!==u:It.call(n,t)},Mr.prototype.set=function(t,n){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=kr&&n===u?i:n,this},Br.prototype.clear=function(){this.__data__=[],this.size=0},Br.prototype.delete=function(t){var n=this.__data__,r=Vr(n,t);return!(r<0||(r==n.length-1?n.pop():rn.call(n,r,1),--this.size,0))},Br.prototype.get=function(t){var n=this.__data__,r=Vr(n,t);return r<0?u:n[r][1]},Br.prototype.has=function(t){return Vr(this.__data__,t)>-1},Br.prototype.set=function(t,n){var r=this.__data__,e=Vr(r,t);return e<0?(++this.size,r.push([t,n])):r[e][1]=n,this},$r.prototype.clear=function(){this.size=0,this.__data__={hash:new Mr,map:new(br||Br),string:new Mr}},$r.prototype.delete=function(t){var n=Ju(this,t).delete(t);return this.size-=n?1:0,n},$r.prototype.get=function(t){return Ju(this,t).get(t)},$r.prototype.has=function(t){return Ju(this,t).has(t)},$r.prototype.set=function(t,n){var r=Ju(this,t),e=r.size;return r.set(t,n),this.size+=r.size==e?0:1,this},Dr.prototype.add=Dr.prototype.push=function(t){return this.__data__.set(t,i),this},Dr.prototype.has=function(t){return this.__data__.has(t)},qr.prototype.clear=function(){this.__data__=new Br,this.size=0},qr.prototype.delete=function(t){var n=this.__data__,r=n.delete(t);return this.size=n.size,r},qr.prototype.get=function(t){return this.__data__.get(t)},qr.prototype.has=function(t){return this.__data__.has(t)},qr.prototype.set=function(t,n){var r=this.__data__;if(r instanceof Br){var e=r.__data__;if(!br||e.length<199)return e.push([t,n]),this.size=++r.size,this;r=this.__data__=new $r(e)}return r.set(t,n),this.size=r.size,this};var ue=mu(pe),oe=mu(he,!0);function ie(t,n){var r=!0;return ue(t,function(t,e,u){return r=!!n(t,e,u)}),r}function ae(t,n,r){for(var e=-1,o=t.length;++e<o;){var i=t[e],a=n(i);if(null!=a&&(c===u?a==a&&!Yi(a):r(a,c)))var c=a,f=i}return f}function ce(t,n){var r=[];return ue(t,function(t,e,u){n(t,e,u)&&r.push(t)}),r}function fe(t,n,r,e,u){var o=-1,i=t.length;for(r||(r=uo),u||(u=[]);++o<i;){var a=t[o];n>0&&r(a)?n>1?fe(a,n-1,r,e,u):xn(u,a):e||(u[u.length]=a)}return u}var le=wu(),se=wu(!0);function pe(t,n){return t&&le(t,n,ma)}function he(t,n){return t&&se(t,n,ma)}function ve(t,n){return yn(n,function(n){return Bi(t[n])})}function ge(t,n){for(var r=0,e=(n=au(n,t)).length;null!=t&&r<e;)t=t[So(n[r++])];return r&&r==e?t:u}function de(t,n,r){var e=n(t);return Li(t)?e:xn(e,r(t))}function _e(t){var n;return null==t?t===u?"[object Undefined]":"[object Null]":an&&an in xt(t)?function(t){var n=It.call(t,an),r=t[an];try{t[an]=u;var e=!0}catch(t){}var o=Ct.call(t);return e&&(n?t[an]=r:delete t[an]),o}(t):(n=t,Ct.call(n))}function ye(t,n){return t>n}function be(t,n){return null!=t&&It.call(t,n)}function me(t,n){return null!=t&&n in xt(t)}function we(t,n,r){for(var o=r?mn:bn,i=t[0].length,a=t.length,c=a,f=e(a),l=1/0,s=[];c--;){var p=t[c];c&&n&&(p=wn(p,Mn(n))),l=hr(p.length,l),f[c]=!r&&(n||i>=120&&p.length>=120)?new Dr(c&&p):u}p=t[0];var h=-1,v=f[0];t:for(;++h<i&&s.length<l;){var g=p[h],d=n?n(g):g;if(g=r||0!==g?g:0,!(v?$n(v,d):o(s,d,r))){for(c=a;--c;){var _=f[c];if(!(_?$n(_,d):o(t[c],d,r)))continue t}v&&v.push(d),s.push(g)}}return s}function xe(t,n,r){var e=null==(t=vo(t,n=au(n,t)))?t:t[So(Mo(n))];return null==e?u:vn(e,t,r)}function ke(t){return Fi(t)&&_e(t)==h}function je(t,n,r,e,o){return t===n||(null!=t&&null!=n&&(Fi(t)||Fi(n))?function(t,n,r,e,o,i){var a=Li(t),c=Li(n),f=a?v:no(t),l=c?v:no(n),s=(f=f==h?x:f)==x,p=(l=l==h?x:l)==x,y=f==l;if(y&&Ui(t)){if(!Ui(n))return!1;a=!0,s=!1}if(y&&!s)return i||(i=new qr),a||Qi(t)?Du(t,n,r,e,o,i):function(t,n,r,e,u,o,i){switch(r){case R:if(t.byteLength!=n.byteLength||t.byteOffset!=n.byteOffset)break;t=t.buffer,n=n.buffer;case T:return!(t.byteLength!=n.byteLength||!o(new Dt(t),new Dt(n)));case g:case d:case w:return Ti(+t,+n);case _:return t.name==n.name&&t.message==n.message;case j:case S:return t==n+"";case m:var a=Vn;case A:var c=1&e;if(a||(a=Yn),t.size!=n.size&&!c)break;var f=i.get(t);if(f)return f==n;e|=2,i.set(t,n);var l=Du(a(t),a(n),e,u,o,i);return i.delete(t),l;case E:if(zr)return zr.call(t)==zr.call(n)}return!1}(t,n,f,r,e,o,i);if(!(1&r)){var b=s&&It.call(t,"__wrapped__"),k=p&&It.call(n,"__wrapped__");if(b||k){var O=b?t.value():t,I=k?n.value():n;return i||(i=new qr),o(O,I,r,e,i)}}return!!y&&(i||(i=new qr),function(t,n,r,e,o,i){var a=1&r,c=Fu(t),f=c.length;if(f!=Fu(n).length&&!a)return!1;for(var l=f;l--;){var s=c[l];if(!(a?s in n:It.call(n,s)))return!1}var p=i.get(t),h=i.get(n);if(p&&h)return p==n&&h==t;var v=!0;i.set(t,n),i.set(n,t);for(var g=a;++l<f;){var d=t[s=c[l]],_=n[s];if(e)var y=a?e(_,d,s,n,t,i):e(d,_,s,t,n,i);if(!(y===u?d===_||o(d,_,r,e,i):y)){v=!1;break}g||(g="constructor"==s)}if(v&&!g){var b=t.constructor,m=n.constructor;b==m||!("constructor"in t)||!("constructor"in n)||"function"==typeof b&&b instanceof b&&"function"==typeof m&&m instanceof m||(v=!1)}return i.delete(t),i.delete(n),v}(t,n,r,e,o,i))}(t,n,r,e,je,o):t!=t&&n!=n)}function Ae(t,n,r,e){var o=r.length,i=o,a=!e;if(null==t)return!i;for(t=xt(t);o--;){var c=r[o];if(a&&c[2]?c[1]!==t[c[0]]:!(c[0]in t))return!1}for(;++o<i;){var f=(c=r[o])[0],l=t[f],s=c[1];if(a&&c[2]){if(l===u&&!(f in t))return!1}else{var p=new qr;if(e)var h=e(l,s,f,t,n,p);if(!(h===u?je(s,l,3,e,p):h))return!1}}return!0}function Se(t){var n;return!(!qi(t)||(n=t,Lt&&Lt in n))&&(Bi(t)?Ut:ht).test(Eo(t))}function Ee(t){return"function"==typeof t?t:null==t?Ka:"object"==typeof t?Li(t)?ze(t[0],t[1]):Ie(t):nc(t)}function Oe(t){if(!lo(t))return sr(t);var n=[];for(var r in xt(t))It.call(t,r)&&"constructor"!=r&&n.push(r);return n}function Te(t,n){return t<n}function Re(t,n){var r=-1,u=Ni(t)?e(t.length):[];return ue(t,function(t,e,o){u[++r]=n(t,e,o)}),u}function Ie(t){var n=Yu(t);return 1==n.length&&n[0][2]?po(n[0][0],n[0][1]):function(r){return r===t||Ae(r,t,n)}}function ze(t,n){return ao(t)&&so(n)?po(So(t),n):function(r){var e=ga(r,t);return e===u&&e===n?da(r,t):je(n,e,3)}}function Le(t,n,r,e,o){t!==n&&le(n,function(i,a){if(o||(o=new qr),qi(i))!function(t,n,r,e,o,i,a){var c=go(t,r),f=go(n,r),l=a.get(f);if(l)Kr(t,r,l);else{var s=i?i(c,f,r+"",t,n,a):u,p=s===u;if(p){var h=Li(f),v=!h&&Ui(f),g=!h&&!v&&Qi(f);s=f,h||v||g?Li(c)?s=c:Wi(c)?s=du(c):v?(p=!1,s=lu(f,!0)):g?(p=!1,s=pu(f,!0)):s=[]:Hi(f)||zi(f)?(s=c,zi(c)?s=ia(c):qi(c)&&!Bi(c)||(s=eo(f))):p=!1}p&&(a.set(f,s),o(s,f,e,i,a),a.delete(f)),Kr(t,r,s)}}(t,n,a,r,Le,e,o);else{var c=e?e(go(t,a),i,a+"",t,n,o):u;c===u&&(c=i),Kr(t,a,c)}},wa)}function Ce(t,n){var r=t.length;if(r)return oo(n+=n<0?r:0,r)?t[n]:u}function Ne(t,n,r){var e=-1;return n=wn(n=n.length?wn(n,function(t){return Li(t)?function(n){return ge(n,1===t.length?t[0]:t)}:t}):[Ka],Mn(Gu())),function(t,n){var r=t.length;for(t.sort(n);r--;)t[r]=t[r].value;return t}(Re(t,function(t,r,u){return{criteria:wn(n,function(n){return n(t)}),index:++e,value:t}}),function(t,n){return function(t,n,r){for(var e=-1,u=t.criteria,o=n.criteria,i=u.length,a=r.length;++e<i;){var c=hu(u[e],o[e]);if(c)return e>=a?c:c*("desc"==r[e]?-1:1)}return t.index-n.index}(t,n,r)})}function We(t,n,r){for(var e=-1,u=n.length,o={};++e<u;){var i=n[e],a=ge(t,i);r(a,i)&&De(o,au(i,t),a)}return o}function Ue(t,n,r,e){var u=e?Rn:Tn,o=-1,i=n.length,a=t;for(t===n&&(n=du(n)),r&&(a=wn(t,Mn(r)));++o<i;)for(var c=0,f=n[o],l=r?r(f):f;(c=u(a,l,c,e))>-1;)a!==t&&rn.call(a,c,1),rn.call(t,c,1);return t}function Pe(t,n){for(var r=t?n.length:0,e=r-1;r--;){var u=n[r];if(r==e||u!==o){var o=u;oo(u)?rn.call(t,u,1):Xe(t,u)}}return t}function Me(t,n){return t+ir(dr()*(n-t+1))}function Be(t,n){var r="";if(!t||n<1||n>9007199254740991)return r;do{n%2&&(r+=t),(n=ir(n/2))&&(t+=t)}while(n);return r}function $e(t,n){return bo(ho(t,n,Ka),t+"")}function De(t,n,r,e){if(!qi(t))return t;for(var o=-1,i=(n=au(n,t)).length,a=i-1,c=t;null!=c&&++o<i;){var f=So(n[o]),l=r;if("__proto__"===f||"constructor"===f||"prototype"===f)break;if(o!=a){var s=c[f];(l=e?e(s,f,c):u)===u&&(l=qi(s)?s:oo(n[o+1])?[]:{})}Hr(c,f,l),c=c[f]}return t}var qe=jr?function(t,n){return jr.set(t,n),t}:Ka,Fe=Sn?function(t,n){return Sn(t,"toString",{configurable:!0,enumerable:!1,value:qa(n),writable:!0})}:Ka;function Ze(t,n,r){var u=-1,o=t.length;n<0&&(n=-n>o?0:o+n),(r=r>o?o:r)<0&&(r+=o),o=n>r?0:r-n>>>0,n>>>=0;for(var i=e(o);++u<o;)i[u]=t[u+n];return i}function Ke(t,n){var r;return ue(t,function(t,e,u){return!(r=n(t,e,u))}),!!r}function He(t,n,r){var e=0,u=null==t?e:t.length;if("number"==typeof n&&n==n&&u<=2147483647){for(;e<u;){var o=e+u>>>1,i=t[o];null!==i&&!Yi(i)&&(r?i<=n:i<n)?e=o+1:u=o}return u}return Ve(t,n,Ka,r)}function Ve(t,n,r,e){var o=0,i=null==t?0:t.length;if(0===i)return 0;for(var a=(n=r(n))!=n,c=null===n,f=Yi(n),l=n===u;o<i;){var s=ir((o+i)/2),p=r(t[s]),h=p!==u,v=null===p,g=p==p,d=Yi(p);if(a)var _=e||g;else _=l?g&&(e||h):c?g&&h&&(e||!v):f?g&&h&&!v&&(e||!d):!v&&!d&&(e?p<=n:p<n);_?o=s+1:i=s}return hr(i,4294967294)}function Ge(t,n){for(var r=-1,e=t.length,u=0,o=[];++r<e;){var i=t[r],a=n?n(i):i;if(!r||!Ti(a,c)){var c=a;o[u++]=0===i?0:i}}return o}function Je(t){return"number"==typeof t?t:Yi(t)?l:+t}function Ye(t){if("string"==typeof t)return t;if(Li(t))return wn(t,Ye)+"";if(Yi(t))return Lr?Lr.call(t):"";var n=t+"";return"0"==n&&1/t==-1/0?"-0":n}function Qe(t,n,r){var e=-1,u=bn,o=t.length,i=!0,a=[],c=a;if(r)i=!1,u=mn;else if(o>=200){var f=n?null:Wu(t);if(f)return Yn(f);i=!1,u=$n,c=new Dr}else c=n?[]:a;t:for(;++e<o;){var l=t[e],s=n?n(l):l;if(l=r||0!==l?l:0,i&&s==s){for(var p=c.length;p--;)if(c[p]===s)continue t;n&&c.push(s),a.push(l)}else u(c,s,r)||(c!==a&&c.push(s),a.push(l))}return a}function Xe(t,n){return null==(t=vo(t,n=au(n,t)))||delete t[So(Mo(n))]}function tu(t,n,r,e){return De(t,n,r(ge(t,n)),e)}function nu(t,n,r,e){for(var u=t.length,o=e?u:-1;(e?o--:++o<u)&&n(t[o],o,t););return r?Ze(t,e?0:o,e?o+1:u):Ze(t,e?o+1:0,e?u:o)}function ru(t,n){var r=t;return r instanceof Pr&&(r=r.value()),kn(n,function(t,n){return n.func.apply(n.thisArg,xn([t],n.args))},r)}function eu(t,n,r){var u=t.length;if(u<2)return u?Qe(t[0]):[];for(var o=-1,i=e(u);++o<u;)for(var a=t[o],c=-1;++c<u;)c!=o&&(i[o]=ee(i[o]||a,t[c],n,r));return Qe(fe(i,1),n,r)}function uu(t,n,r){for(var e=-1,o=t.length,i=n.length,a={};++e<o;){var c=e<i?n[e]:u;r(a,t[e],c)}return a}function ou(t){return Wi(t)?t:[]}function iu(t){return"function"==typeof t?t:Ka}function au(t,n){return Li(t)?t:ao(t,n)?[t]:Ao(aa(t))}function cu(t,n,r){var e=t.length;return r=r===u?e:r,!n&&r>=e?t:Ze(t,n,r)}var fu=Cn||function(t){return nn.clearTimeout(t)};function lu(t,n){if(n)return t.slice();var r=t.length,e=Ft?Ft(r):new t.constructor(r);return t.copy(e),e}function su(t){var n=new t.constructor(t.byteLength);return new Dt(n).set(new Dt(t)),n}function pu(t,n){var r=n?su(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}function hu(t,n){if(t!==n){var r=t!==u,e=null===t,o=t==t,i=Yi(t),a=n!==u,c=null===n,f=n==n,l=Yi(n);if(!c&&!l&&!i&&t>n||i&&a&&f&&!c&&!l||e&&a&&f||!r&&f||!o)return 1;if(!e&&!i&&!l&&t<n||l&&r&&o&&!e&&!i||c&&r&&o||!a&&o||!f)return-1}return 0}function vu(t,n,r,u){for(var o=-1,i=t.length,a=r.length,c=-1,f=n.length,l=pr(i-a,0),s=e(f+l),p=!u;++c<f;)s[c]=n[c];for(;++o<a;)(p||o<i)&&(s[r[o]]=t[o]);for(;l--;)s[c++]=t[o++];return s}function gu(t,n,r,u){for(var o=-1,i=t.length,a=-1,c=r.length,f=-1,l=n.length,s=pr(i-c,0),p=e(s+l),h=!u;++o<s;)p[o]=t[o];for(var v=o;++f<l;)p[v+f]=n[f];for(;++a<c;)(h||o<i)&&(p[v+r[a]]=t[o++]);return p}function du(t,n){var r=-1,u=t.length;for(n||(n=e(u));++r<u;)n[r]=t[r];return n}function _u(t,n,r,e){var o=!r;r||(r={});for(var i=-1,a=n.length;++i<a;){var c=n[i],f=e?e(r[c],t[c],c,r,t):u;f===u&&(f=t[c]),o?Yr(r,c,f):Hr(r,c,f)}return r}function yu(t,n){return function(r,e){var u=Li(r)?gn:Gr,o=n?n():{};return u(r,t,Gu(e,2),o)}}function bu(t){return $e(function(n,r){var e=-1,o=r.length,i=o>1?r[o-1]:u,a=o>2?r[2]:u;for(i=t.length>3&&"function"==typeof i?(o--,i):u,a&&io(r[0],r[1],a)&&(i=o<3?u:i,o=1),n=xt(n);++e<o;){var c=r[e];c&&t(n,c,e,i)}return n})}function mu(t,n){return function(r,e){if(null==r)return r;if(!Ni(r))return t(r,e);for(var u=r.length,o=n?u:-1,i=xt(r);(n?o--:++o<u)&&!1!==e(i[o],o,i););return r}}function wu(t){return function(n,r,e){for(var u=-1,o=xt(n),i=e(n),a=i.length;a--;){var c=i[t?a:++u];if(!1===r(o[c],c,o))break}return n}}function xu(t){return function(n){var r=Hn(n=aa(n))?Xn(n):u,e=r?r[0]:n.charAt(0),o=r?cu(r,1).join(""):n.slice(1);return e[t]()+o}}function ku(t){return function(n){return kn(Ba(za(n).replace(Bt,"")),t,"")}}function ju(t){return function(){var n=arguments;switch(n.length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3]);case 5:return new t(n[0],n[1],n[2],n[3],n[4]);case 6:return new t(n[0],n[1],n[2],n[3],n[4],n[5]);case 7:return new t(n[0],n[1],n[2],n[3],n[4],n[5],n[6])}var r=Nr(t.prototype),e=t.apply(r,n);return qi(e)?e:r}}function Au(t){return function(n,r,e){var o=xt(n);if(!Ni(n)){var i=Gu(r,3);n=ma(n),r=function(t){return i(o[t],t,o)}}var a=t(n,r,e);return a>-1?o[i?n[a]:a]:u}}function Su(t){return qu(function(n){var r=n.length,e=r,i=Ur.prototype.thru;for(t&&n.reverse();e--;){var a=n[e];if("function"!=typeof a)throw new At(o);if(i&&!c&&"wrapper"==Hu(a))var c=new Ur([],!0)}for(e=c?e:r;++e<r;){var f=Hu(a=n[e]),l="wrapper"==f?Ku(a):u;c=l&&co(l[0])&&424==l[1]&&!l[4].length&&1==l[9]?c[Hu(l[0])].apply(c,l[3]):1==a.length&&co(a)?c[f]():c.thru(a)}return function(){var t=arguments,e=t[0];if(c&&1==t.length&&Li(e))return c.plant(e).value();for(var u=0,o=r?n[u].apply(this,t):e;++u<r;)o=n[u].call(this,o);return o}})}function Eu(t,n,r,o,i,a,c,f,l,s){var p=128&n,h=1&n,v=2&n,g=24&n,d=512&n,_=v?u:ju(t);return function y(){for(var b=arguments.length,m=e(b),w=b;w--;)m[w]=arguments[w];if(g)var x=Vu(y),k=function(t,n){for(var r=t.length,e=0;r--;)t[r]===n&&++e;return e}(m,x);if(o&&(m=vu(m,o,i,g)),a&&(m=gu(m,a,c,g)),b-=k,g&&b<s){var j=Jn(m,x);return Cu(t,n,Eu,y.placeholder,r,m,j,f,l,s-b)}var A=h?r:this,S=v?A[t]:t;return b=m.length,f?m=function(t,n){for(var r=t.length,e=hr(n.length,r),o=du(t);e--;){var i=n[e];t[e]=oo(i,r)?o[i]:u}return t}(m,f):d&&b>1&&m.reverse(),p&&l<b&&(m.length=l),this&&this!==nn&&this instanceof y&&(S=_||ju(S)),S.apply(A,m)}}function Ou(t,n){return function(r,e){var u,o,i,a;return u=r,o=t,i=n(e),a={},pe(u,function(t,n,r){o(a,i(t),n,r)}),a}}function Tu(t,n){return function(r,e){var o;if(r===u&&e===u)return n;if(r!==u&&(o=r),e!==u){if(o===u)return e;"string"==typeof r||"string"==typeof e?(r=Ye(r),e=Ye(e)):(r=Je(r),e=Je(e)),o=t(r,e)}return o}}function Ru(t){return qu(function(n){return n=wn(n,Mn(Gu())),$e(function(r){var e=this;return t(n,function(t){return vn(t,e,r)})})})}function Iu(t,n){var r=(n=n===u?" ":Ye(n)).length;if(r<2)return r?Be(n,t):n;var e=Be(n,or(t/Qn(n)));return Hn(n)?cu(Xn(e),0,t).join(""):e.slice(0,t)}function zu(t){return function(n,r,o){return o&&"number"!=typeof o&&io(n,r,o)&&(r=o=u),n=ra(n),r===u?(r=n,n=0):r=ra(r),function(t,n,r,u){for(var o=-1,i=pr(or((n-t)/(r||1)),0),a=e(i);i--;)a[u?i:++o]=t,t+=r;return a}(n,r,o=o===u?n<r?1:-1:ra(o),t)}}function Lu(t){return function(n,r){return"string"==typeof n&&"string"==typeof r||(n=oa(n),r=oa(r)),t(n,r)}}function Cu(t,n,r,e,o,i,a,f,l,s){var p=8&n;n|=p?c:64,4&(n&=~(p?64:c))||(n&=-4);var h=[t,n,o,p?i:u,p?a:u,p?u:i,p?u:a,f,l,s],v=r.apply(u,h);return co(t)&&_o(v,h),v.placeholder=e,mo(v,t,n)}function Nu(t){var n=wt[t];return function(t,r){if(t=oa(t),(r=null==r?0:hr(ea(r),292))&&fr(t)){var e=(aa(t)+"e").split("e");return+((e=(aa(n(e[0]+"e"+(+e[1]+r)))+"e").split("e"))[0]+"e"+(+e[1]-r))}return n(t)}}var Wu=wr&&1/Yn(new wr([,-0]))[1]==f?function(t){return new wr(t)}:Ya;function Uu(t){return function(n){var r,e,u,o,i=no(n);return i==m?Vn(n):i==A?(r=n,e=-1,u=Array(r.size),r.forEach(function(t){u[++e]=[t,t]}),u):(o=n,wn(t(n),function(t){return[t,o[t]]}))}}function Pu(t,n,r,i,f,l,s,p){var h=2&n;if(!h&&"function"!=typeof t)throw new At(o);var v=i?i.length:0;if(v||(n&=-97,i=f=u),s=s===u?s:pr(ea(s),0),p=p===u?p:ea(p),v-=f?f.length:0,64&n){var g=i,d=f;i=f=u}var _=h?u:Ku(t),y=[t,n,r,i,f,g,d,l,s,p];if(_&&function(t,n){var r=t[1],e=n[1],u=r|e,o=u<131,i=128==e&&8==r||128==e&&256==r&&t[7].length<=n[8]||384==e&&n[7].length<=n[8]&&8==r;if(!o&&!i)return t;1&e&&(t[2]=n[2],u|=1&r?0:4);var c=n[3];if(c){var f=t[3];t[3]=f?vu(f,c,n[4]):c,t[4]=f?Jn(t[3],a):n[4]}(c=n[5])&&(f=t[5],t[5]=f?gu(f,c,n[6]):c,t[6]=f?Jn(t[5],a):n[6]),(c=n[7])&&(t[7]=c),128&e&&(t[8]=null==t[8]?n[8]:hr(t[8],n[8])),null==t[9]&&(t[9]=n[9]),t[0]=n[0],t[1]=u}(y,_),t=y[0],n=y[1],r=y[2],i=y[3],f=y[4],(p=y[9]=y[9]===u?h?0:t.length:pr(y[9]-v,0))||!(24&n)||(n&=-25),n&&1!=n)z=8==n||16==n?(m=n,w=p,x=ju(b=t),function t(){for(var n=arguments.length,r=e(n),o=n,i=Vu(t);o--;)r[o]=arguments[o];var a=n<3&&r[0]!==i&&r[n-1]!==i?[]:Jn(r,i);return(n-=a.length)<w?Cu(b,m,Eu,t.placeholder,u,r,a,u,u,w-n):vn(this&&this!==nn&&this instanceof t?x:b,this,r)}):n!=c&&33!=n||f.length?Eu.apply(u,y):(j=r,A=i,S=1&n,E=ju(k=t),function t(){for(var n=-1,r=arguments.length,u=-1,o=A.length,i=e(o+r),a=this&&this!==nn&&this instanceof t?E:k;++u<o;)i[u]=A[u];for(;r--;)i[u++]=arguments[++n];return vn(a,S?j:this,i)});else var b,m,w,x,k,j,A,S,E,O,T,R,I,z=(T=r,R=1&n,I=ju(O=t),function t(){return(this&&this!==nn&&this instanceof t?I:O).apply(R?T:this,arguments)});return mo((_?qe:_o)(z,y),t,n)}function Mu(t,n,r,e){return t===u||Ti(t,Ot[r])&&!It.call(e,r)?n:t}function Bu(t,n,r,e,o,i){return qi(t)&&qi(n)&&(i.set(n,t),Le(t,n,u,Bu,i),i.delete(n)),t}function $u(t){return Hi(t)?u:t}function Du(t,n,r,e,o,i){var a=1&r,c=t.length,f=n.length;if(c!=f&&!(a&&f>c))return!1;var l=i.get(t),s=i.get(n);if(l&&s)return l==n&&s==t;var p=-1,h=!0,v=2&r?new Dr:u;for(i.set(t,n),i.set(n,t);++p<c;){var g=t[p],d=n[p];if(e)var _=a?e(d,g,p,n,t,i):e(g,d,p,t,n,i);if(_!==u){if(_)continue;h=!1;break}if(v){if(!An(n,function(t,n){if(!$n(v,n)&&(g===t||o(g,t,r,e,i)))return v.push(n)})){h=!1;break}}else if(g!==d&&!o(g,d,r,e,i)){h=!1;break}}return i.delete(t),i.delete(n),h}function qu(t){return bo(ho(t,u,Co),t+"")}function Fu(t){return de(t,ma,Xu)}function Zu(t){return de(t,wa,to)}var Ku=jr?function(t){return jr.get(t)}:Ya;function Hu(t){for(var n=t.name+"",r=Ar[n],e=It.call(Ar,n)?r.length:0;e--;){var u=r[e],o=u.func;if(null==o||o==t)return u.name}return n}function Vu(t){return(It.call(Cr,"placeholder")?Cr:t).placeholder}function Gu(){var t=Cr.iteratee||Ha;return t=t===Ha?Ee:t,arguments.length?t(arguments[0],arguments[1]):t}function Ju(t,n){var r,e,u=t.__data__;return("string"==(e=typeof(r=n))||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==r:null===r)?u["string"==typeof n?"string":"hash"]:u.map}function Yu(t){for(var n=ma(t),r=n.length;r--;){var e=n[r],u=t[e];n[r]=[e,u,so(u)]}return n}function Qu(t,n){var r,e=null==(r=t)?u:r[n];return Se(e)?e:u}var Xu=ar?function(t){return null==t?[]:(t=xt(t),yn(ar(t),function(n){return tn.call(t,n)}))}:uc,to=ar?function(t){for(var n=[];t;)xn(n,Xu(t)),t=Jt(t);return n}:uc,no=_e;function ro(t,n,r){for(var e=-1,u=(n=au(n,t)).length,o=!1;++e<u;){var i=So(n[e]);if(!(o=null!=t&&r(t,i)))break;t=t[i]}return o||++e!=u?o:!!(u=null==t?0:t.length)&&Di(u)&&oo(i,u)&&(Li(t)||zi(t))}function eo(t){return"function"!=typeof t.constructor||lo(t)?{}:Nr(Jt(t))}function uo(t){return Li(t)||zi(t)||!!(en&&t&&t[en])}function oo(t,n){var r=typeof t;return!!(n=null==n?9007199254740991:n)&&("number"==r||"symbol"!=r&&gt.test(t))&&t>-1&&t%1==0&&t<n}function io(t,n,r){if(!qi(r))return!1;var e=typeof n;return!!("number"==e?Ni(r)&&oo(n,r.length):"string"==e&&n in r)&&Ti(r[n],t)}function ao(t,n){if(Li(t))return!1;var r=typeof t;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=t&&!Yi(t))||Y.test(t)||!J.test(t)||null!=n&&t in xt(n)}function co(t){var n=Hu(t),r=Cr[n];if("function"!=typeof r||!(n in Pr.prototype))return!1;if(t===r)return!0;var e=Ku(r);return!!e&&t===e[0]}(yr&&no(new yr(new ArrayBuffer(1)))!=R||br&&no(new br)!=m||mr&&no(mr.resolve())!=k||wr&&no(new wr)!=A||xr&&no(new xr)!=O)&&(no=function(t){var n=_e(t),r=n==x?t.constructor:u,e=r?Eo(r):"";if(e)switch(e){case Sr:return R;case Er:return m;case Or:return k;case Tr:return A;case Rr:return O}return n});var fo=Tt?Bi:oc;function lo(t){var n=t&&t.constructor;return t===("function"==typeof n&&n.prototype||Ot)}function so(t){return t==t&&!qi(t)}function po(t,n){return function(r){return null!=r&&r[t]===n&&(n!==u||t in xt(r))}}function ho(t,n,r){return n=pr(n===u?t.length-1:n,0),function(){for(var u=arguments,o=-1,i=pr(u.length-n,0),a=e(i);++o<i;)a[o]=u[n+o];o=-1;for(var c=e(n+1);++o<n;)c[o]=u[o];return c[n]=r(a),vn(t,this,c)}}function vo(t,n){return n.length<2?t:ge(t,Ze(n,0,-1))}function go(t,n){if(("constructor"!==n||"function"!=typeof t[n])&&"__proto__"!=n)return t[n]}var _o=wo(qe),yo=ur||function(t,n){return nn.setTimeout(t,n)},bo=wo(Fe);function mo(t,n,r){var e,u,o,i=n+"";return bo(t,function(t,n){var r=n.length;if(!r)return t;var e=r-1;return n[e]=(r>1?"& ":"")+n[e],n=n.join(r>2?", ":" "),t.replace(et,"{\n/* [wrapped with "+n+"] */\n")}(i,(u=(e=i.match(ut))?e[1].split(ot):[],o=r,dn(p,function(t){var n="_."+t[0];o&t[1]&&!bn(u,n)&&u.push(n)}),u.sort())))}function wo(t){var n=0,r=0;return function(){var e=vr(),o=16-(e-r);if(r=e,o>0){if(++n>=800)return arguments[0]}else n=0;return t.apply(u,arguments)}}function xo(t,n){var r=-1,e=t.length,o=e-1;for(n=n===u?e:n;++r<n;){var i=Me(r,o),a=t[i];t[i]=t[r],t[r]=a}return t.length=n,t}var ko,jo,Ao=(jo=(ko=ki(function(t){var n=[];return 46===t.charCodeAt(0)&&n.push(""),t.replace(Q,function(t,r,e,u){n.push(e?u.replace(ct,"$1"):r||t)}),n},function(t){return 500===jo.size&&jo.clear(),t})).cache,ko);function So(t){if("string"==typeof t||Yi(t))return t;var n=t+"";return"0"==n&&1/t==-1/0?"-0":n}function Eo(t){if(null!=t){try{return Rt.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Oo(t){if(t instanceof Pr)return t.clone();var n=new Ur(t.__wrapped__,t.__chain__);return n.__actions__=du(t.__actions__),n.__index__=t.__index__,n.__values__=t.__values__,n}var To=$e(function(t,n){return Wi(t)?ee(t,fe(n,1,Wi,!0)):[]}),Ro=$e(function(t,n){var r=Mo(n);return Wi(r)&&(r=u),Wi(t)?ee(t,fe(n,1,Wi,!0),Gu(r,2)):[]}),Io=$e(function(t,n){var r=Mo(n);return Wi(r)&&(r=u),Wi(t)?ee(t,fe(n,1,Wi,!0),u,r):[]});function zo(t,n,r){var e=null==t?0:t.length;if(!e)return-1;var u=null==r?0:ea(r);return u<0&&(u=pr(e+u,0)),On(t,Gu(n,3),u)}function Lo(t,n,r){var e=null==t?0:t.length;if(!e)return-1;var o=e-1;return r!==u&&(o=ea(r),o=r<0?pr(e+o,0):hr(o,e-1)),On(t,Gu(n,3),o,!0)}function Co(t){return null!=t&&t.length?fe(t,1):[]}function No(t){return t&&t.length?t[0]:u}var Wo=$e(function(t){var n=wn(t,ou);return n.length&&n[0]===t[0]?we(n):[]}),Uo=$e(function(t){var n=Mo(t),r=wn(t,ou);return n===Mo(r)?n=u:r.pop(),r.length&&r[0]===t[0]?we(r,Gu(n,2)):[]}),Po=$e(function(t){var n=Mo(t),r=wn(t,ou);return(n="function"==typeof n?n:u)&&r.pop(),r.length&&r[0]===t[0]?we(r,u,n):[]});function Mo(t){var n=null==t?0:t.length;return n?t[n-1]:u}var Bo=$e($o);function $o(t,n){return t&&t.length&&n&&n.length?Ue(t,n):t}var Do=qu(function(t,n){var r=null==t?0:t.length,e=Qr(t,n);return Pe(t,wn(n,function(t){return oo(t,r)?+t:t}).sort(hu)),e});function qo(t){return null==t?t:_r.call(t)}var Fo=$e(function(t){return Qe(fe(t,1,Wi,!0))}),Zo=$e(function(t){var n=Mo(t);return Wi(n)&&(n=u),Qe(fe(t,1,Wi,!0),Gu(n,2))}),Ko=$e(function(t){var n=Mo(t);return n="function"==typeof n?n:u,Qe(fe(t,1,Wi,!0),u,n)});function Ho(t){if(!t||!t.length)return[];var n=0;return t=yn(t,function(t){if(Wi(t))return n=pr(t.length,n),!0}),Un(n,function(n){return wn(t,Ln(n))})}function Vo(t,n){if(!t||!t.length)return[];var r=Ho(t);return null==n?r:wn(r,function(t){return vn(n,u,t)})}var Go=$e(function(t,n){return Wi(t)?ee(t,n):[]}),Jo=$e(function(t){return eu(yn(t,Wi))}),Yo=$e(function(t){var n=Mo(t);return Wi(n)&&(n=u),eu(yn(t,Wi),Gu(n,2))}),Qo=$e(function(t){var n=Mo(t);return n="function"==typeof n?n:u,eu(yn(t,Wi),u,n)}),Xo=$e(Ho),ti=$e(function(t){var n=t.length,r=n>1?t[n-1]:u;return Vo(t,r="function"==typeof r?(t.pop(),r):u)});function ni(t){var n=Cr(t);return n.__chain__=!0,n}function ri(t,n){return n(t)}var ei=qu(function(t){var n=t.length,r=n?t[0]:0,e=this.__wrapped__,o=function(n){return Qr(n,t)};return!(n>1||this.__actions__.length)&&e instanceof Pr&&oo(r)?((e=e.slice(r,+r+(n?1:0))).__actions__.push({func:ri,args:[o],thisArg:u}),new Ur(e,this.__chain__).thru(function(t){return n&&!t.length&&t.push(u),t})):this.thru(o)}),ui=yu(function(t,n,r){It.call(t,r)?++t[r]:Yr(t,r,1)}),oi=Au(zo),ii=Au(Lo);function ai(t,n){return(Li(t)?dn:ue)(t,Gu(n,3))}function ci(t,n){return(Li(t)?function(t,n){for(var r=null==t?0:t.length;r--&&!1!==n(t[r],r,t););return t}:oe)(t,Gu(n,3))}var fi=yu(function(t,n,r){It.call(t,r)?t[r].push(n):Yr(t,r,[n])}),li=$e(function(t,n,r){var u=-1,o="function"==typeof n,i=Ni(t)?e(t.length):[];return ue(t,function(t){i[++u]=o?vn(n,t,r):xe(t,n,r)}),i}),si=yu(function(t,n,r){Yr(t,r,n)});function pi(t,n){return(Li(t)?wn:Re)(t,Gu(n,3))}var hi=yu(function(t,n,r){t[r?0:1].push(n)},function(){return[[],[]]}),vi=$e(function(t,n){if(null==t)return[];var r=n.length;return r>1&&io(t,n[0],n[1])?n=[]:r>2&&io(n[0],n[1],n[2])&&(n=[n[0]]),Ne(t,fe(n,1),[])}),gi=er||function(){return nn.Date.now()};function di(t,n,r){return n=r?u:n,n=t&&null==n?t.length:n,Pu(t,128,u,u,u,u,n)}function _i(t,n){var r;if("function"!=typeof n)throw new At(o);return t=ea(t),function(){return--t>0&&(r=n.apply(this,arguments)),t<=1&&(n=u),r}}var yi=$e(function(t,n,r){var e=1;if(r.length){var u=Jn(r,Vu(yi));e|=c}return Pu(t,e,n,r,u)}),bi=$e(function(t,n,r){var e=3;if(r.length){var u=Jn(r,Vu(bi));e|=c}return Pu(n,e,t,r,u)});function mi(t,n,r){var e,i,a,c,f,l,s=0,p=!1,h=!1,v=!0;if("function"!=typeof t)throw new At(o);function g(n){var r=e,o=i;return e=i=u,s=n,c=t.apply(o,r)}function d(t){var r=t-l;return l===u||r>=n||r<0||h&&t-s>=a}function _(){var t,r,e=gi();if(d(e))return y(e);f=yo(_,(r=n-((t=e)-l),h?hr(r,a-(t-s)):r))}function y(t){return f=u,v&&e?g(t):(e=i=u,c)}function b(){var t,r=gi(),o=d(r);if(e=arguments,i=this,l=r,o){if(f===u)return s=t=l,f=yo(_,n),p?g(t):c;if(h)return fu(f),f=yo(_,n),g(l)}return f===u&&(f=yo(_,n)),c}return n=oa(n)||0,qi(r)&&(p=!!r.leading,a=(h="maxWait"in r)?pr(oa(r.maxWait)||0,n):a,v="trailing"in r?!!r.trailing:v),b.cancel=function(){f!==u&&fu(f),s=0,e=l=i=f=u},b.flush=function(){return f===u?c:y(gi())},b}var wi=$e(function(t,n){return re(t,1,n)}),xi=$e(function(t,n,r){return re(t,oa(n)||0,r)});function ki(t,n){if("function"!=typeof t||null!=n&&"function"!=typeof n)throw new At(o);var r=function(){var e=arguments,u=n?n.apply(this,e):e[0],o=r.cache;if(o.has(u))return o.get(u);var i=t.apply(this,e);return r.cache=o.set(u,i)||o,i};return r.cache=new(ki.Cache||$r),r}function ji(t){if("function"!=typeof t)throw new At(o);return function(){var n=arguments;switch(n.length){case 0:return!t.call(this);case 1:return!t.call(this,n[0]);case 2:return!t.call(this,n[0],n[1]);case 3:return!t.call(this,n[0],n[1],n[2])}return!t.apply(this,n)}}ki.Cache=$r;var Ai=$e(function(t,n){var r=(n=1==n.length&&Li(n[0])?wn(n[0],Mn(Gu())):wn(fe(n,1),Mn(Gu()))).length;return $e(function(e){for(var u=-1,o=hr(e.length,r);++u<o;)e[u]=n[u].call(this,e[u]);return vn(t,this,e)})}),Si=$e(function(t,n){var r=Jn(n,Vu(Si));return Pu(t,c,u,n,r)}),Ei=$e(function(t,n){var r=Jn(n,Vu(Ei));return Pu(t,64,u,n,r)}),Oi=qu(function(t,n){return Pu(t,256,u,u,u,n)});function Ti(t,n){return t===n||t!=t&&n!=n}var Ri=Lu(ye),Ii=Lu(function(t,n){return t>=n}),zi=ke(function(){return arguments}())?ke:function(t){return Fi(t)&&It.call(t,"callee")&&!tn.call(t,"callee")},Li=e.isArray,Ci=cn?Mn(cn):function(t){return Fi(t)&&_e(t)==T};function Ni(t){return null!=t&&Di(t.length)&&!Bi(t)}function Wi(t){return Fi(t)&&Ni(t)}var Ui=cr||oc,Pi=fn?Mn(fn):function(t){return Fi(t)&&_e(t)==d};function Mi(t){if(!Fi(t))return!1;var n=_e(t);return n==_||"[object DOMException]"==n||"string"==typeof t.message&&"string"==typeof t.name&&!Hi(t)}function Bi(t){if(!qi(t))return!1;var n=_e(t);return n==y||n==b||"[object AsyncFunction]"==n||"[object Proxy]"==n}function $i(t){return"number"==typeof t&&t==ea(t)}function Di(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}function qi(t){var n=typeof t;return null!=t&&("object"==n||"function"==n)}function Fi(t){return null!=t&&"object"==typeof t}var Zi=ln?Mn(ln):function(t){return Fi(t)&&no(t)==m};function Ki(t){return"number"==typeof t||Fi(t)&&_e(t)==w}function Hi(t){if(!Fi(t)||_e(t)!=x)return!1;var n=Jt(t);if(null===n)return!0;var r=It.call(n,"constructor")&&n.constructor;return"function"==typeof r&&r instanceof r&&Rt.call(r)==Nt}var Vi=sn?Mn(sn):function(t){return Fi(t)&&_e(t)==j},Gi=pn?Mn(pn):function(t){return Fi(t)&&no(t)==A};function Ji(t){return"string"==typeof t||!Li(t)&&Fi(t)&&_e(t)==S}function Yi(t){return"symbol"==typeof t||Fi(t)&&_e(t)==E}var Qi=hn?Mn(hn):function(t){return Fi(t)&&Di(t.length)&&!!Vt[_e(t)]},Xi=Lu(Te),ta=Lu(function(t,n){return t<=n});function na(t){if(!t)return[];if(Ni(t))return Ji(t)?Xn(t):du(t);if(on&&t[on])return function(t){for(var n,r=[];!(n=t.next()).done;)r.push(n.value);return r}(t[on]());var n=no(t);return(n==m?Vn:n==A?Yn:Ta)(t)}function ra(t){return t?(t=oa(t))===f||t===-1/0?1.7976931348623157e308*(t<0?-1:1):t==t?t:0:0===t?t:0}function ea(t){var n=ra(t),r=n%1;return n==n?r?n-r:n:0}function ua(t){return t?Xr(ea(t),0,s):0}function oa(t){if("number"==typeof t)return t;if(Yi(t))return l;if(qi(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=qi(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=Pn(t);var r=pt.test(t);return r||vt.test(t)?Qt(t.slice(2),r?2:8):st.test(t)?l:+t}function ia(t){return _u(t,wa(t))}function aa(t){return null==t?"":Ye(t)}var ca=bu(function(t,n){if(lo(n)||Ni(n))_u(n,ma(n),t);else for(var r in n)It.call(n,r)&&Hr(t,r,n[r])}),fa=bu(function(t,n){_u(n,wa(n),t)}),la=bu(function(t,n,r,e){_u(n,wa(n),t,e)}),sa=bu(function(t,n,r,e){_u(n,ma(n),t,e)}),pa=qu(Qr),ha=$e(function(t,n){t=xt(t);var r=-1,e=n.length,o=e>2?n[2]:u;for(o&&io(n[0],n[1],o)&&(e=1);++r<e;)for(var i=n[r],a=wa(i),c=-1,f=a.length;++c<f;){var l=a[c],s=t[l];(s===u||Ti(s,Ot[l])&&!It.call(t,l))&&(t[l]=i[l])}return t}),va=$e(function(t){return t.push(u,Bu),vn(ka,u,t)});function ga(t,n,r){var e=null==t?u:ge(t,n);return e===u?r:e}function da(t,n){return null!=t&&ro(t,n,me)}var _a=Ou(function(t,n,r){null!=n&&"function"!=typeof n.toString&&(n=Ct.call(n)),t[n]=r},qa(Ka)),ya=Ou(function(t,n,r){null!=n&&"function"!=typeof n.toString&&(n=Ct.call(n)),It.call(t,n)?t[n].push(r):t[n]=[r]},Gu),ba=$e(xe);function ma(t){return Ni(t)?Fr(t):Oe(t)}function wa(t){return Ni(t)?Fr(t,!0):function(t){if(!qi(t))return function(t){var n=[];if(null!=t)for(var r in xt(t))n.push(r);return n}(t);var n=lo(t),r=[];for(var e in t)("constructor"!=e||!n&&It.call(t,e))&&r.push(e);return r}(t)}var xa=bu(function(t,n,r){Le(t,n,r)}),ka=bu(function(t,n,r,e){Le(t,n,r,e)}),ja=qu(function(t,n){var r={};if(null==t)return r;var e=!1;n=wn(n,function(n){return n=au(n,t),e||(e=n.length>1),n}),_u(t,Zu(t),r),e&&(r=te(r,7,$u));for(var u=n.length;u--;)Xe(r,n[u]);return r}),Aa=qu(function(t,n){var r;return null==t?{}:We(r=t,n,function(t,n){return da(r,n)})});function Sa(t,n){if(null==t)return{};var r=wn(Zu(t),function(t){return[t]});return n=Gu(n),We(t,r,function(t,r){return n(t,r[0])})}var Ea=Uu(ma),Oa=Uu(wa);function Ta(t){return null==t?[]:Bn(t,ma(t))}var Ra=ku(function(t,n,r){return n=n.toLowerCase(),t+(r?Ia(n):n)});function Ia(t){return Ma(aa(t).toLowerCase())}function za(t){return(t=aa(t))&&t.replace(dt,Fn).replace($t,"")}var La=ku(function(t,n,r){return t+(r?"-":"")+n.toLowerCase()}),Ca=ku(function(t,n,r){return t+(r?" ":"")+n.toLowerCase()}),Na=xu("toLowerCase"),Wa=ku(function(t,n,r){return t+(r?"_":"")+n.toLowerCase()}),Ua=ku(function(t,n,r){return t+(r?" ":"")+Ma(n)}),Pa=ku(function(t,n,r){return t+(r?" ":"")+n.toUpperCase()}),Ma=xu("toUpperCase");function Ba(t,n,r){var e;return t=aa(t),(n=r?u:n)===u?(e=t,Zt.test(e)?t.match(qt)||[]:t.match(it)||[]):t.match(n)||[]}var $a=$e(function(t,n){try{return vn(t,u,n)}catch(t){return Mi(t)?t:new bt(t)}}),Da=qu(function(t,n){return dn(n,function(n){n=So(n),Yr(t,n,yi(t[n],t))}),t});function qa(t){return function(){return t}}var Fa=Su(),Za=Su(!0);function Ka(t){return t}function Ha(t){return Ee("function"==typeof t?t:te(t,1))}var Va=$e(function(t,n){return function(r){return xe(r,t,n)}}),Ga=$e(function(t,n){return function(r){return xe(t,r,n)}});function Ja(t,n,r){var e=ma(n),u=ve(n,e);null!=r||qi(n)&&(u.length||!e.length)||(r=n,n=t,t=this,u=ve(n,ma(n)));var o=!(qi(r)&&"chain"in r&&!r.chain),i=Bi(t);return dn(u,function(r){var e=n[r];t[r]=e,i&&(t.prototype[r]=function(){var n=this.__chain__;if(o||n){var r=t(this.__wrapped__);return(r.__actions__=du(this.__actions__)).push({func:e,args:arguments,thisArg:t}),r.__chain__=n,r}return e.apply(t,xn([this.value()],arguments))})}),t}function Ya(){}var Qa=Ru(wn),Xa=Ru(_n),tc=Ru(An);function nc(t){var n;return ao(t)?Ln(So(t)):(n=t,function(t){return ge(t,n)})}var rc=zu(),ec=zu(!0);function uc(){return[]}function oc(){return!1}var ic,ac=Tu(function(t,n){return t+n},0),cc=Nu("ceil"),fc=Tu(function(t,n){return t/n},1),lc=Nu("floor"),sc=Tu(function(t,n){return t*n},1),pc=Nu("round"),hc=Tu(function(t,n){return t-n},0);return Cr.after=function(t,n){if("function"!=typeof n)throw new At(o);return t=ea(t),function(){if(--t<1)return n.apply(this,arguments)}},Cr.ary=di,Cr.assign=ca,Cr.assignIn=fa,Cr.assignInWith=la,Cr.assignWith=sa,Cr.at=pa,Cr.before=_i,Cr.bind=yi,Cr.bindAll=Da,Cr.bindKey=bi,Cr.castArray=function(){if(!arguments.length)return[];var t=arguments[0];return Li(t)?t:[t]},Cr.chain=ni,Cr.chunk=function(t,n,r){n=(r?io(t,n,r):n===u)?1:pr(ea(n),0);var o=null==t?0:t.length;if(!o||n<1)return[];for(var i=0,a=0,c=e(or(o/n));i<o;)c[a++]=Ze(t,i,i+=n);return c},Cr.compact=function(t){for(var n=-1,r=null==t?0:t.length,e=0,u=[];++n<r;){var o=t[n];o&&(u[e++]=o)}return u},Cr.concat=function(){var t=arguments.length;if(!t)return[];for(var n=e(t-1),r=arguments[0],u=t;u--;)n[u-1]=arguments[u];return xn(Li(r)?du(r):[r],fe(n,1))},Cr.cond=function(t){var n=null==t?0:t.length,r=Gu();return t=n?wn(t,function(t){if("function"!=typeof t[1])throw new At(o);return[r(t[0]),t[1]]}):[],$e(function(r){for(var e=-1;++e<n;){var u=t[e];if(vn(u[0],this,r))return vn(u[1],this,r)}})},Cr.conforms=function(t){var n,r;return n=te(t,1),r=ma(n),function(t){return ne(t,n,r)}},Cr.constant=qa,Cr.countBy=ui,Cr.create=function(t,n){var r=Nr(t);return null==n?r:Jr(r,n)},Cr.curry=function t(n,r,e){var o=Pu(n,8,u,u,u,u,u,r=e?u:r);return o.placeholder=t.placeholder,o},Cr.curryRight=function t(n,r,e){var o=Pu(n,16,u,u,u,u,u,r=e?u:r);return o.placeholder=t.placeholder,o},Cr.debounce=mi,Cr.defaults=ha,Cr.defaultsDeep=va,Cr.defer=wi,Cr.delay=xi,Cr.difference=To,Cr.differenceBy=Ro,Cr.differenceWith=Io,Cr.drop=function(t,n,r){var e=null==t?0:t.length;return e?Ze(t,(n=r||n===u?1:ea(n))<0?0:n,e):[]},Cr.dropRight=function(t,n,r){var e=null==t?0:t.length;return e?Ze(t,0,(n=e-(n=r||n===u?1:ea(n)))<0?0:n):[]},Cr.dropRightWhile=function(t,n){return t&&t.length?nu(t,Gu(n,3),!0,!0):[]},Cr.dropWhile=function(t,n){return t&&t.length?nu(t,Gu(n,3),!0):[]},Cr.fill=function(t,n,r,e){var o=null==t?0:t.length;return o?(r&&"number"!=typeof r&&io(t,n,r)&&(r=0,e=o),function(t,n,r,e){var o=t.length;for((r=ea(r))<0&&(r=-r>o?0:o+r),(e=e===u||e>o?o:ea(e))<0&&(e+=o),e=r>e?0:ua(e);r<e;)t[r++]=n;return t}(t,n,r,e)):[]},Cr.filter=function(t,n){return(Li(t)?yn:ce)(t,Gu(n,3))},Cr.flatMap=function(t,n){return fe(pi(t,n),1)},Cr.flatMapDeep=function(t,n){return fe(pi(t,n),f)},Cr.flatMapDepth=function(t,n,r){return r=r===u?1:ea(r),fe(pi(t,n),r)},Cr.flatten=Co,Cr.flattenDeep=function(t){return null!=t&&t.length?fe(t,f):[]},Cr.flattenDepth=function(t,n){return null!=t&&t.length?fe(t,n=n===u?1:ea(n)):[]},Cr.flip=function(t){return Pu(t,512)},Cr.flow=Fa,Cr.flowRight=Za,Cr.fromPairs=function(t){for(var n=-1,r=null==t?0:t.length,e={};++n<r;){var u=t[n];e[u[0]]=u[1]}return e},Cr.functions=function(t){return null==t?[]:ve(t,ma(t))},Cr.functionsIn=function(t){return null==t?[]:ve(t,wa(t))},Cr.groupBy=fi,Cr.initial=function(t){return null!=t&&t.length?Ze(t,0,-1):[]},Cr.intersection=Wo,Cr.intersectionBy=Uo,Cr.intersectionWith=Po,Cr.invert=_a,Cr.invertBy=ya,Cr.invokeMap=li,Cr.iteratee=Ha,Cr.keyBy=si,Cr.keys=ma,Cr.keysIn=wa,Cr.map=pi,Cr.mapKeys=function(t,n){var r={};return n=Gu(n,3),pe(t,function(t,e,u){Yr(r,n(t,e,u),t)}),r},Cr.mapValues=function(t,n){var r={};return n=Gu(n,3),pe(t,function(t,e,u){Yr(r,e,n(t,e,u))}),r},Cr.matches=function(t){return Ie(te(t,1))},Cr.matchesProperty=function(t,n){return ze(t,te(n,1))},Cr.memoize=ki,Cr.merge=xa,Cr.mergeWith=ka,Cr.method=Va,Cr.methodOf=Ga,Cr.mixin=Ja,Cr.negate=ji,Cr.nthArg=function(t){return t=ea(t),$e(function(n){return Ce(n,t)})},Cr.omit=ja,Cr.omitBy=function(t,n){return Sa(t,ji(Gu(n)))},Cr.once=function(t){return _i(2,t)},Cr.orderBy=function(t,n,r,e){return null==t?[]:(Li(n)||(n=null==n?[]:[n]),Li(r=e?u:r)||(r=null==r?[]:[r]),Ne(t,n,r))},Cr.over=Qa,Cr.overArgs=Ai,Cr.overEvery=Xa,Cr.overSome=tc,Cr.partial=Si,Cr.partialRight=Ei,Cr.partition=hi,Cr.pick=Aa,Cr.pickBy=Sa,Cr.property=nc,Cr.propertyOf=function(t){return function(n){return null==t?u:ge(t,n)}},Cr.pull=Bo,Cr.pullAll=$o,Cr.pullAllBy=function(t,n,r){return t&&t.length&&n&&n.length?Ue(t,n,Gu(r,2)):t},Cr.pullAllWith=function(t,n,r){return t&&t.length&&n&&n.length?Ue(t,n,u,r):t},Cr.pullAt=Do,Cr.range=rc,Cr.rangeRight=ec,Cr.rearg=Oi,Cr.reject=function(t,n){return(Li(t)?yn:ce)(t,ji(Gu(n,3)))},Cr.remove=function(t,n){var r=[];if(!t||!t.length)return r;var e=-1,u=[],o=t.length;for(n=Gu(n,3);++e<o;){var i=t[e];n(i,e,t)&&(r.push(i),u.push(e))}return Pe(t,u),r},Cr.rest=function(t,n){if("function"!=typeof t)throw new At(o);return $e(t,n=n===u?n:ea(n))},Cr.reverse=qo,Cr.sampleSize=function(t,n,r){return n=(r?io(t,n,r):n===u)?1:ea(n),(Li(t)?function(t,n){return xo(du(t),Xr(n,0,t.length))}:function(t,n){var r=Ta(t);return xo(r,Xr(n,0,r.length))})(t,n)},Cr.set=function(t,n,r){return null==t?t:De(t,n,r)},Cr.setWith=function(t,n,r,e){return e="function"==typeof e?e:u,null==t?t:De(t,n,r,e)},Cr.shuffle=function(t){return(Li(t)?function(t){return xo(du(t))}:function(t){return xo(Ta(t))})(t)},Cr.slice=function(t,n,r){var e=null==t?0:t.length;return e?(r&&"number"!=typeof r&&io(t,n,r)?(n=0,r=e):(n=null==n?0:ea(n),r=r===u?e:ea(r)),Ze(t,n,r)):[]},Cr.sortBy=vi,Cr.sortedUniq=function(t){return t&&t.length?Ge(t):[]},Cr.sortedUniqBy=function(t,n){return t&&t.length?Ge(t,Gu(n,2)):[]},Cr.split=function(t,n,r){return r&&"number"!=typeof r&&io(t,n,r)&&(n=r=u),(r=r===u?s:r>>>0)?(t=aa(t))&&("string"==typeof n||null!=n&&!Vi(n))&&!(n=Ye(n))&&Hn(t)?cu(Xn(t),0,r):t.split(n,r):[]},Cr.spread=function(t,n){if("function"!=typeof t)throw new At(o);return n=null==n?0:pr(ea(n),0),$e(function(r){var e=r[n],u=cu(r,0,n);return e&&xn(u,e),vn(t,this,u)})},Cr.tail=function(t){var n=null==t?0:t.length;return n?Ze(t,1,n):[]},Cr.take=function(t,n,r){return t&&t.length?Ze(t,0,(n=r||n===u?1:ea(n))<0?0:n):[]},Cr.takeRight=function(t,n,r){var e=null==t?0:t.length;return e?Ze(t,(n=e-(n=r||n===u?1:ea(n)))<0?0:n,e):[]},Cr.takeRightWhile=function(t,n){return t&&t.length?nu(t,Gu(n,3),!1,!0):[]},Cr.takeWhile=function(t,n){return t&&t.length?nu(t,Gu(n,3)):[]},Cr.tap=function(t,n){return n(t),t},Cr.throttle=function(t,n,r){var e=!0,u=!0;if("function"!=typeof t)throw new At(o);return qi(r)&&(e="leading"in r?!!r.leading:e,u="trailing"in r?!!r.trailing:u),mi(t,n,{leading:e,maxWait:n,trailing:u})},Cr.thru=ri,Cr.toArray=na,Cr.toPairs=Ea,Cr.toPairsIn=Oa,Cr.toPath=function(t){return Li(t)?wn(t,So):Yi(t)?[t]:du(Ao(aa(t)))},Cr.toPlainObject=ia,Cr.transform=function(t,n,r){var e=Li(t),u=e||Ui(t)||Qi(t);if(n=Gu(n,4),null==r){var o=t&&t.constructor;r=u?e?new o:[]:qi(t)&&Bi(o)?Nr(Jt(t)):{}}return(u?dn:pe)(t,function(t,e,u){return n(r,t,e,u)}),r},Cr.unary=function(t){return di(t,1)},Cr.union=Fo,Cr.unionBy=Zo,Cr.unionWith=Ko,Cr.uniq=function(t){return t&&t.length?Qe(t):[]},Cr.uniqBy=function(t,n){return t&&t.length?Qe(t,Gu(n,2)):[]},Cr.uniqWith=function(t,n){return n="function"==typeof n?n:u,t&&t.length?Qe(t,u,n):[]},Cr.unset=function(t,n){return null==t||Xe(t,n)},Cr.unzip=Ho,Cr.unzipWith=Vo,Cr.update=function(t,n,r){return null==t?t:tu(t,n,iu(r))},Cr.updateWith=function(t,n,r,e){return e="function"==typeof e?e:u,null==t?t:tu(t,n,iu(r),e)},Cr.values=Ta,Cr.valuesIn=function(t){return null==t?[]:Bn(t,wa(t))},Cr.without=Go,Cr.words=Ba,Cr.wrap=function(t,n){return Si(iu(n),t)},Cr.xor=Jo,Cr.xorBy=Yo,Cr.xorWith=Qo,Cr.zip=Xo,Cr.zipObject=function(t,n){return uu(t||[],n||[],Hr)},Cr.zipObjectDeep=function(t,n){return uu(t||[],n||[],De)},Cr.zipWith=ti,Cr.entries=Ea,Cr.entriesIn=Oa,Cr.extend=fa,Cr.extendWith=la,Ja(Cr,Cr),Cr.add=ac,Cr.attempt=$a,Cr.camelCase=Ra,Cr.capitalize=Ia,Cr.ceil=cc,Cr.clamp=function(t,n,r){return r===u&&(r=n,n=u),r!==u&&(r=(r=oa(r))==r?r:0),n!==u&&(n=(n=oa(n))==n?n:0),Xr(oa(t),n,r)},Cr.clone=function(t){return te(t,4)},Cr.cloneDeep=function(t){return te(t,5)},Cr.cloneDeepWith=function(t,n){return te(t,5,n="function"==typeof n?n:u)},Cr.cloneWith=function(t,n){return te(t,4,n="function"==typeof n?n:u)},Cr.conformsTo=function(t,n){return null==n||ne(t,n,ma(n))},Cr.deburr=za,Cr.defaultTo=function(t,n){return null==t||t!=t?n:t},Cr.divide=fc,Cr.endsWith=function(t,n,r){t=aa(t),n=Ye(n);var e=t.length,o=r=r===u?e:Xr(ea(r),0,e);return(r-=n.length)>=0&&t.slice(r,o)==n},Cr.eq=Ti,Cr.escape=function(t){return(t=aa(t))&&K.test(t)?t.replace(F,Zn):t},Cr.escapeRegExp=function(t){return(t=aa(t))&&tt.test(t)?t.replace(X,"\\$&"):t},Cr.every=function(t,n,r){var e=Li(t)?_n:ie;return r&&io(t,n,r)&&(n=u),e(t,Gu(n,3))},Cr.find=oi,Cr.findIndex=zo,Cr.findKey=function(t,n){return En(t,Gu(n,3),pe)},Cr.findLast=ii,Cr.findLastIndex=Lo,Cr.findLastKey=function(t,n){return En(t,Gu(n,3),he)},Cr.floor=lc,Cr.forEach=ai,Cr.forEachRight=ci,Cr.forIn=function(t,n){return null==t?t:le(t,Gu(n,3),wa)},Cr.forInRight=function(t,n){return null==t?t:se(t,Gu(n,3),wa)},Cr.forOwn=function(t,n){return t&&pe(t,Gu(n,3))},Cr.forOwnRight=function(t,n){return t&&he(t,Gu(n,3))},Cr.get=ga,Cr.gt=Ri,Cr.gte=Ii,Cr.has=function(t,n){return null!=t&&ro(t,n,be)},Cr.hasIn=da,Cr.head=No,Cr.identity=Ka,Cr.includes=function(t,n,r,e){t=Ni(t)?t:Ta(t),r=r&&!e?ea(r):0;var u=t.length;return r<0&&(r=pr(u+r,0)),Ji(t)?r<=u&&t.indexOf(n,r)>-1:!!u&&Tn(t,n,r)>-1},Cr.indexOf=function(t,n,r){var e=null==t?0:t.length;if(!e)return-1;var u=null==r?0:ea(r);return u<0&&(u=pr(e+u,0)),Tn(t,n,u)},Cr.inRange=function(t,n,r){var e,o,i;return n=ra(n),r===u?(r=n,n=0):r=ra(r),(e=t=oa(t))>=hr(o=n,i=r)&&e<pr(o,i)},Cr.invoke=ba,Cr.isArguments=zi,Cr.isArray=Li,Cr.isArrayBuffer=Ci,Cr.isArrayLike=Ni,Cr.isArrayLikeObject=Wi,Cr.isBoolean=function(t){return!0===t||!1===t||Fi(t)&&_e(t)==g},Cr.isBuffer=Ui,Cr.isDate=Pi,Cr.isElement=function(t){return Fi(t)&&1===t.nodeType&&!Hi(t)},Cr.isEmpty=function(t){if(null==t)return!0;if(Ni(t)&&(Li(t)||"string"==typeof t||"function"==typeof t.splice||Ui(t)||Qi(t)||zi(t)))return!t.length;var n=no(t);if(n==m||n==A)return!t.size;if(lo(t))return!Oe(t).length;for(var r in t)if(It.call(t,r))return!1;return!0},Cr.isEqual=function(t,n){return je(t,n)},Cr.isEqualWith=function(t,n,r){var e=(r="function"==typeof r?r:u)?r(t,n):u;return e===u?je(t,n,u,r):!!e},Cr.isError=Mi,Cr.isFinite=function(t){return"number"==typeof t&&fr(t)},Cr.isFunction=Bi,Cr.isInteger=$i,Cr.isLength=Di,Cr.isMap=Zi,Cr.isMatch=function(t,n){return t===n||Ae(t,n,Yu(n))},Cr.isMatchWith=function(t,n,r){return r="function"==typeof r?r:u,Ae(t,n,Yu(n),r)},Cr.isNaN=function(t){return Ki(t)&&t!=+t},Cr.isNative=function(t){if(fo(t))throw new bt("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");return Se(t)},Cr.isNil=function(t){return null==t},Cr.isNull=function(t){return null===t},Cr.isNumber=Ki,Cr.isObject=qi,Cr.isObjectLike=Fi,Cr.isPlainObject=Hi,Cr.isRegExp=Vi,Cr.isSafeInteger=function(t){return $i(t)&&t>=-9007199254740991&&t<=9007199254740991},Cr.isSet=Gi,Cr.isString=Ji,Cr.isSymbol=Yi,Cr.isTypedArray=Qi,Cr.isUndefined=function(t){return t===u},Cr.isWeakMap=function(t){return Fi(t)&&no(t)==O},Cr.isWeakSet=function(t){return Fi(t)&&"[object WeakSet]"==_e(t)},Cr.join=function(t,n){return null==t?"":lr.call(t,n)},Cr.kebabCase=La,Cr.last=Mo,Cr.lastIndexOf=function(t,n,r){var e=null==t?0:t.length;if(!e)return-1;var o=e;return r!==u&&(o=(o=ea(r))<0?pr(e+o,0):hr(o,e-1)),n==n?function(t,n,r){for(var e=o+1;e--&&t[e]!==n;);return e}(t,n):On(t,In,o,!0)},Cr.lowerCase=Ca,Cr.lowerFirst=Na,Cr.lt=Xi,Cr.lte=ta,Cr.max=function(t){return t&&t.length?ae(t,Ka,ye):u},Cr.maxBy=function(t,n){return t&&t.length?ae(t,Gu(n,2),ye):u},Cr.mean=function(t){return zn(t,Ka)},Cr.meanBy=function(t,n){return zn(t,Gu(n,2))},Cr.min=function(t){return t&&t.length?ae(t,Ka,Te):u},Cr.minBy=function(t,n){return t&&t.length?ae(t,Gu(n,2),Te):u},Cr.stubArray=uc,Cr.stubFalse=oc,Cr.stubObject=function(){return{}},Cr.stubString=function(){return""},Cr.stubTrue=function(){return!0},Cr.multiply=sc,Cr.nth=function(t,n){return t&&t.length?Ce(t,ea(n)):u},Cr.noConflict=function(){return nn._===this&&(nn._=Wt),this},Cr.noop=Ya,Cr.now=gi,Cr.pad=function(t,n,r){t=aa(t);var e=(n=ea(n))?Qn(t):0;if(!n||e>=n)return t;var u=(n-e)/2;return Iu(ir(u),r)+t+Iu(or(u),r)},Cr.padEnd=function(t,n,r){t=aa(t);var e=(n=ea(n))?Qn(t):0;return n&&e<n?t+Iu(n-e,r):t},Cr.padStart=function(t,n,r){t=aa(t);var e=(n=ea(n))?Qn(t):0;return n&&e<n?Iu(n-e,r)+t:t},Cr.parseInt=function(t,n,r){return r||null==n?n=0:n&&(n=+n),gr(aa(t).replace(nt,""),n||0)},Cr.random=function(t,n,r){if(r&&"boolean"!=typeof r&&io(t,n,r)&&(n=r=u),r===u&&("boolean"==typeof n?(r=n,n=u):"boolean"==typeof t&&(r=t,t=u)),t===u&&n===u?(t=0,n=1):(t=ra(t),n===u?(n=t,t=0):n=ra(n)),t>n){var e=t;t=n,n=e}if(r||t%1||n%1){var o=dr();return hr(t+o*(n-t+Yt("1e-"+((o+"").length-1))),n)}return Me(t,n)},Cr.reduce=function(t,n,r){var e=Li(t)?kn:Nn,u=arguments.length<3;return e(t,Gu(n,4),r,u,ue)},Cr.reduceRight=function(t,n,r){var e=Li(t)?jn:Nn,u=arguments.length<3;return e(t,Gu(n,4),r,u,oe)},Cr.repeat=function(t,n,r){return n=(r?io(t,n,r):n===u)?1:ea(n),Be(aa(t),n)},Cr.replace=function(){var t=arguments,n=aa(t[0]);return t.length<3?n:n.replace(t[1],t[2])},Cr.result=function(t,n,r){var e=-1,o=(n=au(n,t)).length;for(o||(o=1,t=u);++e<o;){var i=null==t?u:t[So(n[e])];i===u&&(e=o,i=r),t=Bi(i)?i.call(t):i}return t},Cr.round=pc,Cr.runInContext=t,Cr.sample=function(t){return(Li(t)?Zr:function(t){return Zr(Ta(t))})(t)},Cr.size=function(t){if(null==t)return 0;if(Ni(t))return Ji(t)?Qn(t):t.length;var n=no(t);return n==m||n==A?t.size:Oe(t).length},Cr.snakeCase=Wa,Cr.some=function(t,n,r){var e=Li(t)?An:Ke;return r&&io(t,n,r)&&(n=u),e(t,Gu(n,3))},Cr.sortedIndex=function(t,n){return He(t,n)},Cr.sortedIndexBy=function(t,n,r){return Ve(t,n,Gu(r,2))},Cr.sortedIndexOf=function(t,n){var r=null==t?0:t.length;if(r){var e=He(t,n);if(e<r&&Ti(t[e],n))return e}return-1},Cr.sortedLastIndex=function(t,n){return He(t,n,!0)},Cr.sortedLastIndexBy=function(t,n,r){return Ve(t,n,Gu(r,2),!0)},Cr.sortedLastIndexOf=function(t,n){if(null!=t&&t.length){var r=He(t,n,!0)-1;if(Ti(t[r],n))return r}return-1},Cr.startCase=Ua,Cr.startsWith=function(t,n,r){return t=aa(t),r=null==r?0:Xr(ea(r),0,t.length),n=Ye(n),t.slice(r,r+n.length)==n},Cr.subtract=hc,Cr.sum=function(t){return t&&t.length?Wn(t,Ka):0},Cr.sumBy=function(t,n){return t&&t.length?Wn(t,Gu(n,2)):0},Cr.template=function(t,n,r){var e=Cr.templateSettings;r&&io(t,n,r)&&(n=u),t=aa(t),n=la({},n,e,Mu);var o,i,a=la({},n.imports,e.imports,Mu),c=ma(a),f=Bn(a,c),l=0,s=n.interpolate||_t,p="__p += '",h=kt((n.escape||_t).source+"|"+s.source+"|"+(s===G?ft:_t).source+"|"+(n.evaluate||_t).source+"|$","g"),v="//# sourceURL="+(It.call(n,"sourceURL")?(n.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++Ht+"]")+"\n";t.replace(h,function(n,r,e,u,a,c){return e||(e=u),p+=t.slice(l,c).replace(yt,Kn),r&&(o=!0,p+="' +\n__e("+r+") +\n'"),a&&(i=!0,p+="';\n"+a+";\n__p += '"),e&&(p+="' +\n((__t = ("+e+")) == null ? '' : __t) +\n'"),l=c+n.length,n}),p+="';\n";var g=It.call(n,"variable")&&n.variable;if(g){if(at.test(g))throw new bt("Invalid `variable` option passed into `_.template`")}else p="with (obj) {\n"+p+"\n}\n";p=(i?p.replace(B,""):p).replace($,"$1").replace(D,"$1;"),p="function("+(g||"obj")+") {\n"+(g?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(i?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var d=$a(function(){return mt(c,v+"return "+p).apply(u,f)});if(d.source=p,Mi(d))throw d;return d},Cr.times=function(t,n){if((t=ea(t))<1||t>9007199254740991)return[];var r=s,e=hr(t,s);n=Gu(n),t-=s;for(var u=Un(e,n);++r<t;)n(r);return u},Cr.toFinite=ra,Cr.toInteger=ea,Cr.toLength=ua,Cr.toLower=function(t){return aa(t).toLowerCase()},Cr.toNumber=oa,Cr.toSafeInteger=function(t){return t?Xr(ea(t),-9007199254740991,9007199254740991):0===t?t:0},Cr.toString=aa,Cr.toUpper=function(t){return aa(t).toUpperCase()},Cr.trim=function(t,n,r){if((t=aa(t))&&(r||n===u))return Pn(t);if(!t||!(n=Ye(n)))return t;var e=Xn(t),o=Xn(n);return cu(e,Dn(e,o),qn(e,o)+1).join("")},Cr.trimEnd=function(t,n,r){if((t=aa(t))&&(r||n===u))return t.slice(0,tr(t)+1);if(!t||!(n=Ye(n)))return t;var e=Xn(t);return cu(e,0,qn(e,Xn(n))+1).join("")},Cr.trimStart=function(t,n,r){if((t=aa(t))&&(r||n===u))return t.replace(nt,"");if(!t||!(n=Ye(n)))return t;var e=Xn(t);return cu(e,Dn(e,Xn(n))).join("")},Cr.truncate=function(t,n){var r=30,e="...";if(qi(n)){var o="separator"in n?n.separator:o;r="length"in n?ea(n.length):r,e="omission"in n?Ye(n.omission):e}var i=(t=aa(t)).length;if(Hn(t)){var a=Xn(t);i=a.length}if(r>=i)return t;var c=r-Qn(e);if(c<1)return e;var f=a?cu(a,0,c).join(""):t.slice(0,c);if(o===u)return f+e;if(a&&(c+=f.length-c),Vi(o)){if(t.slice(c).search(o)){var l,s=f;for(o.global||(o=kt(o.source,aa(lt.exec(o))+"g")),o.lastIndex=0;l=o.exec(s);)var p=l.index;f=f.slice(0,p===u?c:p)}}else if(t.indexOf(Ye(o),c)!=c){var h=f.lastIndexOf(o);h>-1&&(f=f.slice(0,h))}return f+e},Cr.unescape=function(t){return(t=aa(t))&&Z.test(t)?t.replace(q,nr):t},Cr.uniqueId=function(t){var n=++zt;return aa(t)+n},Cr.upperCase=Pa,Cr.upperFirst=Ma,Cr.each=ai,Cr.eachRight=ci,Cr.first=No,Ja(Cr,(ic={},pe(Cr,function(t,n){It.call(Cr.prototype,n)||(ic[n]=t)}),ic),{chain:!1}),Cr.VERSION="4.17.21",dn(["bind","bindKey","curry","curryRight","partial","partialRight"],function(t){Cr[t].placeholder=Cr}),dn(["drop","take"],function(t,n){Pr.prototype[t]=function(r){r=r===u?1:pr(ea(r),0);var e=this.__filtered__&&!n?new Pr(this):this.clone();return e.__filtered__?e.__takeCount__=hr(r,e.__takeCount__):e.__views__.push({size:hr(r,s),type:t+(e.__dir__<0?"Right":"")}),e},Pr.prototype[t+"Right"]=function(n){return this.reverse()[t](n).reverse()}}),dn(["filter","map","takeWhile"],function(t,n){var r=n+1,e=1==r||3==r;Pr.prototype[t]=function(t){var n=this.clone();return n.__iteratees__.push({iteratee:Gu(t,3),type:r}),n.__filtered__=n.__filtered__||e,n}}),dn(["head","last"],function(t,n){var r="take"+(n?"Right":"");Pr.prototype[t]=function(){return this[r](1).value()[0]}}),dn(["initial","tail"],function(t,n){var r="drop"+(n?"":"Right");Pr.prototype[t]=function(){return this.__filtered__?new Pr(this):this[r](1)}}),Pr.prototype.compact=function(){return this.filter(Ka)},Pr.prototype.find=function(t){return this.filter(t).head()},Pr.prototype.findLast=function(t){return this.reverse().find(t)},Pr.prototype.invokeMap=$e(function(t,n){return"function"==typeof t?new Pr(this):this.map(function(r){return xe(r,t,n)})}),Pr.prototype.reject=function(t){return this.filter(ji(Gu(t)))},Pr.prototype.slice=function(t,n){t=ea(t);var r=this;return r.__filtered__&&(t>0||n<0)?new Pr(r):(t<0?r=r.takeRight(-t):t&&(r=r.drop(t)),n!==u&&(r=(n=ea(n))<0?r.dropRight(-n):r.take(n-t)),r)},Pr.prototype.takeRightWhile=function(t){return this.reverse().takeWhile(t).reverse()},Pr.prototype.toArray=function(){return this.take(s)},pe(Pr.prototype,function(t,n){var r=/^(?:filter|find|map|reject)|While$/.test(n),e=/^(?:head|last)$/.test(n),o=Cr[e?"take"+("last"==n?"Right":""):n],i=e||/^find/.test(n);o&&(Cr.prototype[n]=function(){var n=this.__wrapped__,a=e?[1]:arguments,c=n instanceof Pr,f=a[0],l=c||Li(n),s=function(t){var n=o.apply(Cr,xn([t],a));return e&&p?n[0]:n};l&&r&&"function"==typeof f&&1!=f.length&&(c=l=!1);var p=this.__chain__,h=!!this.__actions__.length,v=i&&!p,g=c&&!h;if(!i&&l){n=g?n:new Pr(this);var d=t.apply(n,a);return d.__actions__.push({func:ri,args:[s],thisArg:u}),new Ur(d,p)}return v&&g?t.apply(this,a):(d=this.thru(s),v?e?d.value()[0]:d.value():d)})}),dn(["pop","push","shift","sort","splice","unshift"],function(t){var n=St[t],r=/^(?:push|sort|unshift)$/.test(t)?"tap":"thru",e=/^(?:pop|shift)$/.test(t);Cr.prototype[t]=function(){var t=arguments;if(e&&!this.__chain__){var u=this.value();return n.apply(Li(u)?u:[],t)}return this[r](function(r){return n.apply(Li(r)?r:[],t)})}}),pe(Pr.prototype,function(t,n){var r=Cr[n];if(r){var e=r.name+"";It.call(Ar,e)||(Ar[e]=[]),Ar[e].push({name:n,func:r})}}),Ar[Eu(u,2).name]=[{name:"wrapper",func:u}],Pr.prototype.clone=function(){var t=new Pr(this.__wrapped__);return t.__actions__=du(this.__actions__),t.__dir__=this.__dir__,t.__filtered__=this.__filtered__,t.__iteratees__=du(this.__iteratees__),t.__takeCount__=this.__takeCount__,t.__views__=du(this.__views__),t},Pr.prototype.reverse=function(){if(this.__filtered__){var t=new Pr(this);t.__dir__=-1,t.__filtered__=!0}else(t=this.clone()).__dir__*=-1;return t},Pr.prototype.value=function(){var t=this.__wrapped__.value(),n=this.__dir__,r=Li(t),e=n<0,u=r?t.length:0,o=function(t,n,r){for(var e=-1,u=r.length;++e<u;){var o=r[e],i=o.size;switch(o.type){case"drop":t+=i;break;case"dropRight":n-=i;break;case"take":n=hr(n,t+i);break;case"takeRight":t=pr(t,n-i)}}return{start:t,end:n}}(0,u,this.__views__),i=o.start,a=o.end,c=a-i,f=e?a:i-1,l=this.__iteratees__,s=l.length,p=0,h=hr(c,this.__takeCount__);if(!r||!e&&u==c&&h==c)return ru(t,this.__actions__);var v=[];t:for(;c--&&p<h;){for(var g=-1,d=t[f+=n];++g<s;){var _=l[g],y=_.iteratee,b=_.type,m=y(d);if(2==b)d=m;else if(!m){if(1==b)continue t;break t}}v[p++]=d}return v},Cr.prototype.at=ei,Cr.prototype.chain=function(){return ni(this)},Cr.prototype.commit=function(){return new Ur(this.value(),this.__chain__)},Cr.prototype.next=function(){this.__values__===u&&(this.__values__=na(this.value()));var t=this.__index__>=this.__values__.length;return{done:t,value:t?u:this.__values__[this.__index__++]}},Cr.prototype.plant=function(t){for(var n,r=this;r instanceof Wr;){var e=Oo(r);e.__index__=0,e.__values__=u,n?o.__wrapped__=e:n=e;var o=e;r=r.__wrapped__}return o.__wrapped__=t,n},Cr.prototype.reverse=function(){var t=this.__wrapped__;if(t instanceof Pr){var n=t;return this.__actions__.length&&(n=new Pr(this)),(n=n.reverse()).__actions__.push({func:ri,args:[qo],thisArg:u}),new Ur(n,this.__chain__)}return this.thru(qo)},Cr.prototype.toJSON=Cr.prototype.valueOf=Cr.prototype.value=function(){return ru(this.__wrapped__,this.__actions__)},Cr.prototype.first=Cr.prototype.head,on&&(Cr.prototype[on]=function(){return this}),Cr}();nn._=rr,(e=function(){return rr}.call(n,r,n,t))===u||(t.exports=e)}.call(this)},885(){}},r={};function e(t){var u=r[t];if(void 0!==u)return u.exports;var o=r[t]={id:t,loaded:!1,exports:{}};return n[t].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}e.m=n,t=[],e.O=((n,r,u,o)=>{if(!r){var i=1/0;for(l=0;l<t.length;l++){for(var[r,u,o]=t[l],a=!0,c=0;c<r.length;c++)i>=o&&Object.keys(e.O).every(t=>e.O[t](r[c]))?r.splice(c--,1):(a=!1,o<i&&(i=o));if(a){t.splice(l--,1);var f=u();void 0!==f&&(n=f)}}return n}o=o||0;for(var l=t.length;l>0&&t[l-1][2]>o;l--)t[l]=t[l-1];t[l]=[r,u,o]}),e.n=(t=>{var n=t&&t.__esModule?()=>t.default:()=>t;return e.d(n,{a:n}),n}),e.d=((t,n)=>{for(var r in n)e.o(n,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:n[r]})}),e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(t){if("object"==typeof window)return window}}(),e.o=((t,n)=>Object.prototype.hasOwnProperty.call(t,n)),e.nmd=(t=>(t.paths=[],t.children||(t.children=[]),t)),(()=>{var t={353:0,433:0};e.O.j=(n=>0===t[n]);var n=(n,r)=>{var u,o,[i,a,c]=r,f=0;if(i.some(n=>0!==t[n])){for(u in a)e.o(a,u)&&(e.m[u]=a[u]);if(c)var l=c(e)}for(n&&n(r);f<i.length;f++)o=i[f],e.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return e.O(l)},r=self.webpackChunkguest_invitation_form=self.webpackChunkguest_invitation_form||[];r.forEach(n.bind(null,0)),r.push=n.bind(null,r.push.bind(r))})(),e.O(void 0,[433],()=>e(874));var u=e.O(void 0,[433],()=>e(885));u=e.O(u)})();

/*! elementor-pro - v3.28.0 - 05-05-2025 */
"use strict";(self.webpackChunkelementor_pro=self.webpackChunkelementor_pro||[]).push([[624],{2371:(e,t,n)=>{var o=n(6784),s=o(n(6137)),r=o(n(7371)),l=o(n(3746)),i=o(n(9880)),a=o(n(6238)),d=o(n(4286)),u=o(n(4043)),c=o(n(1750)),m=o(n(4486)),h=o(n(1459)),g=o(n(8534)),f=o(n(6034)),p=o(n(6075)),_=o(n(570)),v=o(n(9302)),b=o(n(6302)),y=o(n(7492)),F=o(n(8241)),M=o(n(325)),w=o(n(7467)),S=o(n(1953)),H=o(n(282)),E=o(n(2969)),O=o(n(5355)),T=o(n(8945));const extendDefaultHandlers=e=>({...e,...{animatedText:s.default,carousel:r.default,countdown:l.default,dynamicTags:i.default,hotspot:a.default,form:d.default,gallery:u.default,lottie:c.default,nav_menu:m.default,popup:h.default,posts:g.default,share_buttons:f.default,slides:p.default,social:_.default,themeBuilder:b.default,themeElements:y.default,woocommerce:F.default,tableOfContents:v.default,loopBuilder:M.default,megaMenu:w.default,nestedCarousel:S.default,taxonomyFilter:H.default,offCanvas:E.default,contactButtons:O.default,search:T.default}});elementorProFrontend.on("elementor-pro/modules/init/before",(()=>{elementorFrontend.hooks.addFilter("elementor-pro/frontend/handlers",extendDefaultHandlers)}))},4921:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=class AjaxHelper{addLoadingAnimationOverlay(e){const t=document.querySelector(`.elementor-element-${e}`);t&&t.classList.add("e-loading-overlay")}removeLoadingAnimationOverlay(e){const t=document.querySelector(`.elementor-element-${e}`);t&&t.classList.remove("e-loading-overlay")}}},6914:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.focusableElementSelectors=function focusableElementSelectors(){return"audio, button, canvas, details, iframe, input, select, summary, textarea, video, [accesskey], a[href], area[href], [tabindex]"}},5921:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.close=void 0;const s=new(o(n(5194)).default)("eicon");t.close={get element(){return s.createSvgElement("close",{path:"M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z",width:1e3,height:1e3})}}},5194:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class IconsManager{static symbolsContainer;static iconsUsageList=[];constructor(e){if(this.prefix=`${e}-`,!IconsManager.symbolsContainer){const e="e-font-icon-svg-symbols";IconsManager.symbolsContainer=document.getElementById(e),IconsManager.symbolsContainer||(IconsManager.symbolsContainer=document.createElementNS("http://www.w3.org/2000/svg","svg"),IconsManager.symbolsContainer.setAttributeNS(null,"style","display: none;"),IconsManager.symbolsContainer.setAttributeNS(null,"class",e),document.body.appendChild(IconsManager.symbolsContainer))}}createSvgElement(e,t){let{path:n,width:o,height:s}=t;const r=this.prefix+e,l="#"+this.prefix+e;if(!IconsManager.iconsUsageList.includes(r)){if(!IconsManager.symbolsContainer.querySelector(l)){const e=document.createElementNS("http://www.w3.org/2000/svg","symbol");e.id=r,e.innerHTML='<path d="'+n+'"></path>',e.setAttributeNS(null,"viewBox","0 0 "+o+" "+s),IconsManager.symbolsContainer.appendChild(e)}IconsManager.iconsUsageList.push(r)}const i=document.createElementNS("http://www.w3.org/2000/svg","svg");return i.innerHTML='<use xlink:href="'+l+'" />',i.setAttributeNS(null,"class","e-font-icon-svg e-"+r),i}}t.default=IconsManager},7754:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n(6914);t.default=class ModalKeyboardHandler{lastFocusableElement=null;firstFocusableElement=null;modalTriggerElement=null;constructor(e){this.config=e,this.changeFocusAfterAnimation=!1}onOpenModal(){this.initializeElements(),this.setTriggerElement(),this.changeFocusAfterAnimation="popup"===this.config.modalType&&!!this.config.hasEntranceAnimation,this.changeFocusAfterAnimation||this.changeFocus(),this.bindEvents()}onCloseModal(){elementorFrontend.elements.$window.off("keydown",this.onKeyDownPressed.bind(this)),this.modalTriggerElement&&this.setFocusToElement(this.modalTriggerElement)}bindEvents(){elementorFrontend.elements.$window.on("keydown",this.onKeyDownPressed.bind(this)),this.changeFocusAfterAnimation&&this.config.$modalElements.on("animationend animationcancel",this.changeFocus.bind(this)),"popup"===this.config.modalType&&this.onPopupCloseEvent()}onPopupCloseEvent(){elementorFrontend.elements.$window.on("elementor/popup/hide",this.onCloseModal.bind(this))}getFocusableElements(){const e="popup"===this.config.modalType?":focusable":(0,o.focusableElementSelectors)();return this.config.$modalElements.find(e)}initializeElements(){const e=this.getFocusableElements();e.length&&(this.lastFocusableElement=e[e.length-1],this.firstFocusableElement=e[0])}setTriggerElement(){const e=elementorFrontend.elements.window.document.activeElement;this.modalTriggerElement=e?elementorFrontend.elements.window.document.activeElement:null}changeFocus(){this.firstFocusableElement?this.setFocusToElement(this.firstFocusableElement):(this.config.$elementWrapper.attr("tabindex","0"),this.setFocusToElement(this.config.$elementWrapper[0]))}onKeyDownPressed(e){const t=e.shiftKey,n="Tab"===e.key||9===e.keyCode,o="0"===this.config.$elementWrapper.attr("tabindex");n&&o?e.preventDefault():n&&this.onTabKeyPressed(n,t,e)}onTabKeyPressed(e,t,n){elementorFrontend.isEditMode()&&this.initializeElements();const o=elementorFrontend.elements.window.document.activeElement;if(t){o===this.firstFocusableElement&&(this.setFocusToElement(this.lastFocusableElement),n.preventDefault())}else{o===this.lastFocusableElement&&(this.setFocusToElement(this.firstFocusableElement),n.preventDefault())}}setFocusToElement(e){const t="popup"===this.config.modalType?250:100;setTimeout((()=>{e?.focus()}),t)}}},5012:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=function runElementHandlers(e){[...e].flatMap((e=>[...e.querySelectorAll(".elementor-element")])).forEach((e=>elementorFrontend.elementsHandler.runReadyTrigger(e)))}},6137:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("animated-headline",(()=>n.e(961).then(n.bind(n,2590))))}}t.default=_default},7371:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("media-carousel",(()=>n.e(692).then(n.bind(n,8948)))),elementorFrontend.elementsHandler.attachHandler("testimonial-carousel",(()=>n.e(897).then(n.bind(n,7181)))),elementorFrontend.elementsHandler.attachHandler("reviews",(()=>n.e(897).then(n.bind(n,7181))))}}t.default=_default},3746:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("countdown",(()=>n.e(416).then(n.bind(n,475))))}}t.default=_default},9880:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.on("components:init",(()=>this.onFrontendComponentsInit()))}onFrontendComponentsInit(){elementorFrontend.utils.urlActions.addAction("reload-page",(()=>document.location.reload()))}}t.default=_default},5355:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.config.experimentalFeatures.container&&(["contact-buttons-var-1","contact-buttons-var-3","contact-buttons-var-4","contact-buttons-var-5","contact-buttons-var-6","contact-buttons-var-7","contact-buttons-var-8","contact-buttons-var-9"].forEach((e=>{elementorFrontend.elementsHandler.attachHandler(e,(()=>n.e(1).then(n.bind(n,197))))})),elementorFrontend.elementsHandler.attachHandler("contact-buttons-var-10",(()=>n.e(61).then(n.bind(n,7263)))),elementorFrontend.elementsHandler.attachHandler("floating-bars-var-2",(()=>n.e(249).then(n.bind(n,2319)))),elementorFrontend.elementsHandler.attachHandler("floating-bars-var-3",(()=>n.e(440).then(n.bind(n,7704)))))}}t.default=_default},4286:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("form",[()=>n.e(325).then(n.bind(n,9230)),()=>n.e(325).then(n.bind(n,2176)),()=>n.e(325).then(n.bind(n,9613)),()=>n.e(325).then(n.bind(n,2478)),()=>n.e(325).then(n.bind(n,733)),()=>n.e(325).then(n.bind(n,6935))]),elementorFrontend.elementsHandler.attachHandler("subscribe",[()=>n.e(325).then(n.bind(n,9230)),()=>n.e(325).then(n.bind(n,2176)),()=>n.e(325).then(n.bind(n,9613))])}}t.default=_default},4043:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("gallery",(()=>n.e(543).then(n.bind(n,771))))}}t.default=_default},6238:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("hotspot",(()=>n.e(292).then(n.bind(n,507))))}}t.default=_default},325:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),["post","product","post_taxonomy","product_taxonomy"].forEach((e=>{elementorFrontend.elementsHandler.attachHandler("loop-grid",(()=>n.e(535).then(n.bind(n,2245))),e),elementorFrontend.elementsHandler.attachHandler("loop-grid",(()=>n.e(993).then(n.bind(n,2813))),e),elementorFrontend.elementsHandler.attachHandler("loop-carousel",(()=>n.e(993).then(n.bind(n,2813))),e),elementorFrontend.elementsHandler.attachHandler("loop-carousel",(()=>n.e(932).then(n.bind(n,7992))),e),elementorFrontend.elementsHandler.attachHandler("loop-grid",(()=>n.e(550).then(n.bind(n,4734))),e)}))}}t.default=_default},9585:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(5012)),r=o(n(4921)),l=o(n(1368)),i=n(275);class BaseFilterFrontendModule extends elementorModules.Module{constructor(){super(),this.loopWidgetsStore=new l.default}removeFilterFromLoopWidget(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";if(!this.loopWidgetsStore.getWidget(e))return this.loopWidgetsStore.addWidget(e),void this.refreshLoopWidget(e,t);if(n===o&&this.loopWidgetsStore.unsetFilter(e,t),n!==o){const o=this.loopWidgetsStore.getFilterTerms(e,t).filter((function(e){return e!==n}));this.loopWidgetsStore.setFilterTerms(e,t,o)}this.refreshLoopWidget(e,t)}setFilterDataForLoopWidget(e,t,n){let o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"DISABLED";this.loopWidgetsStore.maybeInitializeWidget(e),this.loopWidgetsStore.maybeInitializeFilter(e,t);const r=this.validateMultipleFilterOperator(s);if("DISABLED"!==r){const o=this.loopWidgetsStore.getFilterTerms(e,t)??[],s=n.filterData.terms;n.filterData.terms=[...new Set([...o,...s])],n.filterData.logicalJoin=r}this.loopWidgetsStore.setFilter(e,t,n),o?this.refreshLoopWidget(e,t):this.loopWidgetsStore.consolidateFilters(e)}validateMultipleFilterOperator(e){return e&&["AND","OR"].includes(e)?e:"DISABLED"}getQueryStringInObjectForm(){const e={};for(const t in this.loopWidgetsStore.get()){const n=this.loopWidgetsStore.getWidget(t);for(const o in n.consolidatedFilters){const s=n.consolidatedFilters[o];for(const n in s){const o=i.queryConstants[s[n].logicalJoin??"AND"].separator.decoded;e[`e-filter-${t}-${n}`]=Object.values(s[n].terms).join(o)}}}return e}updateURLQueryString(e,t){const n=new URL(window.location.href).searchParams,o=this.getQueryStringInObjectForm(),s=new URLSearchParams;n.forEach(((t,n)=>{n.startsWith("e-filter")||s.append(n,t),n.startsWith("e-page-"+e)&&s.delete(n)}));for(const e in o)s.set(e,o[e]);let r=s.toString();r=r.replace(new RegExp(`${i.queryConstants.AND.separator.encoded}`,"g"),i.queryConstants.AND.separator.decoded),r=r.replace(new RegExp(`${i.queryConstants.OR.separator.encoded}`,"g"),i.queryConstants.OR.separator.decoded);const l=this.getFilterHelperAttributes(t);r=l.pageNum>1?r?this.formatQueryString(l.baseUrl,r):l.baseUrl:r?`?${r}`:location.pathname,history.pushState(null,null,r)}formatQueryString(e,t){const n=e.includes("?")?new URLSearchParams(e.split("?")[1]):new URLSearchParams,o=new URLSearchParams(t);for(const e of n.keys())o.has(e)&&o.delete(e);const s=["page","paged"];for(const e of s)n.delete(e),o.delete(e);const r=new URLSearchParams(n.toString());for(const[e,t]of o.entries())r.append(e,t);return e.split("?")[0]+(r.toString()?`?${r.toString()}`:"")}getFilterHelperAttributes(e){const t=document.querySelector('[data-id="'+e+'"]');if(!t)return{baseUrl:location.href,pageNum:1};return t.querySelector(".e-filter").dataset}prepareLoopUpdateRequestData(e,t){const n=this.loopWidgetsStore.getConsolidatedFilters(e),o=this.getFilterHelperAttributes(t),s={post_id:this.getClosestDataElementorId(document.querySelector(`.elementor-element-${e}`))||elementorFrontend.config.post.id,widget_filters:n,widget_id:e,pagination_base_url:o.baseUrl};if(elementorFrontend.isEditMode()){const t=window.top.$e.components.get("document").utils.findContainerById(e);s.widget_model=t.model.toJSON({remove:["default","editSettings","defaultEditSettings"]}),s.is_edit_mode=!0}return s}getClosestDataElementorId(e){const t=e?.closest("[data-elementor-id]");return t?t.getAttribute("data-elementor-id"):null}getFetchArgumentsForLoopUpdate(e,t){const n=this.prepareLoopUpdateRequestData(e,t),o={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)};return elementorFrontend.isEditMode()&&elementorPro.config.loopFilter?.nonce&&(o.headers["X-WP-Nonce"]=elementorPro.config.loopFilter?.nonce),o}fetchUpdatedLoopWidgetMarkup(e,t){return fetch(`${elementorProFrontend.config.urls.rest}elementor-pro/v1/refresh-loop`,this.getFetchArgumentsForLoopUpdate(e,t))}createFragmentFromHTMLString(e){const t=document.createElement("template");return t.innerHTML=e.trim(),t.content}refreshLoopWidget(e,t){this.loopWidgetsStore.consolidateFilters(e),this.updateURLQueryString(e,t);const n=document.querySelector(`.elementor-element-${e}`);if(!n)return;this.ajaxHelper||(this.ajaxHelper=new r.default),this.ajaxHelper.addLoadingAnimationOverlay(e);return this.fetchUpdatedLoopWidgetMarkup(e,t).then((e=>e instanceof Response&&e?.ok&&!(400<=e?.status)?e.json():{})).catch((()=>({}))).then((t=>{if(!t?.data&&""!==t?.data)return;const o=this.createFragmentFromHTMLString(t.data);Array.from(o.children).forEach((e=>{const t=e.className?`.${e.className.split(" ").join(".")}`:`#${e.id}`,o=n.querySelector(t);o&&o.parentNode.replaceChild(e,o)})),this.handleElementHandlers(n),ElementorProFrontendConfig.settings.lazy_load_background_images&&document.dispatchEvent(new Event("elementor/lazyload/observe")),elementorFrontend.elementsHandler.runReadyTrigger(document.querySelector(`.elementor-element-${e}`)),n.classList.remove("e-loading")})).finally((()=>{this.ajaxHelper.removeLoadingAnimationOverlay(e)}))}handleElementHandlers(e){const t=e.querySelectorAll(".e-loop-item");(0,s.default)(t)}}t.default=BaseFilterFrontendModule},282:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(9585));class LoopFilter extends s.default{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("taxonomy-filter",(()=>n.e(225).then(n.bind(n,2236))))}}t.default=LoopFilter},1368:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=class LoopWidgetsStore{constructor(){this.widgets={}}get(){return this.widgets}getWidget(e){return this.widgets[e]}setWidget(e,t){this.widgets[e]=t}unsetWidget(e){delete this.widgets[e]}getFilters(e){return this.getWidget(e).filters}getFilter(e,t){return this.getWidget(e).filters[t]}setFilter(e,t,n){this.getWidget(e).filters[t]=n}unsetFilter(e,t){delete this.getWidget(e).filters[t]}getFilterTerms(e,t){return this.getFilter(e,t).filterData.terms??[]}setFilterTerms(e,t,n){this.getFilter(e,t).filterData.terms=n}getConsolidatedFilters(e){return this.getWidget(e).consolidatedFilters}setConsolidatedFilters(e,t){this.getWidget(e).consolidatedFilters=t}addWidget(e){this.setWidget(e,{filters:{},consolidatedFilters:{}})}maybeInitializeWidget(e){this.getWidget(e)||this.addWidget(e)}maybeInitializeFilter(e,t){if(this.getFilter(e,t))return;this.setFilter(e,t,{filterData:{terms:[]}})}consolidateFilters(e){const t=this.getFilters(e),n={};for(const e in t){const o=t[e],s=o.filterType,r=o.filterData;0!==r.terms.length&&(n[s]||(n[s]={}),n[s][r.selectedTaxonomy]||(n[s][r.selectedTaxonomy]=[]),!r.terms||n[s][r.selectedTaxonomy].terms&&n[s][r.selectedTaxonomy].terms.includes(r.terms)||(n[s][r.selectedTaxonomy]={terms:"string"===r.terms?[r.terms]:r.terms}),r.logicalJoin&&!n[s][r.selectedTaxonomy].logicalJoin&&(n[s][r.selectedTaxonomy]={...n[s][r.selectedTaxonomy]||{},logicalJoin:r.logicalJoin??"AND"}))}this.setConsolidatedFilters(e,n)}}},275:e=>{e.exports={queryConstants:{AND:{separator:{decoded:"+",fromBrowser:" ",encoded:"%2B"},operator:"AND"},OR:{separator:{decoded:"~",fromBrowser:"~",encoded:"%7C"},operator:"IN"},NOT:{separator:{decoded:"!",fromBrowser:"!",encoded:"%21"},operator:"NOT IN"},DISABLED:{separator:{decoded:"",fromBrowser:"",encoded:""},operator:"AND"}}}},1750:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("lottie",(()=>n.e(970).then(n.bind(n,5200))))}}t.default=_default},7467:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("mega-menu",[()=>n.e(727).then(n.bind(n,3431)),()=>n.e(87).then(n.bind(n,8636)),()=>n.e(912).then(n.bind(n,9774))])}}t.default=_default},4486:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),jQuery.fn.smartmenus&&(jQuery.SmartMenus.prototype.isCSSOn=function(){return!0},elementorFrontend.config.is_rtl&&(jQuery.fn.smartmenus.defaults.rightToLeftSubMenus=!0)),elementorFrontend.elementsHandler.attachHandler("nav-menu",(()=>n.e(334).then(n.bind(n,757))))}}t.default=_default},1953:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("nested-carousel",(()=>n.e(33).then(n.bind(n,1195))))}}t.default=_default},2969:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("off-canvas",(()=>n.e(579).then(n.bind(n,9547)))),elementorFrontend.on("components:init",(()=>this.onFrontendComponentsInit()))}onFrontendComponentsInit(){this.addUrlActions()}addUrlActions(){elementorFrontend.utils.urlActions.addAction("off_canvas:open",(e=>{this.toggleOffCanvasDisplay(e)})),elementorFrontend.utils.urlActions.addAction("off_canvas:close",(e=>{this.toggleOffCanvasDisplay(e)})),elementorFrontend.utils.urlActions.addAction("off_canvas:toggle",(e=>{this.toggleOffCanvasDisplay(e)}))}toggleOffCanvasDisplay(e){window.dispatchEvent(new CustomEvent("elementor-pro/off-canvas/toggle-display-mode",{detail:e}))}}t.default=_default},2506:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(3758)),r=o(n(5469)),l=n(5921),i=o(n(7754));class _default extends elementorModules.frontend.Document{keyboardHandler=null;bindEvents(){const e=this.getDocumentSettings("open_selector");e&&elementorFrontend.elements.$body.on("click",e,this.showModal.bind(this))}startTiming(){new r.default(this.getDocumentSettings("timing"),this).check()&&this.initTriggers()}initTriggers(){this.triggers=new s.default(this.getDocumentSettings("triggers"),this)}showModal(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];const n=this.getDocumentSettings();if(!this.isEdit){if(!elementorFrontend.isWPPreviewMode()){if(this.getStorage("disable"))return;if(t&&elementorProFrontend.modules.popup.popupPopped&&n.avoid_multiple_popups)return}this.$element=jQuery(this.elementHTML),this.elements.$elements=this.$element.find(this.getSettings("selectors.elements"))}const o=this.getModal(),s=o.getElements("closeButton");o.setMessage(this.$element).show(),this.isEdit||(n.close_button_delay&&(s.hide(),clearTimeout(this.closeButtonTimeout),this.closeButtonTimeout=setTimeout((()=>s.show()),1e3*n.close_button_delay)),super.runElementsHandlers()),this.setEntranceAnimation(),n.timing&&n.timing.times_count||this.countTimes(),elementorProFrontend.modules.popup.popupPopped=!0,!this.isEdit&&n.a11y_navigation&&this.handleKeyboardA11y()}setEntranceAnimation(){const e=this.getModal().getElements("widgetContent"),t=this.getDocumentSettings(),n=elementorFrontend.getCurrentDeviceSetting(t,"entrance_animation");if(this.currentAnimation&&e.removeClass(this.currentAnimation),this.currentAnimation=n,!n)return;const o=t.entrance_animation_duration.size;e.addClass(n),setTimeout((()=>e.removeClass(n)),1e3*o)}handleKeyboardA11y(){this.keyboardHandler||(this.keyboardHandler=new i.default(this.getKeyboardHandlingConfig())),this.keyboardHandler.onOpenModal()}setExitAnimation(){const e=this.getModal(),t=this.getDocumentSettings(),n=e.getElements("widgetContent"),o=elementorFrontend.getCurrentDeviceSetting(t,"exit_animation"),s=o?t.entrance_animation_duration.size:0;setTimeout((()=>{o&&n.removeClass(o+" reverse"),this.isEdit||(this.$element.remove(),e.getElements("widget").hide())}),1e3*s),o&&n.addClass(o+" reverse")}initModal(){let e;this.getModal=()=>{if(!e){const t=this.getDocumentSettings(),n=this.getSettings("id"),triggerPopupEvent=e=>{const t="elementor/popup/"+e;elementorFrontend.elements.$document.trigger(t,[n,this]),window.dispatchEvent(new CustomEvent(t,{detail:{id:n,instance:this}}))};let o="elementor-popup-modal";t.classes&&(o+=" "+t.classes);const s={id:"elementor-popup-modal-"+n,className:o,closeButton:!0,preventScroll:t.prevent_scroll,onShow:()=>triggerPopupEvent("show"),onHide:()=>triggerPopupEvent("hide"),effects:{hide:()=>{t.timing&&t.timing.times_count&&this.countTimes(),this.setExitAnimation()},show:"show"},hide:{auto:!!t.close_automatically,autoDelay:1e3*t.close_automatically,onBackgroundClick:!t.prevent_close_on_background_click,onOutsideClick:!t.prevent_close_on_background_click,onEscKeyPress:!t.prevent_close_on_esc_key,ignore:".flatpickr-calendar"},position:{enable:!1}};elementorFrontend.config.experimentalFeatures.e_font_icon_svg&&(s.closeButtonOptions={iconElement:l.close.element}),s.closeButtonClass="eicon-close",e=elementorFrontend.getDialogsManager().createWidget("lightbox",s),e.getElements("widgetContent").addClass("animated");const r=e.getElements("closeButton");this.isEdit&&(r.off("click"),e.hide=()=>{}),this.setCloseButtonPosition()}return e}}setCloseButtonPosition(){const e=this.getModal(),t=this.getDocumentSettings("close_button_position");e.getElements("closeButton").prependTo(e.getElements("outside"===t?"widget":"widgetContent"))}disable(){this.setStorage("disable",!0)}setStorage(e,t,n){elementorFrontend.storage.set(`popup_${this.getSettings("id")}_${e}`,t,n)}getStorage(e,t){return elementorFrontend.storage.get(`popup_${this.getSettings("id")}_${e}`,t)}countTimes(){const e=this.getStorage("times")||0;this.setStorage("times",e+1)}runElementsHandlers(){}async onInit(){super.onInit(),window.DialogsManager||await elementorFrontend.utils.assetsLoader.load("script","dialog"),this.initModal(),this.isEdit?this.showModal():(this.$element.show().remove(),this.elementHTML=this.$element[0].outerHTML,elementorFrontend.isEditMode()||(elementorFrontend.isWPPreviewMode()&&elementorFrontend.config.post.id===this.getSettings("id")?this.showModal():this.startTiming()))}onSettingsChange(e){const t=Object.keys(e.changed)[0];-1!==t.indexOf("entrance_animation")&&this.setEntranceAnimation(),"exit_animation"===t&&this.setExitAnimation(),"close_button_position"===t&&this.setCloseButtonPosition()}getEntranceAnimationDuration(){const e=this.getDocumentSettings(),t=e?.entrance_animation;if(!t||""===t||"none"===t)return 0;const n=e?.entrance_animation_duration?.size;return n?Number(n):0}getKeyboardHandlingConfig(){return{$modalElements:this.getModal().getElements("widgetContent"),$elementWrapper:this.$element,hasEntranceAnimation:0!==this.getEntranceAnimationDuration(),modalType:"popup",modalId:this.$element.data("elementor-id")}}}t.default=_default},1459:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2506));class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.hooks.addAction("elementor/frontend/documents-manager/init-classes",this.addDocumentClass),elementorFrontend.elementsHandler.attachHandler("form",(()=>n.e(887).then(n.bind(n,5985)))),elementorFrontend.on("components:init",(()=>this.onFrontendComponentsInit())),this.shouldSetViewsAndSessions()&&this.setViewsAndSessions()}shouldSetViewsAndSessions(){return!elementorFrontend.isEditMode()&&!elementorFrontend.isWPPreviewMode()&&ElementorProFrontendConfig.popup.hasPopUps}addDocumentClass(e){e.addDocumentClass("popup",s.default)}setViewsAndSessions(){const e=elementorFrontend.storage.get("pageViews")||0;elementorFrontend.storage.set("pageViews",e+1);if(!elementorFrontend.storage.get("activeSession",{session:!0})){elementorFrontend.storage.set("activeSession",!0,{session:!0});const e=elementorFrontend.storage.get("sessions")||0;elementorFrontend.storage.set("sessions",e+1)}}showPopup(e,t){const n=elementorFrontend.documentsManager.documents[e.id];if(!n)return;const o=n.getModal();e.toggle&&o.isVisible()?o.hide():n.showModal(t)}closePopup(e,t){const n=jQuery(t.target).parents('[data-elementor-type="popup"]').data("elementorId");if(!n)return;const o=elementorFrontend.documentsManager.documents[n];o.getModal().hide(),e.do_not_show_again&&o.disable()}onFrontendComponentsInit(){elementorFrontend.utils.urlActions.addAction("popup:open",((e,t)=>this.showPopup(e,t))),elementorFrontend.utils.urlActions.addAction("popup:close",((e,t)=>this.closePopup(e,t)))}}t.default=_default},5469:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(164)),r=o(n(5873)),l=o(n(7471)),i=o(n(2880)),a=o(n(5104)),d=o(n(1837)),u=o(n(3940)),c=o(n(1533)),m=o(n(8254));class _default extends elementorModules.Module{constructor(e,t){super(e),this.document=t,this.timingClasses={page_views:s.default,sessions:r.default,url:l.default,sources:i.default,logged_in:a.default,devices:d.default,times:u.default,browsers:c.default,schedule:m.default}}check(){const e=this.getSettings();let t=!0;return jQuery.each(this.timingClasses,((n,o)=>{if(!e[n])return;new o(e,this.document).check()||(t=!1)})),t}}t.default=_default},2733:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(e,t){super(e),this.document=t}getTimingSetting(e){return this.getSettings(this.getName()+"_"+e)}}t.default=_default},1533:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733));class _default extends s.default{getName(){return"browsers"}check(){if("all"===this.getTimingSetting("browsers"))return!0;const e=this.getTimingSetting("browsers_options"),t=elementorFrontend.utils.environment;return e.some((e=>t[e]))}}t.default=_default},1837:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733));class _default extends s.default{getName(){return"devices"}check(){return-1!==this.getTimingSetting("devices").indexOf(elementorFrontend.getCurrentDeviceMode())}}t.default=_default},5104:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733));class _default extends s.default{getName(){return"logged_in"}check(){const e=elementorFrontend.config.user;if(!e)return!0;if("all"===this.getTimingSetting("users"))return!1;return!this.getTimingSetting("roles").filter((t=>-1!==e.roles.indexOf(t))).length}}t.default=_default},164:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733));class _default extends s.default{getName(){return"page_views"}check(){const e=elementorFrontend.storage.get("pageViews"),t=this.getName();let n=this.document.getStorage(t+"_initialPageViews");return n||(this.document.setStorage(t+"_initialPageViews",e),n=e),e-n>=this.getTimingSetting("views")}}t.default=_default},9901:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=class ScheduleUtils{constructor(e){this.settings=e.settings}getCurrentDateTime(){let e=new Date;return"site"===this.settings.timezone&&this.settings.serverDatetime&&(e=new Date(this.settings.serverDatetime)),e}shouldDisplay=()=>{if(!this.settings.startDate&&!this.settings.endDate)return!0;const e=this.getCurrentDateTime();return(!this.settings.startDate||e>=this.settings.startDate)&&(!this.settings.endDate||e<=this.settings.endDate)}}},8254:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733)),r=o(n(9901));class _default extends s.default{constructor(){super(...arguments);const{schedule_timezone:e,schedule_start_date:t,schedule_end_date:n,schedule_server_datetime:o}=this.getSettings();this.settings={timezone:e,startDate:!!t&&new Date(t),endDate:!!n&&new Date(n),serverDatetime:!!o&&new Date(o)},this.scheduleUtils=new r.default({settings:this.settings})}getName(){return"schedule"}check(){return this.scheduleUtils.shouldDisplay()}}t.default=_default},5873:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733));class _default extends s.default{getName(){return"sessions"}check(){const e=elementorFrontend.storage.get("sessions"),t=this.getName();let n=this.document.getStorage(t+"_initialSessions");return n||(this.document.setStorage(t+"_initialSessions",e),n=e),e-n>=this.getTimingSetting("sessions")}}t.default=_default},2880:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733));class _default extends s.default{getName(){return"sources"}check(){const e=this.getTimingSetting("sources");if(3===e.length)return!0;const t=document.referrer.replace(/https?:\/\/(?:www\.)?/,"");return 0===t.indexOf(location.host.replace("www.",""))?-1!==e.indexOf("internal"):-1!==e.indexOf("external")||-1!==e.indexOf("search")&&/^(google|yahoo|bing|yandex|baidu)\./.test(t)}}t.default=_default},1744:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=class TimesUtils{constructor(e){this.uniqueId=e.uniqueId,this.settings=e.settings,this.storage=e.storage}getTimeFramesInSecounds(e){return{day:86400,week:604800,month:2628288}[e]}setExpiration(e,t,n){if(this.storage.get(e))this.storage.set(e,t);else{const o={lifetimeInSeconds:this.getTimeFramesInSecounds(n)};this.storage.set(e,t,o)}}getImpressionsCount(){const e=this.storage.get(this.uniqueId)??0;return parseInt(e)}incrementImpressionsCount(){if(this.settings.period)if("session"!==this.settings.period){const e=this.getImpressionsCount();this.setExpiration(this.uniqueId,e+1,this.settings.period)}else sessionStorage.setItem(this.uniqueId,parseInt(sessionStorage.getItem(this.uniqueId)??0)+1);else this.storage.set("times",(this.storage.get("times")??0)+1)}shouldCountOnOpen(){this.settings.countOnOpen&&this.incrementImpressionsCount()}shouldDisplayPerTimeFrame(){return this.getImpressionsCount()<this.settings.showsLimit&&(this.shouldCountOnOpen(),!0)}shouldDisplayPerSession(){const e=sessionStorage.getItem(this.uniqueId)??0;return parseInt(e)<this.settings.showsLimit&&(this.shouldCountOnOpen(),!0)}shouldDisplayBackwordCompatible(){let e=arguments.length>1?arguments[1]:void 0;const t=parseInt(arguments.length>0&&void 0!==arguments[0]?arguments[0]:0)<parseInt(e);return this.shouldCountOnOpen(),t}}},3940:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733)),r=o(n(1744));class _default extends s.default{constructor(){super(...arguments),this.uniqueId=`popup-${this.document.getSettings("id")}-impressions-count`;const{times_count:e,times_period:t,times_times:n}=this.getSettings();this.settings={countOnOpen:e,period:t,showsLimit:parseInt(n)},""===this.settings.period&&(this.settings.period=!1),["","close"].includes(this.settings.countOnOpen)?(this.settings.countOnOpen=!1,this.onPopupHide()):this.settings.countOnOpen=!0,this.utils=new r.default({uniqueId:this.uniqueId,settings:this.settings,storage:elementorFrontend.storage})}getName(){return"times"}check(){if(!this.settings.period){const e=this.document.getStorage("times")||0,t=this.getTimingSetting("times");return this.utils.shouldDisplayBackwordCompatible(e,t)}if("session"!==this.settings.period){if(!this.utils.shouldDisplayPerTimeFrame())return!1}else if(!this.utils.shouldDisplayPerSession())return!1;return!0}onPopupHide(){window.addEventListener("elementor/popup/hide",(()=>{this.utils.incrementImpressionsCount()}))}}t.default=_default},7471:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(2733));class _default extends s.default{getName(){return"url"}check(){const e=this.getTimingSetting("url"),t=this.getTimingSetting("action"),n=document.referrer;if("regex"!==t)return"hide"===t^-1!==n.indexOf(e);let o;try{o=new RegExp(e)}catch(e){return!1}return o.test(n)}}t.default=_default},3758:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(9739)),r=o(n(9226)),l=o(n(4270)),i=o(n(1697)),a=o(n(9143)),d=o(n(3676)),u=o(n(7541));class _default extends elementorModules.Module{constructor(e,t){super(e),this.document=t,this.triggers=[],this.triggerClasses={page_load:s.default,scrolling:r.default,scrolling_to:l.default,click:i.default,inactivity:a.default,exit_intent:d.default,adblock_detection:u.default},this.runTriggers()}runTriggers(){const e=this.getSettings();jQuery.each(this.triggerClasses,((t,n)=>{if(!e[t])return;const o=new n(e,(()=>this.onTriggerFired()));o.run(),this.triggers.push(o)}))}destroyTriggers(){this.triggers.forEach((e=>e.destroy())),this.triggers=[]}onTriggerFired(){this.document.showModal(!0),this.destroyTriggers()}}t.default=_default},7541:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(6904));class _default extends s.default{getName(){return"adblock_detection"}generateRandomString(){const e="abcdefghijklmnopqrstuvwxyz0123456789";let t="";for(let n=0;n<6;n++){t+=e[Math.floor(36*Math.random())]}return t}hasAdblock(){const e=`elementor-adblock-detection-${this.generateRandomString()}`;this.createEmptyAdBlockElement(e);const t=document.querySelector(`#${e}`);if(!t)return!0;const n="none"===window.getComputedStyle(t)?.display;return this.removeEmptyAdBlockElement(t),n}createEmptyAdBlockElement(e){const t=document.createElement("div");t.id=e,t.className="ad-box",t.style.position="fixed",t.style.top="0",t.style.left="0",t.setAttribute("aria-hidden","true"),t.innerHTML="&nbsp;",document.body.appendChild(t)}removeEmptyAdBlockElement(e){e.remove()}run(){this.timeout=setTimeout((()=>{this.hasAdblock()&&this.callback()}),1e3*this.getTriggerSetting("delay"))}destroy(){clearTimeout(this.timeout)}}t.default=_default},6904:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(e,t){super(e),this.callback=t}getTriggerSetting(e){return this.getSettings(this.getName()+"_"+e)}}t.default=_default},1697:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(6904));class _default extends s.default{constructor(){super(...arguments),this.checkClick=this.checkClick.bind(this),this.clicksCount=0}getName(){return"click"}checkClick(){this.clicksCount++,this.clicksCount===this.getTriggerSetting("times")&&this.callback()}run(){elementorFrontend.elements.$body.on("click",this.checkClick)}destroy(){elementorFrontend.elements.$body.off("click",this.checkClick)}}t.default=_default},3676:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(6904));class _default extends s.default{constructor(){super(...arguments),this.detectExitIntent=this.detectExitIntent.bind(this)}getName(){return"exit_intent"}detectExitIntent(e){e.clientY<=0&&this.callback()}run(){elementorFrontend.elements.$window.on("mouseleave",this.detectExitIntent)}destroy(){elementorFrontend.elements.$window.off("mouseleave",this.detectExitIntent)}}t.default=_default},9143:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(6904));class _default extends s.default{constructor(){super(...arguments),this.restartTimer=this.restartTimer.bind(this)}getName(){return"inactivity"}run(){this.startTimer(),elementorFrontend.elements.$document.on("keypress mousemove",this.restartTimer)}startTimer(){this.timeOut=setTimeout(this.callback,1e3*this.getTriggerSetting("time"))}clearTimer(){clearTimeout(this.timeOut)}restartTimer(){this.clearTimer(),this.startTimer()}destroy(){this.clearTimer(),elementorFrontend.elements.$document.off("keypress mousemove",this.restartTimer)}}t.default=_default},9739:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(6904));class _default extends s.default{getName(){return"page_load"}run(){this.timeout=setTimeout(this.callback,1e3*this.getTriggerSetting("delay"))}destroy(){clearTimeout(this.timeout)}}t.default=_default},4270:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(6904));class _default extends s.default{getName(){return"scrolling_to"}run(){let e;try{e=jQuery(this.getTriggerSetting("selector"))}catch(e){return}e.length&&(this.setUpIntersectionObserver(),this.observer.observe(e[0]))}setUpIntersectionObserver(){this.observer=new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting&&this.callback()}))}))}destroy(){this.observer&&this.observer.disconnect()}}t.default=_default},9226:(e,t,n)=>{var o=n(6784);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=o(n(6904));class _default extends s.default{constructor(){super(...arguments),this.checkScroll=this.checkScroll.bind(this),this.lastScrollOffset=0}getName(){return"scrolling"}checkScroll(){const e=scrollY>this.lastScrollOffset?"down":"up",t=this.getTriggerSetting("direction");if(this.lastScrollOffset=scrollY,e!==t)return;if("up"===e)return void this.callback();const n=elementorFrontend.elements.$document.height()-innerHeight;scrollY/n*100>=this.getTriggerSetting("offset")&&this.callback()}run(){elementorFrontend.elements.$window.on("scroll",this.checkScroll)}destroy(){elementorFrontend.elements.$window.off("scroll",this.checkScroll)}}t.default=_default},8534:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),["classic","full_content","cards"].forEach((e=>{elementorFrontend.elementsHandler.attachHandler("posts",(()=>n.e(535).then(n.bind(n,2078))),e)})),elementorFrontend.elementsHandler.attachHandler("posts",(()=>n.e(396).then(n.bind(n,2195))),"classic"),elementorFrontend.elementsHandler.attachHandler("posts",(()=>n.e(396).then(n.bind(n,2195))),"full_content"),elementorFrontend.elementsHandler.attachHandler("posts",(()=>n.e(396).then(n.bind(n,7907))),"cards"),elementorFrontend.elementsHandler.attachHandler("portfolio",(()=>n.e(726).then(n.bind(n,2232))))}}t.default=_default},8945:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("search",[()=>n.e(187).then(n.bind(n,6963)),()=>n.e(187).then(n.bind(n,7112))])}}t.default=_default},6034:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("share-buttons",(()=>n.e(316).then(n.bind(n,3607))))}}t.default=_default},6075:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("slides",(()=>n.e(829).then(n.bind(n,3271))))}}t.default=_default},570:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("facebook-button",(()=>n.e(158).then(n.bind(n,5070)))),elementorFrontend.elementsHandler.attachHandler("facebook-comments",(()=>n.e(158).then(n.bind(n,5070)))),elementorFrontend.elementsHandler.attachHandler("facebook-embed",(()=>n.e(158).then(n.bind(n,5070)))),elementorFrontend.elementsHandler.attachHandler("facebook-page",(()=>n.e(158).then(n.bind(n,5070))))}}t.default=_default},9302:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("table-of-contents",(()=>Promise.all([n.e(234),n.e(404)]).then(n.bind(n,3827))))}}t.default=_default},6302:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),["archive_classic","archive_full_content","archive_cards"].forEach((e=>{elementorFrontend.elementsHandler.attachHandler("archive-posts",(()=>n.e(345).then(n.bind(n,439))),e)})),elementorFrontend.elementsHandler.attachHandler("archive-posts",(()=>n.e(345).then(n.bind(n,6629))),"archive_classic"),elementorFrontend.elementsHandler.attachHandler("archive-posts",(()=>n.e(345).then(n.bind(n,6629))),"archive_full_content"),elementorFrontend.elementsHandler.attachHandler("archive-posts",(()=>n.e(345).then(n.bind(n,2718))),"archive_cards"),jQuery((function(){var e=location.search.match(/theme_template_id=(\d*)/),t=e?jQuery(".elementor-"+e[1]):[];t.length&&jQuery("html, body").animate({scrollTop:t.offset().top-window.innerHeight/2})}))}}t.default=_default},7492:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("search-form",(()=>n.e(798).then(n.bind(n,9319))))}}t.default=_default},8241:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;class _default extends elementorModules.Module{constructor(){super(),elementorFrontend.elementsHandler.attachHandler("woocommerce-menu-cart",(()=>n.e(6).then(n.bind(n,2115)))),elementorFrontend.elementsHandler.attachHandler("woocommerce-purchase-summary",(()=>n.e(80).then(n.bind(n,193)))),elementorFrontend.elementsHandler.attachHandler("woocommerce-checkout-page",(()=>n.e(354).then(n.bind(n,9391)))),elementorFrontend.elementsHandler.attachHandler("woocommerce-cart",(()=>n.e(4).then(n.bind(n,2937)))),elementorFrontend.elementsHandler.attachHandler("woocommerce-my-account",(()=>n.e(662).then(n.bind(n,1627)))),elementorFrontend.elementsHandler.attachHandler("woocommerce-notices",(()=>n.e(621).then(n.bind(n,4702)))),elementorFrontend.elementsHandler.attachHandler("woocommerce-product-add-to-cart",(()=>n.e(787).then(n.bind(n,6973)))),elementorFrontend.isEditMode()&&elementorFrontend.on("components:init",(()=>{elementorFrontend.elements.$body.find(".elementor-widget-woocommerce-cart").length||elementorFrontend.elements.$body.append('<div class="woocommerce-cart-form">')}))}}t.default=_default},2470:e=>{e.exports=wp.i18n}},e=>{e.O(0,[313],(()=>{return t=2371,e(e.s=t);var t}));e.O()}]);

/*!
 * Countdown v0.1.0
 * https://github.com/fengyuanchen/countdown
 *
 * Copyright 2014 Fengyuan Chen
 * Released under the MIT license
 */


!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){"use strict";var b=function(c,d){this.$element=a(c),this.defaults=a.extend({},b.defaults,this.$element.data(),a.isPlainObject(d)?d:{}),this.init()};b.prototype={constructor:b,init:function(){var a=this.$element.html(),b=new Date(this.defaults.date||a);b.getTime()&&(this.content=a,this.date=b,this.find(),this.defaults.autoStart&&this.start())},find:function(){var a=this.$element;this.$days=a.find("[data-days]"),this.$hours=a.find("[data-hours]"),this.$minutes=a.find("[data-minutes]"),this.$seconds=a.find("[data-seconds]"),this.$days.length+this.$hours.length+this.$minutes.length+this.$seconds.length>0&&(this.found=!0)},reset:function(){this.found?(this.output("days"),this.output("hours"),this.output("minutes"),this.output("seconds")):this.output()},ready:function(){var a,b=this.date,c=100,d=1e3,e=6e4,f=36e5,g=864e5,h={};return b?(a=b.getTime()-(new Date).getTime(),0>=a?(this.end(),!1):(h.days=a,h.hours=h.days%g,h.minutes=h.hours%f,h.seconds=h.minutes%e,h.milliseconds=h.seconds%d,this.days=Math.floor(h.days/g),this.hours=Math.floor(h.hours/f),this.minutes=Math.floor(h.minutes/e),this.seconds=Math.floor(h.seconds/d),this.deciseconds=Math.floor(h.milliseconds/c),!0)):!1},start:function(){!this.active&&this.ready()&&(this.active=!0,this.reset(),this.autoUpdate=this.defaults.fast?setInterval(a.proxy(this.fastUpdate,this),100):setInterval(a.proxy(this.update,this),1e3))},stop:function(){this.active&&(this.active=!1,clearInterval(this.autoUpdate))},end:function(){this.date&&(this.stop(),this.days=0,this.hours=0,this.minutes=0,this.seconds=0,this.deciseconds=0,this.reset(),this.defaults.end())},destroy:function(){this.date&&(this.stop(),this.$days=null,this.$hours=null,this.$minutes=null,this.$seconds=null,this.$element.empty().html(this.content),this.$element.removeData("countdown"))},fastUpdate:function(){--this.deciseconds>=0?this.output("deciseconds"):(this.deciseconds=9,this.update())},update:function(){--this.seconds>=0?this.output("seconds"):(this.seconds=59,--this.minutes>=0?this.output("minutes"):(this.minutes=59,--this.hours>=0?this.output("hours"):(this.hours=23,--this.days>=0?this.output("days"):this.end())))},output:function(a){if(!this.found)return void this.$element.empty().html(this.template());switch(a){case"deciseconds":this.$seconds.text(this.getSecondsText());break;case"seconds":this.$seconds.text(this.seconds);break;case"minutes":this.$minutes.text(this.minutes);break;case"hours":this.$hours.text(this.hours);break;case"days":this.$days.text(this.days)}},template:function(){return this.defaults.text.replace("%s",this.days).replace("%s",this.hours).replace("%s",this.minutes).replace("%s",this.getSecondsText())},getSecondsText:function(){return this.active&&this.defaults.fast?this.seconds+"."+this.deciseconds:this.seconds}},b.defaults={autoStart:!0,date:null,fast:!1,end:a.noop,text:"%s days, %s hours, %s minutes, %s seconds"},b.setDefaults=function(c){a.extend(b.defaults,c)},a.fn.countdown=function(c){return this.each(function(){var d=a(this),e=d.data("countdown");e||d.data("countdown",e=new b(this,c)),"string"==typeof c&&a.isFunction(e[c])&&e[c]()})},a.fn.countdown.constructor=b,a.fn.countdown.setDefaults=b.setDefaults,a(function(){a("[countdown]").countdown()})}); 

jQuery("document").ready(function(t){t("#post-guestbook-box").submit(function(o){o.preventDefault();var e="action=guestbook_box_submit&id="+t(".guestbook-box-content").data("id")+"&avatar="+t("#hidden-avatar img").attr("src")+"&"+t(this).serialize();t.post(cevar.ajax_url,e,function(o){t(".guestbook-list").prepend(o),t("#post-guestbook-box")[0].reset()})})});

jQuery(document).on('click', '.delete', function () {
    var id = this.id;
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {"action": "your_delete_action", "element_id": id},
        success: function (data) {
            //run stuff on success here.  You can use `data` var in the 
           //return so you could post a message.  
        }
    });
});

//Neo - Conditional Statement for audio or Youtube
// jQuery("document").ready(function($) {
// 	var e = window.settingAutoplay;
// 	if(e) {
// 		$("#mute-sound").show();
// 		if(document.body.contains(document.getElementById("song"))) {
// 			document.getElementById("song").play();
// 		}
// 	} else { 
// 		$("#unmute-sound").show();
// 	}
// 	$("#audio-container").click(function(u) {
// 		if(e) {
// 			$("#mute-sound").hide();
// 			$("#unmute-sound").show();
// 			playAud();//document.getElementById("song").pause();
// 			e = !1
// 		} else {
// 			$("#unmute-sound").hide();
// 			$("#mute-sound").show();
// 			//document.getElementById("song").play();
// 			playAud();
// 			e = !0;
// 		}
// 	})
// 	function playAud(){
// 		if(document.body.contains(document.getElementById("song"))) {
// 			if(e){
// 				document.getElementById("song").pause();
// 			} else {
// 				document.getElementById("song").play();
// 			}
// 		} else {
// 			toggleAudio();
// 		}
// 	}
// });

(function ($) {"use strict"; var editMode = false;
// Sticky script starts
var wdpSticky = function ($scope, $) {
    var wdpStickySection = $scope.find('.wdp-sticky-section-yes').eq(0);

    wdpStickySection.each(function(i) {
        var dataSettings = $(this).data('settings');
        $.each( dataSettings, function(index, value) { 
            if( index === 'wdp_sticky_top_spacing' ){
                $scope.find('.wdp-sticky-section-yes').css( "top", value + "px" );
            }
        }); 
    });
    $scope.each(function(i) {
        var sectionSettings = $scope.data("settings");
        $.each( sectionSettings, function(index, value) { 
            if( index === 'wdp_sticky_top_spacing' ){
                $scope.css( "top", value + "px" );
            }
        }); 
    });
    
    if ( wdpStickySection.length > 0 ) {
        var parent = document.querySelector('.wdp-sticky-section-yes').parentElement;
        while (parent) {
            var hasOverflow = getComputedStyle(parent).overflow;
            if (hasOverflow !== 'visible') {
                parent.style.overflow = "visible"
            }
            parent = parent.parentElement;
        }
    }

    var columnClass = $scope.find( '.wdp-column-sticky' );
    var dataId = columnClass.data('id');
    var dataType = columnClass.data('type');
    var topSpacing = columnClass.data('top_spacing');

    if( dataType === 'column' ){
        var $target  = $scope;
        var wrapClass = columnClass.find( '.elementor-widget-wrap' );
    
        wrapClass.stickySidebar({
            topSpacing: topSpacing,
            bottomSpacing: 60,
            containerSelector: '.elementor-row',
            innerWrapperSelector: '.elementor-column-wrap',
        });
    }

}
// Sticky script ends
$(window).on('elementor/frontend/init', function () {
    if( elementorFrontend.isEditMode() ) {
        editMode = true;
    }
    
    elementorFrontend.hooks.addAction( 'frontend/element_ready/section', wdpSticky);
}); 

}(jQuery));


jQuery("document").ready(function($) {
    var showPagination = window.settingPagination;
    var hal = window.settingHalaman;
    var pagify = {
      items: {},
      container: null,
      totalPages: 1,
      perPage: 3,
      currentPage: 0,
      createNavigation: function () {
        this.totalPages = Math.ceil(this.items.length / this.perPage);
  
        $(".pagination", this.container.parent()).remove();
        var pagination = $('<div class="pagination"></div>').append(
          '<a class="nav prev disabled" data-next="false">←</a>'
        );
  
        for (var i = 0; i < this.totalPages; i++) {
          var pageElClass = "page";
          if (!i) pageElClass = "page current";
          var pageEl =
            '<a class="' +
            pageElClass +
            '" data-page="' +
            (i + 1) +
            '">' +
            (i + 1) +
            "</a>";
          pagination.append(pageEl);
        }
        pagination.append('<a class="nav next" data-next="true">→</a>');
  
        this.container.after(pagination);
  
        var that = this;
        $("body").off("click", ".nav");
        this.navigator = $("body").on("click", ".nav", function () {
          var el = $(this);
          that.navigate(el.data("next"));
        });
  
        $("body").off("click", ".page");
        this.pageNavigator = $("body").on("click", ".page", function () {
          var el = $(this);
          that.goToPage(el.data("page"));
        });
      },
      navigate: function (next) {
        // default perPage to 5
        if (isNaN(next) || next === undefined) {
          next = true;
        }
        $(".pagination .nav").removeClass("disabled");
        if (next) {
          this.currentPage++;
          if (this.currentPage > this.totalPages - 1)
            this.currentPage = this.totalPages - 1;
          if (this.currentPage == this.totalPages - 1)
            $(".pagination .nav.next").addClass("disabled");
        } else {
          this.currentPage--;
          if (this.currentPage < 0) this.currentPage = 0;
          if (this.currentPage == 0)
            $(".pagination .nav.prev").addClass("disabled");
        }
  
        this.showItems();
      },
      updateNavigation: function () {
        var pages = $(".pagination .page");
        pages.removeClass("current");
        $(
          '.pagination .page[data-page="' + (this.currentPage + 1) + '"]'
        ).addClass("current");
      },
      goToPage: function (page) {
        this.currentPage = page - 1;
  
        $(".pagination .nav").removeClass("disabled");
        if (this.currentPage == this.totalPages - 1)
          $(".pagination .nav.next").addClass("disabled");
  
        if (this.currentPage == 0)
          $(".pagination .nav.prev").addClass("disabled");
        this.showItems();
      },
      showItems: function () {
        this.items.hide();
        var base = this.perPage * this.currentPage;
        this.items.slice(base, base + this.perPage).show();
  
        this.updateNavigation();
      },
      init: function (container, items, perPage) {
        this.container = container;
        this.currentPage = 0;
        this.totalPages = 1;
        this.perPage = perPage;
        this.items = items;
        this.createNavigation();
        this.showItems();
      }
    };
  
    // stuff it all into a jQuery method!
    $.fn.pagify = function (perPage, itemSelector) {
      var el = $(this);
      var items = $(itemSelector, el);
  
      // default perPage to 5
      if (isNaN(perPage) || perPage === undefined) {
        perPage = 3;
      }
  
      // don't fire if fewer items than perPage
      if (items.length <= perPage) {
        return true;
      }
  
      pagify.init(el, items, perPage);
    };
    if(showPagination === 'yes'){
        $(".guestbook-list").pagify(hal, ".user-guestbook");
    }
  });
