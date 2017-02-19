# -*- encoding: utf-8 -*-
from odoo import fields, models

class product_template(models.Model):
    _inherit = "product.template"

    product_images_ids = fields.One2many('ot.product.images', 'product_id', string='Multi Images')