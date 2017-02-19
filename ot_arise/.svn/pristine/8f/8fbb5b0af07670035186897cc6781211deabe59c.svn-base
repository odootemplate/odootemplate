import openerp

from openerp import SUPERUSER_ID
from openerp import http
from openerp.http import request
from openerp.tools.translate import _
from openerp.addons.website.models.website import slug
from openerp.exceptions import except_orm

import openerp.addons.website.controllers.main

class Website(openerp.addons.website.controllers.main.Website):
    @http.route(['/subscribe_modal'], type='json', auth="public", methods=['POST'], website=True)
    def subscribe_modal(self, **post):
        return request.website._render("ot_arise.ot_subscribe_modal")

    @http.route(['/subscribe_confirm'], type='json', auth="public", methods=['POST'], website=True)
    def subscribe_confirm(self, **post):
        cr, uid, context, pool = request.cr, request.uid, request.context, request.registry

        subscribe_obj = pool.get('ot.subscribe')
        is_subscribe = subscribe_obj.search(cr, uid, [('name', '=', post.get('email'))])
        is_error = False

        if is_subscribe:
            is_error = True
        else:
            subscribe_id = subscribe_obj.create(cr, SUPERUSER_ID, {
                'name' : post.get('email')    
            })

        return request.website._render("ot_arise.ot_subscribe_confirm", {
            'is_error': is_error
        })