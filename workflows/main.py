from flask import Flask

from api.routes import bp
from config.settings import config

app = Flask(__name__)
app.register_blueprint(bp)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=True)
