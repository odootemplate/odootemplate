// OT Remarks - Odoo 9 need to use define and require ajax instead of openerp
odoo.define('website_sale.fornest', function (require) {
    'use strict';

    var openerp = require('web.ajax');
    function productsSlider() {
        // Cache the thumb selector for speed
        var thumb = $('#gallery-thumbs').find('.thumb');
            
        // How many thumbs do you want to show & scroll by
        var visibleThumbs = 3;

        // Put slider into variable to use public functions
        var gallerySlider = $('.bxslider').bxSlider({
            mode: 'fade',
            controls: false,
            pager: false,
            easing: 'easeInOutQuint',
            infiniteLoop: false,
            speed: 500,
            nextText: '&gt;',
            prevText: '&lt;',

            onSlideAfter: function ($slideElement, oldIndex, newIndex) {
                thumb.removeClass('pager-active');
                thumb.eq(newIndex).addClass('pager-active');
                // Action next carousel slide on one before the end, so newIndex + 1
                slideThumbs(newIndex, visibleThumbs);
            },
        });

        // When clicking a thumb
        thumb.click(function (e) {
            // -6 as BX slider clones a bunch of elements
            gallerySlider.goToSlide($(this).closest('.thumb-item').index());

            // Prevent default click behaviour
            e.preventDefault();
        });

        // Function to calculate which slide to move the thumbs to
        function slideThumbs(currentSlideNumber, visibleThumbs) {
            // Calculate the first number and ignore the remainder
            var m = Math.floor(currentSlideNumber / visibleThumbs);
            // Multiply by the number of visible slides to calculate the exact slide we need to move to
            var slideTo = m;

            // Tell the slider to move
            thumbsSlider.goToSlide(slideTo);
        }

        // When you click on a thumb
        $('#gallery-thumbs').find('.thumb').click(function () {
            // Remove the active class from all thumbs
            $('#gallery-thumbs').find('.thumb').removeClass('pager-active');

            // Add the active class to the clicked thumb
            $(this).addClass('pager-active');
        });

        setTimeout(function() {
            if($(".gallery-thumbs-container .bx-prev").is(":visible")) {
                $(".gallery-thumbs-container").css("margin-top", "50px")
            }
            if($(".gallery-thumbs-container .bx-next").is(":visible")) {
                $(".gallery-thumbs-container").css("margin-bottom", "50px")
            }
        }, 100);

        // Thumbnail slider
        var thumbsSlider = $('#gallery-thumbs').bxSlider({
            controls: true,
            pager: false,
            easing: 'easeInOutQuint',
            //displaySlideQty: visibleThumbs,
            //moveSlideQty: visibleThumbs,
            infiniteLoop: false,
            slideWidth: 85,
            minSlides: visibleThumbs,
            maxSlides: visibleThumbs,
            slideMargin: 10,
            preventDefaultSwipeX: false,
            preventDefaultSwipeY: false,
            mode: 'vertical'
        });
    }

    $(document).ready(function() {
    	// Homepage Product Tabs
    	$("#ot-products-tabs").tabs()

    	// Single Product Images Slider
    	if ($('.bxslider img').length > 0) {
            productsSlider();
        }

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

        /* Scroll to Top */
        var offset = 300,
        offset_opacity = 1200,
        scroll_top_duration = 700,
        $back_to_top = $('.ot-top');

        $(window).scroll(function(){
            ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('ot-is-visible') : $back_to_top.removeClass('ot-is-visible ot-fade-out');
            if( $(this).scrollTop() > offset_opacity ) { 
                $back_to_top.addClass('ot-fade-out');
            }
        });

        $back_to_top.on('click', function(event){
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0 ,
                }, scroll_top_duration
            );
        });

        /* Variant Attributes Change */
        $('.oe_website_sale').on('change', '.css_attribute_color input', function (ev) {
            ev.preventDefault();
            $('.css_attribute_color').removeClass("active");
            $('.css_attribute_color:has(input:checked)').addClass("active");
        });

        /* Add to Cart Ajax */
        $('.oe_website_sale .a-submit.ot-add-product').off('click').on('click', function (e) {
            e.preventDefault();

            var button = $(this)
            openerp.jsonRpc("/shop/cart/update", 'call', {
                'product_id': parseInt($("input[name='product_id']", $(this).closest('.oe_product')).val()),
                'add_qty': 1 
            }).then(function (data) {
                if(!data.is_variant) {
                    var product_img = $(button).parents().eq(1).find('img')
                    var product_offset = $(product_img).offset();
                    $(product_img).clone().addClass('product-clone').css({
                        'left' : product_offset.left + 'px',
                        'top' : parseInt(product_offset.top-$(window).scrollTop()) + 'px',
                        'width' :  $(product_img).width() + 'px',
                        'height' : $(product_img).height() + 'px',
                        'position' : 'fixed',
                        'z-index': 1002
                    }).appendTo($(product_img).closest('.oe_product').parent());

                    if($("li.ot-my-cart").is(':visible')) {
                        var cart_offset = $('li.ot-my-cart img').offset();
                    } else {
                        var cart_offset = $('.ot-fixed-header .navbar-toggle').offset();
                    }

                    $('.product-clone').animate( { top: parseInt(cart_offset.top-$(window).scrollTop()) + 'px', left: cart_offset.left + 'px', 'height': '0px', 'width': '0px' }, 800, function(){
                        $(this).remove();
                    });

                    setTimeout(function() {
                        var $q = $(".my_cart_quantity");
                        $q.parent().parent().removeClass("hidden", !data.quantity);
                        $q.html(data.cart_quantity).hide().fadeIn(600);

                        $(".ot-cart-content").load(location.href + " .ot-cart-content > *");
                    }, 1000)
                } else {
                    var $form = $(button).closest('form');

                    openerp.jsonRpc("/shop/modal/product_attributes", 'call', {
                        'product_id': parseInt($("input[name='product_id']", $(button).closest('.oe_product')).val()),
                        // OT Remarks - Odoo 9 cannot get context
                        // kwargs: {
                        //     context: openerp.website.get_context()
                        // }
                    }).then(function (modal) {
                        var $modal = $(modal);
                        var $appended = $modal.appendTo($form).modal()

                        $appended.on('shown.bs.modal', function() {
                            productsSlider();
                        })
                        $appended.on('hidden.bs.modal', function () {
                            $(this).remove();
                        });

                        $modal.on('click', '.a-submit', function (e) {
                            e.preventDefault();
                            var modal_submit = $(this);
                            $modal.modal('hide');

                            openerp.jsonRpc("/shop/cart/update", 'call', {
                                'product_id': parseInt($("input[name='product_id']", $(this).closest('.js_product')).val()),
                                'add_qty': parseInt($("input.js_quantity", $(this).closest('.js_product')).val()),
                                'skip_check': true
                            }).then(function (data) {
                                var product_img = $(button).parents().eq(1).find('img')
                                var product_offset = $(product_img).offset();
                                $(product_img).clone().addClass('product-clone').css({
                                    'left' : product_offset.left + 'px',
                                    'top' : parseInt(product_offset.top-$(window).scrollTop()) + 'px',
                                    'width' :  $(product_img).width() + 'px',
                                    'height' : $(product_img).height() + 'px',
                                    'position' : 'fixed',
                                    'z-index': 1002
                                }).appendTo($(product_img).closest('.oe_product').parent());

                                if($("li.ot-my-cart").is(':visible')) {
                                    var cart_offset = $('li.ot-my-cart img').offset();
                                } else {
                                    var cart_offset = $('.ot-fixed-header .navbar-toggle').offset();
                                }

                                $('.product-clone').animate( { top: parseInt(cart_offset.top-$(window).scrollTop()) + 'px', left: cart_offset.left + 'px', 'height': '0px', 'width': '0px' }, 800, function(){
                                    $(this).remove();
                                });

                                setTimeout(function() {
                                    var $q = $(".my_cart_quantity");
                                    $q.parent().parent().removeClass("hidden", !data.quantity);
                                    $q.html(data.cart_quantity).hide().fadeIn(600);

                                    $(".ot-cart-content").load(location.href + " .ot-cart-content > *");
                                }, 1000)
                            });
                        });
                    });
                }
            });
        });

        $('.ot-single-product .oe_website_sale .a-submit.ot-add-product').off('click').on('click', function (e) {
            e.preventDefault();

            var button = $(this)
            var parent = $('.oe_website_sale')
            openerp.jsonRpc("/shop/cart/update", 'call', {
                'product_id': parseInt($("input[name='product_id']", $(button).closest('.oe_website_sale')).val()),
                'add_qty': parseInt($("input.js_quantity", $(this).closest('.js_product')).val()),
                'skip_check': true
            }).then(function (data) {
                if(!data.is_variant) {
                    var product_img = $(parent).find('.bxslider').find('img:visible')
                    var product_offset = $(product_img).offset();
                    $(product_img).clone().addClass('product-clone').css({
                        'left' : product_offset.left + 'px',
                        'top' : parseInt(product_offset.top-$(window).scrollTop()) + 'px',
                        'width' :  $(product_img).width() + 'px',
                        'height' : $(product_img).height() + 'px',
                        'position' : 'fixed',
                        'z-index': 1002
                    }).appendTo($(product_img).closest('.oe_website_sale').parent());

                    if($("li.ot-my-cart").is(':visible')) {
                        var cart_offset = $('li.ot-my-cart img').offset();
                    } else {
                        var cart_offset = $('.ot-fixed-header .navbar-toggle').offset();
                    }

                    $('.product-clone').animate( { top: parseInt(cart_offset.top-$(window).scrollTop()) + 'px', left: cart_offset.left + 'px', 'height': '0px', 'width': '0px' }, 800, function(){
                        $(this).remove();
                    });

                    setTimeout(function() {
                        var $q = $(".my_cart_quantity");
                        $q.parent().parent().removeClass("hidden", !data.quantity);
                        $q.html(data.cart_quantity).hide().fadeIn(600);

                        $(".ot-cart-content").load(location.href + " .ot-cart-content > *");
                    }, 1000)
                }
            });
        });

        /* Remove Product Ajax */
        $('.ot-cart-content').on('click', 'a.ot-remove-product', function() {
            openerp.jsonRpc("/shop/cart/update", 'call', {
                'product_id': parseInt($(this).parent().find("input[name='remove_product_id']").val()),
                'set_qty': 0,
                'skip_check': true,
            }).then(function (data) {
                var $q = $(".my_cart_quantity");
                $q.parent().parent().removeClass("hidden", !data.quantity);
                $q.html(data.cart_quantity).hide().fadeIn(600);

                $(".ot-cart-content").load(location.href + " .ot-cart-content > *");
            });
        })

        $('#ot-subscribe-form').submit(function(e) {
            e.preventDefault();
            var form = $(this);
            console.log($(form).find('#ot-subscribe-email').val())

            openerp.jsonRpc("/shop/subscribe", 'call', {
                email: $(form).find('#ot-subscribe-email').val()
            }).then(function (modal) {
                var $modal = $(modal);
                var content = $modal.appendTo(form).modal();

                $('.modal-backdrop').removeClass("modal-backdrop");
                $('body').removeClass('modal-open');
                $('body').css('padding', 0);

                setTimeout(function() {
                    $(content).remove();
                }, 4000)
            });
        })
    })
});