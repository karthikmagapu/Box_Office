import urllib.request, re, os, urllib.parse, time, json

actors = [
    'N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt',
    'Prabhas', 'Amitabh Bachchan', 'Deepika Padukone',
    'Prithviraj Sukumaran', 'Shruti Haasan',
    'Pawan Kalyan', 'Emraan Hashmi', 'Priyanka Arul Mohan',
    'Yash', 'Sanjay Dutt', 'Srinidhi Shetty',
    'Allu Arjun', 'Fahadh Faasil', 'Rashmika Mandanna',
    'Mahesh Babu', 'Sreeleela', 'Meenakshi Chaudhary',
    'Teja Sajja', 'Amritha Aiyer', 'Varalaxmi Sarathkumar',
    'Timothee Chalamet', 'Zendaya', 'Rebecca Ferguson',
    'Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.',
    'Robert Pattinson', 'Zoe Kravitz', 'Paul Dano'
]

results = {}
for actor in actors:
    try:
        url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(actor + ' tmdb headshot profile')
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        match = re.search(r'src="([^"]+media/v3/original_images[^"]+)"', html)
        if not match:
             match = re.search(r'src="([^"]+t/p/w[0-9]+[^"]+\.jpg)"', html)
             
        if match:
            img_url = match.group(1).replace('w94_and_h141_bestv2', 'w600_and_h900_bestv2')
            if not img_url.startswith('http'):
                 img_url = 'https://www.themoviedb.org' + img_url
            results[actor] = img_url
            print(f'{actor}: {img_url}')
        else:
            print(f'{actor}: Not found')
    except Exception as e:
        print(f'Error {actor}: {e}')
        time.sleep(1)

with open('actors.json', 'w') as f:
    json.dump(results, f)
