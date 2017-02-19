import werkzeug
import openerp

from openerp import SUPERUSER_ID
from openerp import http
from openerp.http import request
from openerp.tools.translate import _
from openerp.addons.website.models.website import slug
from openerp.exceptions import except_orm

import openerp.addons.website_sale.controllers.main

PPG = 20 # Products Per Page
PPR = 4  # Products Per Row

class table_compute(object):
    def __init__(self):
        self.table = {}

    def _check_place(self, posx, posy, sizex, sizey):
        res = True
        for y in range(sizey):
            for x in range(sizex):
                if posx+x>=PPR:
                    res = False
                    break
                row = self.table.setdefault(posy+y, {})
                if row.setdefault(posx+x) is not None:
                    res = False
                    break
            for x in range(PPR):
                self.table[posy+y].setdefault(x, None)
        return res

    def process(self, products):
        # Compute products positions on the grid
        minpos = 0
        index = 0
        maxy = 0
        for p in products:
            x = min(max(p.website_size_x, 1), PPR)
            y = min(max(p.website_size_y, 1), PPR)
            if index>=PPG:
                x = y = 1

            pos = minpos
            while not self._check_place(pos%PPR, pos/PPR, x, y):
                pos += 1
            # if 21st products (index 20) and the last line is full (PPR products in it), break
            # (pos + 1.0) / PPR is the line where the product would be inserted
            # maxy is the number of existing lines
            # + 1.0 is because pos begins at 0, thus pos 20 is actually the 21st block
            # and to force python to not round the division operation
            if index >= PPG and ((pos + 1.0) / PPR) > maxy:
                break

            if x==1 and y==1:   # simple heuristic for CPU optimization
                minpos = pos/PPR

            for y2 in range(y):
                for x2 in range(x):
                    self.table[(pos/PPR)+y2][(pos%PPR)+x2] = False
            self.table[pos/PPR][pos%PPR] = {
                'product': p, 'x':x, 'y': y,
                'class': " ".join(map(lambda x: x.html_class or '', p.website_style_ids))
            }
            if index<=PPG:
                maxy=max(maxy,y+(pos/PPR))
            index += 1

        # Format table according to HTML needs
        rows = self.table.items()
        rows.sort()
        rows = map(lambda x: x[1], rows)
        for col in range(len(rows)):
            cols = rows[col].items()
            cols.sort()
            x += len(cols)
            rows[col] = [c for c in map(lambda x: x[1], cols) if c != False]

        return rows

        # TODO keep with input type hidden

class QueryURL(object):
    def __init__(self, path='', **args):
        self.path = path
        self.args = args

    def __call__(self, path=None, **kw):
        if not path:
            path = self.path
        for k,v in self.args.items():
            kw.setdefault(k,v)
        l = []
        for k,v in kw.items():
            if v:
                if isinstance(v, list) or isinstance(v, set):
                    l.append(werkzeug.url_encode([(k,i) for i in v]))
                else:
                    l.append(werkzeug.url_encode([(k,v)]))
        if l:
            path += '?' + '&'.join(l)
        return path

def get_pricelist():
    cr, uid, context, pool = request.cr, request.uid, request.context, request.registry
    sale_order = context.get('sale_order')
    if sale_order:
        pricelist = sale_order.pricelist_id
    else:
        partner = pool['res.users'].browse(cr, SUPERUSER_ID, uid, context=context).partner_id
        pricelist = partner.property_product_pricelist
    return pricelist

