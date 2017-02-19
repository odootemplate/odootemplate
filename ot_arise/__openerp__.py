# -*- encoding: utf-8 -*-
# Python source code encoding : https://www.python.org/dev/peps/pep-0263/
##############################################################################
#
#    OpenERP, Odoo Source Management Solution
#    Copyright (c) 2015 Antiun Ingeniería S.L. (http://www.antiun.com)
#                 Endika Iglesias <endikaig@antiun.com>
#                 Antonio Espinosa <antonioea@antiun.com>
#                 Daniel Góme-Zurita <danielgz@antiun.com>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published
#    by the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

{
    'name': "Odoo Template Arise",
    'version': '1.0',
    'author': 'Odoo Template',
    'category': 'Theme',
    'depends': [
        'website'
    ],
    'summary': """Premium Responsive Odoo Template - Arise""",
    'description': """Premium Responsive Odoo Template - Arise""",
    'demo': [],
    'website': 'https://www.odootemplate.com',
    'description': """
    """,
    'external_dependencies': {},
    'data': [
        'views/templates.xml',
        'views/ot_subscribe_view.xml',
        'security/ir.model.access.csv',
    ],
    'qweb': [],
    'license': 'AGPL-3',
    'test': [],
    'installable': True,
    'application': False,
    'price': 99.99,
    'currency': 'EUR',
}
