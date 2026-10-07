export interface CastMember {
  name: string;
  role: string;
  img: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string;
  rating: string;
  duration: string;
  formats: string[];
  featured?: boolean;
  trailerUrl: string;
  locations: string[];
  comingSoon?: boolean;
  releaseDate?: string;
  cast: CastMember[];
  language: string;
}

export const MOVIES: Movie[] = [
  {
    id: 't1',
    title: 'RRR',
    poster: 'https://image.tmdb.org/t/p/w1280/tjpiEnZBUAA8pdNPRKa5vP2Zpqw.jpg',
    genre: 'Action / Epic',
    rating: '9.7',
    duration: '3h 5m',
    formats: ['IMAX', '3D', '2D'],
    featured: true,
    trailerUrl: 'https://www.youtube.com/watch?v=f_vbAtFSEc0',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Chennai', 'Pune', 'Kolkata', 'Kochi'],
    language: 'Telugu',
    cast: [
      { name: 'N.T. Rama Rao Jr.', role: 'Komaram Bheem', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Jr-NTRspotted-promoting-RRR-on-sets-of-The-Kapil-Sharma-Show_%28cropped%29.jpg' },
      { name: 'Ram Charan', role: 'Alluri Sitarama Raju', img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Ram_Charan_at_the_RRR_press_meet_%28cropped%29.jpg' },
      { name: 'Alia Bhatt', role: 'Sita', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Alia_Bhatt_attends_at_the_2026_Cannes_Film_Festival_%28cropped%29_%28cropped%29.jpg' }
    ]
  },
  {
    id: 't2',
    title: 'Kalki 2898 AD',
    poster: 'https://image.tmdb.org/t/p/w1280/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg',
    genre: 'Sci-Fi / Action',
    rating: '9.5',
    duration: '3h 10m',
    formats: ['IMAX 3D', '3D', '2D'],
    featured: true,
    trailerUrl: 'https://www.youtube.com/watch?v=y1QzU4GgQyM',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Chennai', 'Pune', 'Kolkata', 'Kochi'],
    language: 'Telugu',
    cast: [
      { name: 'Prabhas', role: 'Bhairava', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Prabhas_at_Baahubali_media_meet%2C_day_2_%28cropped%29.jpg' },
      { name: 'Amitabh Bachchan', role: 'Ashwatthama', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Amitabh_Bachchan.jpg' },
      { name: 'Deepika Padukone', role: 'SUM-80', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Deepika_Padukone_at_Cannes_2022_%28cropped%29.jpg' }
    ]
  },
  {
    id: 't4',
    title: 'Salaar: Part 1 - Ceasefire',
    poster: 'https://image.tmdb.org/t/p/w1280/nlu9WbcetNFRGXXPWITr30ob7W6.jpg',
    genre: 'Action / Thriller',
    rating: '8.8',
    duration: '2h 55m',
    formats: ['IMAX', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=4urO4vtROVE',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai', 'Pune', 'Kochi'],
    language: 'Telugu',
    cast: [
      { name: 'Prabhas', role: 'Devaratha', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Prabhas_at_Baahubali_media_meet%2C_day_2_%28cropped%29.jpg' },
      { name: 'Prithviraj Sukumaran', role: 'Vardharaja', img: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Prithviraj_Sukumaran_at_the_Kaduva_press_meet_%28cropped%29.jpg' },
      { name: 'Shruti Haasan', role: 'Aadhya', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Shruti_Haasan_at_the_Salaar_press_meet_%28cropped%29.jpg' }
    ]
  },
  {
    id: 't5',
    title: 'OG (They Call Him OG)',
    poster: 'https://image.tmdb.org/t/p/w1280/yHyvS4OMq8oij11Co9CbeMqLUo2.jpg',
    genre: 'Action / Crime',
    rating: '9.4',
    duration: '2h 45m',
    formats: ['IMAX', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=4B8F3Yv6Y4w',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai'],
    language: 'Telugu',
    cast: [
      { name: 'Pawan Kalyan', role: 'Ojas Gambheera', img: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Pawan_Kalyan_at_the_Katamarayudu_press_meet_%28cropped%29.jpg' },
      { name: 'Emraan Hashmi', role: 'Omi Bhau', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Emraan_Hashmi_promoting_Mr_X.jpg' },
      { name: 'Priyanka Arul Mohan', role: 'Lead', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Priyanka_Arul_Mohan_at_Doctor_press_meet_%28cropped%29.jpg' }
    ]
  },
  {
    id: 't6',
    title: 'K.G.F: Chapter 2',
    poster: 'https://image.tmdb.org/t/p/w1280/khNVygolU0TxLIDWff5tQlAhZ23.jpg',
    genre: 'Action / Crime',
    rating: '9.3',
    duration: '2h 48m',
    formats: ['IMAX', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=Qah9sSIXJqk',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Pune', 'Kolkata'],
    language: 'Kannada',
    cast: [
      { name: 'Yash', role: 'Rocky', img: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Yash_at_KGF_Chapter_2_press_meet_%28cropped%29.jpg' },
      { name: 'Sanjay Dutt', role: 'Adheera', img: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Sanjay_Dutt_promoting_Panipat.jpg' },
      { name: 'Srinidhi Shetty', role: 'Reena', img: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Srinidhi_Shetty_at_KGF_Chapter_2_press_meet_%28cropped%29.jpg' }
    ]
  },
  {
    id: 't3',
    title: 'Pushpa 2: The Rule',
    poster: 'https://image.tmdb.org/t/p/w1280/xkYGdKuK8jfqvGNCZV1uNdYkIfS.jpg',
    genre: 'Action / Crime',
    rating: '9.8',
    duration: '2h 58m',
    formats: ['2D'],
    featured: true,
    trailerUrl: 'https://www.youtube.com/watch?v=1kUK0Zzz_JE',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Chennai', 'Pune', 'Kolkata', 'Kochi'],
    language: 'Telugu',
    cast: [
      { name: 'Allu Arjun', role: 'Pushpa Raj', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Allu_Arjun_at_the_Sarrainodesuccess_meet_%28cropped%29.jpg' },
      { name: 'Fahadh Faasil', role: 'Bhanwar Singh', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Fahadh_Faasil_at_the_Trance_press_meet_%28cropped%29.jpg' },
      { name: 'Rashmika Mandanna', role: 'Srivalli', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Rashmika_Mandanna_at_the_Geetha_Govindam_audio_launch_%28cropped%29.jpg' }
    ]
  },
  {
    id: 't7',
    title: 'Guntur Kaaram',
    poster: 'https://image.tmdb.org/t/p/w1280/qvBt4YLy274ZmoMAfVlwmHkjVkq.jpg',
    genre: 'Action / Family',
    rating: '8.2',
    duration: '2h 42m',
    formats: ['2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=oR3X4K8fM-4',
    locations: ['Hyderabad', 'Bengaluru', 'Chennai'],
    language: 'Telugu',
    cast: [
      { name: 'Mahesh Babu', role: 'Ramana', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Mahesh_Babu_at_the_Spyder_press_meet_%28cropped%29.jpg' },
      { name: 'Sreeleela', role: 'Amulya', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Sreeleela_at_the_Dhamaka_success_meet_%28cropped%29.jpg' },
      { name: 'Meenakshi Chaudhary', role: 'Raji', img: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Meenakshi_Chaudhary_at_the_Khiladi_press_meet_%28cropped%29.jpg' }
    ]
  },
  {
    id: 't8',
    title: 'Hanu-Man',
    poster: 'https://image.tmdb.org/t/p/w1280/p8iOZk31rBxHyYLKRwAb0uFinn4.jpg',
    genre: 'Action / Fantasy',
    rating: '9.1',
    duration: '2h 38m',
    formats: ['3D', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=OqaAiNxhuOk',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Chennai', 'Pune', 'Kochi'],
    language: 'Telugu',
    cast: [
      { name: 'Teja Sajja', role: 'Hanumanthu', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Teja_Sajja_at_the_Hanu-Man_success_meet_%28cropped%29.jpg' },
      { name: 'Amritha Aiyer', role: 'Meenakshi', img: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Amritha_Aiyer_at_the_Red_press_meet_%28cropped%29.jpg' },
      { name: 'Varalaxmi Sarathkumar', role: 'Anjamma', img: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Varalaxmi_Sarathkumar_at_the_Sarkar_press_meet_%28cropped%29.jpg' }
    ]
  },
  {
    id: 'm1',
    title: 'DUNE: PART TWO',
    poster: 'https://image.tmdb.org/t/p/w1280/3HzGtM0JpfH2pWFGugJK22LRP6b.jpg',
    genre: 'Sci-Fi / Action',
    rating: '9.2',
    duration: '2h 46m',
    formats: ['IMAX', '4DX', '3D'],
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    locations: ['Mumbai', 'Delhi-NCR', 'Bengaluru', 'Pune', 'Kolkata', 'Chennai'],
    language: 'English',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Timoth%C3%A9e_Chalamet_Cannes_2021_%28cropped%29.jpg' },
      { name: 'Zendaya', role: 'Chani', img: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Zendaya_at_the_Spider-Man_No_Way_Home_premiere_%28cropped%29.jpg' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Rebecca_Ferguson_at_the_Mission_Impossible_Rogue_Nation_premiere_%28cropped%29.jpg' }
    ]
  },
  {
    id: 'm2',
    title: 'Oppenheimer',
    poster: 'https://image.tmdb.org/t/p/w1280/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    genre: 'Biography / Drama',
    rating: '8.9',
    duration: '3h 0m',
    formats: ['IMAX 70mm', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    locations: ['Mumbai', 'Delhi-NCR', 'Bengaluru', 'Pune', 'Kolkata', 'Chennai'],
    language: 'English',
    cast: [
      { name: 'Cillian Murphy', role: 'Oppenheimer', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cillian_Murphy_2024_%28cropped%29.jpg' },
      { name: 'Emily Blunt', role: 'Kitty Oppenheimer', img: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Emily_Blunt_at_WWD_Style_Awards_2026-02.jpg' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', img: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg' }
    ]
  },
  {
    id: 'm3',
    title: 'The Batman',
    poster: 'https://image.tmdb.org/t/p/w1280/3w7koeOR2x71XYMJDGpygxYtScI.jpg',
    genre: 'Action / Crime',
    rating: '8.5',
    duration: '2h 56m',
    formats: ['4DX', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    locations: ['Mumbai', 'Delhi-NCR', 'Bengaluru', 'Pune', 'Kolkata'],
    language: 'English',
    cast: [
      { name: 'Robert Pattinson', role: 'Bruce Wayne', img: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Robert_Pattinson_at_Berlinale_2025.jpg' },
      { name: 'Zoë Kravitz', role: 'Selina Kyle', img: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Zoe_Kravitz_2020_dvna_studio.jpg' },
      { name: 'Paul Dano', role: 'The Riddler', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Paul_Dano_Deauville_2012.jpg' }
    ]
  },
  {
    id: 't9',
    title: 'Athidhi (Re-Release)',
    poster: 'https://image.tmdb.org/t/p/w1280/jD5qUBrYWzpFNgn4i9xZU2k3n1A.jpg',
    genre: 'Action / Thriller / Romance',
    rating: '9.4',
    duration: '2h 35m',
    formats: ['2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=nE3jE4n-x7E',
    locations: ['Hyderabad', 'Bengaluru'],
    language: 'Telugu',
    cast: [
      { name: 'Mahesh Babu', role: 'Athidhi / Aditya', img: 'https://image.tmdb.org/t/p/w200/fcxgYi1h6vywacUg8asM6S0IIhf.jpg' },
      { name: 'Amrita Rao', role: 'Amrita', img: 'https://image.tmdb.org/t/p/w200/sqbPQ3lbBCuGP6tLj6QuxnC62j5.jpg' },
      { name: 'Brahmanandam', role: 'Brahmanandam', img: 'https://image.tmdb.org/t/p/w200/zh6nWEIy3l1dsZA9EDuDezq867b.jpg' },
      { name: 'Nassar', role: 'Home Minister', img: 'https://image.tmdb.org/t/p/w200/p3I0tSQY3C5qZW3NzFfbpjKPNL6.jpg' }
    ]
  },
  {
    id: 'c1',
    title: 'Maa Inti Bangaaram',
    poster: '/posters/c1.jpg',
    genre: 'Action / Family / Drama',
    rating: '9.4',
    duration: '2h 35m',
    formats: ['2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=Jg28cM4aR4E',
    comingSoon: true,
    releaseDate: '19 Jun 2026',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai'],
    language: 'Telugu',
    cast: [
      { name: 'Samantha Ruth Prabhu', role: 'Lead Female', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Samantha_at_an_event_for_Citadel_%28cropped%29.jpg' },
      { name: 'Gulshan Devaiah', role: 'Lead Male', img: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Gulshan_Devaiah_at_the_promotions_of_Hunterrr_%28cropped%29.jpg' },
      { name: 'Gautami Tadimalla', role: 'Supporting', img: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Gautami_Tadimalla_at_an_event_%28cropped%29.jpg' }
    ]
  },
  {
    id: 'c2',
    title: 'Peddhi',
    poster: '/posters/c2.jpg',
    genre: 'Sports / Action / Drama',
    rating: '9.6',
    duration: '2h 55m',
    formats: ['IMAX', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=vV3U07u6-Z4',
    comingSoon: true,
    releaseDate: '04 Jun 2026',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai', 'Kochi'],
    language: 'Telugu',
    cast: [
      { name: 'Ram Charan', role: 'Lead Male', img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Ram_Charan_at_the_RRR_press_meet_%28cropped%29.jpg' },
      { name: 'Janhvi Kapoor', role: 'Lead Female', img: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Janhvi_Kapoor_promoting_Good_Luck_Jerry_%28cropped%29.jpg' },
      { name: 'Shiva Rajkumar', role: 'Cameo / Supporting', img: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Shiva_Rajkumar_at_an_event_%28cropped%29.jpg' }
    ]
  },
  {
    id: 'c3',
    title: 'The Paradise',
    poster: '/posters/c3.jpg',
    genre: 'Action / Thriller / Period Drama',
    rating: '9.5',
    duration: '2h 50m',
    formats: ['IMAX', '3D', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=4B8F3Yv6Y4w',
    comingSoon: true,
    releaseDate: '21 Aug 2026',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai', 'Pune'],
    language: 'Telugu',
    cast: [
      { name: 'Nani', role: 'Lead Male', img: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Nani_at_Dasara_promotions_%28cropped%29.jpg' },
      { name: 'Janhvi Kapoor', role: 'Lead Female', img: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Janhvi_Kapoor_promoting_Good_Luck_Jerry_%28cropped%29.jpg' },
      { name: 'Mohan Babu', role: 'Antagonist', img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Mohan_Babu_at_an_event_%28cropped%29.jpg' }
    ]
  },
  {
    id: 'c4',
    title: 'Spirit',
    poster: '/posters/c4.jpg',
    genre: 'Action / Crime / Drama',
    rating: '9.8',
    duration: '3h 5m',
    formats: ['IMAX 3D', '3D', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=y1QzU4GgQyM',
    comingSoon: true,
    releaseDate: '05 Mar 2027',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Chennai', 'Pune', 'Kochi'],
    language: 'Telugu',
    cast: [
      { name: 'Prabhas', role: 'IPS Officer', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Prabhas_at_Baahubali_media_meet%2C_day_2_%28cropped%29.jpg' },
      { name: 'Triptii Dimri', role: 'Lead Female', img: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Tripti_Dimri_promoting_Qala_%28cropped%29.jpg' },
      { name: 'Vivek Oberoi', role: 'Antagonist', img: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Vivek_Oberoi_at_an_event_%28cropped%29.jpg' }
    ]
  },
  {
    id: 'c5',
    title: 'Varanasi',
    poster: '/posters/c5.jpg',
    genre: 'Epic / Action / Adventure / Mythology',
    rating: '9.9',
    duration: '3h 10m',
    formats: ['IMAX', '2D'],
    trailerUrl: 'https://www.youtube.com/watch?v=f_vbAtFSEc0',
    comingSoon: true,
    releaseDate: '07 Apr 2027',
    locations: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Delhi-NCR', 'Chennai', 'Kolkata'],
    language: 'Telugu',
    cast: [
      { name: 'Mahesh Babu', role: 'Rudhra', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Mahesh_Babu_at_the_Spyder_press_meet_%28cropped%29.jpg' },
      { name: 'Priyanka Chopra', role: 'Mandakini', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Priyanka_Chopra_at_the_2023_Met_Gala_%28cropped%29.jpg' },
      { name: 'Prithviraj Sukumaran', role: 'Kumbha (Antagonist)', img: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Prithviraj_Sukumaran_at_the_Kaduva_press_meet_%28cropped%29.jpg' }
    ]
  }
];
