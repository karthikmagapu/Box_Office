import urllib.request, json, os, urllib.parse, re

os.makedirs('public/posters', exist_ok=True)

queries = {
    'm1': 'Dune Part Two 2024 official movie poster',
    't1': 'Devara Part 1 official movie poster',
    't2': 'Kalki 2898 AD official movie poster',
    't3': 'Pushpa 2 The Rule official movie poster',
    't4': 'Salaar Part 1 Ceasefire official movie poster',
    't5': 'They Call Him OG Pawan Kalyan official movie poster',
    't6': 'Varanasi movie poster',
    't7': 'Guntur Kaaram official movie poster',
    't8': 'Hanu Man 2024 official movie poster',
    'm2': 'Oppenheimer official movie poster',
    'm3': 'The Batman 2022 official movie poster'
}

for mid, q in queries.items():
    try:
        url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(q)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        imgs = re.findall(r'src="//external-content\.duckduckgo\.com/iu/\?u=([^"]+)"', html)
        if imgs:
            img_url = urllib.parse.unquote(imgs[0])
            if "&" in img_url:
                img_url = img_url.split("&")[0]
            img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with open(f'public/posters/{mid}.jpg', 'wb') as f:
                f.write(urllib.request.urlopen(img_req).read())
            print(f'Saved {mid} from {img_url}')
        else:
            print(f'No image found for {mid}')
    except Exception as e:
        print(f'Error on {mid}: {e}')
