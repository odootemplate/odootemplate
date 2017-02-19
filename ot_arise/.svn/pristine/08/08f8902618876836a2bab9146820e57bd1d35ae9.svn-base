import odoo

from odoo import SUPERUSER_ID
from odoo import http
from odoo.http import request
from odoo.tools.translate import _
from odoo.addons.website.models.website import slug
from odoo.exceptions import except_orm

from odoo.addons.website.controllers.main import Website

class WebsiteArise(Website):
    @http.route(['/subscribe_modal'], type='json', auth="public", methods=['POST'], website=True)
    def subscribe_modal(self, **post):
        # OT Remarks - Render is different in o10
        return request.env['ir.ui.view'].render_template("ot_arise.ot_subscribe_modal")

    @http.route(['/subscribe_confirm'], type='json', auth="public", methods=['POST'], website=True)
    def subscribe_confirm(self, **post):
        cr, uid, context, pool = request.cr, request.uid, request.context, request.env

        subscribe_obj = pool['ot.subscribe']
        is_subscribe = subscribe_obj.search([('name', '=', post.get('email'))])
        is_error = False

        if is_subscribe:
            is_error = True
        else:
            subscribe_id = subscribe_obj.create({
                'name' : post.get('email')    
            })

        # OT Remarks - Render is different in o10
        return request.env['ir.ui.view'].render_template("ot_arise.ot_subscribe_confirm", {
            'is_error': is_error
        })