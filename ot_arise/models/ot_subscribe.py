# -*- encoding: utf-8 -*-
from odoo import fields, models
import time

class ot_subscribe(models.Model):
    _name = 'ot.subscribe'
    _description = 'OT Subscribe'

    name = fields.Char(string='Email')
    date = fields.Datetime(string='Join Date',default=lambda *a: time.strftime("%Y-%m-%d %H:%M:%S"))

    _sql_constraints = [
        ('name_uniq', 'unique (name)', 'Subscriber email must be unique !')
    ]