class website_sale(openerp.addons.website_sale.controllers.main.website_sale):
    @http.route(['/', '/page/homepage'], type='http', auth="public", website=True)
    def home(self, page=0, category=None, search='', **post):
        cr, uid, context, pool = request.cr, request.uid, request.context, request.registry

        domain = request.website.sale_product_domain()
        if search:
            domain += ['|', '|', '|', ('name', 'ilike', search), ('description', 'ilike', search),
                ('description_sale', 'ilike', search), ('product_variant_ids.default_code', 'ilike', search)]
        if category:
            domain += [('public_categ_ids', 'child_of', int(category))]

        attrib_list = request.httprequest.args.getlist('attrib')
        attrib_values = [map(int,v.split("-")) for v in attrib_list if v]
        attrib_set = set([v[1] for v in attrib_values])

        if attrib_values:
            attrib = None
            ids = []
            for value in attrib_values:
                if not attrib:
                    attrib = value[0]
                    ids.append(value[1])
                elif value[0] == attrib:
                    ids.append(value[1])
                else:
                    domain += [('attribute_line_ids.value_ids', 'in', ids)]
                    attrib = value[0]
                    ids = [value[1]]
            if attrib:
                domain += [('attribute_line_ids.value_ids', 'in', ids)]

        keep = QueryURL('/shop', category=category and int(category), search=search, attrib=attrib_list)

        if not context.get('pricelist'):
            pricelist = self.get_pricelist()
            context['pricelist'] = int(pricelist)
        else:
            pricelist = pool.get('product.pricelist').browse(cr, uid, context['pricelist'], context)

        product_obj = pool.get('product.template')

        url = "/shop"
        product_count = product_obj.search_count(cr, uid, domain, context=context)
        if search:
            post["search"] = search
        if category:
            category = pool['product.public.category'].browse(cr, uid, int(category), context=context)
            url = "/shop/category/%s" % slug(category)
        pager = request.website.pager(url=url, total=product_count, page=page, step=PPG, scope=7, url_args=post)
        product_ids = product_obj.search(cr, uid, domain, limit=PPG, offset=pager['offset'], order='website_published desc, website_sequence desc', context=context)
        products = product_obj.browse(cr, uid, product_ids, context=context)

        style_obj = pool['product.style']
        style_ids = style_obj.search(cr, uid, [], context=context)
        styles = style_obj.browse(cr, uid, style_ids, context=context)

        category_obj = pool['product.public.category']
        category_ids = category_obj.search(cr, uid, [], context=context)
        categories = category_obj.browse(cr, uid, category_ids, context=context)
        categs = filter(lambda x: not x.parent_id, categories)

        attributes_obj = request.registry['product.attribute']
        attributes_ids = attributes_obj.search(cr, uid, [], context=context)
        attributes = attributes_obj.browse(cr, uid, attributes_ids, context=context)

        from_currency = pool['res.users'].browse(cr, uid, uid, context=context).company_id.currency_id
        to_currency = pricelist.currency_id
        compute_currency = lambda price: pool['res.currency']._compute(cr, uid, from_currency, to_currency, price, context=context)

        # Custom Code
        company = pool.get('res.users').browse(cr, SUPERUSER_ID, SUPERUSER_ID).company_id
        ot_categ_1 = False
        ot_categ_2 = False
        ot_categ_3 = False

        if company.ot_categ_1:
            ot_categ_1_ids = product_obj.search(cr, SUPERUSER_ID, [('sale_ok', '=', True), ('website_published', '=', True), ('public_categ_ids', '=', company.ot_categ_1.id)], limit=8, context=context)

            if ot_categ_1_ids:
                ot_categ_1 = product_obj.browse(cr, SUPERUSER_ID, ot_categ_1_ids, context=context)
                ot_categ_1 = table_compute().process(ot_categ_1)

        if company.ot_categ_2:
            ot_categ_2_ids = product_obj.search(cr, SUPERUSER_ID, [('sale_ok', '=', True), ('website_published', '=', True), ('public_categ_ids', '=', company.ot_categ_2.id)], limit=8, context=context)

            if ot_categ_2_ids:
                ot_categ_2 = product_obj.browse(cr, SUPERUSER_ID, ot_categ_2_ids, context=context)
                ot_categ_2 = table_compute().process(ot_categ_2)

        if company.ot_categ_3:
            ot_categ_3_ids = product_obj.search(cr, SUPERUSER_ID, [('sale_ok', '=', True), ('website_published', '=', True), ('public_categ_ids', '=', company.ot_categ_3.id)], limit=8, context=context)

            if ot_categ_3_ids:
                ot_categ_3 = product_obj.browse(cr, SUPERUSER_ID, ot_categ_3_ids, context=context)
                ot_categ_3 = table_compute().process(ot_categ_3)

        values = {
            'search': search,
            'category': category,
            'attrib_values': attrib_values,
            'attrib_set': attrib_set,
            'pager': pager,
            'pricelist': pricelist,
            'products': products,
            'bins': table_compute().process(products),
            'rows': PPR,
            'styles': styles,
            'categories': categs,
            'attributes': attributes,
            'compute_currency': compute_currency,
            'keep': keep,
            'style_in_product': lambda style, product: style.id in [s.id for s in product.website_style_ids],
            'attrib_encode': lambda attribs: werkzeug.url_encode([('attrib',i) for i in attribs]),
            'company': company,
            'ot_categ_1': ot_categ_1,
            'ot_categ_2': ot_categ_2,
            'ot_categ_3': ot_categ_3,
        }
        return request.website.render("website.homepage", values)

    @http.route(['/shop/cart/update'], type='json', auth="public", methods=['POST'], website=True)
    def cart_update(self, product_id, add_qty=None, set_qty=None, skip_check=False, **kw):
        value = {}
        cr, uid, pool, context = request.cr, request.uid, request.registry, request.context

        order = request.website.sale_get_order(force_create=1)

        product_obj = pool.get('product.product')

        product = product_obj.browse(cr, SUPERUSER_ID, product_id, context=context)
        product_tmpl = product.product_tmpl_id

        if product_tmpl.attribute_line_ids and not skip_check:
            value['is_variant'] = True

            return value

        value = order._cart_update(product_id=product_id, add_qty=add_qty, set_qty=set_qty)
        value['cart_quantity'] = order.cart_quantity

        return value

    @http.route(['/shop/modal/product_attributes'], type='json', auth="public", methods=['POST'], website=True)
    def product_attributes(self, product_id, **kw):
        cr, uid, context, pool = request.cr, request.uid, request.context, request.registry
        pricelist = self.get_pricelist()
        if not context.get('pricelist'):
            context['pricelist'] = int(pricelist)

        from_currency = pool['res.users'].browse(cr, uid, uid, context=context).company_id.currency_id
        to_currency = pricelist.currency_id
        compute_currency = lambda price: pool['res.currency']._compute(cr, uid, from_currency, to_currency, price, context=context)
        product = pool['product.product'].browse(cr, uid, int(product_id), context=context)

        return request.website._render("ot_fornest.ot_product_attributes", {
            'product': product,
            'compute_currency': compute_currency,
            'get_attribute_value_ids': self.get_attribute_value_ids,
        })

    @http.route(['/shop/subscribe'], type='json', auth="public", methods=['POST'], website=True)
    def subscribe(self, **post):
        cr, uid, context, pool = request.cr, request.uid, request.context, request.registry

        subscribe_obj = pool.get('ot.subscribe')
        is_subscribe = subscribe_obj.search(cr, uid, [('name', '=', post.get('email'))])
        is_error = False

        if is_subscribe:
            is_error = True
        else:
            subscribe_id = subscribe_obj.create(cr, SUPERUSER_ID, {
                'name' : post.get('email')    
            })

        return request.website._render("ot_fornest.ot_subscribe", {
            'is_error': is_error
        })