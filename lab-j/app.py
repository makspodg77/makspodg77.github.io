import sqlite3
from flask import Flask, render_template, g, request, redirect, url_for
from datetime import datetime

app = Flask(__name__)

DATABASE = "data.db"


@app.context_processor
def inject_now():
    return {'now': datetime.now()}


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db


@app.route("/", methods=['GET'])
@app.route("/localities", methods=['GET'])
def index():
    localities = get_db().execute('SELECT * FROM locality').fetchall()
    return render_template('index.html', localities=localities)


@app.route("/localities/<int:locality_id>", methods=['GET'])
def show(locality_id):
    locality = get_db().execute('SELECT * FROM locality where id = ?', [locality_id]).fetchone()
    return render_template('show.html', locality=locality)


@app.route("/localities/<int:locality_id>/edit", methods=['GET', 'POST'])
def edit(locality_id):
    db = get_db()
    if request.method == 'POST':
        name = request.form['name']
        municipality = request.form['municipality']
        county = request.form['county']
        db.execute(
            'UPDATE locality SET name = ?, municipality = ?, county = ? WHERE id = ?',
            (name, municipality, county, locality_id)
        )
        db.commit()
        return redirect(url_for('show', locality_id=locality_id))

    locality = db.execute(
        'SELECT * FROM locality WHERE id = ?', (locality_id,)
    ).fetchone()
    return render_template("edit.html", locality=locality)

@app.route("/localities/new", methods=['GET', 'POST'])
def new():
    db = get_db()
    if request.method == 'POST':
        name = request.form['name']
        municipality = request.form['municipality']
        county = request.form['county']
        db.execute(
            'INSERT INTO locality (name, municipality, county) VALUES (?, ?, ?)',
            (name, municipality, county)
        )
        db.commit()
        return redirect(url_for('index'))

    return render_template("new.html")

@app.route("/localities/<int:locality_id>/delete", methods=['POST'])
def delete(locality_id):
    db = get_db()
    db.execute('DELETE FROM locality WHERE id = ?', (locality_id,))
    db.commit()
    return redirect(url_for('index'))