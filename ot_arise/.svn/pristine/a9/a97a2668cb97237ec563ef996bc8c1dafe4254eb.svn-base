// OT Remarks - Odoo 9 need to use define and require ajax instead of openerp
odoo.define('website_sale.arise', function (require) {
    var openerp = require('web.ajax');

    $(document).ready(function() {
        /* Fixed Header */
        var stickyOffset = $('.ot-fixed-header').offset().top;

        $(window).scroll(function(){
            var sticky = $('.ot-fixed-header'),
            scroll = $(window).scrollTop();

            if (scroll > stickyOffset) {
                sticky.addClass('fixed');
            }
            else {
                sticky.removeClass('fixed');
            }
        });

        $('.ot-subscribe-btn').on('click', function(e) {
            e.preventDefault();

            openerp.jsonRpc("/subscribe_modal", 'call', {}).then(function (modal) {
                var $modal = $(modal);
                $modal.appendTo('body').modal().on('hidden.bs.modal', function () {
                    $(this).remove();
                });

                setTimeout(function() {
                    $('body').find('input#ot-subscribe-email').focus();
                }, 600);

                $modal.on('submit', '#ot-subscribe-form', function(e) {
                    e.preventDefault();
                    var form = $(this);
                    $(form).parent().parent().find('.close').click();

                    openerp.jsonRpc("/subscribe_confirm", 'call', {
                        email: $(form).find('#ot-subscribe-email').val()
                    }).then(function (modal) {
                        var $modal = $(modal);
                        var content = $modal.appendTo('body').modal();

                        $('.modal-backdrop').removeClass("modal-backdrop");
                        $('body').removeClass('modal-open');
                        $('body').css('padding', 0);

                        setTimeout(function() {
                            $(content).remove();
                        }, 4000)
                    });
                });
            });

        })
    });
});