from functools import wraps
from flask_restful import reqparse

from db import db
from models.User import User


def setup_db():
    """Create tables and poulate db if needed"""
    num_of_users = 0
    try:
        # Will throw an error if user table doesn't exists
        num_of_users = db.session.execute('select count(*) from user').first()[0]
    except Exception as error:
        db.create_all()

    # Insert fixtures to test our pagination
    if num_of_users == 0:
        users = [
            dict(
                id=user_id,
                username='user_{}'.format(user_id),
                email='user_{}'.format(user_id) + '@mail.fr'
            )
            for user_id in range(50)
        ]
        db.engine.execute(User.__table__.insert(), users)
        print('{} users inserted'.format(
            db.session.execute('select count(*) from user').first()[0]
        ), flush=True)


def parse_params(*arguments):
    """ Parse the parameters, forward them to the wrapped function as named parameters """
    def parse(func):
        """ Wrapper """
        @wraps(func)
        def resource_verb(*args, **kwargs):
            """ Decorated function """
            parser = reqparse.RequestParser()
            for argument in arguments:
                parser.add_argument(argument)
            kwargs.update(parser.parse_args())
            return func(*args, **kwargs)
        return resource_verb
    return parse
