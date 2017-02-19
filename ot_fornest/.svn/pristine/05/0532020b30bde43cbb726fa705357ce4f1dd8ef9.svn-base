from odoo import fields, models

class ot_config_settings(models.TransientModel):
	_name = 'ot.config.settings'
	_inherit = 'res.config.settings'
	_description = 'Config'

	company_id = fields.Many2one('res.company', string="Company", required=True,default=lambda self: self.env.user.company_id)
	ot_categ_1 = fields.Many2one('product.public.category', string='Category 1', related='company_id.ot_categ_1')
	ot_categ_2 = fields.Many2one('product.public.category', string='Category 2', related='company_id.ot_categ_2')
	ot_categ_3 = fields.Many2one('product.public.category', string='Category 3', related='company_id.ot_categ_3')
