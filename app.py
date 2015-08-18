from flask import Flask, render_template, url_for
from flask_restful import Resource, Api
from collections import defaultdict
import json

app = Flask(__name__)
api = Api(app)
with open('vec_over1.json') as fp:
	full_json = json.load(fp)

split_by = lambda x: ' '.join(x.split('_BY_')[0].split('_')[1:]) + ' - ' + ' '.join(x.split('_BY_')[1].split('_'))

full_json = [[split_by(e[0]), e[1], e[2], e[3]] for e in full_json if e[3] > 10]
print len(full_json)
full_json = sorted(full_json, key=lambda x: -x[3])

styles = defaultdict(int)
for e in full_json:
	styles[e[2]] += 1
styles = [e[0] for e in sorted(styles.items(), key=lambda x: -x[1])[:20]]

x_extent = (min([x[1][0] for x in full_json]), max([x[1][0] for x in full_json]))
y_extent = (min([x[1][1] for x in full_json]), max([x[1][1] for x in full_json]))
rn_extext = (min([x[3] for x in full_json]), max([x[3] for x in full_json]))

@app.route('/')
def index():
	return render_template('index.html')


# APIs

class FullJson(Resource):
	def get(self):
		global full_json, x_extent, y_extent, styles, rn_extext
		return [full_json, x_extent, y_extent, styles, rn_extext]

api.add_resource(FullJson, '/api/full_json')

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=11237)
