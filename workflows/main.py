from flask import Flask

from api.auth import init_auth
from api.routes import bp
from config.settings import config

app = Flask(__name__)
app.secret_key = config.SECRET_KEY
app.config.from_object(config)
auth0 = init_auth(app)
app.extensions["auth0"] = auth0
app.register_blueprint(bp)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=True)
