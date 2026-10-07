import urllib.request, json, urllib.parse, time, os

actors = [
    'N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt',
    'Prabhas', 'Amitabh Bachchan', 'Deepika Padukone',
    'Prithviraj Sukumaran', 'Shruti Haasan',
    'Pawan Kalyan', 'Emraan Hashmi', 'Priyanka Arul Mohan',
    'Yash (actor)', 'Sanjay Dutt', 'Srinidhi Shetty',
    'Allu Arjun', 'Fahadh Faasil', 'Rashmika Mandanna',
    'Mahesh Babu', 'Sreeleela', 'Meenakshi Chaudhary',
    'Teja Sajja', 'Amritha Aiyer', 'Varalaxmi Sarathkumar',
    'Timothee Chalamet', 'Zendaya', 'Rebecca Ferguson',
    'Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.',
    'Robert Pattinson', 'Zoe Kravitz', 'Paul Dano'
]

import hashlib

def get_commons_url(filename):
    filename = filename.replace(' ', '_')
    md5 = hashlib.md5(filename.encode('utf-8')).hexdigest()
    return f"https://upload.wikimedia.org/wikipedia/commons/{md5[:1]}/{md5[:2]}/{urllib.parse.quote(filename)}"

results = {}

for actor in actors:
    try:
        # Search Wikidata
        url = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&search=' + urllib.parse.quote(actor) + '&language=en&format=json'
        req = urllib.request.Request(url, headers={'User-Agent': 'Bot/1.0'})
        res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        
        if res.get('search') and len(res['search']) > 0:
            qid = res['search'][0]['id']
            # Get properties
            url2 = f'https://www.wikidata.org/w/api.php?action=wbgetentities&ids={qid}&props=claims&format=json'
            req2 = urllib.request.Request(url2, headers={'User-Agent': 'Bot/1.0'})
            res2 = json.loads(urllib.request.urlopen(req2).read().decode('utf-8'))
            
            claims = res2['entities'][qid].get('claims', {})
            # P18 is the image property in Wikidata
            if 'P18' in claims:
                filename = claims['P18'][0]['mainsnak']['datavalue']['value']
                img_url = get_commons_url(filename)
                results[actor] = img_url
                print(f'{actor}: {img_url}')
            else:
                print(f'{actor}: No image found (P18)')
        else:
            print(f'{actor}: Entity not found')
    except Exception as e:
        print(f'Error {actor}: {e}')
    time.sleep(0.5)

with open('actors_wikidata.json', 'w') as f:
    json.dump(results, f)
