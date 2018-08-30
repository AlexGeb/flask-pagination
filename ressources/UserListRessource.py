from flask_restful import fields, marshal_with, reqparse, Resource

from utils import parse_params
from models.User import User


def paginated(queried_object_fields):
    """Build a marshaller for the SqlAlchemy.Pagination object."""
    return {
        'items': fields.Nested(queried_object_fields),  # Array of the queried objects
        'total': fields.Integer,                        # Total number of items
        'page': fields.Integer,                         # Current page number
        'pages': fields.Integer,                        # Total number of pages
        'per_page': fields.Integer                      # Number of items per page
    }


user_fileds = {
    'username': fields.String,
    'email': fields.String
}


class UserListRessource(Resource):
    @parse_params(
        reqparse.Argument('page', type=int, required=False, location='args', default=1),
        reqparse.Argument('size', type=int, required=False, location='args', default=10),
    )
    @marshal_with(paginated(user_fileds))
    def get(self, page, size):
        return User.query.paginate(page, size, False)
