"""This is app module

This modules uese mognodb module for connection to dabase and returning data in
json format.
"""

__author__ = 'Ales Lerch'

import os
import random
from flask import Flask
from flask import Flask, flash, redirect, render_template, request, session, abort
from functools import wraps
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
import sys
sys.path.append('..')
import mongodatabase as ExploitM

app = Flask(__name__)

@app.route("/")
def home():
    if not session.get('logged_in'):
        return render_template('login.html')
    else:
        return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    if request.form['password'] == 'password' and request.form['username'] == 'admin':
        session['logged_in'] = True
    else:
        flash('Wrong password!')
    return home()

@app.route("/logout")
def logout():
    session['logged_in'] = False
    return home()

@app.route("/test")
def test():
    return render_template("test.html")

@app.route("/exploits/list/")
def list_data():
    mdb = ExploitM.ExploitMDB()
    data = mdb.get_specific(
        {'command': True, 'if_none_match': True, 'user_agent': True,
        'error': True, 'accept': True, 'ip': True,
        'port': True, 'country': True, 'connection': True,
        'referer': True, 'path': True, 'cookie': True, 
        'if_modified_since': True, 'time': True, 'date': True,
        'host': True, 'accept_language': True, 'x_requested_with': True,
        'accept_encoding': True, 'socket_info': True, 'version': True,
        'attacktype': True, 'second_id': True, 'total_exploit': True,
        'total_dataflow': True}
        )
    return json.dumps([d for d in data], default=json_util.default)

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(host='localhost',port=5000,debug=True)
