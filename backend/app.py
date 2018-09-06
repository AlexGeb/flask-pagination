from flask import Flask
from flask_cors import CORS
from flask_restful import Api
import os

from db import db
from ressources.UsersRessource import UsersRessource
from utils import setup_db
app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, 'app.sqlite')

api = Api(app)
db.init_app(app)
db.app = app
setup_db()

api.add_resource(UsersRessource, '/users')

if __name__ == '__main__':
    app.run(debug=True)
