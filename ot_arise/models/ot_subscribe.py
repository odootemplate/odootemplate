from openerp.osv import osv, fields
import time

class ot_subscribe(osv.osv):
    _name = 'ot.subscribe'

    _columns = {
        'name' : fields.char('Email'),
        'date' : fields.datetime('Join Date')
    }

    _defaults = {
        'date': lambda *a: time.strftime("%Y-%m-%d %H:%M:%S"),
    }

    _sql_constraints = [
        ('name_uniq', 'unique (name)', 'Subscriber email must be unique !')
    ]