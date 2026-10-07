import urllib.request, re, os, urllib.parse

movies = {
    'c1': 'Maa Inti Bangaaram',
    'c2': 'Peddhi',
    'c3': 'The Paradise',
    'c4': 'Spirit Prabhas',
    'c5': 'Varanasi'
}

os.makedirs('public/posters', exist_ok=True)

for mid, title in movies.items():
    try:
        url = 'https://www.themoviedb.org/search?query=' + urllib.parse.quote(title)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        # Extract the poster url from the search results
        match = re.search(r'data-src="([^"]+media/v3/original_images[^"]+)"', html)
        if not match:
             match = re.search(r'data-src="([^"]+t/p/w[0-9]+[^"]+\.jpg)"', html)
        if not match:
             match = re.search(r'src="([^"]+t/p/w[0-9]+[^"]+\.jpg)"', html)
             
        if match:
            poster_url = match.group(1).replace('w94_and_h141_bestv2', 'w600_and_h900_bestv2')
            if not poster_url.startswith('http'):
                poster_url = 'https://www.themoviedb.org' + poster_url
            img_req = urllib.request.Request(poster_url, headers={'User-Agent': 'Mozilla/5.0'})
            with open(f'public/posters/{mid}.jpg', 'wb') as f:
                f.write(urllib.request.urlopen(img_req).read())
            print(f'Downloaded {mid}: {title} from {poster_url}')
        else:
            print(f'No TMDB match for {mid}: {title}')
    except Exception as e:
        print(f'Error fetching {mid}: {e}')
