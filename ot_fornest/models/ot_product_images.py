# -*- encoding: utf-8 -*-
from openerp import tools
from openerp.osv import osv, fields

class ot_product_images(osv.osv):
	_name = 'ot.product.images'

	def _get_image(self, cr, uid, ids, name, args, context=None):
		result = dict.fromkeys(ids, False)
		for obj in self.browse(cr, uid, ids, context=context):
			result[obj.id] = tools.image_get_resized_images(obj.image, avoid_resize_medium=True)
		return result

	def _set_image(self, cr, uid, id, name, value, args, context=None):
		return self.write(cr, uid, [id], {'image': tools.image_resize_image_big(value)}, context=context)

	_columns = {
		'name' : fields.char('Description'),
		'product_id' : fields.many2one('product.template', 'Product'),
		'image' : fields.binary('Image'),
		'image_medium': fields.function(_get_image, fnct_inv=_set_image,
			string="Medium-sized image", type="binary", multi="_get_image", 
			store={
				'ot.product.images': (lambda self, cr, uid, ids, c={}: ids, ['image'], 10),
			},
			help="Medium-sized image of the product. It is automatically "\
				 "resized as a 128x128px image, with aspect ratio preserved, "\
				 "only when the image exceeds one of those sizes. Use this field in form views or some kanban views."),
	}

	_defaults = {
		'name' : lambda obj, cr, uid, context: obj.pool.get('ir.sequence').get(cr, uid, 'ot.product.images'),
	}