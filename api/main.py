from flask import Flask
from flask_cors import CORS

from api.auth import init_auth
from api.routes import bp
from config.settings import config
from models.database import database
app = Flask(__name__)
app.secret_key = config.SECRET_KEY
app.config.from_object(config)

CORS(app, supports_credentials=True, )

# Initialize Auth0
auth0 = init_auth(app)
app.extensions["auth0"] = auth0

app.register_blueprint(bp)


@app.before_request
def before_request():
    if database.is_closed():
        database.connect(reuse_if_open=True)



@app.teardown_request
def teardown_request(exception: Exception | None):
    if not database.is_closed():
        database.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=True)
