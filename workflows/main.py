from flask import Flask

from api.auth import init_auth
from api.routes import bp
from config.settings import config
from models.database import close_db
from models.database import init_db

app = Flask(__name__)
app.secret_key = config.SECRET_KEY
app.config.from_object(config)

# Initialize database and create tables
init_db()

# Initialize Auth0
auth0 = init_auth(app)
app.extensions["auth0"] = auth0

app.register_blueprint(bp)


@app.teardown_appcontext
def close_database(error):
    """Close database connection on app teardown."""
    close_db()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=True)
