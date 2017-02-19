from openerp.osv import fields, osv

class res_company(osv.osv):
	_inherit = "res.company"

	_columns = {
		'ot_categ_1': fields.many2one('product.public.category', 'Category 1'),
		'ot_categ_2': fields.many2one('product.public.category', 'Category 2'),
		'ot_categ_3': fields.many2one('product.public.category', 'Category 3'),
	}