# -*- encoding: utf-8 -*-
from openerp.osv import osv, fields

class product_template(osv.osv):
    _inherit = "product.template"

    _columns = {
        'product_images_ids' : fields.one2many('ot.product.images', 'product_id', 'Multi Images'),
    }