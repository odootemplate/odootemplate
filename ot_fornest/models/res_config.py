from openerp.osv import fields, osv

class ot_config_settings(osv.osv_memory):
    _name = 'ot.config.settings'
    _inherit = 'res.config.settings'

    _columns = {
        'company_id': fields.many2one('res.company', string="Company", required=True),
        'ot_categ_1': fields.related('company_id', 'ot_categ_1', type='many2one', relation='product.public.category', string='Category 1'),
        'ot_categ_2': fields.related('company_id', 'ot_categ_2', type='many2one', relation='product.public.category', string='Category 2'),
        'ot_categ_3': fields.related('company_id', 'ot_categ_3', type='many2one', relation='product.public.category', string='Category 3'),
    }

    def on_change_company_id(self, cr, uid, ids, company_id, context=None):
        website_data = self.pool.get('res.company').read(cr, uid, [company_id], [], context=context)[0]
        values = {}
        for fname, v in website_data.items():
            if fname in self._columns:
                values[fname] = v[0] if v and self._columns[fname]._type == 'many2one' else v
        return {'value' : values}

    # FIXME in trunk for god sake. Change the fields above to fields.char instead of fields.related, 
    # and create the function set_website who will set the value on the website_id
    # create does not forward the values to the related many2one. Write does.
    def create(self, cr, uid, vals, context=None):
        config_id = super(ot_config_settings, self).create(cr, uid, vals, context=context)
        self.write(cr, uid, config_id, vals, context=context)
        return config_id

    _defaults = {
        'company_id': lambda self,cr,uid,c: self.pool.get('res.users').browse(cr,uid,uid).company_id.id,
    }