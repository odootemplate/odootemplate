from odoo import fields, models

class res_company(models.Model):
	_inherit = "res.company"

	ot_categ_1 = fields.Many2one('product.public.category', string='Category 1')
	ot_categ_2 = fields.Many2one('product.public.category', string='Category 2')
	ot_categ_3 = fields.Many2one('product.public.category', string='Category 3')