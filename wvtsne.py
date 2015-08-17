import gensim, json
from tsne import bh_sne
import numpy as np

model = gensim.models.doc2vec.Doc2Vec.load('new_ba.model')
vocab = model.vocab
vocab = [voca for voca in vocab.items() if voca[0].startswith('BEER_')]
beers = [voca[0] for voca in vocab]
wvs = np.asarray([model[voca[0]] for voca in vocab], dtype=np.float64)

reduced = bh_sne(wvs)
vec_list = dict(zip(beers, reduced.tolist()))

with open('vec.json', 'w') as fp:
	json.dump(vec_list, fp)